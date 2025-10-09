// utils/axios.js

import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach Authorization header dynamically via request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Optional response interceptor for token refresh (currently disabled)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Optional logic for token refresh or re-authentication
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If you implement token refresh logic in future, add it here:
      // const newAccessToken = await refreshAccessToken();
      // Cookies.set("access_token", newAccessToken);
      // originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      // return axiosInstance(originalRequest);

      // Right now, you might want to redirect to login or show error
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
