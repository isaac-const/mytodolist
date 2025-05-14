// src/app/(protected)/index.tsx
import { Checkbox } from 'expo-checkbox'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useAuth } from '../../hooks/useAuth'
import api from '../../services/api'

interface Task { id: number; title: string; description: string | null; done: boolean }

export default function Index() {
  const { logout } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await api.get('/task')
        const data = res.data.tasks || res.data
        setTasks(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleAdd = async () => {
    if (!newTask.trim()) return
    try {
      const res = await api.post('/task', { title: newTask.trim(), description: newTask.trim() })
      setTasks(prev => [res.data, ...prev])
      setNewTask('')
    } catch (e) {
      console.error(e)
    }
  }

  const handleToggle = async (id: number, done: boolean) => {
    try {
      await api.patch(`/task/${id}`, { done: !done })
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !done } : t)))
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/task/${id}`)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Minhas tarefas</Text>
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={tasks}
            keyExtractor={(item, index) =>
              item?.id?.toString() || `temp_${index}` // Fallback seguro
            }
            refreshing={loading}
            onRefresh={() => {
              setLoading(true)
              api.get('/task')
                .then(r => setTasks(r.data.tasks || r.data))
                .catch(e => console.error(e))
                .finally(() => setLoading(false))
            }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.taskRow}>
                  <Checkbox
                    value={item.done}
                    onValueChange={() => handleToggle(item.id, item.done)}
                    color={item.done ? '#9E78CF' : undefined}
                  />
                  <View style={styles.taskInfo}>
                    <Text style={[styles.text, item.done && styles.done]}>{item.title}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>Nenhuma tarefa.</Text>}
          />
        </View>

        <KeyboardAwareScrollView
          contentContainerStyle={styles.bottomContent}
          enableOnAndroid
          extraScrollHeight={Platform.OS === 'ios' ? 0 : 0}
        >
          <Image
            source={require('../../assets/jair.png')}
            style={styles.imageStyle}
          />
          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Nova tarefa"
              placeholderTextColor="#FFF"
              value={newTask}
              onChangeText={setNewTask}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#15101C', padding: 30 },
  content:       { flex: 1, backgroundColor: '#1E1A2D', borderRadius: 20, padding: 20, justifyContent: 'space-between' },
  topContent:    { flex: 1 },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title:         { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  logoutButton:  { backgroundColor: '#15101C', padding: 8, borderRadius: 10 },
  logoutText:    { color: '#9E78CF' },
  card:          { flexDirection: 'row', backgroundColor: '#15101C', borderRadius: 10, padding: 10, marginBottom: 10, justifyContent: 'space-between', alignItems: 'center' },
  taskRow:       { flexDirection: 'row', alignItems: 'center' },
  taskInfo:      { marginLeft: 10 },
  text:          { color: '#FFF', fontSize: 16 },
  desc:          { color: '#BBB', fontSize: 12 },
  done:          { textDecorationLine: 'line-through', opacity: 0.6 },
  deleteButton:  { padding: 5 },
  deleteText:    { color: '#9E78CF' },
  empty:         { color: '#FFF', textAlign: 'center', marginTop: 20 },
  bottomContent: { alignItems: 'center' },
  inputArea:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10 },
  input:         { flex: 1, borderWidth: 1, borderColor: '#9E78CF', borderRadius: 10, padding: 10, color: '#FFF', marginRight: 10 },
  addButton:     { backgroundColor: '#9E78CF', padding: 14, borderRadius: 10 },
  addText:       { color: '#FFF', fontSize: 18 },
  imageStyle:    { width: '100%', height: 100, opacity: 0.4, marginBottom: 10 },
})
