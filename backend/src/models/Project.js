const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 100 },
    description: { type: String, required: [true, 'Description is required'], maxlength: 2000 },
    requiredSkills: [{ type: String, trim: true }],
    teamSize: { type: Number, required: true, min: 1, max: 20, default: 3 },
    status: { type: String, enum: ['open', 'closed', 'in-progress'], default: 'open' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: String, trim: true }],
    githubRepo: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Web', 'Mobile', 'AI/ML', 'DevOps', 'Open Source', 'Startup', 'Research', 'Other'],
      default: 'Other',
    },
    applicationCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Virtual for checking if team is full
projectSchema.virtual('isFull').get(function () {
  return this.members.length >= this.teamSize;
});

projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Project', projectSchema);
