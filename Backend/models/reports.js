const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  staffName: { type: String, required: true }, 
  department: { type: String, required: true }, 
  data: { type: Object, default: {} },
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },isEdited:  { type: Boolean, default: false },
editedAt:  { type: Date },
editedBy:  { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);