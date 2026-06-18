import api from './api';

export const login = async (email, password) => {
  return await api.post('/auth/login', { email, password });
};

export const register = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Optional: await api.post('/auth/logout');
};

export const sendOTP = async (email) => {
  return await api.post('/auth/resend-otp', { email });
};

export const verifyOTP = async (email, otp) => {
  return await api.post('/auth/verify-otp', { email, otp });
};

export const resetPassword = async (email, newPassword) => {
  return await api.post('/auth/reset-password', { email, newPassword });
};
