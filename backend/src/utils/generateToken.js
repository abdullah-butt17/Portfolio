const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Generate a JWT for an admin and set it as an HTTP-only cookie.
 */
const generateToken = (res, adminId) => {
  const token = jwt.sign({ id: adminId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

module.exports = generateToken;
