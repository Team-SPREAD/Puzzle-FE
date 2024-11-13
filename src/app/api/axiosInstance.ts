import axios from 'axios';

const token =
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const axiosInstance = axios.create({
  baseURL: 'http://kim-sun-woo.com:3000', // 베이스 URL 설정
  headers: {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
