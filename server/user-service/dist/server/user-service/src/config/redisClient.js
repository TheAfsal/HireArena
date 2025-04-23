"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redisClient = new ioredis_1.default('redis://default:g4VIKOlYMy1OzlxqvjwB4hSovk8gPY4p@redis-12701.crce179.ap-south-1-1.ec2.redns.redis-cloud.com:12701');
// Check the connection to Redis
redisClient.on('connect', () => {
    console.log('Connected to Redis!');
});
redisClient.on('error', (err) => {
    console.error('Failed to connect to Redis:', err);
});
const checkRedisConnection = async () => {
    try {
        await redisClient.ping();
        console.log('Redis is connected and responding!');
    }
    catch (err) {
        console.error('Error with Redis:', err);
    }
};
checkRedisConnection();
exports.default = redisClient;
