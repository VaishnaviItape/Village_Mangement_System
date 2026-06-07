import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import Colors from '../../../constants/Colors';
import apiClient from '../../../api/client';

export default function UserReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await apiClient.get('/reports/users');
      if (response.data.success) {
        setReport(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching user report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>User Demographics</Text>
        {report && report.usersByRole.length > 0 ? (
          report.usersByRole.map((item, idx) => (
            <View key={idx} style={styles.row}>
              <Text style={[styles.label, { textTransform: 'capitalize' }]}>{item.role || 'Unknown'}:</Text>
              <Text style={styles.value}>{item.count}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No users found.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Registrations</Text>
        {report && report.recentRegistrations.map((user, idx) => (
          <View key={idx} style={styles.userItem}>
            <Text style={styles.userName}>{user.full_name}</Text>
            <Text style={styles.userRole}>{user.role}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 15,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: Colors.textLight,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  noData: {
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userName: {
    fontSize: 15,
    color: Colors.text,
  },
  userRole: {
    fontSize: 13,
    color: Colors.textLight,
    textTransform: 'capitalize',
  }
});
