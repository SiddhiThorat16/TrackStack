// C:/Labmentix Projects/Project-Management-App/TrackStack/server/controllers/projectController.js

const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
  try {
    const { ticketId, text, parentId } = req.body;
    
    const comment = new Comment({
      ticketId,
      userId: req.user.id,
      text,
      parentId: parentId || null
    });
    
    await comment.save();
    await comment.populate('userId', 'name email');
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTicketComments = async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    const comments = await Comment.find({ ticketId })
      .populate('userId', 'name email')
      .populate('parentId', 'text createdAt')
      .sort({ createdAt: 1 });
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
