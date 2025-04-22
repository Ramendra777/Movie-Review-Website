import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { DarkModeContext } from '../../context/DarkModeContext';
import DarkModeToggle from '../DarkModeToggle';
import { FaFilm, FaSearch, FaUser, FaSignOutAlt, FaHome } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <nav className={`bg-blue-800 text-white shadow-md ${darkMode ? 'dark:bg-gray-900' : ''}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <FaFilm className="text-2xl" />
          <span className="text-xl font-bold">MovieReviews</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-blue-200">
            <FaHome className="text-xl" />
          </Link>
          <Link to="/search" className="hover:text-blue-200">
            <FaSearch className="text-xl" />
          </Link>
          
          <DarkModeToggle />

          {user ? (
            <div className="flex items-center space-x-4">
              {user.isAdmin && (
                <Link to="/admin" className="hover:text-blue-200">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="hover:text-blue-200">
                <FaUser className="text-xl" />
              </Link>
              <button 
                onClick={handleLogout} 
                className="hover:text-blue-200"
                title="Logout"
              >
                <FaSignOutAlt className="text-xl" />
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-200">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;