// C:\Labmentix Projects\Project-Management-App\TrackStack\client\src\App.jsx

import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            TrackStack 🐛
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-white text-xl font-semibold">Welcome, {user?.name}</span>
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold">
              Logout
            </button>
          </div>
        </header>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Router>
      <Routes>
        {/* FIXED ROUTING - /register = register form, /login = login form */}
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Auth isLogin={false} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Auth isLogin={true} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
