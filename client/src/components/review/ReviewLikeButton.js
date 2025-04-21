// client/src/components/review/ReviewLikeButton.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const ReviewLikeButton = ({ reviewId, likeCount }) => {
  const { user } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false);
  const [count, setCount] = useState(likeCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLike = async () => {
      if (user) {
        try {
          const response = await api.get(`/social/check-like/${reviewId}`);
          setIsLiked(response.data.isLiked);
        } catch (error) {
          console.error('Error checking like status:', error);
        }
      }
    };
    
    checkLike();
  }, [user, reviewId]);

  const toggleLike = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (isLiked) {
        await api.post(`/social/unlike-review/${reviewId}`);
        setCount(prev => prev - 1);
      } else {
        await api.post(`/social/like-review/${reviewId}`);
        setCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={toggleLike}
        disabled={loading || !user}
        className="text-red-500 hover:text-red-600 focus:outline-none disabled:opacity-50"
        title={isLiked ? 'Unlike review' : 'Like review'}
      >
        {isLiked ? <FaHeart /> : <FaRegHeart />}
      </button>
      <span className="ml-1 text-sm text-gray-600">{count}</span>
    </div>
  );
};

export default ReviewLikeButton;