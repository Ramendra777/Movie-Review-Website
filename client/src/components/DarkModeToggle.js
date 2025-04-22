import React, { useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full focus:outline-none"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <FaSun className="text-yellow-300 text-xl" />
      ) : (
        <FaMoon className="text-gray-200 text-xl" />
      )}
    </button>
  );
};

export default DarkModeToggle;