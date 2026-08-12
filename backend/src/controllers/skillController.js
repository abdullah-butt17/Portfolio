const Skill = require('../models/Skill');
const { AppError, asyncHandler } = require('../middleware/errorMiddleware');
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require('../utils/cloudinaryUtils');

// @route   GET /api/skills
// @access  Public
const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find().sort({ displayOrder: 1, category: 1 });

  res.status(200).json({
    success: true,
    message: 'Skills fetched successfully',
    data: skills,
  });
});

// @route   POST /api/skills
// @access  Admin
const createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Skill created successfully',
    data: skill,
  });
});

// @route   PUT /api/skills/:id
// @access  Admin
const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!skill) throw new AppError('Skill not found', 404);

  res.status(200).json({
    success: true,
    message: 'Skill updated successfully',
    data: skill,
  });
});

// @route   DELETE /api/skills/:id
// @access  Admin
const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    throw new AppError('Skill not found', 404);
  }

  // Delete certificate from Cloudinary before deleting the skill
  if (skill.certificate?.publicId) {
    await deleteFromCloudinary(
      skill.certificate.publicId,
      'image'
    );
  }

  await skill.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Skill deleted successfully',
    data: {},
  });
});

// @route   PATCH /api/skills/:id/order
// @access  Admin
const updateSkillOrder = asyncHandler(async (req, res) => {
  const { displayOrder } = req.body;

  const skill = await Skill.findByIdAndUpdate(
    req.params.id,
    { displayOrder },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!skill) throw new AppError('Skill not found', 404);

  res.status(200).json({
    success: true,
    message: 'Skill order updated',
    data: skill,
  });
});

// @route   POST /api/skills/:id/certificate
// @access  Admin
const uploadSkillCertificate = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No certificate file uploaded', 400);
  }

  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    throw new AppError('Skill not found', 404);
  }

  // Delete the previous certificate from Cloudinary
  if (skill.certificate?.publicId) {
    await deleteFromCloudinary(
      skill.certificate.publicId,
      'image'
    );
  }

  // Upload the new certificate
  const result = await uploadToCloudinary(
    req.file.buffer,
    'image',
    'portfolio/skills/certificates'
  );

  skill.certificate = {
    url: result.secure_url,
    publicId: result.public_id,
    name: req.file.originalname,
  };

  await skill.save();

  res.status(200).json({
    success: true,
    message: 'Skill certificate uploaded successfully',
    data: skill,
  });
});

// @route   DELETE /api/skills/:id/certificate
// @access  Admin
const deleteSkillCertificate = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    throw new AppError('Skill not found', 404);
  }

  if (!skill.certificate?.publicId) {
    throw new AppError('No certificate found for this skill', 404);
  }

  await deleteFromCloudinary(
    skill.certificate.publicId,
    'image'
  );

  skill.certificate = undefined;

  await skill.save();

  res.status(200).json({
    success: true,
    message: 'Skill certificate deleted successfully',
    data: skill,
  });
});

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  updateSkillOrder,
  uploadSkillCertificate,
  deleteSkillCertificate,
};