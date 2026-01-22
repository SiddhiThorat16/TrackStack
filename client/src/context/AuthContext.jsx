// C:\Labmentix Projects\Project-Management-App\TrackStack\client\src\context\AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setUser(res.data);
        setIsAuthenticated(true);
      }).catch(() => {
        localStorage.removeItem('token');
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    console.log('AuthContext login called:', { email }); // DEBUG
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    
    localStorage.setItem('token', res.data.token);
    const userData = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${res.data.token}` }
    });
    setUser(userData.data);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const register = async (name, email, password) => {
    console.log('AuthContext register called:', { name, email }); // DEBUG
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name,
      email,
      password
    });
    localStorage.setItem('token', res.data.token);
    const userData = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${res.data.token}` }
    });
    setUser(userData.data);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
