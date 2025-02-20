import Redis from 'ioredis';

const redisClient = new Redis({
  host: 'redis', 
  port: 6379,        
});

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
  } catch (err) {
    console.error('Error with Redis:', err);
  }
};

checkRedisConnection();

export default redisClient; 
