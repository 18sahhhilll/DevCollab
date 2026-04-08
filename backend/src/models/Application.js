const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    message: { type: String, default: '', maxlength: 1000 },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ project: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
