const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { submitContact } = require('../controllers/contactController');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages sent. Please try again later.' },
});

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('subject').optional().trim().isLength({ max: 150 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
];

router.post('/', contactLimiter, contactValidation, validate, submitContact);

module.exports = router;
