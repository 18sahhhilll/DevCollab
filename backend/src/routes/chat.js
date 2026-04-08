const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMessages } = require('../controllers/chatController');

router.get('/:projectId', protect, getMessages);

module.exports = router;
