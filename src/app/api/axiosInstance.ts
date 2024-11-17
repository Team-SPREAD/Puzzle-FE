import axios from 'axios';

//방생성이 없어서 테스트 토큰 사용했습니다. 주석처리 후 작업해주세요
const TestToken = process.env.TEST_TOKEN
const token =
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const axiosInstance = axios.create({
  baseURL: 'http://kim-sun-woo.com:3000', // 베이스 URL 설정
  headers: {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${TestToken}` } : {}),
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