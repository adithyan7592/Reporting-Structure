const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/user');
const Report = require('./models/reports');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://reports.thetrendsetters.in',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  heartbeatFrequencyMS: 10000,
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

const isSuperOrManagement = (role) => role === 'superadmin' || role === 'management';

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ msg: 'Invalid token' }); }
};

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

// ── Login ────────────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!user) return res.status(400).json({ msg: 'User does not exist' });
    if (!await bcrypt.compare(password, user.password)) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, department: user.department, managedDepts: user.managedDepts, jobTitle: user.jobTitle, name: user.name },
      process.env.JWT_SECRET, { expiresIn: '1d' }
    );

    res.json({ token, role: user.role, department: user.department, managedDepts: user.managedDepts, jobTitle: user.jobTitle, name: user.name });
  } catch (err) { res.status(500).json({ msg: 'Server error' }); }
});

// ── Register ─────────────────────────────────────────────────────────────────
app.post('/api/register', protect, async (req, res) => {
  if (!isSuperOrManagement(req.user.role) && req.user.role !== 'manager')
    return res.status(403).json({ msg: 'Access denied' });

  const { name, email, password, department, role, managedDepts, jobTitle } = req.body;
  try {
    if (await User.findOne({ email })) return res.status(400).json({ msg: 'User already exists' });
    const hashed = await bcrypt.hash(password, await bcrypt.genSalt(10));
    await new User({
      name, email, password: hashed,
      department: role === 'management' ? 'All' : department,
      role: role || 'staff',
      managedDepts: role === 'manager' ? (managedDepts || []) : [],
      jobTitle: jobTitle || '',
    }).save();
    res.status(201).json({ msg: `Account created for ${name}` });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Error creating account' });
  }
});

// ── Get Reports ───────────────────────────────────────────────────────────────
app.get('/api/reports', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'manager') {
      const depts = (req.user.managedDepts || []).map(d => d.dept);
      if (!depts.length) return res.json([]);
      query.department = { $in: depts };
    } else if (req.user.role === 'staff') {
      query.department = req.user.department;
    }
    // superadmin and management see all reports (no query filter)
    res.json(await Report.find(query).sort({ createdAt: -1 }));
  } catch { res.status(500).json({ msg: 'Error fetching reports' }); }
});

// ── Submit Report ─────────────────────────────────────────────────────────────
app.post('/api/reports', protect, async (req, res) => {
  try {
    const { title, data } = req.body;
    const r = await new Report({
      title, data: data || {},
      staffName: req.user.name,
      department: req.user.department,
      createdBy: req.user.id
    }).save();
    res.status(201).json(r);
  } catch (err) { res.status(500).json({ msg: 'Error saving report' }); }
});

// ── Get Users ─────────────────────────────────────────────────────────────────
app.get('/api/users', protect, async (req, res) => {
  if (!isSuperOrManagement(req.user.role) && req.user.role !== 'manager')
    return res.status(403).json({ msg: 'Unauthorized' });
  try {
    let query = { role: { $nin: ['superadmin'] } };
    if (req.user.role === 'manager') {
      const depts = (req.user.managedDepts || []).map(d => d.dept);
      query = { role: 'staff', department: { $in: depts } };
    }
    res.json(await User.find(query).select('-password').sort({ role: 1, name: 1 }));
  } catch { res.status(500).json({ msg: 'Error fetching users' }); }
});

// ── Update User ───────────────────────────────────────────────────────────────
app.put('/api/users/:id', protect, async (req, res) => {
  if (!isSuperOrManagement(req.user.role) && req.user.role !== 'manager')
    return res.status(403).json({ msg: 'Unauthorized' });

  const { name, email, department, password, role, managedDepts, jobTitle } = req.body;
  const update = {
    name, email,
    department: role === 'management' ? 'All' : department,
    role: role || 'staff',
    managedDepts: role === 'manager' ? (managedDepts || []) : [],
    jobTitle: jobTitle || '',
  };
  if (password?.trim()) update.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
  try {
    const u = await User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).select('-password');
    res.json({ msg: 'Updated', user: u });
  } catch { res.status(500).json({ msg: 'Error updating' }); }
});

app.delete('/api/users/:id', protect, async (req, res) => {
  if (!isSuperOrManagement(req.user.role) && req.user.role !== 'manager')
    return res.status(403).json({ msg: 'Unauthorized' });
  try {
    // Managers can only delete staff in their managed depts
    if (req.user.role === 'manager') {
      const userToDelete = await User.findById(req.params.id);
      if (!userToDelete) return res.status(404).json({ msg: 'User not found' });
      const managerDepts = (req.user.managedDepts || []).map(d => d.dept);
      if (!managerDepts.includes(userToDelete.department))
        return res.status(403).json({ msg: 'You can only delete staff in your departments' });
      if (userToDelete.role !== 'staff')
        return res.status(403).json({ msg: 'Managers can only delete staff accounts' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch { res.status(500).json({ msg: 'Error deleting' }); }
});

// ── Edit Report ───────────────────────────────────────────────────────────────
app.put('/api/reports/:id', protect, async (req, res) => {
  if (req.user.role === 'staff') return res.status(403).json({ msg: 'Unauthorized' });
  try {
    const { data } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ msg: 'Report not found' });

    if (req.user.role === 'manager') {
      const depts = (req.user.managedDepts || []).map(d => d.dept);
      if (!depts.includes(report.department))
        return res.status(403).json({ msg: 'Access denied' });
    }

    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      { $set: { data, isEdited: true, editedAt: new Date(), editedBy: req.user.name } },
      { new: true }
    );
    res.json(updated);
  } catch (err) { res.status(500).json({ msg: 'Error updating report' }); }
});


app.listen(process.env.PORT || 5000, () => console.log('🚀 Server running'));