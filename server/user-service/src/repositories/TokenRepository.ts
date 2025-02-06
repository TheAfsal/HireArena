import redisClient from "../config/redisClient";

class TokenRepository {
  async storeRefreshToken(email: string, refreshToken: string): Promise<void> {
    try {
      await redisClient.set(email, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days
    } catch (error) {
      console.error("Error storing refresh token:", error);
      throw new Error("Token storage failed");
    }
  }

  async getRefreshToken(email: string): Promise<string | null> {
    try {
      return await redisClient.get(email);
    } catch (error) {
      console.error("Error fetching refresh token:", error);
      throw new Error("Token retrieval failed");
    }
  }

  async removeRefreshToken(email: string): Promise<void> {
    try {
      await redisClient.del(email);
    } catch (error) {
      console.error("Error removing refresh token:", error);
      throw new Error("Token deletion failed");
    }
  }
}

export default TokenRepository;
