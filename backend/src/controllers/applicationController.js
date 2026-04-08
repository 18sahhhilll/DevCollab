const Application = require('../models/Application');
const Project = require('../models/Project');
const User = require('../models/User');

// POST /api/applications  — apply to a project
const applyToProject = async (req, res) => {
  try {
    const { projectId, message } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.status !== 'open') return res.status(400).json({ message: 'Project is not open' });
    if (project.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot apply to your own project' });
    }
    if (project.members.map(String).includes(req.user._id.toString())) {
      return res.status(400).json({ message: 'You are already a team member' });
    }

    const application = await Application.create({
      project: projectId,
      applicant: req.user._id,
      message: message || '',
    });

    // Increment application count
    await Project.findByIdAndUpdate(projectId, { $inc: { applicationCount: 1 } });

    // Notify project owner
    await User.findByIdAndUpdate(project.createdBy, {
      $push: {
        notifications: {
          message: `${req.user.name} applied to your project "${project.title}"`,
          type: 'application',
          link: `/projects/${projectId}`,
        },
      },
    });

    // Emit real-time notification if io is available via req
    if (req.io) {
      req.io.to(`user_${project.createdBy}`).emit('notification', {
        message: `${req.user.name} applied to "${project.title}"`,
        type: 'application',
        link: `/projects/${projectId}`,
      });
    }

    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Already applied to this project' });
    res.status(500).json({ message: err.message });
  }
};

// GET /api/applications/my  — own applications
const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate('project', 'title status requiredSkills category createdBy')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/applications/project/:projectId — applications for a project (owner only)
const getProjectApplications = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const apps = await Application.find({ project: req.params.projectId })
      .populate('applicant', 'name avatar skills role experienceLevel bio githubUsername')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/applications/:id  — accept or reject
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const application = await Application.findById(req.params.id).populate('project');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const project = application.project;
    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check team size when accepting
    if (status === 'accepted') {
      if (project.members.length >= project.teamSize) {
        return res.status(400).json({ message: 'Team is already full' });
      }
      // Add member to project
      await Project.findByIdAndUpdate(project._id, {
        $addToSet: { members: application.applicant },
      });
    }

    application.status = status;
    await application.save();

    // Notify applicant
    const notifMsg = status === 'accepted'
      ? `You were accepted to the team for "${project.title}"! 🎉`
      : `Your application for "${project.title}" was not accepted.`;

    await User.findByIdAndUpdate(application.applicant, {
      $push: {
        notifications: {
          message: notifMsg,
          type: status,
          link: `/projects/${project._id}`,
        },
      },
    });

    if (req.io) {
      req.io.to(`user_${application.applicant}`).emit('notification', {
        message: notifMsg,
        type: status,
        link: `/projects/${project._id}`,
      });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { applyToProject, getMyApplications, getProjectApplications, updateApplicationStatus };
