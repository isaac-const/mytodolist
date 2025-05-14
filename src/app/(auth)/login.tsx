// src/app/(auth)/login.tsx
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import api from '../../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const res = await api.post('/session', { email, password })
      await login(res.data.token)
      router.replace({ pathname: '/' })
    } catch (err) {
      console.error(err)
      Alert.alert('Erro', 'Login falhou. Verifique suas credenciais.')
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#9E78CF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#9E78CF" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15101C', paddingHorizontal: 30, paddingVertical: 80, justifyContent: 'center' },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#9E78CF', borderRadius: 10, padding: 12, color: '#FFF', marginBottom: 20 },
  button: { backgroundColor: '#9E78CF', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#9E78CF', textAlign: 'center' },
})
