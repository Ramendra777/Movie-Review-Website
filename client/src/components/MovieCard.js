// client/src/components/MovieCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <Link to={`/movie/${movie.tmdbId || movie.id}`}>
        <img
          src={movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : '/no-poster.jpg'}
          alt={movie.title}
          className="w-full h-64 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/movie/${movie.tmdbId || movie.id}`} className="text-lg font-semibold hover:text-blue-600">
          {movie.title}
        </Link>
        <div className="flex items-center mt-2">
          <StarRating rating={movie.averageRating} />
          <span className="ml-2 text-gray-600">
            ({movie.ratingCount || 0})
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          {movie.releaseDate && new Date(movie.releaseDate).getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;