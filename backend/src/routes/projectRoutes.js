const express = require('express');
const { body, param } = require('express-validator');
const {
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
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { upload, validateFileSize } = require('../middleware/uploadMiddleware');

const router = express.Router();

const CATEGORIES = ['Full Stack', 'AI / ML', 'University', 'Personal', 'Other'];
const STATUSES = ['completed', 'in-progress', 'archived'];

const projectValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }),
  body('shortDescription').trim().notEmpty().withMessage('Short description is required').isLength({ max: 300 }),
  body('category').isIn(CATEGORIES).withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('status').optional().isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(', ')}`),
  body('technologies').optional().isArray().withMessage('Technologies must be an array'),
  body('features').optional().isArray().withMessage('Features must be an array'),
  body('githubUrl').optional({ checkFalsy: true }).isURL().withMessage('githubUrl must be a valid URL'),
  body('liveUrl').optional({ checkFalsy: true }).isURL().withMessage('liveUrl must be a valid URL'),
];

const idValidation = [param('id').isMongoId().withMessage('Invalid project ID')];

// ---------- Public ----------
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/admin', protect, requireAdmin, getAdminProjects);
router.get('/admin/:id', protect, requireAdmin, idValidation, validate, getAdminProjectById);
router.get('/:slug', getProjectBySlug);

// ---------- Admin ----------
router.post('/', protect, requireAdmin, projectValidation, validate, createProject);

router.put(
  '/:id',
  protect,
  requireAdmin,
  idValidation,
  projectValidation.map((v) => v.optional()),
  validate,
  updateProject
);

router.delete('/:id', protect, requireAdmin, idValidation, validate, deleteProject);

router.patch(
  '/:id/status',
  protect,
  requireAdmin,
  [...idValidation, body('status').isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(', ')}`)],
  validate,
  updateProjectStatus
);

router.patch(
  '/:id/featured',
  protect,
  requireAdmin,
  [...idValidation, body('featured').isBoolean().withMessage('featured must be boolean')],
  validate,
  updateProjectFeatured
);

router.patch(
  '/:id/published',
  protect,
  requireAdmin,
  [...idValidation, body('published').isBoolean().withMessage('published must be boolean')],
  validate,
  updateProjectPublished
);

router.patch(
  '/:id/order',
  protect,
  requireAdmin,
  [...idValidation, body('displayOrder').isInt().withMessage('displayOrder must be an integer')],
  validate,
  updateProjectOrder
);

router.post(
  '/:id/media',
  protect,
  requireAdmin,
  idValidation,
  validate,
  upload.single('file'),
  validateFileSize,
  uploadProjectMedia
);

router.delete(
  '/:id/media/:publicId',
  protect,
  requireAdmin,
  idValidation,
  validate,
  deleteProjectMedia
);

module.exports = router;
