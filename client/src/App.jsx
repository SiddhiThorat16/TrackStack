// C:\Labmentix Projects\Project-Management-App\TrackStack\client\src\App.jsx

import { AuthProvider, useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import ProjectDetail from "./pages/ProjectDetail";

const Layout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 min-w-0 transition-all duration-300 lg:ml-72 xl:ml-80">
      {" "}
      {/* FIXED: Match sidebar width */}
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 lg:p-8">
        {" "}
        {/* Reduced padding */}
        <div className="max-w-7xl mx-auto">
          {" "}
          {/* Added container constraint */}
          {children}
        </div>
      </main>
    </div>
  </div>
);

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppContent() {
  return (
    <Router>
      {" "}
      {/* ✅ ROUTER FIRST */}
      <AuthProvider>
        {" "}
        {/* ✅ AuthProvider INSIDE Router */}
        <div className="font-sans antialiased">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth isLogin={true} />} />
            <Route path="/register" element={<Auth isLogin={false} />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Projects />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:projectId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

function App() {
  return <AppContent />;
}

export default App;
