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

// ADD THIS STATS ROUTE in routes/tickets.js (NOT controller)
router.get('/stats', protect, async (req, res) => {
  try {
    const Ticket = require('../models/Ticket'); // Import here
    
    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ 
      status: { $in: ['TODO', 'IN_PROGRESS', 'REVIEW'] } 
    });
    const highPriorityOpen = await Ticket.countDocuments({ 
      status: { $in: ['TODO', 'IN_PROGRESS', 'REVIEW'] }, 
      priority: { $in: ['HIGH', 'URGENT'] } 
    });

    res.json({ total, open, highPriorityOpen, avgCompletionDays: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
