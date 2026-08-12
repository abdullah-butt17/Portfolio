const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'Abdullah Butt',
    },
    headline: {
      type: String,
      required: true,
      trim: true,
      default: 'Full-Stack Developer & AI Engineer',
    },
    bio: {
      type: String,
      trim: true,
    },
    profileImage: {
      url: { type: String },
      publicId: { type: String },
    },
    location: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    phone: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
