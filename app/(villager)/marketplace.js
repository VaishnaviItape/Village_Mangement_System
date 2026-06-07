import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import apiClient from '../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', price: '', item_type: 'crop', contact_number: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await apiClient.get('/sv/marketplace');
      setItems(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSell = async () => {
    try {
      const name = await AsyncStorage.getItem('fullName') || 'Villager';
      await apiClient.post('/sv/marketplace', { ...form, seller_name: name });
      Alert.alert('Success', 'Item listed in the marketplace!');
      setModalVisible(false);
      fetchItems();
    } catch (error) {
      Alert.alert('Error', 'Could not list item');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.typeBadge}>{item.item_type.toUpperCase()}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.seller}>Seller: {item.seller_name}</Text>
        <Text style={styles.contact}>📞 {item.contact_number}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
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
            <Text style={styles.modalTitle}>Sell an Item / Service</Text>
            <TextInput style={styles.input} placeholder="Title (e.g. 50kg Wheat)" onChangeText={t => setForm({...form, title: t})} />
            <TextInput style={styles.input} placeholder="Description" onChangeText={t => setForm({...form, description: t})} />
            <TextInput style={styles.input} placeholder="Price (₹)" keyboardType="numeric" onChangeText={t => setForm({...form, price: t})} />
            <TextInput style={styles.input} placeholder="Contact Number" keyboardType="phone-pad" onChangeText={t => setForm({...form, contact_number: t})} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, {backgroundColor: Colors.gray}]} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={handleSell}>
                <Text style={styles.btnText}>List Item</Text>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  typeBadge: { backgroundColor: Colors.primary, color: Colors.white, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, fontSize: 10, fontWeight: 'bold' },
  price: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  title: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 5 },
  desc: { color: Colors.gray, marginBottom: 10 },
  cardFooter: { borderTopWidth: 1, borderTopColor: Colors.lightGray, paddingTop: 10 },
  seller: { fontSize: 12, fontWeight: 'bold' },
  contact: { fontSize: 12, color: Colors.primary },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: Colors.white, padding: 20, borderRadius: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: Colors.lightGray, padding: 10, borderRadius: 8, marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btn: { flex: 1, backgroundColor: Colors.primary, padding: 12, borderRadius: 8, marginHorizontal: 5, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: 'bold' }
});
