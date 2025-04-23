import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB || "");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// `mongodb://${process.env.MONGO_DB}:27017/interview-db`,
// {
//   authSource: "admin",
//   user: process.env.MONGO_INITDB_ROOT_USERNAME || "root",
//   pass: process.env.MONGO_INITDB_ROOT_PASSWORD || "root",
// }
