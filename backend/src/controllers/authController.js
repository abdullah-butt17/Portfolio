const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const { AppError, asyncHandler } = require('../middleware/errorMiddleware');
const env = require('../config/env');

// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

  if (!admin) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!admin.isActive) {
    throw new AppError('This admin account is inactive', 403);
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  generateToken(res, admin._id);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

// @route   POST /api/auth/logout
// @access  Private (admin)
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: 'Logged out successfully', data: {} });
});

// @route   GET /api/auth/me
// @access  Private (admin)
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Current admin fetched',
    data: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
});

module.exports = { login, logout, getMe };
