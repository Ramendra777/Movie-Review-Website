// server/utils/recommender.js
const Movie = require('../models/Movie');
const Review = require('../models/Review');

// Content-based recommendation
const getContentBasedRecommendations = async (userId) => {
  // Get user's reviewed movies
  const userReviews = await Review.find({ user: userId })
    .populate('movie')
    .sort({ rating: -1 })
    .limit(5);
  
  if (userReviews.length === 0) return [];
  
  // Extract top genres from highly rated movies
  const genreCounts = {};
  userReviews.forEach(review => {
    if (review.rating >= 7 && review.movie.genres) {
      review.movie.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    }
  });
  
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);
  
  if (topGenres.length === 0) return [];
  
  // Find similar movies
  return Movie.find({
    _id: { $nin: userReviews.map(r => r.movie._id) },
    genres: { $in: topGenres }
  })
  .sort({ averageRating: -1 })
  .limit(10);
};

// Collaborative filtering (simplified)
const getCollaborativeRecommendations = async (userId) => {
  // Find users with similar tastes
  const similarUsers = await Review.aggregate([
    {
      $lookup: {
        from: 'reviews',
        let: { movieId: '$movie' },
        pipeline: [
          { $match: { $expr: { $eq: ['$movie', '$$movieId'] }, user: { $ne: userId } } },
          { $project: { user: 1, rating: 1 } }
        ],
        as: 'otherReviews'
      }
    },
    { $unwind: '$otherReviews' },
    {
      $group: {
        _id: '$otherReviews.user',
        similarity: {
          $sum: {
            $abs: { $subtract: ['$rating', '$otherReviews.rating'] }
          }
        },
        count: { $sum: 1 }
      }
    },
    { $match: { count: { $gte: 3 } } },
    { $sort: { similarity: 1 } },
    { $limit: 5 }
  ]);
  
  if (similarUsers.length === 0) return [];
  
  // Get movies highly rated by similar users
  const similarUserIds = similarUsers.map(u => u._id);
  const recommendedMovies = await Review.aggregate([
    { $match: { user: { $in: similarUserIds }, rating: { $gte: 7 } } },
    { $group: { _id: '$movie', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    { $sort: { avgRating: -1, count: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: '_id',
        as: 'movie'
      }
    },
    { $unwind: '$movie' },
    { $replaceRoot: { newRoot: '$movie' } }
  ]);
  
  return recommendedMovies;
};

module.exports = {
  getContentBasedRecommendations,
  getCollaborativeRecommendations
};