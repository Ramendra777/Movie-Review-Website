// client/src/pages/Admin.js
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import AdminMovies from '../components/admin/AdminMovies';
import AdminUsers from '../components/admin/AdminUsers';
import { FaFilm, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const Admin = () => {
  const { user, logout } = useContext(AuthContext);
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('movies');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      history.push('/');
    } else {
      fetchStats();
    }
  }, [user, history]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">Welcome, {user.username}</span>
            <button
              onClick={logout}
              className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">Total Movies</h3>
              <p className="text-3xl font-bold">{stats.movieCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
              <p className="text-3xl font-bold">{stats.userCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">Total Reviews</h3>
              <p className="text-3xl font-bold">{stats.reviewCount}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('movies')}
                className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'movies' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FaFilm className="mr-2" />
                Movies
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <FaUsers className="mr-2" />
                Users
              </button>
            </nav>
          </div>
          <div className="p-6">
            {activeTab === 'movies' && <AdminMovies />}
            {activeTab === 'users' && <AdminUsers />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;