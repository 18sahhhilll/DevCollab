const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProjects, getMatchedProjects, getProjectById,
  createProject, updateProject, deleteProject,
} = require('../controllers/projectController');

// Order matters — /match must come before /:id
router.get('/match', protect, getMatchedProjects);
router.get('/', getProjects);
router.post('/', protect, createProject);
router.get('/:id', getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
