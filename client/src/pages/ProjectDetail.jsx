// C:/Labmentix Projects/Project-Management-App/TrackStack/client/src/pages/ProjectDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM'
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProject();
    fetchTickets();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProject(data);
    } catch (err) {
      console.error('Project fetch error:', err);
    }
  };

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:5000/api/tickets/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(data);
      setLoading(false);
    } catch (err) {
      console.error('Tickets fetch error:', err);
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tickets', {
        ...ticketForm,
        projectId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTicketForm({ title: '', description: '', priority: 'MEDIUM' });
      setShowForm(false);
      fetchTickets();
    } catch (err) {
      console.error('Create ticket error:', err);
    }
  };

  const statusGroups = {
    TODO: [],
    'IN_PROGRESS': [],
    REVIEW: [],
    DONE: []
  };

  tickets.forEach(ticket => {
    statusGroups[ticket.status].push(ticket);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Project Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-4xl shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center text-3xl shadow-xl">
              🐛
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black">{project?.title}</h1>
              <p className="text-xl opacity-90">{project?.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 ml-auto">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-8 py-4 bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              + New Ticket
            </button>
            <Link
              to="/projects"
              className="px-8 py-4 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              ← All Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Create Ticket Form */}
      {showForm && (
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-4xl shadow-2xl border border-white/50">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Create New Ticket</h2>
          <form onSubmit={handleCreateTicket} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">Title</label>
              <input
                type="text"
                value={ticketForm.title}
                onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
                className="w-full p-5 text-xl border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="e.g. Login button not responding"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">Priority</label>
              <select
                value={ticketForm.priority}
                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                className="w-full p-5 text-xl border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HIGH">🟠 High</option>
                <option value="URGENT">🔴 Urgent</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-lg font-semibold text-gray-700 mb-3">Description</label>
              <textarea
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                rows="4"
                className="w-full p-5 text-xl border-2 border-gray-200 rounded-3xl resize-vertical focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Detailed description of the issue..."
                required
              />
            </div>
            <div className="md:col-span-2 lg:col-span-1 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-5 px-8 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300"
              >
                Create Ticket
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-8 py-5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid lg:grid-cols-4 gap-8">
        {Object.entries(statusGroups).map(([status, statusTickets]) => (
          <div key={status} className="space-y-4">
            <div className={`p-6 rounded-3xl font-bold text-xl text-white shadow-2xl ${
              status === 'TODO' ? 'bg-gradient-to-r from-gray-500 to-gray-600' :
              status === 'IN_PROGRESS' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
              status === 'REVIEW' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
              'bg-gradient-to-r from-emerald-500 to-emerald-600'
            }`}>
              {status.replace('_', ' ')} ({statusTickets.length})
            </div>
            <div className="space-y-4 min-h-[400px]">
              {statusTickets.map((ticket) => (
                <div key={ticket._id} className="group bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 border border-gray-100 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-2xl text-xs font-bold ${
                      ticket.priority === 'LOW' ? 'bg-green-100 text-green-800' :
                      ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {ticket.priority}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">{ticket.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ticket.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    {ticket.assignee ? (
                      <span className="flex items-center gap-2 text-indigo-600 font-semibold">
                        👤 {ticket.assignee.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">No assignee</span>
                    )}
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-xl text-xs">
                      by {ticket.createdBy?.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetail;
