import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Task { id: number; title: string; completed: boolean; }

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      else router.replace('/login');
      fetchTasks();
    };
    init();
  }, [router]);

  const fetchTasks = async () => { try { setLoading(true); const response = await axios.get<Task[]>('/tasks'); setTasks(response.data); } catch {} finally { setLoading(false); } };
  const handleAdd = async () => { if (!newTask.trim()) return; const resp = await axios.post<Task>('/tasks', { title: newTask.trim() }); setTasks(prev => [resp.data, ...prev]); setNewTask(''); };
  const handleToggle = async (id: number, completed: boolean) => { await axios.patch(`/tasks/${id}`, { completed: !completed }); setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t)); };
  const handleDelete = async (id: number) => { await axios.delete(`/tasks/${id}`); setTasks(prev => prev.filter(t => t.id !== id)); };
  const handleLogout = async () => { await AsyncStorage.removeItem('token'); router.replace('/login'); };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.contentHeader}>
          <View style={styles.titleRow}>
            <Text style={styles.titleText}>Minhas tarefas</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}><Text style={styles.logoutText}>Fazer Logout</Text></TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={tasks}
          keyExtractor={item => item.id.toString()}
          refreshing={loading}
          onRefresh={fetchTasks}
          renderItem={({ item }) => (
            <View style={styles.card}>\

              <View style={styles.taskRow}><Checkbox value={item.completed} onValueChange={() => handleToggle(item.id, item.completed)} color={item.completed ? '#9E78CF' : undefined} /><Text style={[styles.textCardList, item.completed && styles.completedText]}>{item.title}</Text></View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}><Text style={styles.deleteText}>🗑️</Text></TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma tarefa.</Text>}
        />
        <KeyboardAwareScrollView style={styles.keyboard} contentContainerStyle={styles.keyboardContent} enableOnAndroid enableAutomaticScroll extraScrollHeight={Platform.OS === 'ios' ? 20 : 120} keyboardOpeningTime={0}>
          <Image source={require('../../assets/jair.png')} style={styles.image} />
          <View style={styles.inputRow}>
            <TextInput style={styles.input} placeholder="adicione uma nova tarefa..." placeholderTextColor="#FFF" value={newTask} onChangeText={setNewTask} />
            <TouchableOpacity style={styles.button} onPress={handleAdd}><Text style={styles.buttonText}>+</Text></TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15101C',
    paddingHorizontal: 30,
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    backgroundColor: '#1E1A2D',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
  },
  contentHeader: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#15101C',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  logoutText: {
    color: '#9E78CF',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#15101C',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textCardList: {
    color: '#FFF',
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteButton: {
    padding: 5,
  },
  deleteText: {
    color: '#9E78CF',
  },
  emptyText: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 20,
  },
  keyboard: {
    flex: 1,
  },
  keyboardContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  image: {
    alignSelf: 'center',
    opacity: 0.2,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#9E78CF',
    borderRadius: 10,
    padding: 10,
    color: '#FFF',
  },
  button: {
    backgroundColor: '#9E78CF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
});