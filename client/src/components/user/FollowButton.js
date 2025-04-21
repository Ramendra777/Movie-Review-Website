// client/src/components/user/FollowButton.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const FollowButton = ({ userId }) => {
  const { user } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFollowing = async () => {
      if (user && user.id !== userId) {
        try {
          const response = await api.get(`/social/check-follow/${userId}`);
          setIsFollowing(response.data.isFollowing);
        } catch (error) {
          console.error('Error checking follow status:', error);
        }
      }
    };
    
    checkFollowing();
  }, [user, userId]);

  const toggleFollow = async () => {
    if (!user || user.id === userId) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await api.post(`/social/unfollow/${userId}`);
      } else {
        await api.post(`/social/follow/${userId}`);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.id === userId) return null;

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-md text-sm font-medium ${
        isFollowing 
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;