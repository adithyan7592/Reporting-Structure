const mongoose = require('mongoose');

const ALL_DEPARTMENTS = [
  'AYUSH', 'Bioclean', 'Theertha',
  'KP – (CRM)', 'KP – Factory Outlet', 'KP – Exclusive Outlet',
  'Happiness', 'Purchase', 'Warehouse', 'Media', 'Marketing', 'Accounts',
];

// Per-dept access: which fields a manager can see in that department
// fields: ['*']  → all fields visible
// fields: ['Total No. of Calls', 'Quality Leads'] → only those fields visible
const ManagedDeptSchema = new mongoose.Schema({
  dept:   { type: String, enum: ALL_DEPARTMENTS, required: true },
  fields: { type: [String], default: ['*'] },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, unique: true, required: true },
  password:     { type: String, required: true },
  role:         { type: String, enum: ['superadmin', 'manager', 'staff'], default: 'staff' },
  jobTitle:     { type: String, default: '' },
  managedDepts: { type: [ManagedDeptSchema], default: [] },
  department:   { type: String, enum: ALL_DEPARTMENTS, required: true },
});

module.exports = mongoose.model('User', UserSchema);