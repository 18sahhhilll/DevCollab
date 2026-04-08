const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    bio: { type: String, default: '', maxlength: 500 },
    avatar: { type: String, default: '' },
    skills: [{ type: String, trim: true }],
    role: {
      type: String,
      enum: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer',
             'DevOps Engineer', 'Data Scientist', 'UI/UX Designer', 'Product Manager', 'Other'],
      default: 'Other',
    },
    experienceLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner',
    },
    githubUsername: { type: String, default: '', trim: true },
    availability: { type: Boolean, default: true },
    interests: [{ type: String, trim: true }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    notifications: [
      {
        message: String,
        type: { type: String, enum: ['application', 'accepted', 'rejected', 'team', 'chat'] },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        link: String,
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
