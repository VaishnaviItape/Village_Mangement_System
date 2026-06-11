import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import apiClient from '../../api/client';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function SchemesScreen() {
  const router = useRouter();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const response = await apiClient.get('/schemes');
      if (response.data && response.data.success) {
        setSchemes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchemes();
  };

  const renderScheme = ({ item }) => {
    let eligibility = {};
    try {
      eligibility = JSON.parse(item.eligibility_criteria || '{}');
    } catch (e) { }

    return (
      <View style={styles.card}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.cardGradient}
        >
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            </View>
            <Text style={styles.statusBadge}>{item.status}</Text>
          </View>
          
          <Text style={styles.title}>{item.scheme_name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          
          {Object.keys(eligibility).length > 0 && (
            <View style={styles.eligibilityContainer}>
              <Text style={styles.eligibilityTitle}>Eligibility:</Text>
              {Object.entries(eligibility).map(([key, value]) => (
                <View key={key} style={styles.eligibilityRow}>
                  <Ionicons name="checkmark-circle-outline" size={16} color="#6366F1" />
                  <Text style={styles.eligibilityText}>
                    <Text style={styles.eligibilityKey}>{key.charAt(0).toUpperCase() + key.slice(1)}: </Text>
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
            <Text style={styles.dateText}>
              {new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.applyButton}
            onPress={() => router.push({ pathname: '/(villager)/schemeApplication', params: { scheme_id: item.scheme_id, scheme_name: item.scheme_name } })}
          >
            <LinearGradient
              colors={['#4F46E5', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.applyButtonGradient}
            >
              <Text style={styles.applyButtonText}>Apply Now</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Govt. Schemes</Text>
          <Text style={styles.headerSubtitle}>View and apply for schemes.</Text>
        </View>
      </View>
      <FlatList
        data={schemes}
        keyExtractor={(item) => item.scheme_id.toString()}
        renderItem={renderScheme}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>No government schemes available at the moment.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: '#D1FAE5',
    padding: 10,
    borderRadius: 16,
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    color: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },
  eligibilityContainer: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  eligibilityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3730A3',
    marginBottom: 8,
  },
  eligibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eligibilityText: {
    fontSize: 14,
    color: '#4338CA',
    marginLeft: 8,
  },
  eligibilityKey: {
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  applyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
});
