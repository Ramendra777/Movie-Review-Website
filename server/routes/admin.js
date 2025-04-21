// server/routes/admin.js
const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Movie = require('../models/Movie');
const User = require('../models/User');
const { clearCache } = require('../utils/cache');
const router = express.Router();

// Admin middleware (add this to server/middleware/admin.js)
// module.exports = (req, res, next) => {
//   if (!req.user.isAdmin) return res.status(403).send('Access denied');
//   next();
// };

// Get all movies (admin view)
router.get('/movies', [auth, admin], async (req, res) => {
  try {
    const movies = await Movie.find().sort('-createdAt');
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new movie
router.post('/movies', [auth, admin], async (req, res) => {
  try {
    const movie = new Movie({
      ...req.body,
      addedBy: req.user.id
    });
    await movie.save();
    
    // Clear relevant cache
    await clearCache('movies:*');
    
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update movie
router.put('/movies/:id', [auth, admin], async (req, res) => {
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

// Delete movie
router.delete('/movies/:id', [auth, admin], async (req, res) => {
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

// Get all users
router.get('/users', [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle user admin status
router.put('/users/:id/toggle-admin', [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isAdmin = !user.isAdmin;
    await user.save();
    
    res.json({ 
      message: `User ${user.isAdmin ? 'promoted to' : 'demoted from'} admin`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;