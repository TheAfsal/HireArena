import { IRedisService } from "@core/interfaces/services/IRedisService";
import redisClient from "../config/redisClient";

class RedisService implements IRedisService {
  async get(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      redisClient.get(key, (err, data) => {
        if (err) return reject(err);
        resolve(data ?? null);
      });
    });
  }

  async setWithTTL(key: string, value: any, ttl: number): Promise<void> {
    return new Promise((resolve, reject) => {
      redisClient.setex(key, ttl, JSON.stringify(value), (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  async delete(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      redisClient.del(key, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  
}

export default RedisService;
