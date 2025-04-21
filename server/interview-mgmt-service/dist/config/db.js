"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    try {
        console.log(process.env.MONGO_DB);
        await mongoose_1.default.connect(`mongodb://${process.env.MONGO_DB}:27017/interview-db`, {
            authSource: "admin",
            user: process.env.MONGO_INITDB_ROOT_USERNAME || "root",
            pass: process.env.MONGO_INITDB_ROOT_PASSWORD || "root",
        });
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
