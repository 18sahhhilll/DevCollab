const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  applyToProject, getMyApplications,
  getProjectApplications, updateApplicationStatus,
} = require('../controllers/applicationController');

router.post('/', protect, applyToProject);
router.get('/my', protect, getMyApplications);
router.get('/project/:projectId', protect, getProjectApplications);
router.put('/:id', protect, updateApplicationStatus);

module.exports = router;
