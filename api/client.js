import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

// Dynamically set BASE_URL based on the platform the app is running on
const BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:8080/api'
  : Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api'
  : 'http://localhost:8080/api'; // iOS simulator uses localhost

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
