const Project = require('../models/Project');
const { AppError, asyncHandler } = require('../middleware/errorMiddleware');
const { generateUniqueSlug } = require('../utils/slugify');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUtils');

// ---------- Public ----------

// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const { search, category, status, featured, page = 1, limit = 9 } = req.query;

  const query = { published: true };

  if (category) query.category = category;
  if (status) query.status = status;
  if (featured !== undefined) query.featured = featured === 'true';

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { technologies: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 9, 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const [projects, total] = await Promise.all([
    Project.find(query).sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(limitNum),
    Project.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    message: 'Projects fetched successfully',
    data: projects,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// @route   GET /api/projects/featured
// @access  Public
const getFeaturedProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ published: true, featured: true }).sort({
    displayOrder: 1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    message: 'Featured projects fetched successfully',
    data: projects,
  });
});

// @route   GET /api/projects/:slug
// @access  Public
const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug, published: true });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  res.status(200).json({ success: true, message: 'Project fetched successfully', data: project });
});

// ---------- Admin ----------

// @route   GET /api/projects/admin
// @access  Admin
const getAdminProjects = asyncHandler(async (req, res) => {
  const { search, category, status, featured, published, page = 1, limit = 9 } = req.query;

  const query = {};
  if (category) query.category = category;
  if (status) query.status = status;
  if (featured !== undefined) query.featured = featured === 'true';
  if (published !== undefined) query.published = published === 'true';

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { technologies: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 9, 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const [projects, total] = await Promise.all([
    Project.find(query).sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(limitNum),
    Project.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    message: 'Admin projects fetched successfully',
    data: projects,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// @route   GET /api/projects/admin/:id
// @access  Admin
const getAdminProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError('Project not found', 404);

  res.status(200).json({ success: true, message: 'Project fetched successfully', data: project });
});

// @route   POST /api/projects
// @access  Admin
const createProject = asyncHandler(async (req, res) => {
  const slug = await generateUniqueSlug(Project, req.body.title);

  const project = await Project.create({ ...req.body, slug });

  res.status(201).json({ success: true, message: 'Project created successfully', data: project });
});

// @route   PUT /api/projects/:id
// @access  Admin
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError('Project not found', 404);

  const updates = { ...req.body };

  if (updates.title && updates.title !== project.title) {
    updates.slug = await generateUniqueSlug(Project, updates.title, project._id);
  }

  Object.assign(project, updates);
  await project.save();

  res.status(200).json({ success: true, message: 'Project updated successfully', data: project });
});

// @route   DELETE /api/projects/:id
// @access  Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError('Project not found', 404);

  const mediaToDelete = [
    ...(project.thumbnail ? [project.thumbnail] : []),
    ...(project.video ? [project.video] : []),
    ...(project.screenshots || []),
  ];

  await Promise.all(
    mediaToDelete.map((m) => deleteFromCloudinary(m.publicId, m.resourceType))
  );

  await project.deleteOne();

  res.status(200).json({ success: true, message: 'Project deleted successfully', data: {} });
});

// @route   PATCH /api/projects/:id/status
// @access  Admin
const updateProjectStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const project = await Project.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
  if (!project) throw new AppError('Project not found', 404);

  res.status(200).json({ success: true, message: 'Project status updated', data: project });
});

// @route   PATCH /api/projects/:id/featured
// @access  Admin
const updateProjectFeatured = asyncHandler(async (req, res) => {
  const { featured } = req.body;
  const project = await Project.findByIdAndUpdate(req.params.id, { featured }, { new: true, runValidators: true });
  if (!project) throw new AppError('Project not found', 404);

  res.status(200).json({ success: true, message: 'Project featured status updated', data: project });
});

// @route   PATCH /api/projects/:id/published
// @access  Admin
const updateProjectPublished = asyncHandler(async (req, res) => {
  const { published } = req.body;
  const project = await Project.findByIdAndUpdate(req.params.id, { published }, { new: true, runValidators: true });
  if (!project) throw new AppError('Project not found', 404);

  res.status(200).json({ success: true, message: 'Project publish status updated', data: project });
});

// @route   PATCH /api/projects/:id/order
// @access  Admin
const updateProjectOrder = asyncHandler(async (req, res) => {
  const { displayOrder } = req.body;
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { displayOrder },
    { new: true, runValidators: true }
  );
  if (!project) throw new AppError('Project not found', 404);

  res.status(200).json({ success: true, message: 'Project order updated', data: project });
});

// ---------- Media ----------

// @route   POST /api/projects/:id/media
// @access  Admin
// body/query: type = 'thumbnail' | 'screenshot' | 'video'
const uploadProjectMedia = asyncHandler(async (req, res) => {
  const { type } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError('Project not found', 404);
  if (!req.file) throw new AppError('No file uploaded', 400);
  if (!['thumbnail', 'screenshot', 'video'].includes(type)) {
    throw new AppError('Invalid media type. Must be thumbnail, screenshot, or video.', 400);
  }

  const resourceType = type === 'video' ? 'video' : 'image';
  const result = await uploadToCloudinary(req.file.buffer, resourceType, `portfolio/projects/${project.slug}`);

  const mediaObj = { url: result.secure_url, publicId: result.public_id, resourceType };

  if (type === 'thumbnail') {
    if (project.thumbnail?.publicId) {
      await deleteFromCloudinary(project.thumbnail.publicId, project.thumbnail.resourceType);
    }
    project.thumbnail = mediaObj;
  } else if (type === 'video') {
    if (project.video?.publicId) {
      await deleteFromCloudinary(project.video.publicId, project.video.resourceType);
    }
    project.video = mediaObj;
  } else {
    project.screenshots.push(mediaObj);
  }

  await project.save();

  res.status(200).json({ success: true, message: 'Media uploaded successfully', data: project });
});

// @route   DELETE /api/projects/:id/media/:publicId
// @access  Admin
// NOTE: publicId in the URL must be the URL-encoded Cloudinary public ID.
const deleteProjectMedia = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError('Project not found', 404);

  const publicId = decodeURIComponent(req.params.publicId);
  let found = false;

  if (project.thumbnail?.publicId === publicId) {
    await deleteFromCloudinary(publicId, project.thumbnail.resourceType);
    project.thumbnail = null;
    found = true;
  } else if (project.video?.publicId === publicId) {
    await deleteFromCloudinary(publicId, project.video.resourceType);
    project.video = null;
    found = true;
  } else {
    const idx = project.screenshots.findIndex((s) => s.publicId === publicId);
    if (idx !== -1) {
      await deleteFromCloudinary(publicId, project.screenshots[idx].resourceType);
      project.screenshots.splice(idx, 1);
      found = true;
    }
  }

  if (!found) throw new AppError('Media not found on this project', 404);

  await project.save();

  res.status(200).json({ success: true, message: 'Media deleted successfully', data: project });
});

module.exports = {
  getProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getAdminProjects,
  getAdminProjectById,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStatus,
  updateProjectFeatured,
  updateProjectPublished,
  updateProjectOrder,
  uploadProjectMedia,
  deleteProjectMedia,
};
