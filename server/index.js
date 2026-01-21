// C:\Labmentix Projects\Project-Management-App\TrackStack\server\index.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();

const auth = require('./middleware/auth');  // Add this import

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Atlas Connected!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json({ limit: '50mb' }));

// Basic route
app.get('/api', (req, res) => {
  res.json({ message: 'TrackStack API Running! 🚀' });
});

// Auth routes - ADD THESE 2 LINES
app.use('/api/auth', require('./routes/auth'));
app.get('/api/protected', auth, (req, res) => {
  res.json({ message: 'Protected route accessed!', user: req.user?.email || 'No user' });
});

// DB Connection
connectDB();

// Error handling middleware (ADD THIS - before app.listen)
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
