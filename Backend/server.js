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
  origin: 'https://reports.thetrendsetters.in', //Frontend URL
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
 * @desc    Authenticate user & get token
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
 * @desc    Create Staff (Superadmin Only)
 */
app.post('/api/register', protect, async (req, res) => {
  try {
    // Authorization check
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ msg: "Access Denied: Only Superadmin can create accounts" });
    }

    const { name, email, password, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      department,
      role: 'staff' // Default role for created users
    });

    await newUser.save();
    res.status(201).json({ msg: `Staff account created for ${name} in ${department}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating staff account" });
  }
});

/**
 * @route   GET /api/reports
 * @desc    Get reports based on department permissions
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
    console.error("Save Error:", err);
    res.status(500).json({ msg: "Error saving report" });
  }
});

// TEMPORARY ROUTE TO FIX YOUR DATABASE PASSWORD
app.get('/api/fix-my-password', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    
    // This updates the user you created in Atlas to have a proper hash
    const user = await User.findOneAndUpdate(
      { email: "admin@system.com" }, 
      { password: hashedPassword },
      { new: true }
    );

    if (user) {
      res.send("<h1>Success!</h1><p>Your password is now encrypted in the database. You can now log in at the frontend.</p>");
    } else {
      res.send("<h1>User Not Found</h1><p>Check if the email in Atlas is exactly 'admin@system.com'</p>");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));