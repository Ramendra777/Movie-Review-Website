// server/routes/recommendations.js
const express = require('express');
const auth = require('../middleware/auth');
const { 
  getContentBasedRecommendations,
  getCollaborativeRecommendations
} = require('../utils/recommender');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const [contentBased, collaborative] = await Promise.all([
      getContentBasedRecommendations(req.user.id),
      getCollaborativeRecommendations(req.user.id)
    ]);
    
    // Combine and dedupe recommendations
    const allRecs = [...contentBased, ...collaborative];
    const uniqueRecs = allRecs.filter(
      (movie, index, self) => index === self.findIndex(m => m._id.equals(movie._id))
    );
    
    res.json(uniqueRecs.slice(0, 10));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;