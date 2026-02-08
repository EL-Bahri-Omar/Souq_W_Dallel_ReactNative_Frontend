import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const tokenData = await AsyncStorage.getItem('token');
      
      if (tokenData) {
        let token = tokenData;
        
        if (token && !token.startsWith('eyJ')) {
          try {
            const parsed = JSON.parse(tokenData);
            token = parsed.token || tokenData;
          } catch (e) {}
        }
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
        
        if (config.url?.includes('/api/auth/register')) {
          delete config.headers['Authorization'];
        }
      }
      
    } catch (error) {}
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;