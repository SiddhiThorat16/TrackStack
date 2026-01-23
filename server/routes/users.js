// C:/Labmentix Projects/Project-Management-App/TrackStack/server/routes/users.js

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// All routes protected
router.use(protect);

// GET /api/users - Get all registered users (team members)
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('name email createdAt')
      .sort({ createdAt: -1 });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
