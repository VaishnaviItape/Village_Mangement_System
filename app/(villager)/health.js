import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../constants/Colors';
import apiClient from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useRouter } from 'expo-router';

export default function Health() {
  const router = useRouter();

  const [records, setRecords] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [form, setForm] = useState({ type: 'disease_report', details: '' });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await apiClient.get('/sv/health');
      if (res.data.success) {
        setRecords(res.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.details) {
      Alert.alert('Error', 'Please describe the issue.');
      return;
    }
    setLoading(true);
    try {
      const name = await AsyncStorage.getItem('fullName') || 'Villager';
      const res = await apiClient.post('/sv/health', { ...form, reported_by: name });
      if (res.data.success) {
        Alert.alert('Success', 'Health report submitted successfully.');
        setForm({ type: 'disease_report', details: '' });
        setModalVisible(false);
        fetchRecords();
      }
    } catch (error) {
      Alert.alert('Error', 'Could not submit report');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedItem(item)}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <Ionicons name="medkit" size={24} color="#EF4444" />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.type.replace('_', ' ').toUpperCase()}</Text>
          <Text style={styles.cardCategory}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
        <View style={[
          styles.statusBadge, 
          item.status === 'Resolved' ? styles.statusApproved : 
          item.status === 'In Progress' ? styles.statusPending : styles.statusRejected
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Health & Sanitation</Text>
          <Text style={styles.headerSubtitle}>Report and track health issues in your area.</Text>
        </View>
      </View>

      {fetching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={renderItem}
          keyExtractor={i => i.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="medkit-outline" size={60} color="#CBD5E1" />
              <Text style={styles.emptyText}>No health issues reported yet.</Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Add Form Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report Health Issue</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.label}>Issue Type</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <Picker.Item label="Disease Outbreak" value="disease_report" />
                  <Picker.Item label="Sanitation Issue" value="sanitation" />
                  <Picker.Item label="Medical Request" value="medical" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>

              <CustomInput 
                placeholder="Describe the issue (e.g. Mosquitoes breeding)" 
                value={form.details} 
                onChangeText={t => setForm({...form, details: t})} 
                icon="document-text-outline" 
                multiline={true} 
              />
              
              <CustomButton title={loading ? "Submitting..." : "Submit Report"} onPress={handleSubmit} disabled={loading} style={{ marginTop: 10, marginBottom: 20 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Detail View Modal */}
      <Modal visible={!!selectedItem} animationType="fade" transparent={true} onRequestClose={() => setSelectedItem(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Report Details</Text>
                  <TouchableOpacity onPress={() => setSelectedItem(null)}>
                    <Ionicons name="close" size={28} color="#4B5563" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type</Text>
                    <Text style={styles.detailValue}>{selectedItem.type.replace('_', ' ').toUpperCase()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Reported By</Text>
                    <Text style={styles.detailValue}>{selectedItem.reported_by}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{new Date(selectedItem.created_at).toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[styles.statusBadge, selectedItem.status === 'Resolved' ? styles.statusApproved : selectedItem.status === 'In Progress' ? styles.statusPending : styles.statusRejected]}>
                      <Text style={styles.statusText}>{selectedItem.status}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={[styles.detailValue, { lineHeight: 22, marginTop: 5 }]}>{selectedItem.details}</Text>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerArea: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { marginRight: 15, padding: 5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: '#6B7280' },
  listContainer: { padding: 15, paddingBottom: 100 },
  card: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 16, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  cardIconContainer: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  cardCategory: { fontSize: 13, color: '#6B7280' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusApproved: { backgroundColor: '#D1FAE5' },
  statusRejected: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#374151' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { color: '#9CA3AF', fontSize: 16, marginTop: 15 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#EF4444', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginLeft: 4 },
  pickerContainer: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, marginBottom: 20, backgroundColor: '#F9FAFB' },
  detailRow: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 10, alignItems: 'flex-start' },
  detailLabel: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  detailValue: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
});
