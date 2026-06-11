import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
} from 'react-native';
import apiClient from '../../api/client';

export default function VillagerDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [loadingSchemes, setLoadingSchemes] = useState(true);
  const [showProfile, setShowProfile] = useState(false); // Toggle Profile Expand
  
  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    loadUser();
    fetchSchemes();
    fetchNotifications();
  }, []);

  const loadUser = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const fetchSchemes = async () => {
    try {
      const response = await apiClient.get('/schemes');
      if (response.data.success) {
        setSchemes(response.data.data.slice(0, 4));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSchemes(false);
    }
  };

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const userData = await AsyncStorage.getItem('user');
      let userId = '';
      if (userData) {
        const parsedUser = JSON.parse(userData);
        userId = parsedUser?.user_id || parsedUser?.id || '';
      }
      
      const response = await apiClient.get(`/notifications/my?user_id=${userId}`);
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (err) {
      console.log('Error fetching notifications:', err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleOpenNotifications = () => {
    setShowNotifications(true);
    fetchNotifications();
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchemes();
    fetchNotifications().finally(() => {
      setRefreshing(false);
    });
  };

  const logout = async () => {
    await AsyncStorage.clear();
    router.replace('/auth/login');
  };

  const quickActions = [
    {
      title: 'Pay Taxes',
      icon: 'card',
      color: '#EEF2FF',
      iconColor: '#4F46E5',
      route: '/(villager)/taxes',
    },
    {
      title: 'Certificates',
      icon: 'document-text',
      color: '#F3E8FF',
      iconColor: '#9333EA',
      route: '/(villager)/certificates',
    },
    {
      title: 'Report Issue',
      icon: 'chatbubbles',
      color: '#FFE4E6',
      iconColor: '#E11D48',
      route: '/(villager)/complaints',
    },
    {
      title: 'Schemes',
      icon: 'shield-checkmark',
      color: '#D1FAE5',
      iconColor: '#059669',
      route: '/(villager)/schemes',
    },
  ];

  return (
    <View style={styles.container}>
      {/* New Profile Header (Reference Style) */}
      <View style={[styles.header, { zIndex: 50, elevation: 5 }]}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => setShowProfile(!showProfile)}
          activeOpacity={0.8}
        >
          <Ionicons name="person" size={32} color="#4F46E5" />
        </TouchableOpacity>

        <View style={styles.userInfoContainer}>
          <Text style={styles.userNameTop}>Hi, {user?.name || 'Villager'} 👋</Text>
          <Text style={styles.subText}>Verified Citizen</Text>
        </View>

        <TouchableOpacity style={styles.bellIconContainer} onPress={handleOpenNotifications}>
          <Ionicons name="notifications-outline" size={26} color="#4F46E5" />
          {notifications.length > 0 && (
            <View style={{position: 'absolute', right: -2, top: -2, backgroundColor: '#EF4444', width: 10, height: 10, borderRadius: 5}} />
          )}
        </TouchableOpacity>
      </View>

      {/* Dynamic & Beautiful Profile Quick Card */}
      {showProfile && (
        <View style={[styles.profileDropdownCard, { position: 'absolute', top: 90, left: 0, right: 0, zIndex: 100, elevation: 10 }]}>
          <View style={styles.profileHeaderSection}>
            <View style={styles.largeAvatar}>
              <Text style={styles.largeAvatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || 'V'}
              </Text>
            </View>
            <View style={styles.profileMeta}>
              <Text style={styles.profileMetaName}>{user?.name || 'Villager Name'}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>Verified Citizen</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileDivider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Ionicons name="phone-portrait-outline" size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{user?.phone || '+91 XXXXX XXXXX'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="home-outline" size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>Village ID:</Text>
              <Text style={styles.infoValue}>{user?.villageId || 'VIL-2026'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={styles.logoutText}>Logout Securely</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
        }
      >
        <View style={styles.content}>
        {/* Summary Card Cards */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <View style={[styles.miniIconBg, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="wallet-outline" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.summaryNumber}>0</Text>
            <Text style={styles.summaryLabel}>Pending Taxes</Text>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.summaryItem}>
            <View style={[styles.miniIconBg, { backgroundColor: '#FFE4E6' }]}>
              <Ionicons name="alert-circle-outline" size={20} color="#E11D48" />
            </View>
            <Text style={styles.summaryNumber}>1</Text>
            <Text style={styles.summaryLabel}>Complaints</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Services & Actions</Text>
        <View style={styles.grid}>
          {quickActions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={() => router.push(item.route)}
            >
              <View style={[styles.iconWrapper, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={26} color={item.iconColor} />
              </View>
              <Text style={styles.actionText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Schemes Section */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Government Schemes</Text>
          <TouchableOpacity onPress={() => router.push('/(villager)/schemes')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {loadingSchemes ? (
          <ActivityIndicator color="#4F46E5" style={{ marginVertical: 20 }} />
        ) : (
          schemes.map((scheme, index) => (
            <TouchableOpacity
              key={index}
              style={styles.schemeCard}
              onPress={() => router.push('/(villager)/schemes')}
            >
              <View style={styles.schemeLeft}>
                <Ionicons name="ribbon" size={22} color="#10B981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.schemeTitle} numberOfLines={1}>
                  {scheme.scheme_name}
                </Text>
                <Text style={styles.schemeStatus}>{scheme.status || 'Active'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))
        )}

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity Updates</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <Ionicons name="checkmark-circle" size={22} color="#10B981" />
            <View style={styles.activityText}>
              <Text style={styles.activityTitle}>Tax Payment Successful</Text>
              <Text style={styles.activityTime}>2 days ago</Text>
            </View>
          </View>

          <View style={styles.activityDivider} />

          <View style={styles.activityItem}>
            <Ionicons name="time" size={22} color="#F59E0B" />
            <View style={styles.activityText}>
              <Text style={styles.activityTitle}>Birth Certificate Under Review</Text>
              <Text style={styles.activityTime}>5 days ago</Text>
            </View>
          </View>
        </View>
        </View>
      </ScrollView>

      {/* Notifications Modal */}
      <Modal visible={showNotifications} animationType="slide" transparent={true} onRequestClose={() => setShowNotifications(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Ionicons name="close" size={28} color="#4B5563" />
              </TouchableOpacity>
            </View>

            {loadingNotifications ? (
              <ActivityIndicator size="large" color="#4F46E5" style={{ marginVertical: 30 }} />
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={(item) => (item.notification_id || item.id || Math.random()).toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                  <View style={{ alignItems: 'center', marginVertical: 40 }}>
                    <Ionicons name="notifications-off-outline" size={50} color="#CBD5E1" />
                    <Text style={{ color: '#9CA3AF', marginTop: 15 }}>No new notifications.</Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <View style={styles.notificationItem}>
                    <View style={styles.notificationIcon}>
                      <Ionicons name="notifications" size={20} color="#4F46E5" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.notificationMessage}>{item.message}</Text>
                      <Text style={styles.notificationTime}>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}</Text>
                    </View>
                  </View>
                )}
              />
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FAF5F5', // Light warm tint matching the screenshot
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
  /* Profile Dropdown Styling */
  profileDropdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  profileHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  largeAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  profileMeta: {
    marginLeft: 15,
  },
  profileMetaName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
  },
  roleText: {
    color: '#065F46',
    fontSize: 11,
    fontWeight: '700',
  },
  profileDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    verticalMargin: 15,
    marginVertical: 15,
  },
  infoGrid: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 6,
    width: 75,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    marginTop: 15,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    marginLeft: 6,
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 18,
    marginBottom: 25,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  miniIconBg: {
    padding: 8,
    borderRadius: 12,
    marginBottom: 6,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  summaryLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#F1F5F9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 14,
    marginTop: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontWeight: '600',
    color: '#334155',
    fontSize: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  seeAll: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 13,
  },
  schemeCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  schemeLeft: {
    marginRight: 14,
    backgroundColor: '#E6F4EA',
    padding: 8,
    borderRadius: 12,
  },
  schemeTitle: {
    fontWeight: '700',
    color: '#1E293B',
    fontSize: 14,
  },
  schemeStatus: {
    color: '#10B981',
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 35,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  activityText: {
    marginLeft: 14,
  },
  activityTitle: {
    fontWeight: '600',
    color: '#334155',
    fontSize: 14,
  },
  activityTime: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
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
    maxHeight: '80%',
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
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    backgroundColor: '#EEF2FF',
    padding: 10,
    borderRadius: 12,
    marginRight: 15,
  },
  notificationMessage: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});