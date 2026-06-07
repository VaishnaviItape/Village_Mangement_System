import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import apiClient from '../../api/client';
import { Ionicons } from '@expo/vector-icons';

export default function VillagerTaxes() {
  // Mock unpaid taxes for demo
  const [taxes] = useState([
    { id: '1', tax_name: 'Property Tax (Ghar Patti)', amount: 1500, due_date: '2026-12-31' },
    { id: '2', tax_name: 'Water Tax (Pani Patti)', amount: 800, due_date: '2026-10-15' },
    { id: '3', tax_name: 'Trade License Renewal', amount: 3000, due_date: '2026-08-01' }
  ]);

  const handlePayment = async (tax) => {
    Alert.alert(
      "Confirm Payment",
      `Pay ₹${tax.amount} for ${tax.tax_name} via UPI?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Pay via UPI", 
          onPress: async () => {
            try {
              const name = await AsyncStorage.getItem('fullName') || 'Villager';
              const res = await apiClient.post('/sv/payments', {
                user_name: name,
                payment_type: tax.tax_name,
                amount: tax.amount
              });
              Alert.alert('Payment Successful!', `Transaction ID: ${res.data.transaction_id}`);
            } catch (error) {
              Alert.alert('Payment Failed', 'Please try again.');
            }
          } 
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="document-text" size={24} color={Colors.primary} />
        <Text style={styles.amount}>₹{item.amount}</Text>
      </View>
      <Text style={styles.title}>{item.tax_name}</Text>
      <Text style={styles.desc}>Due: {item.due_date}</Text>
      <TouchableOpacity style={styles.payButton} onPress={() => handlePayment(item)}>
        <Text style={styles.payButtonText}>Pay Now via UPI</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Pending Taxes</Text>
      <FlatList
        data={taxes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  desc: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 15,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  payButton: {
    backgroundColor: '#00b894',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  }
});
