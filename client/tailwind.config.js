// client/tailwind.config.js
module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: 'class', // Use class-based dark mode
    theme: {
      extend: {
        colors: {
          dark: {
            100: '#1a202c',
            200: '#2d3748',
            300: '#4a5568',
          },
        },
      },
    },
    variants: {
      extend: {
        backgroundColor: ['dark'],
        textColor: ['dark'],
        borderColor: ['dark'],
      },
    },
    plugins: [],
  };