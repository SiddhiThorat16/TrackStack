// C:/Labmentix Projects/Project-Management-App/TrackStack/server/routes/tickets.js

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createTicket,
  getProjectTickets,
  updateTicket,
  deleteTicket,
  assignTicket
} = require('../controllers/ticketController');

const router = express.Router();

// All routes protected
router.use(protect);

router.post('/', createTicket);                    // POST /api/tickets
router.get('/project/:projectId', getProjectTickets); // GET /api/tickets/project/:projectId
router.put('/:id', updateTicket);                  // PUT /api/tickets/:id
router.delete('/:id', deleteTicket);               // DELETE /api/tickets/:id
router.patch('/:id/assign', assignTicket);         // PATCH /api/tickets/:id/assign

module.exports = router;
