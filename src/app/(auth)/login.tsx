import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      await AsyncStorage.setItem('token', res.data.token);
      router.replace('/');
    } catch {
      Alert.alert('Erro', 'Login falhou. Verifique suas credenciais.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Entrar</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#9E78CF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#9E78CF" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}><Text style={styles.buttonText}>Entrar</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/register')}><Text style={styles.linkText}>Não tem conta? Cadastre-se</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15101C', paddingHorizontal: 30, paddingVertical: 80, justifyContent: 'center' },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#9E78CF', borderRadius: 10, padding: 12, color: '#FFF', marginBottom: 20 },
  button: { backgroundColor: '#9E78CF', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#9E78CF', textAlign: 'center' },
});