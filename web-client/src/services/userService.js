import api from './api';

export const getProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/users/me', data);
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/users/me/password', { currentPassword, newPassword });
  return response.data;
};

export const getMyBadges = async () => {
  const response = await api.get('/badges/my');
  return response.data;
};

export const getBadgeDefinitions = async () => {
  const response = await api.get('/badges/definitions');
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPasswordWithOtp = async (email, otp, newPassword) => {
  const response = await api.post('/auth/reset-password', { email, otp, newPassword });
  return response.data;
};
