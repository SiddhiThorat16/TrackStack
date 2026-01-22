// C:/Labmentix Projects/Project-Management-App/TrackStack/server/models/Ticket.js

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 5000 },
  priority: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], 
    default: 'MEDIUM' 
  },
  status: { 
    type: String, 
    enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'], 
    default: 'TODO' 
  },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Nullable
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
