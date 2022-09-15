const createError = require('http-errors');
const redis = require('redis');
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err) => {
  createError(err.message);
});
redisClient.on('error', (err) => {
  console.log(err);
  createError.InternalError(err.message);
});
redisClient.on('end', () => {
  console.log('Disconnected from Redis');
});
module.exports = redisClient;
