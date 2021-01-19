import axios from 'axios';
import { getToken } from './auth';
import { backend } from '../Variables/variables';

const api = axios.create({
  baseURL: backend,
});

api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers.token = `${token}`;
  }
  return config;
});

export default api;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error.response);
  }
);
