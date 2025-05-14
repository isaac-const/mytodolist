// src/services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Platform } from 'react-native'

const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost'

const api = axios.create({
  baseURL: `http://${host}:3333`,
  headers: { 'Content-Type': 'application/json' },
})

// Antes de cada requisição, injeta token do AsyncStorage
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

export default api
