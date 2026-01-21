// C:\Labmentix Projects\Project-Management-App\TrackStack\client\src\context\AuthContext.jsx

import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return { ...state, token: action.payload.token, user: action.payload.user, isAuthenticated: true };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...state, token: null, user: null, isAuthenticated: false };
    case 'LOAD_USER':
      return { ...state, token: action.payload.token, user: action.payload.user, isAuthenticated: true };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { token: null, user: null, isAuthenticated: false });

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me');
          dispatch({ type: 'LOAD_USER', payload: { token, user: res.data.user } });
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
  };

  const register = async (name, email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
