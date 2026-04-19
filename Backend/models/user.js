const mongoose = require('mongoose');
 
const allDepartments = [
  'KP', 'AYUSH', 'Theertha', 'Bioclean', 'Happiness',
  'Purchase', 'Media', 'KP(Outlet)', 'KP Warehouse',
  'Ayush/Bioclean/Theertha Warehouse', 'Accounts'
];
 
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
 
  // THREE-TIER ROLE SYSTEM
  // superadmin → sees everything, manages users
  // manager    → sees only their managedDepts (AGM, OM, TL, etc.)
  // staff      → sees only their own department reports
  role: {
    type: String,
    enum: ['superadmin', 'manager', 'staff'],
    default: 'staff'
  },
 
  // For manager accounts: list of departments they oversee
  // e.g. ['KP', 'KP(Outlet)'] for a KP AGM
  // For staff: this will be empty (they use `department` field instead)
  managedDepts: {
    type: [String],
    enum: allDepartments,
    default: []
  },
 
  // The department a staff member belongs to (used for role: 'staff')
  // For managers, set this to their "primary" dept or leave as 'KP' as a default
  department: {
    type: String,
    enum: ['KP', 'AYUSH', 'Theertha', 'Bioclean', 'Happiness', 'Purchase', 'Media', 'KP(Outlet)', 'KP Warehouse', 'Ayush/Bioclean/Theertha Warehouse', 'Accounts'],
    required: true
  },
 
  // Optional: Human-readable job title for display on dashboard
  // e.g. "Team Lead", "AGM", "Operations Manager"
  jobTitle: {
    type: String,
    default: ''
  }
});
 
module.exports = mongoose.model('User', UserSchema);