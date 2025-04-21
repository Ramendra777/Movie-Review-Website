// server/utils/cache.js
const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

const cacheMiddleware = (keyPrefix, ttl = 3600) => {
  return async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') return next();
    
    const cacheKey = `${keyPrefix}:${req.originalUrl}`;
    
    try {
      const cachedData = await getAsync(cacheKey);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }
      
      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = (body) => {
        setAsync(cacheKey, JSON.stringify(body), 'EX', ttl)
          .catch(err => console.error('Cache set error:', err));
        return originalJson.call(res, body);
      };
      
      next();
    } catch (err) {
      console.error('Cache middleware error:', err);
      next();
    }
  };
};

const clearCache = async (keyPattern) => {
  if (process.env.NODE_ENV === 'test') return;
  
  try {
    const keys = await new Promise((resolve, reject) => {
      client.keys(keyPattern, (err, keys) => {
        if (err) reject(err);
        else resolve(keys);
      });
    });
    
    if (keys.length > 0) {
      await delAsync(keys);
    }
  } catch (err) {
    console.error('Cache clear error:', err);
  }
};

module.exports = { cacheMiddleware, clearCache };