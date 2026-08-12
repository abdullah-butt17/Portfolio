const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String, enum: ['image', 'video'], required: true },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: 300,
    },
    fullDescription: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Full Stack', 'AI / ML', 'University', 'Personal', 'Other'],
    },
    technologies: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: mediaSchema,
      default: null,
    },
    screenshots: {
      type: [mediaSchema],
      default: [],
    },
    video: {
      type: mediaSchema,
      default: null,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'archived'],
      default: 'in-progress',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    completionDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

projectSchema.index({ title: 'text', shortDescription: 'text', technologies: 'text' });

module.exports = mongoose.model('Project', projectSchema);
