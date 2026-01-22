// C:/Labmentix Projects/Project-Management-App/TrackStack/server/controllers/projectController.js

const Project = require('../models/Project');
const User = require('../models/User');

exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = new Project({ title, description, createdBy: req.user.id });
    await project.save();
    await project.populate('createdBy', 'name email');
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.user.id }, { teamMembers: req.user.id }]
    }).populate('createdBy teamMembers', 'name email').sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    Object.assign(project, req.body);
    await project.save();
    await project.populate('createdBy', 'name email');
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || project.createdBy.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Project not found or not authorized' });
    }
    
    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project || project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (project.teamMembers.includes(user._id)) {
      return res.status(400).json({ message: 'User already a member' });
    }
    project.teamMembers.push(user._id);
    await project.save();
    await project.populate('teamMembers', 'name email');
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    project.teamMembers = project.teamMembers.filter(
      id => id.toString() !== req.params.memberId
    );
    await project.save();
    await project.populate('teamMembers', 'name email');
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy teamMembers', 'name email');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Authorization check
    if (project.createdBy._id.toString() !== req.user.id && 
        !project.teamMembers.some(m => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized for this project' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
