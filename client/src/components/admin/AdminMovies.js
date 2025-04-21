// client/src/components/admin/AdminMovies.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import MovieForm from './MovieForm';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await api.get('/admin/movies');
      setMovies(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  const handleDelete = (movieId) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this movie?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await api.delete(`/admin/movies/${movieId}`);
              setMovies(movies.filter(movie => movie._id !== movieId));
            } catch (error) {
              console.error('Error deleting movie:', error);
            }
          }
        },
        {
          label: 'No'
        }
      ]
    });
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentMovie) {
        // Update existing movie
        await api.put(`/admin/movies/${currentMovie._id}`, formData);
      } else {
        // Add new movie
        await api.post('/admin/movies', formData);
      }
      fetchMovies();
      setShowForm(false);
      setCurrentMovie(null);
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Movies</h2>
        <button
          onClick={() => {
            setCurrentMovie(null);
            setShowForm(true);
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FiPlus className="mr-2" />
          Add Movie
        </button>
      </div>

      {showForm && (
        <MovieForm
          movie={currentMovie}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setCurrentMovie(null);
          }}
        />
      )}

      {loading ? (
        <div className="text-center py-8">Loading movies...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Poster</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Rating</th>
                <th className="py-3 px-4 text-left">Release Date</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movies.map((movie) => (
                <tr key={movie._id}>
                  <td className="py-3 px-4">
                    <img
                      src={movie.posterPath ? `https://image.tmdb.org/t/p/w200${movie.posterPath}` : '/no-poster.jpg'}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium">{movie.title}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1">{movie.averageRating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {movie.releaseDate && new Date(movie.releaseDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentMovie(movie);
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(movie._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;