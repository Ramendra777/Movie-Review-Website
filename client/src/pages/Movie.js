import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../services/tmdb';
import api from '../services/api';
import MovieCard from '../components/movie/MovieCard';
import ReviewList from '../components/review/ReviewList';
import ReviewForm from '../components/review/ReviewForm';
import WatchlistButton from '../components/movie/WatchlistButton';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Movie = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch movie details from TMDB
        const tmdbMovie = await getMovieDetails(id);
        if (!tmdbMovie) {
          throw new Error('Movie not found');
        }
        
        // Fetch our database movie and reviews
        const [dbMovie, reviewsRes] = await Promise.all([
          api.get(`/movies/tmdb/${tmdbMovie.id}`).catch(() => null),
          api.get(`/reviews/movie/${tmdbMovie.id}`)
        ]);
        
        const combinedMovie = {
          ...tmdbMovie,
          ...(dbMovie?.data || {}),
          posterPath: tmdbMovie.poster_path,
          backdropPath: tmdbMovie.backdrop_path,
          releaseDate: tmdbMovie.release_date,
          genres: tmdbMovie.genres?.map(g => g.name) || []
        };
        
        setMovie(combinedMovie);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleReviewSubmit = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!movie) return <div className="text-center py-8">Movie not found</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Movie Header */}
      <div className="relative mb-8">
        <div 
          className="h-64 w-full bg-cover bg-center rounded-lg"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdropPath})`
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-end p-6">
            <div className="flex items-end space-x-6">
              <img
                src={movie.posterPath ? `https://image.tmdb.org/t/p/w300${movie.posterPath}` : '/no-poster.jpg'}
                alt={movie.title}
                className="w-48 h-72 object-cover rounded shadow-lg"
              />
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-blue-600 px-2 py-1 rounded text-sm">
                    {movie.releaseDate?.split('-')[0]}
                  </span>
                  <span className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    {movie.vote_average?.toFixed(1)}/10
                  </span>
                  <span>{movie.runtime} min</span>
                  {user && <WatchlistButton movieId={movie.id} />}
                </div>
                <p className="text-lg mb-4">{movie.overview}</p>
                <div className="flex flex-wrap gap-2">
                  {movie.genres?.map(genre => (
                    <span key={genre} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {user && <ReviewForm movieId={movie.id} onSubmit={handleReviewSubmit} />}
          <ReviewList reviews={reviews} />
        </div>
        
        {/* Movie Details Sidebar */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Details</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-500 dark:text-gray-400">Original Title</h4>
              <p>{movie.original_title}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-500 dark:text-gray-400">Status</h4>
              <p>{movie.status}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-500 dark:text-gray-400">Production Companies</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {movie.production_companies?.map(company => (
                  <span key={company.id} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">
                    {company.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;