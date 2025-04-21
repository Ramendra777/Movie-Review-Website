// server/routes/movies.js
const express = require('express');
const Movie = require('../models/Movie');
const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { query, genre, yearFrom, yearTo, ratingFrom, sortBy } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { overview: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (genre) {
      filter.genres = genre;
    }
    
    if (yearFrom || yearTo) {
      filter.releaseDate = {};
      if (yearFrom) filter.releaseDate.$gte = new Date(`${yearFrom}-01-01`);
      if (yearTo) filter.releaseDate.$lte = new Date(`${yearTo}-12-31`);
    }
    
    if (ratingFrom) {
      filter.averageRating = { $gte: Number(ratingFrom) };
    }
    
    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort = { averageRating: -1, ratingCount: -1 };
        break;
      case 'newest':
        sort = { releaseDate: -1 };
        break;
      case 'oldest':
        sort = { releaseDate: 1 };
        break;
      case 'popular':
        sort = { ratingCount: -1 };
        break;
      default:
        sort = { title: 1 };
    }
    
    const movies = await Movie.find(filter)
      .sort(sort)
      .limit(50);
    
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;