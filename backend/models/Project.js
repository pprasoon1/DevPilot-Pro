// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  files: { type: Object, required: true } // JSON object to store the file tree
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;