import { Checkbox } from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

interface Task {
  id: number;
  title: string;
  description: string | null;
  done: boolean;
}

export default function Index() {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Adonis returns user with tasks array
      const res = await api.get('/tasks');
      const data = res.data.tasks || res.data;
      setTasks(data as Task[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    if (!newTask.trim()) return;
    try {
      const resp = await api.post('/tasks', { title: newTask.trim(), description: null });
      setTasks(prev => [resp.data, ...prev]);
      setNewTask('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (id: number, done: boolean) => {
    try {
      await api.patch(`/tasks/${id}`, { done: !done });
      setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !done } : t));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Minhas tarefas</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>
        </View>
        <FlatList
          data={tasks}
          keyExtractor={item => item.id.toString()}
          refreshing={loading}
          onRefresh={fetchTasks}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.taskRow}>
                <Checkbox value={item.done} onValueChange={() => handleToggle(item.id, item.done)} color={item.done ? '#9E78CF' : undefined} />
                <View style={styles.taskInfo}>
                  <Text style={[styles.text, item.done && styles.done]}>{item.title}</Text>
                  {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
                </View>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}><Text style={styles.deleteText}>🗑️</Text></TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma tarefa.</Text>}
        />
        <KeyboardAwareScrollView contentContainerStyle={styles.inputArea} enableOnAndroid enableAutomaticScroll extraScrollHeight={Platform.OS === 'ios' ? 20 : 120}>
          <TextInput style={styles.input} placeholder="Nova tarefa" placeholderTextColor="#FFF" value={newTask} onChangeText={setNewTask} />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}><Text style={styles.addText}>+</Text></TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#15101C', padding: 30, justifyContent: 'center' },
  content: { flex: 1, backgroundColor: '#1E1A2D', borderRadius: 20, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#15101C', padding: 8, borderRadius: 10 },
  logoutText: { color: '#9E78CF' },
  card: { flexDirection: 'row', backgroundColor: '#15101C', borderRadius: 10, padding: 10, marginBottom: 10, justifyContent: 'space-between', alignItems: 'center' },
  taskRow: { flexDirection: 'row', alignItems: 'center' },
  taskInfo: { marginLeft: 10 },
  text: { color: '#FFF', fontSize: 16 },
  desc: { color: '#BBB', fontSize: 12 },
  done: { textDecorationLine: 'line-through', opacity: 0.6 },
  deleteButton: { padding: 5 },
  deleteText: { color: '#9E78CF' },
  empty: { color: '#FFF', textAlign: 'center', marginTop: 20 },
  inputArea: { flexGrow: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderWidth: 1, borderColor: '#9E78CF', borderRadius: 10, padding: 10, color: '#FFF', marginRight: 10 },
  addButton: { backgroundColor: '#9E78CF', padding: 14, borderRadius: 10 },
  addText: { color: '#FFF', fontSize: 18 },
});