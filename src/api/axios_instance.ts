import axios from 'axios';

const axios_instance = axios.create({
  baseURL: 'https://focuspro.dayal-enterprises.com/public/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axios_instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios_instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error);
    return Promise.reject(error);
  }
);

export default axios_instance;

 