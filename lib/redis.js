// lib/redis.js
import Redis from 'ioredis';

// Connect to Redis using the environment variable or default to localhost
// For local development without env vars, this defaults to 127.0.0.1:6379
// which is standard for a local Redis instance.
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

export default redis;
