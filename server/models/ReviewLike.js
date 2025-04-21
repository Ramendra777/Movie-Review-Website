// server/models/ReviewLike.js
const mongoose = require('mongoose');

const ReviewLikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one like per user per review
ReviewLikeSchema.index({ user: 1, review: 1 }, { unique: true });

module.exports = mongoose.model('ReviewLike', ReviewLikeSchema);