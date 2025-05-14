// src/app/(auth)/register.tsx
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import api from '../../services/api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleRegister = async () => {
  // validações locais...
    try {
      // 1) cadastra o usuário
      await api.post('/user', { name: name.trim(), email, password })
      // 2) faz login com as mesmas credenciais
      const resLogin = await api.post('/session', { email, password })
      const jwt      = resLogin.data.token
      await login(jwt)
      router.replace({ pathname: '/' })
    } catch (err: any) {
      if (err.response?.status === 422) {
      const errors = err.response.data.errors
      const messages = Array.isArray(errors)
        ? errors.map((e) => e.message).join('\n')
        : Object.values(errors).flat().join('\n')
      Alert.alert('Erro de validação', messages)
    } else {
      Alert.alert('Erro', 'Cadastro falhou. Tente novamente.')
    }
  }
}


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#9E78CF" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#9E78CF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#9E78CF" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirme a Senha" placeholderTextColor="#9E78CF" value={confirm} onChangeText={setConfirm} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.linkText}>Já tem conta? Entre</Text>
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
