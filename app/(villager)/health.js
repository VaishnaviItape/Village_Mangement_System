import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import apiClient from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Health() {
  const [records, setRecords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ type: 'disease_report', details: '' });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await apiClient.get('/sv/health');
      setRecords(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const name = await AsyncStorage.getItem('fullName') || 'Villager';
      await apiClient.post('/sv/health', { ...form, reported_by: name });
      Alert.alert('Success', 'Health report submitted successfully.');
      setModalVisible(false);
      fetchRecords();
    } catch (error) {
      Alert.alert('Error', 'Could not submit report');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="medkit" size={24} color={Colors.primary} />
        <Text style={styles.status}>{item.status}</Text>
      </View>
      <Text style={styles.title}>{item.type.replace('_', ' ').toUpperCase()}</Text>
      <Text style={styles.desc}>{item.details}</Text>
      <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={i => i.id.toString()}
        contentContainerStyle={{ padding: 15 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report Health/Sanitation Issue</Text>
            <TextInput style={styles.input} placeholder="Describe the issue (e.g. Mosquitoes breeding)" multiline numberOfLines={4} onChangeText={t => setForm({...form, details: t})} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, {backgroundColor: Colors.gray}]} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                <Text style={styles.btnText}>Submit Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  card: { backgroundColor: Colors.white, padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  status: { color: Colors.primary, fontWeight: 'bold', fontSize: 12 },
  title: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 5 },
  desc: { color: Colors.gray, marginBottom: 10 },
  date: { fontSize: 12, color: Colors.gray, textAlign: 'right' },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: Colors.white, padding: 20, borderRadius: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: Colors.lightGray, padding: 10, borderRadius: 8, marginBottom: 10, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btn: { flex: 1, backgroundColor: Colors.primary, padding: 12, borderRadius: 8, marginHorizontal: 5, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: 'bold' }
});
