const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Project = require('../models/Project');
const User = require('../models/User');

module.exports = (io) => {
  // Middleware: authenticate socket connections via JWT
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication error'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('name avatar role');
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.user.name} (${socket.id})`);

    // Join personal notification room
    socket.join(`user_${socket.user._id}`);

    // Join a project chat room
    socket.on('join_project', async ({ projectId }) => {
      try {
        const project = await Project.findById(projectId);
        if (!project) return socket.emit('error', { message: 'Project not found' });

        const isMember =
          project.members.map(String).includes(socket.user._id.toString()) ||
          project.createdBy.toString() === socket.user._id.toString();
        if (!isMember) return socket.emit('error', { message: 'Not a team member' });

        socket.join(`project_${projectId}`);
        console.log(`📦 ${socket.user.name} joined project room ${projectId}`);

        // Notify room
        socket.to(`project_${projectId}`).emit('user_joined', {
          user: { _id: socket.user._id, name: socket.user.name, avatar: socket.user.avatar },
        });
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    // Send message to project room
    socket.on('send_message', async ({ projectId, content }) => {
      try {
        if (!content?.trim()) return;
        const message = await Message.create({
          project: projectId,
          sender: socket.user._id,
          content: content.trim(),
        });

        const populated = await message.populate('sender', 'name avatar role');
        io.to(`project_${projectId}`).emit('new_message', populated);
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    // Typing indicators
    socket.on('typing', ({ projectId }) => {
      socket.to(`project_${projectId}`).emit('user_typing', {
        user: { name: socket.user.name, _id: socket.user._id },
      });
    });

    socket.on('stop_typing', ({ projectId }) => {
      socket.to(`project_${projectId}`).emit('user_stop_typing', { userId: socket.user._id });
    });

    socket.on('leave_project', ({ projectId }) => {
      socket.leave(`project_${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.user.name}`);
    });
  });
};
