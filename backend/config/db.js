import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // Zero-config: Use memory server if no URI is provided, or if explicitly requested.
    if (!uri || uri.startsWith('in-memory')) {
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log(`Using Zero-Config In-Memory MongoDB`);
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
