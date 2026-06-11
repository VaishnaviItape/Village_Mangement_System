import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Colors from '../../constants/Colors';
import apiClient from '../../api/client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, TouchableOpacity } from 'expo-router';

export default function PanchayatInfo() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMeetings(); }, []);

  const fetchMeetings = async () => {
    try {
      const res = await apiClient.get('/sv/sabha');
      if (res.data.success) setMeetings(res.data.data);
    } catch (e) { console.log(e); } finally { setLoading(false); }
  };

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Gram Sabha Meetings</Text>
          <Text style={styles.headerSubtitle}>Stay updated with village decisions.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

      {loading ? <ActivityIndicator size="large" color={Colors.primary} style={{marginTop: 50}} /> : meetings.length > 0 ? (
        meetings.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.date}>{new Date(item.meeting_date).toLocaleDateString()}</Text>
              <View style={[styles.statusBadge, item.status === 'Completed' ? styles.statusCompleted : styles.statusScheduled]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            
            <Text style={styles.label}>Agenda:</Text>
            <Text style={styles.textValue}>{item.agenda}</Text>

            {item.minutes && (
              <View style={styles.minutesBox}>
                <Text style={styles.label}>Minutes / Decisions:</Text>
                <Text style={styles.textValue}>{item.minutes}</Text>
              </View>
            )}
          </View>
        ))
      ) : <Text style={styles.noData}>No upcoming meetings found.</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContainer: { padding: 15, paddingBottom: 30 },
  headerArea: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { marginRight: 15, padding: 5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: '#6B7280' },
  card: { backgroundColor: Colors.white, padding: 20, borderRadius: 12, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: Colors.lightGray, paddingBottom: 10 },
  date: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  label: { fontSize: 14, fontWeight: 'bold', color: Colors.text, marginTop: 5 },
  textValue: { fontSize: 15, color: Colors.textLight, marginTop: 5, lineHeight: 22 },
  minutesBox: { marginTop: 15, padding: 15, backgroundColor: '#F8F9FA', borderRadius: 8, borderLeftWidth: 3, borderLeftColor: Colors.primary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  statusScheduled: { backgroundColor: '#E0F2FE' },
  statusCompleted: { backgroundColor: '#D4EDDA' },
  statusText: { fontSize: 12, fontWeight: 'bold', color: Colors.text },
  noData: { color: Colors.textLight, fontStyle: 'italic', textAlign: 'center', marginTop: 30 }
});
