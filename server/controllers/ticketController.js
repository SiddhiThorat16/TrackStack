// C:/Labmentix Projects/Project-Management-App/TrackStack/server/models/ticketController.js

const Ticket = require('../models/Ticket');
const Project = require('../models/Project');
const User = require('../models/User');

// Create ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority, projectId } = req.body;
    
    // Verify user has access to project
    const project = await Project.findById(projectId);
    if (!project || (project.createdBy.toString() !== req.user.id && 
                     !project.teamMembers.some(m => m.toString() === req.user.id))) {
      return res.status(403).json({ message: 'Not authorized for this project' });
    }

    const ticket = new Ticket({
      title,
      description,
      priority: priority || 'MEDIUM',
      projectId,
      createdBy: req.user.id
    });
    
    await ticket.save();
    await ticket.populate('createdBy assignee projectId', 'title name email');
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get tickets by project
exports.getProjectTickets = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    // Verify project access
    const project = await Project.findById(projectId);
    if (!project || (project.createdBy.toString() !== req.user.id && 
                     !project.teamMembers.some(m => m.toString() === req.user.id))) {
      return res.status(403).json({ message: 'Not authorized for this project' });
    }

    const tickets = await Ticket.find({ projectId })
      .populate('createdBy assignee', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update ticket
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Only project members can update
    const project = await Project.findById(ticket.projectId);
    if (!project || (project.createdBy.toString() !== req.user.id && 
                     !project.teamMembers.some(m => m.toString() === req.user.id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(ticket, req.body);
    await ticket.save();
    await ticket.populate('createdBy assignee projectId', 'title name email');
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete ticket (only creator or project owner)
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const project = await Project.findById(ticket.projectId);
    if (!project || (project.createdBy.toString() !== req.user.id && 
                     ticket.createdBy.toString() !== req.user.id &&
                     !project.teamMembers.some(m => m.toString() === req.user.id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign ticket
exports.assignTicket = async (req, res) => {
  try {
    const { email } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const project = await Project.findById(ticket.projectId);
    if (!project || (project.createdBy.toString() !== req.user.id && 
                     !project.teamMembers.some(m => m.toString() === req.user.id))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    ticket.assignee = user._id;
    await ticket.save();
    await ticket.populate('assignee', 'name email');
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getProjectTickets
exports.getProjectTickets = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assignee, search } = req.query;
    
    // Build filter object
    let filter = { projectId };
    
    // Add optional filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const tickets = await Ticket.find(filter)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Authorization: creator or assignee can edit
    if (ticket.createdBy.toString() !== req.user.id && ticket.assignee?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updates = req.body;
    const updatedTicket = await Ticket.findByIdAndUpdate(id, updates, { new: true })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name');
    
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Authorization: only creator can delete
    if (ticket.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Ticket.findByIdAndDelete(id);
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
