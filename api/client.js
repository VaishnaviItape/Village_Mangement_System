import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your local network IP (e.g., http://192.168.1.100:8080/api)
// or use 10.0.2.2 for Android Emulator connecting to localhost
const BASE_URL = 'http://10.0.2.2:8080/api'; 

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
