const User = require('../models/User');
const Project = require('../models/Project');
const { getUserProfile, getUserRepos, getUserLanguages } = require('../services/githubService');

// GET /api/users/profile  — own profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks', 'title status');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/profile  — update own profile
const updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'bio', 'skills', 'role', 'experienceLevel',
                     'githubUsername', 'availability', 'interests', 'avatar'];
    const updates = {};
    allowed.forEach((field) => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/:id  — public profile
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -notifications');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/:id/github  — GitHub data
const getGithubData = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user?.githubUsername) return res.status(400).json({ message: 'No GitHub username set' });

    const [profile, repos, languages] = await Promise.all([
      getUserProfile(user.githubUsername),
      getUserRepos(user.githubUsername),
      getUserLanguages(user.githubUsername),
    ]);
    res.json({ profile, repos, languages });
  } catch (err) {
    const status = err.response?.status === 404 ? 404 : 500;
    res.status(status).json({ message: err.response?.data?.message || err.message });
  }
};

// POST /api/users/bookmark/:projectId  — toggle bookmark
const toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pid = req.params.projectId;
    const idx = user.bookmarks.indexOf(pid);
    if (idx === -1) user.bookmarks.push(pid);
    else user.bookmarks.splice(idx, 1);
    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/notifications  — get notifications
const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    res.json(user.notifications.sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/notifications/read  — mark all read
const markNotificationsRead = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $set: { 'notifications.$[].read': true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/dashboard  — dashboard stats
const getDashboard = async (req, res) => {
  try {
    const Application = require('../models/Application');
    const [ownProjects, applications] = await Promise.all([
      Project.find({ createdBy: req.user._id }).populate('members', 'name avatar').lean(),
      Application.find({ applicant: req.user._id })
        .populate('project', 'title status requiredSkills')
        .lean(),
    ]);
    res.json({ ownProjects, applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProfile, updateProfile, getUserById, getGithubData,
  toggleBookmark, getNotifications, markNotificationsRead, getDashboard,
};
