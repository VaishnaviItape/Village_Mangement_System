import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import apiClient from '../../api/client';
import { useRouter } from 'expo-router';

export default function UtilityRequests() {
  const router = useRouter();

  // Form State
  const [requestType, setRequestType] = useState('Water Connection');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [assetId, setAssetId] = useState('');
  const [document, setDocument] = useState(null);
  
  // Data State
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [infrastructure, setInfrastructure] = useState([]);

  // Modal State
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchHistory();
    fetchInfrastructure();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get('/utility/my');
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching utility history:', error);
    } finally {
      setFetchingHistory(false);
    }
  };

  const fetchInfrastructure = async () => {
    try {
      const res = await apiClient.get('/infrastructure');
      if (res.data.success) {
        setInfrastructure(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching infrastructure:', error);
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setDocument(result.assets[0]);
      }
    } catch (err) {
      console.log('Document picking error', err);
    }
  };

  const handleSubmit = async () => {
    if (!location) {
      Alert.alert('Error', 'Please provide a location.');
      return;
    }
    if (requestType === 'Repair Request' && !assetId) {
      Alert.alert('Error', 'Please select an infrastructure asset for the repair.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('request_type', requestType);
      formData.append('description', description);
      formData.append('location', location);
      if (requestType === 'Repair Request') {
        formData.append('asset_id', assetId);
      }
      
      if (document) {
        formData.append('document', {
          uri: document.uri,
          name: document.name,
          type: document.mimeType || 'application/octet-stream',
        });
      }

      const res = await apiClient.post('/utility', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        Alert.alert('Success', res.data.message);
        setDescription('');
        setLocation('');
        setAssetId('');
        setDocument(null);
        setIsFormVisible(false);
        fetchHistory();
      }
    } catch (error) {
      console.log('Submit error:', error);
      Alert.alert('Error', 'Failed to submit utility request');
    } finally {
      setLoading(false);
    }
  };

  const renderHistoryCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedItem(item)}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <Ionicons name="build" size={24} color="#059669" />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.request_type}</Text>
          <Text style={styles.cardCategory}>{item.location}</Text>
        </View>
        <View style={[
          styles.statusBadge, 
          item.status === 'Approved' ? styles.statusApproved : 
          item.status === 'Rejected' ? styles.statusRejected : styles.statusPending
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
          <Text style={styles.headerTitle}>Utility Requests</Text>
          <Text style={styles.headerSubtitle}>Manage your water connections, NOCs, and repairs.</Text>
        </View>
      </View>

      {fetchingHistory ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderHistoryCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="construct-outline" size={60} color="#CBD5E1" />
              <Text style={styles.emptyText}>No utility requests submitted yet.</Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setIsFormVisible(true)}>
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Add Form Modal */}
      <Modal visible={isFormVisible} animationType="slide" transparent={true} onRequestClose={() => setIsFormVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Request</Text>
              <TouchableOpacity onPress={() => setIsFormVisible(false)}>
                <Ionicons name="close" size={28} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.label}>Request Type</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={requestType} onValueChange={(itemValue) => setRequestType(itemValue)}>
                  <Picker.Item label="Water Connection (Nal)" value="Water Connection" />
                  <Picker.Item label="Building Construction NOC" value="Building NOC" />
                  <Picker.Item label="Infrastructure Repair" value="Repair Request" />
                </Picker>
              </View>

              {requestType === 'Repair Request' && (
                <>
                  <Text style={styles.label}>Select Asset to Repair</Text>
                  <View style={styles.pickerContainer}>
                    <Picker selectedValue={assetId} onValueChange={(itemValue) => setAssetId(itemValue)}>
                      <Picker.Item label="-- Select Asset --" value="" />
                      {infrastructure.map((item) => (
                        <Picker.Item key={item.asset_id} label={`${item.asset_name} (${item.asset_type})`} value={item.asset_id} />
                      ))}
                    </Picker>
                  </View>
                </>
              )}

              <CustomInput placeholder="Location / Address" value={location} onChangeText={setLocation} icon="location-outline" />
              <CustomInput placeholder="Description (Optional)" value={description} onChangeText={setDescription} icon="document-text-outline" />

              <CustomButton title={document ? `Selected: ${document.name}` : "Upload Building Plan / Photo"} onPress={handleDocumentPick} type="outline" style={{ marginBottom: 15 }} />
              <CustomButton title={loading ? "Submitting..." : "Submit Request"} onPress={handleSubmit} disabled={loading} style={{ marginBottom: 20 }} />
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
                  <Text style={styles.modalTitle}>Request Details</Text>
                  <TouchableOpacity onPress={() => setSelectedItem(null)}>
                    <Ionicons name="close" size={28} color="#4B5563" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type</Text>
                    <Text style={styles.detailValue}>{selectedItem.request_type}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue}>{selectedItem.location}</Text>
                  </View>
                  {selectedItem.asset_name && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Asset</Text>
                      <Text style={styles.detailValue}>{selectedItem.asset_name}</Text>
                    </View>
                  )}
                  {selectedItem.description ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Description</Text>
                      <Text style={[styles.detailValue, { lineHeight: 22 }]}>{selectedItem.description}</Text>
                    </View>
                  ) : null}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[styles.statusBadge, selectedItem.status === 'Approved' ? styles.statusApproved : selectedItem.status === 'Rejected' ? styles.statusRejected : styles.statusPending]}>
                      <Text style={styles.statusText}>{selectedItem.status}</Text>
                    </View>
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
  cardIconContainer: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
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
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#10B981', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
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
