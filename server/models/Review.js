// server/models/Review.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  text: {
    type: String,
    maxlength: 2000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one review per user per movie
ReviewSchema.index({ movie: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);