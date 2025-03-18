import mongoose from 'mongoose';

export async function connectDB() {
  try {
    await mongoose.connect(`mongodb://${process.env.MONGO_DB}:27017/chat-app`, {
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}