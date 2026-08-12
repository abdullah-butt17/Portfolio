const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  if (!env.mongoUri) {
    // eslint-disable-next-line no-console
    console.error('MONGO_URI is not defined. Cannot connect to database.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(env.mongoUri);
    // eslint-disable-next-line no-console
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  // eslint-disable-next-line no-console
  console.warn('MongoDB disconnected');
});

const gracefulShutdown = async () => {
  await mongoose.connection.close();
  // eslint-disable-next-line no-console
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = connectDB;
