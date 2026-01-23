// C:/Labmentix Projects/Project-Management-App/TrackStack/client/src/pages/Analytics.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTickets: 0,
    openTickets: 0,
    avgCompletionDays: 0,
    teamMembers: 0,
    highPriorityOpen: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch all stats in parallel
      const [projectsRes, ticketsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/tickets/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const projects = projectsRes.data;
      const tickets = ticketsRes.data;
      const users = usersRes.data;

      setStats({
        totalProjects: projects.length,
        totalTickets: tickets.total,
        openTickets: tickets.open,
        avgCompletionDays: tickets.avgCompletionDays || 0,
        teamMembers: users.length,
        highPriorityOpen: tickets.highPriorityOpen || 0
      });
    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-4xl shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center text-3xl shadow-xl">
            📊
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-black">Analytics Dashboard</h1>
            <p className="text-xl opacity-90">TrackStack Performance Overview</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-4xl shadow-2xl border border-white/50">
          <div className="text-3xl font-bold text-indigo-600 mb-2">{stats.totalProjects}</div>
          <div className="text-gray-600 font-semibold">Total Projects</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-4xl shadow-2xl border border-white/50">
          <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.totalTickets}</div>
          <div className="text-gray-600 font-semibold">Total Tickets</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-4xl shadow-2xl border border-white/50">
          <div className={`text-3xl font-bold mb-2 ${stats.openTickets > 10 ? 'text-orange-600' : 'text-blue-600'}`}>
            {stats.openTickets}
          </div>
          <div className="text-gray-600 font-semibold">Open Tickets</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-4xl shadow-2xl border border-white/50 md:col-span-2 lg:col-span-1">
          <div className="text-3xl font-bold text-purple-600 mb-2">{stats.teamMembers}</div>
          <div className="text-gray-600 font-semibold">Team Members</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-4xl shadow-2xl border border-white/50 md:col-span-2 lg:col-span-1">
          <div className={`text-3xl font-bold mb-2 ${stats.highPriorityOpen > 3 ? 'text-red-600' : 'text-orange-600'}`}>
            {stats.highPriorityOpen}
          </div>
          <div className="text-gray-600 font-semibold">High Priority Open</div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-4xl shadow-2xl border border-white/50 md:col-span-2 lg:col-span-1">
          <div className="text-3xl font-bold text-gray-600 mb-2">{stats.avgCompletionDays.toFixed(1)} days</div>
          <div className="text-gray-600 font-semibold">Avg Completion Time</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-4xl shadow-2xl border border-white/50">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>Open Tickets: <span className="font-bold text-indigo-600">{((stats.openTickets/stats.totalTickets)*100).toFixed(1)}%</span></div>
          <div>High Priority Backlog: <span className={`font-bold ${stats.highPriorityOpen > 3 ? 'text-red-600' : 'text-emerald-600'}`}>{stats.highPriorityOpen}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
