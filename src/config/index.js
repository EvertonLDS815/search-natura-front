import axios from 'axios';
import { redirectToLogin } from '../utils/redirect';

// Cria a instância do axios com a baseURL
const token = localStorage.getItem('user');
const api = axios.create({
  baseURL: 'https://search-natura.vercel.app',
  headers: { Authorization: `Bearer ${token}` },
});

// Adiciona um interceptor para incluir o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Adiciona um interceptor de resposta para tratar tokens expirados
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove o token inválido do localStorage
      localStorage.removeItem('user');
      // Redireciona para a página de login
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default api;
