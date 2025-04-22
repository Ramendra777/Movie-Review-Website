const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  overview: String,
  posterPath: String,
  backdropPath: String,
  releaseDate: Date,
  genres: [String],
  averageRating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Update average rating when new reviews are added
MovieSchema.methods.updateRating = async function(reviewRating) {
  const totalRatings = this.averageRating * this.ratingCount + reviewRating;
  this.ratingCount += 1;
  this.averageRating = totalRatings / this.ratingCount;
  await this.save();
};

module.exports = mongoose.model('Movie', MovieSchema);