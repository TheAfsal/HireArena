"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redisClient_1 = __importDefault(require("../config/redisClient"));
class RedisService {
    async get(key) {
        return new Promise((resolve, reject) => {
            redisClient_1.default.get(key, (err, data) => {
                if (err)
                    return reject(err);
                resolve(data ?? null);
            });
        });
    }
    async setWithTTL(key, value, ttl) {
        return new Promise((resolve, reject) => {
            redisClient_1.default.setex(key, ttl, JSON.stringify(value), (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    async delete(key) {
        return new Promise((resolve, reject) => {
            redisClient_1.default.del(key, (err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}
exports.default = RedisService;
