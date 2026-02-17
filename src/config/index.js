import axios from 'axios';
import { redirectToLogin } from '../utils/redirect';

const api = axios.create({
  baseURL: 'https://search-natura.vercel.app',
});

// 🔹 Request
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

// 🔹 Response
api.interceptors.response.use(
  (response) => response,
  (error) => {

    // 🔥 Se não tem response → é erro de rede (offline)
    if (!error.response) {
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // 🔐 Só desloga se for token inválido real
    if (status === 401 && data?.message === 'Token inválido') {
      localStorage.removeItem('token');
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export default api;
