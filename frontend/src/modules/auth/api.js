import axios from 'axios';

import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './tokenService';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api';
const AUTH_URL = 'http://127.0.0.1:8000/api/auth';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(`${AUTH_URL}/token/refresh/`, {
          refresh: getRefreshToken(),
        });
        setTokens(refreshResponse.data.access, refreshResponse.data.refresh ?? getRefreshToken());
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export const authApi = axios.create({
  baseURL: AUTH_URL,
});
