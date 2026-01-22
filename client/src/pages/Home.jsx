// C:\Labmentix Projects\Project-Management-App\TrackStack\client\src\pages\Home.jsx

import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-500 bg-clip-text text-transparent mb-8 animate-pulse">
            TrackStack
          </h1>
          <p className="text-2xl md:text-3xl font-light mb-12 opacity-90 leading-relaxed max-w-2xl mx-auto">
            The ultimate bug tracking platform for modern development teams. 
            Built with MERN stack for lightning-fast performance.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
            <Link
              to="/login"
              className="group relative px-12 py-6 bg-white text-indigo-900 text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 flex items-center gap-3"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></span>
              <span className="relative">🚀 Get Started</span>
            </Link>
            <Link
              to="/register"
              className="px-12 py-6 border-2 border-white/30 backdrop-blur-xl text-white text-xl font-bold rounded-3xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              ✨ Sign Up Free
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl">
              🐛
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Bug Tracking</h3>
            <p className="text-gray-300">Real-time issue tracking with Kanban boards and smart filtering.</p>
          </div>
          <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl">
              👥
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Team Collaboration</h3>
            <p className="text-gray-300">Assign tasks, add comments, and manage team permissions seamlessly.</p>
          </div>
          <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Lightning Fast</h3>
            <p className="text-gray-300">MERN stack powered with real-time updates and optimized performance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
