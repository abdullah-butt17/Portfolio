const multer = require('multer');
const { AppError } = require('./errorMiddleware');

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if ([...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].includes(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new AppError(`Unsupported file type: ${file.mimetype}`, 400));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_VIDEO_SIZE },
});

/**
 * Validates the uploaded file's size against its type after multer parses it,
 * since multer's limits.fileSize is a single global ceiling.
 */
const validateFileSize = (req, res, next) => {
  if (!req.file) return next();

  const isVideo = ALLOWED_VIDEO_TYPES.includes(req.file.mimetype);
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  if (req.file.size > maxSize) {
    return next(new AppError(`File exceeds maximum size of ${maxSize / (1024 * 1024)}MB`, 400));
  }
  next();
};

module.exports = { upload, validateFileSize, ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES };
