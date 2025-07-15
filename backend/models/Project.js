// backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  files: { type: Object, default: {} }, // Stores file paths as keys and content as values
  createdAt: { type: Date, default: Date.now },
  isEducational: { type: Boolean, default: false },
  eduProjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'EduProject' },
  currentStep: { type: Number, default: 0 },
});

module.exports = mongoose.model('Project', projectSchema);