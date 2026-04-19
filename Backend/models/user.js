const mongoose = require('mongoose');

// All departments in the org structure
const ALL_DEPARTMENTS = [
  // CRM
  'AYUSH',
  'Bioclean',
  'Theertha',
  // KP / ICP
  'KP – ICP (CRM)',
  'KP – Factory Outlet',
  'KP – Exclusive Outlet',
  // Support
  'Happiness',
  'Purchase',
  'Warehouse',
  'Media',
  'Marketing',
  'Accounts',
];

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, unique: true, required: true },
  password: { type: String, required: true },

  // THREE-TIER ROLE SYSTEM
  // superadmin → full access + user management
  // manager    → sees only their managedDepts (AGM, TL, OM, Head, etc.)
  // staff      → sees & submits only their own dept
  role: {
    type: String,
    enum: ['superadmin', 'manager', 'staff'],
    default: 'staff',
  },

  // Manager's job title (e.g. "AGM", "Team Lead", "Technical Head")
  jobTitle: { type: String, default: '' },

  // For managers: which depts they can view reports from
  managedDepts: {
    type: [String],
    enum: ALL_DEPARTMENTS,
    default: [],
  },

  // The dept a user belongs to / submits reports for
  department: {
    type: String,
    enum: ALL_DEPARTMENTS,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);