// C:/Labmentix Projects/Project-Management-App/TrackStack/client/src/config.js

// Production backend URL from /Render
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';
