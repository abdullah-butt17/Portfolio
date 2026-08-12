const express = require('express');
const { body, param } = require('express-validator');

const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  updateSkillOrder,
  uploadSkillCertificate,
  deleteSkillCertificate,
} = require('../controllers/skillController');

const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const { validate } = require('../middleware/validationMiddleware');

const {
  upload,
  validateFileSize,
} = require('../middleware/uploadMiddleware');

const router = express.Router();

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid skill ID'),
];

const skillValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Skill name is required'),

  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert']),

  body('displayOrder')
    .optional()
    .isInt(),
];

// Public
router.get('/', getSkills);

// Admin - skill CRUD
router.post(
  '/',
  protect,
  requireAdmin,
  skillValidation,
  validate,
  createSkill
);

router.put(
  '/:id',
  protect,
  requireAdmin,
  [...idValidation, ...skillValidation.map((v) => v.optional())],
  validate,
  updateSkill
);

router.delete(
  '/:id',
  protect,
  requireAdmin,
  idValidation,
  validate,
  deleteSkill
);

// Admin - change display order
router.patch(
  '/:id/order',
  protect,
  requireAdmin,
  [
    ...idValidation,
    body('displayOrder')
      .isInt()
      .withMessage('displayOrder must be an integer'),
  ],
  validate,
  updateSkillOrder
);

// Admin - upload/replace certificate
router.post(
  '/:id/certificate',
  protect,
  requireAdmin,
  idValidation,
  validate,
  upload.single('file'),
  validateFileSize,
  uploadSkillCertificate
);

// Admin - delete certificate
router.delete(
  '/:id/certificate',
  protect,
  requireAdmin,
  idValidation,
  validate,
  deleteSkillCertificate
);

module.exports = router;