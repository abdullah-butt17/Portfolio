const Profile = require('../models/Profile');
const { AppError, asyncHandler } = require('../middleware/errorMiddleware');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUtils');

// @route   GET /api/profile
// @access  Public
const getProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();

  if (!profile) {
    profile = await Profile.create({});
  }

  res.status(200).json({ success: true, message: 'Profile fetched successfully', data: profile });
});

// @route   PUT /api/profile
// @access  Admin
const updateProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();

  if (!profile) {
    profile = await Profile.create(req.body);
  } else {
    Object.assign(profile, req.body);
    await profile.save();
  }

  res.status(200).json({ success: true, message: 'Profile updated successfully', data: profile });
});

// @route   POST /api/profile/image
// @access  Admin
const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('No file uploaded', 400);

  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({});

  if (profile.profileImage?.publicId) {
    await deleteFromCloudinary(profile.profileImage.publicId, 'image');
  }

  const result = await uploadToCloudinary(req.file.buffer, 'image', 'portfolio/profile');
  profile.profileImage = { url: result.secure_url, publicId: result.public_id };
  await profile.save();

  res.status(200).json({ success: true, message: 'Profile image updated successfully', data: profile });
});

module.exports = { getProfile, updateProfile, uploadProfileImage };
