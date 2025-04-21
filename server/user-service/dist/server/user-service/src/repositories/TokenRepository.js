"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redisClient_1 = __importDefault(require("../config/redisClient"));
class TokenRepository {
    async storeRefreshToken(email, refreshToken) {
        try {
            await redisClient_1.default.set(email, refreshToken, "EX", 7 * 24 * 60 * 60);
        }
        catch (error) {
            console.error("Error storing refresh token:", error);
            throw new Error("Token storage failed");
        }
    }
    async getRefreshToken(email) {
        try {
            return await redisClient_1.default.get(email);
        }
        catch (error) {
            console.error("Error fetching refresh token:", error);
            throw new Error("Token retrieval failed");
        }
    }
    async removeRefreshToken(email) {
        try {
            await redisClient_1.default.del(email);
        }
        catch (error) {
            console.error("Error removing refresh token:", error);
            throw new Error("Token deletion failed");
        }
    }
}
exports.default = TokenRepository;
