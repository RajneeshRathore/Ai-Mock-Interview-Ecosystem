import api from './api';

export const startInterview = async (userId, type, role, difficulty) => {
  const response = await api.post('/interview/start', {
    topic: role,
    experienceLevel: difficulty,
    interviewType: type
  });
  // api interceptor returns response.data from axios = { success, data }
  return response.data;
};

export const answerQuestion = async (interviewId, answer) => {
  const response = await api.post(`/interview/${interviewId}/answer`, { answer });
  return response.data;
};

export const finishInterview = async (interviewId, duration = 0) => {
  const response = await api.post(`/interview/${interviewId}/end`, { duration });
  return response.data;
};

export const getInterviewById = async (interviewId) => {
  const response = await api.get(`/interview/${interviewId}`);
  return response.data;
};

export const getInterviews = async () => {
  const response = await api.get('/interview/history/all');
  return response.data;
};
