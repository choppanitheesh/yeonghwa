const isProduction = import.meta.env.MODE === 'production';

export const API_BASE_URL = isProduction 
  ? 'https://yeonghwa-backend.onrender.com/api/auth'
  : 'http://localhost:5000/api/auth';