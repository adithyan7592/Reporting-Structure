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

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected: ReportingDB'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// ── Auth Middleware ──────────────────────────────────────────────────────────
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: 'Token is not valid or expired' });
  }
};

// ── POST /api/login ──────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id:           user._id,
        role:         user.role,
        department:   user.department,
        managedDepts: user.managedDepts || [],
        jobTitle:     user.jobTitle || '',
        name:         user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      role:         user.role,
      department:   user.department,
      managedDepts: user.managedDepts || [],
      jobTitle:     user.jobTitle || '',
      name:         user.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ── POST /api/register (superadmin only) ─────────────────────────────────────
app.post('/api/register', protect, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin')
      return res.status(403).json({ msg: 'Access Denied' });

    const { name, email, password, department, role, managedDepts, jobTitle } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password:     hashed,
      department,
      role:         role || 'staff',
      managedDepts: role === 'manager' ? (managedDepts || []) : [],
      jobTitle:     jobTitle || '',
    });

    await newUser.save();
    res.status(201).json({ msg: `Account created for ${name}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error creating account' });
  }
});

// ── GET /api/reports ─────────────────────────────────────────────────────────
// superadmin → all | manager → managedDepts | staff → own dept
app.get('/api/reports', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'manager') {
      const depts = req.user.managedDepts || [];
      if (!depts.length) return res.json([]);
      query.department = { $in: depts };
    } else if (req.user.role === 'staff') {
      query.department = req.user.department;
    }
    const reports = await Report.find(query).sort({ createdAt: -1 });
    res.json(reports);
  } catch {
    res.status(500).json({ msg: 'Error fetching reports' });
  }
});

// ── POST /api/reports ────────────────────────────────────────────────────────
app.post('/api/reports', protect, async (req, res) => {
  try {
    const { title, data } = req.body;
    const newReport = new Report({
      title,
      data:       data || {},
      staffName:  req.user.name || 'Unknown',
      department: req.user.department,
      createdBy:  req.user.id,
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    console.error('Save Error:', err);
    res.status(500).json({ msg: 'Error saving report' });
  }
});

// ── GET /api/users (superadmin only) ─────────────────────────────────────────
app.get('/api/users', protect, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(403).json({ msg: 'Unauthorized' });
    const users = await User.find({ role: { $ne: 'superadmin' } })
      .select('-password')
      .sort({ role: 1, name: 1 });
    res.json(users);
  } catch {
    res.status(500).json({ msg: 'Error fetching users' });
  }
});

// ── PUT /api/users/:id (superadmin only) ─────────────────────────────────────
app.put('/api/users/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(403).json({ msg: 'Unauthorized' });

    const { name, email, department, password, role, managedDepts, jobTitle } = req.body;
    const updateData = {
      name, email, department,
      role:         role || 'staff',
      managedDepts: role === 'manager' ? (managedDepts || []) : [],
      jobTitle:     jobTitle || '',
    };

    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updated = await User.findByIdAndUpdate(
      req.params.id, { $set: updateData }, { new: true }
    ).select('-password');

    res.json({ msg: 'User updated', user: updated });
  } catch {
    res.status(500).json({ msg: 'Error updating user' });
  }
});

// ── DELETE /api/users/:id (superadmin only) ───────────────────────────────────
app.delete('/api/users/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(403).json({ msg: 'Unauthorized' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch {
    res.status(500).json({ msg: 'Error deleting user' });
  }
});

// ── Temp password fix ─────────────────────────────────────────────────────────
app.get('/api/fix-my-password', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('admin123', salt);
    const user = await User.findOneAndUpdate(
      { email: 'admin@system.com' },
      { password: hashed },
      { new: true }
    );
    res.send(user ? '<h1>Done! Password updated.</h1>' : '<h1>User not found.</h1>');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));