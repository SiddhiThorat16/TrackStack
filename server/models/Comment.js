// C:/Labmentix Projects/Project-Management-App/TrackStack/server/models/Comment.js

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  ticketId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ticket', 
    required: true, 
    index: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  text: { 
    type: String, 
    required: true, 
    trim: true, 
    maxlength: 5000 
  },
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment', 
    default: null 
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
