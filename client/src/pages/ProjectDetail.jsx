// C:/Labmentix Projects/Project-Management-App/TrackStack/client/src/pages/ProjectDetail.jsx

import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TicketModal from "../components/TicketModal";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketForm, setTicketForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Comment section states
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const [editingTicket, setEditingTicket] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchProject();
    fetchTickets();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setProject(data);
    } catch (err) {
      console.error("Project fetch error:", err);
    }
  };

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `http://localhost:5000/api/tickets/project/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTickets(data);
      setLoading(false);
    } catch (err) {
      console.error("Tickets fetch error:", err);
      setLoading(false);
    }
  };

  // Comment functions
  const loadTicketComments = async (ticketId) => {
    try {
      // If clicking the same ticket, close comments
      if (selectedTicket === ticketId) {
        setSelectedTicket(null);
        setComments([]);
        return;
      }
      
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:5000/api/comments/ticket/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(data);
      setSelectedTicket(ticketId);
    } catch (err) {
      console.error('Comments error:', err);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedTicket) return;
    
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:5000/api/comments', {
        ticketId: selectedTicket,
        text: commentText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setComments(prev => [data, ...prev]);
      setCommentText('');
    } catch (err) {
      console.error('Add comment error:', err);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/tickets",
        {
          ...ticketForm,
          projectId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTicketForm({ title: "", description: "", priority: "MEDIUM" });
      setShowForm(false);
      fetchTickets();
    } catch (err) {
      console.error("Create ticket error:", err);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTickets(); // Refresh list
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // 🎯 DRAG & DROP HANDLER
  const onDragEnd = useCallback(
    async (result) => {
      const { destination, source, draggableId } = result;

      // Dropped outside lists
      if (!destination) return;

      // Same position/same column
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      // Find moved ticket
      const ticket = tickets.find((t) => t._id === draggableId);
      if (!ticket) return;

      // Update status based on destination column
      const statusMap = {
        todo: "TODO",
        "in-progress": "IN_PROGRESS",
        review: "REVIEW",
        done: "DONE",
      };

      const newStatus = statusMap[destination.droppableId];

      try {
        const token = localStorage.getItem("token");
        // Update ticket status via API
        await axios.put(
          `http://localhost:5000/api/tickets/${ticket._id}`,
          {
            status: newStatus,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Optimistic UI update
        setTickets((prevTickets) =>
          prevTickets.map((t) =>
            t._id === draggableId ? { ...t, status: newStatus } : t,
          ),
        );
        
        // If the moved ticket has comments open, close them
        if (selectedTicket === draggableId) {
          setSelectedTicket(null);
          setComments([]);
        }
      } catch (err) {
        console.error("Drag update failed:", err);
        fetchTickets(); // Revert on error
      }
    },
    [tickets, projectId, selectedTicket],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const statusGroups = {
    todo: [],
    "in-progress": [],
    review: [],
    done: [],
  };

  // Map database statuses to frontend keys
  const statusMap = {
    TODO: "todo",
    IN_PROGRESS: "in-progress",
    REVIEW: "review",
    DONE: "done",
  };

  tickets.forEach((ticket) => {
    const frontendStatus = statusMap[ticket.status];
    if (frontendStatus && statusGroups[frontendStatus]) {
      statusGroups[frontendStatus].push(ticket);
    }
  });

  const statusLabels = {
    todo: "To Do",
    "in-progress": "In Progress",
    review: "Review",
    done: "Done",
  };

  const statusColors = {
    todo: "from-gray-500 to-gray-600",
    "in-progress": "from-blue-500 to-blue-600",
    review: "from-yellow-500 to-yellow-600",
    done: "from-emerald-500 to-emerald-600",
  };

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
              <h1 className="text-4xl lg:text-5xl font-black">
                {project?.title}
              </h1>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Create New Ticket
          </h2>
          <form
            onSubmit={handleCreateTicket}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Title
              </label>
              <input
                type="text"
                value={ticketForm.title}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, title: e.target.value })
                }
                className="w-full p-5 text-xl border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="e.g. Login button not responding"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Priority
              </label>
              <select
                value={ticketForm.priority}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, priority: e.target.value })
                }
                className="w-full p-5 text-xl border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="LOW">🟢 Low</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="HIGH">🟠 High</option>
                <option value="URGENT">🔴 Urgent</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Description
              </label>
              <textarea
                value={ticketForm.description}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, description: e.target.value })
                }
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

      {/* 🎯 KANBAN DRAG & DROP */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid lg:grid-cols-4 gap-8">
          {Object.entries(statusGroups).map(([statusKey, statusTickets]) => {
            const label = statusLabels[statusKey];
            const color = statusColors[statusKey];

            return (
              <div key={statusKey}>
                <div
                  className={`p-6 rounded-3xl font-bold text-xl text-white shadow-2xl mb-6 bg-gradient-to-r ${color}`}
                >
                  {label} ({statusTickets.length})
                </div>
                <Droppable droppableId={statusKey}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[400px] p-4 space-y-4 rounded-3xl transition-all duration-300 ${
                        snapshot.isDraggingOver
                          ? "bg-gradient-to-b from-blue-50 to-indigo-50 shadow-2xl border-2 border-blue-200"
                          : "bg-white/50 backdrop-blur-xl shadow-xl border border-gray-100 hover:shadow-xl"
                      }`}
                    >
                      {statusTickets.map((ticket, index) => (
                        <Draggable
                          key={ticket._id}
                          draggableId={ticket._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                                snapshot.isDragging
                                  ? "shadow-2xl border-2 border-blue-300 bg-white/80 scale-105 z-10"
                                  : "hover:-translate-y-1 hover:border-blue-100"
                              } ${selectedTicket === ticket._id ? 'border-2 border-indigo-300' : ''}`}
                              onClick={() => loadTicketComments(ticket._id)}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <span
                                  className={`px-3 py-1 rounded-2xl text-xs font-bold ${
                                    ticket.priority === "LOW"
                                      ? "bg-green-100 text-green-800"
                                      : ticket.priority === "MEDIUM"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : ticket.priority === "HIGH"
                                          ? "bg-orange-100 text-orange-800"
                                          : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {ticket.priority}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    ticket.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2">
                                {ticket.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {ticket.description}
                              </p>
                              <div className="flex items-center justify-between text-sm">
                                {ticket.assignee ? (
                                  <span className="flex items-center gap-2 text-indigo-600 font-semibold">
                                    👤 {ticket.assignee.name}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">
                                    No assignee
                                  </span>
                                )}
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-xl text-xs">
                                  by {ticket.createdBy?.name}
                                </span>
                              </div>

                              {/* ✅ COMMENTS SECTION */}
                              {selectedTicket === ticket._id && (
                                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                                  {/* Comment List */}
                                  <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
                                    {comments.map(comment => (
                                      <div key={comment._id} className="flex gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                          {comment.userId.name?.[0] || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-900 text-sm truncate">{comment.userId.name}</span>
                                            <span className="text-xs text-gray-500">
                                              {new Date(comment.createdAt).toLocaleTimeString()}
                                            </span>
                                          </div>
                                          <p className="text-sm text-gray-800 leading-relaxed">{comment.text}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  {/* Add Comment Form */}
                                  <form onSubmit={addComment} className="flex gap-2 p-2 bg-white rounded-2xl border-2 border-gray-100 focus-within:border-indigo-300 transition-all">
                                    <textarea
                                      value={commentText}
                                      onChange={(e) => setCommentText(e.target.value)}
                                      placeholder="Write a comment..."
                                      className="flex-1 p-3 text-sm border-none rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none max-h-24"
                                      rows="1"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault();
                                          addComment(e);
                                        }
                                      }}
                                    />
                                    <button
                                      type="submit"
                                      disabled={!commentText.trim()}
                                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all whitespace-nowrap disabled:cursor-not-allowed"
                                    >
                                      Post
                                    </button>
                                  </form>
                                </div>
                              )}

                              {/* ADD ACTION BUTTONS - Bottom right */}
                              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent opening comments
                                    setEditingTicket(ticket);
                                    setShowEditModal(true);
                                  }}
                                  className="p-2 hover:bg-indigo-100 rounded-xl text-indigo-600 hover:text-indigo-700 transition-colors"
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Delete "${ticket.title}"?`)) {
                                      handleDeleteTicket(ticket._id);
                                    }
                                  }}
                                  className="p-2 hover:bg-red-100 rounded-xl text-red-600 hover:text-red-700 transition-colors"
                                  title="Delete"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <TicketModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        ticket={editingTicket}
        onSave={fetchTickets}
      />
    </div>
  );
};

export default ProjectDetail;
