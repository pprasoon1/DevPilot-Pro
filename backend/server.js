const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const authenticate = require('./middleware/auth');
const projectRoutes = require('./routes/projects');

const path = require('path');

const app = express();
const PORT = 5000;
const __dirname = path.resolve();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

if(process.env.NODE_ENV === production){
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

// Example protected route
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});