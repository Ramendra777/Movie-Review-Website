const redis = require('redis');
const { promisify } = require('util');
const config = require('../config/db');

const client = redis.createClient({
  host: config.redisHost,
  port: config.redisPort
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

exports.cacheMiddleware = (keyPrefix, ttl = 3600) => {
  return async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') return next();
    
    const cacheKey = `${keyPrefix}:${req.originalUrl}`;
    
    try {
      const cachedData = await getAsync(cacheKey);
      if (cachedData) return res.json(JSON.parse(cachedData));
      
      const originalJson = res.json;
      res.json = (body) => {
        setAsync(cacheKey, JSON.stringify(body), 'EX', ttl)
          .catch(console.error);
        return originalJson.call(res, body);
      };
      
      next();
    } catch (err) {
      console.error('Cache error:', err);
      next();
    }
  };
};

exports.clearCache = async (keyPattern) => {
  if (process.env.NODE_ENV === 'test') return;
  
  try {
    const keys = await new Promise((resolve, reject) => {
      client.keys(keyPattern, (err, keys) => {
        if (err) reject(err);
        else resolve(keys);
      });
    });
    
    if (keys.length > 0) await delAsync(keys);
  } catch (err) {
    console.error('Cache clear error:', err);
  }
};