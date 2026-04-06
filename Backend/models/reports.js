const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: String,
  data: Object, // Flexible object to store your specific form fields
  department: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);