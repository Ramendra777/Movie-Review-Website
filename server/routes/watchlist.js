// server/routes/watchlist.js
const express = require('express');
const auth = require('../middleware/auth');
const Watchlist = require('../models/Watchlist');
const router = express.Router();

// Get or create watchlist
router.get('/', auth, async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user.id })
      .populate('movies');
    
    if (!watchlist) {
      watchlist = new Watchlist({ user: req.user.id, movies: [] });
      await watchlist.save();
    }
    
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to watchlist
router.post('/add/:movieId', auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOneAndUpdate(
      { user: req.user.id },
      { $addToSet: { movies: req.params.movieId } },
      { new: true, upsert: true }
    ).populate('movies');
    
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from watchlist
router.post('/remove/:movieId', auth, async (req, res) => {
  try {
    const watchlist = await Watchlist.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { movies: req.params.movieId } },
      { new: true }
    ).populate('movies');
    
    res.json(watchlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;