const { AppError } = require('./errorMiddleware');

/**
 * Must run after `protect`. Verifies req.admin has the admin role.
 */
const requireAdmin = (req, res, next) => {
  if (!req.admin || req.admin.role !== 'admin') {
    return next(new AppError('Not authorized as admin', 403));
  }
  next();
};

module.exports = { requireAdmin };
