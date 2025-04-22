const Movie = require('../models/Movie');
const { clearCache } = require('../utils/cache');

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find()
      .sort({ averageRating: -1 })
      .limit(20);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const movie = new Movie({
      ...req.body,
      addedBy: req.user.id
    });
    await movie.save();
    await clearCache('movies:*');
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};