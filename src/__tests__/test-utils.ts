import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export async function connect() {
  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  }
}

export async function closeDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
    console.log('MongoDB stopped');
  }
}

export async function clearDatabase() {
    const collections = mongoose.connection.collections;
    const promises = Object.keys(collections).map((key) =>
      collections[key].deleteMany({})
    );
    await Promise.all(promises);
  }
