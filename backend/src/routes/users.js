const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProfile, updateProfile, getUserById, getGithubData,
  toggleBookmark, getNotifications, markNotificationsRead, getDashboard,
} = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/dashboard', protect, getDashboard);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markNotificationsRead);
router.post('/bookmark/:projectId', protect, toggleBookmark);
router.get('/:id', getUserById);
router.get('/:id/github', getGithubData);

module.exports = router;
