import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const SERVICES = [
  { id: 'civic', title: 'Civic', icon: 'document-text-outline', route: '/(villager)/civic', color: '#4F46E5' },
  { id: 'utilities', title: 'Utilities', icon: 'construct-outline', route: '/(villager)/utilities', color: '#059669' },
  { id: 'business', title: 'Business', icon: 'briefcase-outline', route: '/(villager)/business', color: '#D97706' },
  { id: 'agriculture', title: 'Agriculture', icon: 'leaf-outline', route: '/(villager)/agriculture', color: '#65A30D' },
  { id: 'panchayat', title: 'Gram Sabha', icon: 'people-outline', route: '/(villager)/panchayat', color: '#2563EB' },
  { id: 'taxes', title: 'Taxes', icon: 'cash-outline', route: '/(villager)/taxes', color: '#DC2626' },
  { id: 'certificates', title: 'Certificates', icon: 'school-outline', route: '/(villager)/certificates', color: '#7C3AED' },
  { id: 'marketplace', title: 'Marketplace', icon: 'cart-outline', route: '/(villager)/marketplace', color: '#0891B2' },
  { id: 'health', title: 'Health', icon: 'medkit-outline', route: '/(villager)/health', color: '#E11D48' },
];

export default function ServicesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>All Services</Text>
          <Text style={styles.headerSubtitle}>Access all village management features from here.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>

      <View style={styles.grid}>
        {SERVICES.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.card}
            onPress={() => router.push(service.route)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: service.color + '1A' }]}>
              <Ionicons name={service.icon} size={32} color={service.color} />
            </View>
            <Text style={styles.cardTitle}>{service.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  headerArea: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { marginRight: 15, padding: 5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: '#6B7280' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '31%', // 3 cards per row
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});
