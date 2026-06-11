import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../constants/Colors';
import apiClient from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useRouter } from 'expo-router';

export default function Marketplace() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [form, setForm] = useState({ title: '', description: '', price: '', item_type: 'crop', contact_number: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await apiClient.get('/sv/marketplace');
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  const handleSell = async () => {
    if (!form.title || !form.price || !form.contact_number) {
      Alert.alert('Error', 'Please fill all required fields (Title, Price, Contact).');
      return;
    }

    setLoading(true);
    try {
      const name = await AsyncStorage.getItem('fullName') || 'Villager';
      const res = await apiClient.post('/sv/marketplace', { ...form, seller_name: name });
      if (res.data.success) {
        Alert.alert('Success', 'Item listed in the marketplace!');
        setForm({ title: '', description: '', price: '', item_type: 'crop', contact_number: '' });
        setModalVisible(false);
        fetchItems();
      }
    } catch (error) {
      Alert.alert('Error', 'Could not list item');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedItem(item)}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <Ionicons name="cart" size={24} color="#D97706" />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardCategory}>{item.item_type.toUpperCase()}</Text>
        </View>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>₹{item.price}</Text>
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
          <Text style={styles.headerTitle}>Village Marketplace</Text>
          <Text style={styles.headerSubtitle}>Buy and sell crops, tools, and local goods.</Text>
        </View>
      </View>

      {fetching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={i => i.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="basket-outline" size={60} color="#CBD5E1" />
              <Text style={styles.emptyText}>No items listed in the marketplace yet.</Text>
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
              <Text style={styles.modalTitle}>Sell an Item</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.label}>Item Category</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={form.item_type} onValueChange={(v) => setForm({ ...form, item_type: v })}>
                  <Picker.Item label="Crops / Vegetables" value="crop" />
                  <Picker.Item label="Farming Tools" value="tools" />
                  <Picker.Item label="Livestock" value="livestock" />
                  <Picker.Item label="Local Handicrafts" value="handicrafts" />
                  <Picker.Item label="Other Services" value="service" />
                </Picker>
              </View>

              <CustomInput placeholder="Title (e.g. 50kg Wheat)" value={form.title} onChangeText={t => setForm({...form, title: t})} icon="pricetag-outline" />
              <CustomInput placeholder="Price (₹)" value={form.price} onChangeText={t => setForm({...form, price: t})} keyboardType="numeric" icon="cash-outline" />
              <CustomInput placeholder="Contact Number" value={form.contact_number} onChangeText={t => setForm({...form, contact_number: t})} keyboardType="phone-pad" icon="call-outline" />
              <CustomInput placeholder="Description" value={form.description} onChangeText={t => setForm({...form, description: t})} icon="document-text-outline" multiline={true} />
              
              <CustomButton title={loading ? "Listing..." : "List Item"} onPress={handleSell} disabled={loading} style={{ marginTop: 10, marginBottom: 20 }} />
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
                  <Text style={styles.modalTitle}>Item Details</Text>
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
                    <Text style={styles.detailLabel}>Price</Text>
                    <Text style={[styles.detailValue, { color: '#059669', fontSize: 20 }]}>₹{selectedItem.price}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category</Text>
                    <Text style={styles.detailValue}>{selectedItem.item_type.toUpperCase()}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Seller</Text>
                    <Text style={styles.detailValue}>{selectedItem.seller_name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Contact</Text>
                    <Text style={styles.detailValue}>{selectedItem.contact_number}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Listed On</Text>
                    <Text style={styles.detailValue}>{new Date(selectedItem.created_at).toLocaleDateString()}</Text>
                  </View>
                  {selectedItem.description ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Description</Text>
                      <Text style={[styles.detailValue, { lineHeight: 22, marginTop: 5, fontWeight: 'normal' }]}>{selectedItem.description}</Text>
                    </View>
                  ) : null}
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
  cardIconContainer: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  cardCategory: { fontSize: 13, color: '#6B7280' },
  priceBadge: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#D1FAE5', borderRadius: 12 },
  priceText: { fontSize: 14, fontWeight: 'bold', color: '#059669' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { color: '#9CA3AF', fontSize: 16, marginTop: 15 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#D97706', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
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
