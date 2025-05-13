// src/services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

// Cria instância base do axios
const api = axios.create({
  baseURL: 'http://10.0.2.2:3333',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor antes de cada requisição
api.interceptors.request.use(
  async config => {
    // Pega o token salvo no AsyncStorage
    const token = await AsyncStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default api
