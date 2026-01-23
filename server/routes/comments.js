// C:/Labmentix Projects/Project-Management-App/TrackStack/server/routes/comments.js

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createComment, getTicketComments } = require('../controllers/commentController');

const router = express.Router();
router.use(protect);

router.post('/', createComment);
router.get('/ticket/:ticketId', getTicketComments);

module.exports = router;
