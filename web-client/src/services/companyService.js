import api from './api';

export const getCompanies = async () => {
  const response = await api.get('/companies');
  return response.data;
};

export const getCompanyById = async (id) => {
  const response = await api.get(`/companies/${id}`);
  return response.data;
};
