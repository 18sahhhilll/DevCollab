const Project = require('../models/Project');
const User = require('../models/User');
const { matchProjects } = require('../services/matchingService');

// GET /api/projects  — list all (with optional filters)
const getProjects = async (req, res) => {
  try {
    const { status, category, skill, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (skill) filter.requiredSkills = { $in: [new RegExp(skill, 'i')] };
    if (search) filter.title = { $regex: search, $options: 'i' };

    const projects = await Project.find(filter)
      .populate('createdBy', 'name avatar role')
      .populate('members', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects/match  — matched & sorted by user skills
const getMatchedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'open' })
      .populate('createdBy', 'name avatar role')
      .populate('members', 'name avatar');
    const enriched = matchProjects(projects, req.user.skills || []);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name avatar role bio githubUsername')
      .populate('members', 'name avatar role skills');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const { title, description, requiredSkills, teamSize, category, tags, githubRepo } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    const project = await Project.create({
      title, description,
      requiredSkills: requiredSkills || [],
      teamSize: teamSize || 3,
      category: category || 'Other',
      tags: tags || [],
      githubRepo: githubRepo || '',
      createdBy: req.user._id,
      members: [req.user._id],
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const allowed = ['title', 'description', 'requiredSkills', 'teamSize', 'status', 'category', 'tags', 'githubRepo'];
    allowed.forEach((f) => { if (req.body[f] !== undefined) project[f] = req.body[f]; });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProjects, getMatchedProjects, getProjectById, createProject, updateProject, deleteProject };
