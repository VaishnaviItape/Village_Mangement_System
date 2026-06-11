import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/auth/login');
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.avatarContainer}
          activeOpacity={0.8}
        >
          <Ionicons name="person" size={32} color="#4F46E5" />
        </TouchableOpacity>
        
        <View style={styles.userInfoContainer}>
          <Text style={styles.userNameTop}>Hi, {user?.name || 'Admin'} 👋</Text>
          <Text style={styles.subText}>Administrator</Text>
        </View>

        <TouchableOpacity style={styles.bellIconContainer}>
          <Ionicons name="notifications-outline" size={26} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>15</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Pending Complaints</Text>
        </View>
      </View>

      <CustomButton 
        title="Logout" 
        onPress={handleLogout} 
        type="danger" 
        style={{ marginTop: 30, marginBottom: 20 }} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#FAF5F5',
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  avatarContainer: {
    marginRight: 15,
  },
  userInfoContainer: {
    flex: 1,
  },
  userNameTop: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
  },
  subText: {
    color: '#6B7280',
    marginTop: 2,
    fontSize: 14,
    fontWeight: '500',
  },
  bellIconContainer: {
    padding: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: Colors.white,
    flex: 0.48,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
});
