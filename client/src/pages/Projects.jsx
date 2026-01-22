// C:/Labmentix Projects/Project-Management-App/TrackStack/client/src/pages/Projects.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [showAddMember, setShowAddMember] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch projects. Please refresh.');
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/projects', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ title: '', description: '' });
      fetchProjects();
    } catch (err) {
      setError('Failed to create project. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (projectId, email) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/projects/${projectId}/members`, { email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
      setShowAddMember(null);
    } catch (err) {
      setError('Failed to add member. Check email.');
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center gap-6 mb-12 pb-8 border-b border-gray-200">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl text-3xl font-black text-white">
          📂
        </div>
        <div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent mb-2">
            Projects
          </h1>
          <p className="text-2xl text-gray-600 font-light">Manage your development teams & bug tracking</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-8 p-6 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-3xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 text-xl">⚠️</div>
            <span className="text-lg font-medium text-red-800">{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-auto p-2 hover:bg-red-500/20 rounded-2xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Create Project Form */}
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-4xl shadow-2xl border border-white/50 mb-12 hover:shadow-3xl transition-all duration-500">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-8">
          Create New Project
        </h2>
        <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700 block mb-2">Project Title</label>
            <input
              type="text"
              placeholder="e.g. E-commerce Bug Fixes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-6 text-xl border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-gradient-to-r from-white to-blue-50 hover:shadow-lg"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-lg font-semibold text-gray-700 block mb-2">Description</label>
            <textarea
              placeholder="Brief description of what this project tracks..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full p-6 text-xl border-2 border-gray-200 rounded-3xl resize-vertical focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-gradient-to-r from-white to-blue-50 hover:shadow-lg"
              required
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white py-8 px-12 rounded-3xl text-2xl font-black shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-10 blur transition-opacity duration-500"></span>
              {loading ? (
                <span className="flex items-center gap-3">
                  <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Project...
                </span>
              ) : (
                '🚀 Launch New Project'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Projects Grid */}
      <div className="space-y-8">
        {projects.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center text-5xl opacity-50">
              📂
            </div>
            <h3 className="text-4xl font-black text-gray-700 mb-4">No Projects Yet</h3>
            <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
              Get started by creating your first project above. Track bugs, assign tasks, and collaborate with your team.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold">📊</span>
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-900">{projects.length} Project{projects.length !== 1 ? 's' : ''}</h3>
                <p className="text-xl text-gray-600">Click "View Tickets" to manage issues</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div 
                  key={project._id} 
                  className="group bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-10 rounded-4xl shadow-2xl hover:shadow-3xl border border-white/50 hover:border-indigo-200/50 backdrop-blur-xl hover:-translate-y-4 transition-all duration-700 hover:rotate-1 origin-bottom"
                >
                  {/* Project Icon */}
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500 text-3xl font-black text-white">
                    🐛
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-3xl font-black text-gray-900 mb-6 text-center group-hover:text-indigo-700 transition-colors">
                    {project.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-lg mb-10 leading-relaxed text-center line-clamp-3 px-4">
                    {project.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="space-y-4 mb-10">
                    <div className="flex items-center justify-between text-xl">
                      <span className="text-gray-500 font-semibold">
                        👥 {project.teamMembers?.length || 0} Members
                      </span>
                      <span className="px-4 py-2 bg-green-100/80 text-green-800 text-lg font-bold rounded-2xl shadow-md">
                        Owner: {project.createdBy?.name}
                      </span>
                    </div>
                    
                    {/* Members Badges */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {project.teamMembers?.slice(0, 3).map((member) => (
                        <span 
                          key={member._id} 
                          className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          {member.name}
                        </span>
                      ))}
                      {project.teamMembers?.length > 3 && (
                        <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-2xl text-sm font-semibold">
                          +{project.teamMembers.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {showAddMember === project._id && (
                      <div className="flex gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl border-2 border-indigo-200/50 backdrop-blur-xl">
                        <input
                          type="email"
                          placeholder="team@company.com"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              addMember(project._id, e.target.value.trim());
                              e.target.value = '';
                            }
                          }}
                          className="flex-1 p-4 border-2 border-indigo-200 rounded-2xl text-lg bg-white/50 backdrop-blur-xl focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 placeholder-gray-500"
                        />
                        <button
                          onClick={() => setShowAddMember(null)}
                          className="px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setShowAddMember(showAddMember === project._id ? null : project._id)}
                        className={`flex-1 py-5 px-6 rounded-3xl font-bold text-lg shadow-xl transition-all duration-500 ${
                          showAddMember === project._id
                            ? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg hover:shadow-2xl'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg hover:shadow-2xl hover:-translate-y-1'
                        }`}
                      >
                        {showAddMember === project._id ? 'Cancel' : '+ Add Member'}
                      </button>
                      <Link
                        to={`/project/${project._id}`}
                        className="flex-1 group relative py-5 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-white/20 blur group-hover:opacity-100 transition-all duration-500 opacity-0"></span>
                        <span className="relative flex items-center justify-center gap-3">
                          📋 View Tickets
                          <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;
