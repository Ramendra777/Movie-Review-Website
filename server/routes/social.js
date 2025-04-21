// server/routes/social.js
const express = require('express');
const auth = require('../middleware/auth');
const Follow = require('../models/Follow');
const ReviewLike = require('../models/ReviewLike');
const router = express.Router();

// Follow a user
router.post('/follow/:userId', auth, async (req, res) => {
  if (req.user.id === req.params.userId) {
    return res.status(400).json({ message: 'Cannot follow yourself' });
  }
  
  try {
    const follow = new Follow({
      follower: req.user.id,
      following: req.params.userId
    });
    await follow.save();
    res.json({ message: 'Followed successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already following this user' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Unfollow a user
router.post('/unfollow/:userId', auth, async (req, res) => {
  try {
    await Follow.findOneAndRemove({
      follower: req.user.id,
      following: req.params.userId
    });
    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like a review
router.post('/like-review/:reviewId', auth, async (req, res) => {
  try {
    const like = new ReviewLike({
      user: req.user.id,
      review: req.params.reviewId
    });
    await like.save();
    res.json({ message: 'Review liked' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Already liked this review' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Unlike a review
router.post('/unlike-review/:reviewId', auth, async (req, res) => {
  try {
    await ReviewLike.findOneAndRemove({
      user: req.user.id,
      review: req.params.reviewId
    });
    res.json({ message: 'Review unliked' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;