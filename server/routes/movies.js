// server/routes/movies.js
const express = require('express');
const Movie = require('../models/Movie');
const { cacheMiddleware, clearCache } = require('../utils/cache');
const auth = require('../middleware/auth');
const router = express.Router();

// Cache popular movies for 1 hour
router.get('/popular', cacheMiddleware('movies'), async (req, res) => {
  try {
    const movies = await Movie.find()
      .sort({ averageRating: -1 })
      .limit(20);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cache search results for 30 minutes
router.get('/search', cacheMiddleware('movies', 1800), async (req, res) => {
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

// Add new movie (clear cache after)
router.post('/', auth, async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    
    // Clear relevant cache
    await clearCache('movies:*');
    
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update movie (clear cache after)
router.put('/:id', auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    
    // Clear relevant cache
    await clearCache('movies:*');
    
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete movie (clear cache after)
router.delete('/:id', auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    
    // Clear relevant cache
    await clearCache('movies:*');
    
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;