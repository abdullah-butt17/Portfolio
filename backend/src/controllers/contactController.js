const Contact = require('../models/Contact');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @route   POST /api/contact
// @access  Public
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Save contact message to MongoDB
  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  res.status(201).json({
    success: true,
    message: 'Your message has been received. Thank you for reaching out.',
    data: contact,
  });
});

module.exports = { submitContact };