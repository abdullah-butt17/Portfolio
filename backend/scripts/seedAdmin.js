/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../src/config/env');
const Admin = require('../src/models/Admin');

const seed = async () => {
  const { name, email, password } = env.admin;

  if (!name || !email || !password) {
    console.error('ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  await mongoose.connect(env.mongoUri);
  console.log(`Connected to ${mongoose.connection.name}`);

  const existing = await Admin.findOne({ email: email.toLowerCase() });

  if (existing) {
    console.log(`Admin with email ${email} already exists. Skipping creation.`);
  } else {
    await Admin.create({ name, email, password });
    console.log(`Admin account created for ${email}`);
  }

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
