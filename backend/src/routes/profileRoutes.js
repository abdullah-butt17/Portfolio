const express = require('express');
const { body } = require('express-validator');

const {
  getProfile,
  updateProfile,
  uploadProfileImage,
} = require('../controllers/profileController');

const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const {
  upload,
  validateFileSize,
} = require('../middleware/uploadMiddleware');

const router = express.Router();

const profileValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),

  body('headline')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Headline cannot be empty'),

  body('bio')
    .optional()
    .trim(),

  body('location')
    .optional()
    .trim(),

  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail(),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 30 })
    .withMessage('Phone number is too long'),

  body('githubUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Invalid GitHub URL'),

  body('linkedinUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Invalid LinkedIn URL'),

  body('resumeUrl')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Invalid resume URL'),
];

// Public
router.get('/', getProfile);

// Admin - update profile
router.put(
  '/',
  protect,
  requireAdmin,
  profileValidation,
  validate,
  updateProfile
);

// Admin - upload profile image
router.post(
  '/image',
  protect,
  requireAdmin,
  upload.single('file'),
  validateFileSize,
  uploadProfileImage
);

module.exports = router;