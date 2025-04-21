// client/src/pages/Admin.js
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { searchMovies } from '../services/tmdb';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !user.isAdmin) {
      history.push('/');
    }
  }, [user, history]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchMovies(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMovie = async (tmdbMovie) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/movies', {
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        overview: tmdbMovie.overview,
        posterPath: tmdbMovie.poster_path,
        backdropPath: tmdbMovie.backdrop_path,
        releaseDate: tmdbMovie.release_date,
        genres: tmdbMovie.genre_ids
      });
      alert(`Movie "${response.data.title}" added successfully!`);
      setSelectedMovie(null);
    } catch (error) {
      console.error('Error adding movie:', error);
      alert(error.response?.data?.message || 'Failed to add movie');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Movie</h2>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a movie on TMDB..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
        
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Search Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((movie) => (
                <div key={movie.id} className="border rounded-lg p-4 flex">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/no-poster.jpg'}
                    alt={movie.title}
                    className="w-16 h-24 object-cover mr-4"
                  />
                  <div className="flex-grow">
                    <h4 className="font-medium">{movie.title}</h4>
                    <p className="text-sm text-gray-600">
                      {movie.release_date && new Date(movie.release_date).getFullYear()}
                    </p>
                    <button
                      onClick={() => handleAddMovie(movie)}
                      disabled={isSubmitting}
                      className="mt-2 bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Add to Database
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;