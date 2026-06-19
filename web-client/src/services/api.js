import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    credentials: true,
  },
});

// Request Interceptor: Attach token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle auth errors globally
api.interceptors.response.use(
  (response) => response.data, // Return data directly for convenience
  (error) => {
    // If the token is invalid or expired
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // We don't automatically redirect here to avoid breaking React Router flow, 
      // but Redux or Context should listen to this state.
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Keep this around for backwards compatibility until refactor is complete
export const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));
export const mockApiCall = async (data, shouldFail = false, ms = 800) => {
  await delay(ms);
  if (shouldFail) throw new Error('API request failed');
  return { data, status: 200 };
};

export default api;
