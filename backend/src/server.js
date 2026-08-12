const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');

const start = async () => {
  await connectDB();

  const server = app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });

  process.on('unhandledRejection', (err) => {
    // eslint-disable-next-line no-console
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

start();
