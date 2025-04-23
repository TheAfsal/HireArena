import mongoose from 'mongoose';

export async function connectDB() {
  try {
    console.log(process.env.MONGO_DB);
    await mongoose.connect(process.env.MONGO_DB ||"");
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}