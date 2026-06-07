import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '../../../constants/Colors';
import apiClient from '../../../api/client';

export default function ComplaintReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await apiClient.get('/reports/complaints');
      if (response.data.success) {
        setReport(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching complaint report:', error);
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
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Complaints Status</Text>
        {report && report.length > 0 ? (
          report.map((item, idx) => (
            <View key={idx} style={styles.row}>
              <Text style={[styles.label, { textTransform: 'capitalize' }]}>{item.status}:</Text>
              <Text style={styles.value}>{item.count}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No complaints logged.</Text>
        )}
      </View>
    </View>
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
});
