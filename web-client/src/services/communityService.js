import api from './api';

export const getPosts = async (params = {}) => {
  const response = await api.get('/posts', { params });
  return response;
};

export const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (data) => {
  const response = await api.post('/posts', data);
  return response.data;
};

export const toggleUpvote = async (id) => {
  const response = await api.put(`/posts/${id}/upvote`);
  return response.data;
};

export const addComment = async (postId, body) => {
  const response = await api.post(`/posts/${postId}/comments`, { body });
  return response.data;
};

export const toggleCommentUpvote = async (postId, commentId) => {
  const response = await api.put(`/posts/${postId}/comments/${commentId}/upvote`);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};
