// C:/Labmentix Projects/Project-Management-App/TrackStack/client/src/components/Sidebar.jsx

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: "📊", label: "Dashboard", path: "/dashboard" },
    { icon: "📂", label: "Projects", path: "/projects" },
    { icon: "👥", label: "Team", path: "/team" },
    { icon: "📈", label: "Analytics", path: "/analytics" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        } lg:translate-x-0 lg:static w-72 lg:w-72 xl:w-80 border-r border-white/10 bg-gradient-to-b from-slate-900 to-slate-800 backdrop-blur-xl`}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
              🐛
            </div>
            <div>
              <h2 className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                TrackStack
              </h2>
              <p className="text-xs text-gray-400">Bug Tracking</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center p-4 rounded-2xl transition-all duration-300 ${
                location.pathname === item.path
                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/20 text-white shadow-lg shadow-indigo-500/25"
                  : "text-gray-300 hover:bg-white/10 hover:text-white border border-transparent"
              }`}
            >
              <span className="w-8 text-xl mr-4">{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
              {location.pathname === item.path && (
                <div className="ml-auto w-2 h-8 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full"></div>
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-sm font-bold">JD</span>
                </div>
                <div>
                  <p className="font-semibold text-white">John Doe</p>
                  <p className="text-xs text-gray-400">Admin</p>
                </div>
              </div>
              <button className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default Sidebar;
