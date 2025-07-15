// routes/projects.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const authenticate = require('../middleware/auth'); // Assumes you have JWT authentication middleware
const EduProject = require('../models/EduProject');
// Create a new project
router.post('/', authenticate, async (req, res) => {
  const { name, files } = req.body;
  try {
    const project = new Project({
      name,
      owner: req.userId, // From JWT payload
      files: files || {} // Default to empty file tree if not provided
    });
    await project.save();
    await User.findByIdAndUpdate(req.userId, { $push: { projects: project._id } });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
});

// Get all projects for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.userId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

// Get a specific project
router.get('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error });
  }
});

// Update a project
router.put('/:id', authenticate, async (req, res) => {
  const { name, files } = req.body;
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { name, files },
      { new: true } // Return the updated document
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error });
  }
});

// Delete a project
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await User.findByIdAndUpdate(req.userId, { $pull: { projects: req.params.id } });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
});

router.post('/startEdu', authenticate, async (req, res) => {
  const { eduProjectId } = req.body;
  try {
    const eduProject = await EduProject.findById(eduProjectId);
    if (!eduProject) return res.status(404).json({ message: 'Educational project not found' });

    const newProject = new Project({
      name: eduProject.title,
      owner: req.userId, // From authentication middleware
      files: eduProject.initialFiles,
      isEducational: true,
      eduProjectId: eduProject._id,
      currentStep: 0,
    });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error starting educational project' });
  }
});
module.exports = router;