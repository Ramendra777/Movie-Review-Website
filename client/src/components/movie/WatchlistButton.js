// client/src/components/movie/WatchlistButton.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

const WatchlistButton = ({ movieId }) => {
  const { user } = useContext(AuthContext);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkWatchlist = async () => {
      if (user) {
        try {
          const response = await api.get('/watchlist');
          const isInList = response.data.movies.some(movie => movie._id === movieId);
          setIsInWatchlist(isInList);
        } catch (error) {
          console.error('Error checking watchlist:', error);
        }
      }
    };
    
    checkWatchlist();
  }, [user, movieId]);

  const toggleWatchlist = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (isInWatchlist) {
        await api.post(`/watchlist/remove/${movieId}`);
      } else {
        await api.post(`/watchlist/add/${movieId}`);
      }
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error('Error updating watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWatchlist}
      disabled={loading || !user}
      className="text-2xl text-yellow-500 hover:text-yellow-600 focus:outline-none disabled:opacity-50"
      title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {isInWatchlist ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};

export default WatchlistButton;