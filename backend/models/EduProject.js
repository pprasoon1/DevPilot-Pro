const mongoose = require('mongoose');

const eduProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  steps: [
    {
      stepId: { type: String, required: true }, // e.g., "step1"
      description: { type: String, required: true },
      documentation: { type: String, required: true }, // Could be text or a URL
    },
  ],
  initialFiles: { type: Object, required: true }, // Initial file tree, e.g., { "index.js": "console.log('Hello');" }
});

module.exports = mongoose.model('EduProject', eduProjectSchema);