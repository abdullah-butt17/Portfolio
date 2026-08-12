const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Admin = require('../models/Admin');
const { AppError, asyncHandler } = require('./errorMiddleware');

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new AppError('Not authenticated. Please log in.', 401);
  }

  const decoded = jwt.verify(token, env.jwtSecret);
  const admin = await Admin.findById(decoded.id);

  if (!admin) {
    throw new AppError('Admin account no longer exists', 401);
  }

  if (!admin.isActive) {
    throw new AppError('Admin account is inactive', 403);
  }

  req.admin = admin;
  next();
});

module.exports = { protect };
