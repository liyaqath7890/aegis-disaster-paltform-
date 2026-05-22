import axios from 'axios';

const defaultBaseUrl = import.meta.env.VITE_API_BASE_URL || `${window.location.origin}/api/v1`;

export const httpClient = axios.create({
  baseURL: defaultBaseUrl,
  timeout: 15000,
  withCredentials: true
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('aegis_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
