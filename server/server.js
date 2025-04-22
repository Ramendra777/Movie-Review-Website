const express = require('express');
const app = express();

// ... your existing middleware and routes

app.get('/api', (req, res) => {
  res.json({ status: 'API is running' });
});

// ... your existing server setup

module.exports = app;