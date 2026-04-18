const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import Models
const User = require('./models/user');
const Report = require('./models/reports');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://reports.thetrendsetters.in', // Your Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected: ReportingDB"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// --- AUTH MIDDLEWARE ---
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) { 
    res.status(401).json({ msg: "Token is not valid or expired" }); 
  }
};

// --- ROUTES ---

/**
 * @route   POST /api/login
 * @desc    Authenticate user & get token with specific role
 */
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Sign token with user ID, department, and specific role (Agent/AGM/etc)
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role, 
        department: user.department,
        name: user.name 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      role: user.role, 
      department: user.department, 
      name: user.name 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   POST /api/register
 * @desc    Create Staff with Custom Role (Superadmin Only)
 */
app.post('/api/register', protect, async (req, res) => {
  try {
    // Authorization check
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ msg: "Access Denied: Only Superadmin can create accounts" });
    }

    // Accept 'role' (e.g., Agent, AGM) from the frontend request
    const { name, email, password, department, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      department,
      role: role || 'Agent' // Default to Agent if no role is specified
    });

    await newUser.save();
    res.status(201).json({ msg: `Account created for ${name} as ${role} in ${department}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating staff account" });
  }
});

/**
 * @route   GET /api/users
 * @desc    Get all staff members (Superadmin Only)
 */
app.get('/api/users', protect, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ msg: "Unauthorized" });
    }
    // Return all users except superadmin, excluding passwords for security
    const users = await User.find({ role: { $ne: 'superadmin' } }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users" });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update staff details or reset password (Superadmin Only)
 */
app.put('/api/users/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const { name, email, department, role, password } = req.body;
    let updateData = { name, email, department, role };

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.json({ msg: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ msg: "Error updating user" });
  }
});

/**
 * @route   GET /api/reports
 * @desc    Get reports based on permissions
 */
app.get('/api/reports', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'superadmin') {
      query.department = req.user.department;
    }
    const reports = await Report.find(query).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching reports" });
  }
});

/**
 * @route   POST /api/reports
 * @desc    Submit a new report
 */
app.post('/api/reports', protect, async (req, res) => {
  try {
    const { title, data } = req.body;
    const newReport = new Report({
      title,
      data: data || {},
      staffName: req.user.name || "Unknown Staff", 
      department: req.user.department,
      createdBy: req.user.id
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ msg: "Error saving report" });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));