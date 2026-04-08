const Message = require('../models/Message');
const Project = require('../models/Project');

// GET /api/chat/:projectId  — fetch messages (must be member)
const getMessages = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isMember = project.members.map(String).includes(req.user._id.toString())
      || project.createdBy.toString() === req.user._id.toString();
    if (!isMember) return res.status(403).json({ message: 'Not a team member' });

    const messages = await Message.find({ project: req.params.projectId })
      .populate('sender', 'name avatar role')
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMessages };
