import mongoose from "mongoose";

export async function connectDB() {
  try {
    console.log(process.env.MONGO_DB);
    await mongoose.connect(
      `mongodb://${process.env.MONGO_DB}:27017/interview-db`,
      {
        authSource: "admin",
        user: process.env.MONGO_INITDB_ROOT_USERNAME || "root",
        pass: process.env.MONGO_INITDB_ROOT_PASSWORD || "root",
      }
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
