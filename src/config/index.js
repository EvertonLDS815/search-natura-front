import axios from 'axios';
import { redirectToLogin } from '../utils/redirect';

const token = localStorage.getItem('user');

const api = axios.create({
  baseURL: 'https://search-natura.vercel.app',
  headers: { Authorization: `Bearer ${token}` },
});

// interceptor de request
api.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// interceptor de response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // 🔐 só desloga se o token for realmente inválido
    if (status === 401 && message === 'Token inválido') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default api;
