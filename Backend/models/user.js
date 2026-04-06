const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'staff'], default: 'staff' },
  department: { 
    type: String, 
    enum: ['KP', 'AYUSH', 'Theertha', 'Bioclean', 'Happiness', 'Purchase', 'Media', 'All'],
    required: true 
  }
});

module.exports = mongoose.model('User', UserSchema);