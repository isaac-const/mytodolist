import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../../hooks/useAuth'; // << hook do AuthContext
import api from '../../services/api'; // << instância axios com baseURL + token

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth();               // << pega o login do contexto
  const router = useRouter();

  const handleRegister = async () => {
    if (!name.trim()) {
      return Alert.alert('Erro', 'Informe seu nome.');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Erro', 'As senhas não coincidem.');
    }

    try {
      // usa api.post, que já sabe onde está seu servidor
      const res = await api.post('/user', { name: name.trim(), email, password });

      // dispara o login no contexto, que guarda o token e atualiza headers
      await login(res.data.token);

      router.replace('/');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Cadastro falhou. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#9E78CF"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9E78CF"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#9E78CF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirme a Senha"
        placeholderTextColor="#9E78CF"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.linkText}>Já tem conta? Entre</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles= StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15101C', paddingHorizontal: 30, paddingVertical: 80, justifyContent: 'center' },
  title:     { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  input:     { borderWidth: 1, borderColor: '#9E78CF', borderRadius: 10, padding: 12, color: '#FFF', marginBottom: 20 },
  button:    { backgroundColor: '#9E78CF', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText:{ color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  linkText:  { color: '#9E78CF', textAlign: 'center' },
});