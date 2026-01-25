// C:/Labmentix Projects/Project-Management-App/TrackStack/client/src/components/TicketModal.jsx

import { useState, useEffect } from 'react';

export default function TicketModal({ isOpen, onClose, ticket, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO'
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status
      });
    }
  }, [ticket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/tickets/${ticket._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      onSave(); // Refresh tickets
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-4xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Edit Ticket</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-4 border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-xl"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="5"
              className="w-full p-4 border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 resize-vertical"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full p-4 border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HIGH">🟠 High</option>
                <option value="URGENT">🔴 Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full p-4 border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="TODO">📋 To Do</option>
                <option value="IN_PROGRESS">⚡ In Progress</option>
                <option value="REVIEW">🔍 Review</option>
                <option value="DONE">✅ Done</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 px-8 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all"
            >
              Update Ticket
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-3xl shadow-lg hover:shadow-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
