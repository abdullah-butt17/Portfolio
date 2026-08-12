const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },

    category: {
      type: String,
      trim: true,
      default: 'Other',
    },

    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate',
    },

    icon: {
      type: String,
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    // Certificate uploaded to Cloudinary
    certificate: {
      url: {
        type: String,
        trim: true,
      },
      publicId: {
        type: String,
        trim: true,
      },
      name: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);