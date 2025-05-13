// src/app/_layout.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

import { AuthProvider } from '../contexts/AuthContext';

axios.defaults.baseURL = 'https://your-api.com';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default function Layout() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token && segments[0] !== '(auth)') {
        router.replace('/login');
      }
    };
    checkAuth();
  }, [router, segments]);

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
