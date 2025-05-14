import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, ReactNode, useEffect, useState } from 'react'
import api from '../services/api'

interface AuthContextType {
  token: string | null
  login: (token: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)

  // Ao montar, carrega e injeta token no axios
  useEffect(() => {
    AsyncStorage.getItem('token').then(t => {
      if (t) {
        setToken(t)
        api.defaults.headers.common['Authorization'] = `Bearer ${t}`
      }
    })
  }, [])

  const login = async (newToken: string) => {
    await AsyncStorage.setItem('token', newToken)
    setToken(newToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  const logout = async () => {
    await AsyncStorage.removeItem('token')
    setToken(null)
    delete api.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
