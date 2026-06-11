import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import apiClient from '../../api/client';
import { useRouter } from 'expo-router';

export default function VillagerComplaints() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Water');
  
  // Data State
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [fetching, setFetching] = useState(true);

  // Modal State
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await apiClient.get('/complaints/my');
      if (res.data.success) {
        setComplaints(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching complaints:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/complaints', { title, description, category });

      if (res.data.success) {
        Toast.show({ type: 'success', text1: 'Success', text2: res.data.message || 'Complaint submitted successfully!' });
        setTitle('');
        setDescription('');
        setCategory('Water');
        setIsFormVisible(false); // Close Modal on success
        fetchComplaints();
      }
    } catch (error) {
      console.log('Submit error:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to submit complaint' });
    } finally {
      setLoading(false);
    }
  };

  const renderComplaintCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedItem(item)}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <Ionicons name="alert-circle" size={24} color="#D97706" />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardCategory}>{item.category} • {new Date().toLocaleDateString()}</Text>
        </View>
        <View style={[
          styles.statusBadge, 
          item.status === 'Resolved' ? styles.statusResolved : 
          item.status === 'In Progress' ? styles.statusProgress : styles.statusPending
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
          <Text style={styles.headerTitle}>My Complaints</Text>
          <Text style={styles.headerSubtitle}>View and track your reported issues.</Text>
        </View>
      </View>

      {fetching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComplaintCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={60} color="#CBD5E1" />
              <Text style={styles.emptyText}>No complaints submitted yet.</Text>
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
              <Text style={styles.modalTitle}>Report an Issue</Text>
              <TouchableOpacity onPress={() => setIsFormVisible(false)}>
                <Ionicons name="close" size={28} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
                  <Picker.Item label="Water Supply" value="Water" />
                  <Picker.Item label="Electricity" value="Electricity" />
                  <Picker.Item label="Roads & Transport" value="Roads" />
                  <Picker.Item label="Sanitation" value="Sanitation" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>

              <CustomInput placeholder="Issue Title (e.g., Broken pipe)" value={title} onChangeText={setTitle} icon="create-outline" />
              <CustomInput placeholder="Describe the issue in detail..." value={description} onChangeText={setDescription} icon="document-text-outline" multiline={true} />

              <CustomButton title={loading ? "Submitting..." : "Submit Complaint"} onPress={handleSubmit} disabled={loading} style={{ marginTop: 20, marginBottom: 20 }} />
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
                  <Text style={styles.modalTitle}>Complaint Details</Text>
                  <TouchableOpacity onPress={() => setSelectedItem(null)}>
                    <Ionicons name="close" size={28} color="#4B5563" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Title</Text>
                    <Text style={styles.detailValue}>{selectedItem.title}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category</Text>
                    <Text style={styles.detailValue}>{selectedItem.category}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[styles.statusBadge, selectedItem.status === 'Resolved' ? styles.statusResolved : selectedItem.status === 'In Progress' ? styles.statusProgress : styles.statusPending]}>
                      <Text style={styles.statusText}>{selectedItem.status}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Description</Text>
                    <Text style={[styles.detailValue, { lineHeight: 22, marginTop: 5 }]}>{selectedItem.description}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100, // Space for FAB
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusPending: { backgroundColor: '#FEE2E2' },
  statusProgress: { backgroundColor: '#FEF3C7' },
  statusResolved: { backgroundColor: '#D1FAE5' },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#374151' },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 15,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: Colors.primary || '#4F46E5',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
  },
  detailRow: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});
