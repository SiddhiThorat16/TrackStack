// C:/Labmentix Projects/Project-Management-App/TrackStack/server/routes/projects.js

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject, 
  deleteProject, 
  addMember, 
  removeMember 
} = require('../controllers/projectController');

const router = express.Router();

router.post('/', protect, createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.patch('/:id/members', protect, addMember);
router.delete('/:id/members/:memberId', protect, removeMember);

module.exports = router;
