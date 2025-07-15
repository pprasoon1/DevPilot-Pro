const express = require('express');
const router = express.Router();
const EduProject = require('../models/EduProject');

// Get all educational projects
router.get('/', async (req, res) => {
  try {
    const projects = await EduProject.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching educational projects' });
  }
});

// Get a specific educational project
router.get('/:id', async (req, res) => {
  try {
    const project = await EduProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project' });
  }
});

module.exports = router;