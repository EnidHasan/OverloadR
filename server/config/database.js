const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/workout-tracker';

let memoryServer;

async function connectWithUri(uri) {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  return {
    uri,
    usingMemoryServer: false,
  };
}

async function connectToDatabase() {
  const configuredUri = process.env.MONGODB_URI;
  const fallbackUri = DEFAULT_URI;

  if (!configuredUri) {
    throw new Error('MONGODB_URI is not set. Add it to server/.env before starting the server.');
  }

  try {
    return await connectWithUri(configuredUri);
  } catch (primaryError) {
    if (process.env.NODE_ENV === 'production') {
      throw primaryError;
    }

    console.warn('⚠️ Primary MongoDB connection failed. Falling back to local development options.');
    console.warn(`   Reason: ${primaryError.message}`);

    try {
      return await connectWithUri(fallbackUri);
    } catch (localError) {
      console.warn('⚠️ Local MongoDB is unavailable. Starting an in-memory MongoDB instance for development.');
      console.warn(`   Reason: ${localError.message}`);

      memoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'workout-tracker',
        },
      });

      const memoryUri = memoryServer.getUri();

      await mongoose.connect(memoryUri, {
        serverSelectionTimeoutMS: 10000,
      });

      return {
        uri: memoryUri,
        usingMemoryServer: true,
      };
    }
  }
}

async function disconnectFromDatabase() {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = undefined;
  }
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
};