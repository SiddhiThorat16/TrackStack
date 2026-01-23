// C:/Labmentix Projects/Project-Management-App/TrackStack/client/src/pages/Team.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeamMembers(data);
    } catch (err) {
      console.error('Failed to fetch team:', err);
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
            👥
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-black">Team Members</h1>
            <p className="text-xl opacity-90">{teamMembers.length} Total Members</p>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teamMembers.map((member) => (
          <div key={member._id} className="bg-white/80 backdrop-blur-xl p-8 rounded-4xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all hover:-translate-y-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                {member.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-indigo-600 font-semibold">{member.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Joined {new Date(member.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gray-100 rounded-3xl mx-auto mb-6 flex items-center justify-center text-3xl">
            👥
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Team Members</h3>
          <p className="text-gray-500 mb-6">Invite team members to collaborate on projects.</p>
        </div>
      )}
    </div>
  );
};

export default Team;
