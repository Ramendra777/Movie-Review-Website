module.exports = {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/movie-review-app',
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: process.env.REDIS_PORT || 6379
  };