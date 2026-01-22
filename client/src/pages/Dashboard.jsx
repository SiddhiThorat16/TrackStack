// C:/Labmentix Projects/Project-Management-App/TrackStack/client/src/pages/Dashboard.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    openTickets: 0,
    teamMembers: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const projectsRes = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const projects = projectsRes.data;
      setStats({
        totalProjects: projects.length,
        openTickets: Math.floor(Math.random() * 50) + 10, // Mock data
        teamMembers: Math.floor(Math.random() * 20) + 5
      });
      setRecentProjects(projects.slice(0, 4));
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    }
  };

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-white to-blue-50/50 p-12 rounded-4xl shadow-2xl border border-white/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-6">
              Welcome Back!
            </h1>
            <p className="text-2xl text-gray-700 font-light">
              Here's what's happening with your projects today
            </p>
          </div>
          <div className="flex gap-6">
            <Link 
              to="/projects" 
              className="px-10 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500"
            >
              📂 Manage Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="group bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-10 rounded-4xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-700 cursor-pointer border border-white/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center text-3xl shadow-xl">
              📂
            </div>
            <div>
              <p className="text-indigo-100 font-semibold">Total Projects</p>
              <p className="text-4xl font-black">{stats.totalProjects}</p>
            </div>
          </div>
          <p className="text-indigo-100 opacity-80">Active development spaces</p>
        </div>

        <div className="group bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white p-10 rounded-4xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-700 cursor-pointer border border-white/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center text-3xl shadow-xl">
              🐛
            </div>
            <div>
              <p className="text-emerald-100 font-semibold">Open Tickets</p>
              <p className="text-4xl font-black">{stats.openTickets}</p>
            </div>
          </div>
          <p className="text-emerald-100 opacity-80">Issues needing attention</p>
        </div>

        <div className="group bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-10 rounded-4xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-700 cursor-pointer border border-white/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center text-3xl shadow-xl">
              👥
            </div>
            <div>
              <p className="text-blue-100 font-semibold">Team Members</p>
              <p className="text-4xl font-black">{stats.teamMembers}</p>
            </div>
          </div>
          <p className="text-blue-100 opacity-80">Collaborators across projects</p>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold">📋</span>
          </div>
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-1">Recent Projects</h2>
            <p className="text-xl text-gray-600">Quick access to your latest work</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProjects.map((project) => (
            <Link
              key={project._id}
              to={`/project/${project._id}`}
              className="group bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/50 hover:border-purple-200/50"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto text-2xl shadow-xl group-hover:scale-110 transition-transform">
                🐛
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-purple-700 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-600 text-center line-clamp-2 mb-6">{project.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">👥 {project.teamMembers?.length || 0}</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-xl">
                  {project.createdBy?.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {recentProjects.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-8 bg-gray-200 rounded-3xl flex items-center justify-center text-4xl opacity-50">
              📂
            </div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">No Recent Projects</h3>
            <Link 
              to="/projects" 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
            >
              Create Your First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
