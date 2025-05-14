// src/app/(protected)/_layout.tsx
import { Slot, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedLayout() {
  const { token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.replace('/login')
    }
  }, [token, router])

  return <Slot />
}
