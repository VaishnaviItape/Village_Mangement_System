import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '../../api/client';

export default function SchemeApplicationScreen() {
  const router = useRouter();
  const { scheme_id, scheme_name } = useLocalSearchParams();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [aadhaarDoc, setAadhaarDoc] = useState('');
  const [incomeDoc, setIncomeDoc] = useState('');

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

  const handleMockUpload = (setter, docName) => {
    // Simulating file upload
    Alert.alert('Upload Document', `Select a PDF/Image for ${docName}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Select Mock File', onPress: () => setter(`${docName.replace(/\s+/g, '_').toLowerCase()}_mock.pdf`) }
    ]);
  };

  const handleSubmit = async () => {
    if (!aadhaarDoc || !incomeDoc) {
      Alert.alert('Error', 'Please upload all required documents.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: user.id,
        scheme_id: scheme_id,
        eligibility_score: 100, // Dummy score
        documents: {
          aadhaar: aadhaarDoc,
          income: incomeDoc
        }
      };

      const res = await apiClient.post('/scheme-applications', payload);
      
      if (res.data && res.data.success) {
        Alert.alert('Success', 'Your application has been submitted successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', res.data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.log('Error submitting application', error);
      Alert.alert('Error', 'An error occurred while submitting your application.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <ActivityIndicator size="large" color="#4F46E5" style={{ flex: 1, justifyContent: 'center' }} />;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply for Scheme</Text>
        <Text style={styles.schemeName}>{scheme_name}</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* User Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Applicant Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name</Text>
            <Text style={styles.detailValue}>{user.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mobile</Text>
            <Text style={styles.detailValue}>{user.phone || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{user.email || 'N/A'}</Text>
          </View>
          <Text style={styles.infoText}>* These details are auto-fetched from your profile.</Text>
        </View>

        {/* Documents Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          
          <View style={styles.docUploadBox}>
            <View style={styles.docHeader}>
              <Ionicons name="document-text" size={24} color="#4F46E5" />
              <Text style={styles.docTitle}>Aadhaar Card</Text>
            </View>
            {aadhaarDoc ? (
              <View style={styles.docSuccess}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.docSuccessText}>{aadhaarDoc}</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadBtn} onPress={() => handleMockUpload(setAadhaarDoc, 'Aadhaar Card')}>
                <Text style={styles.uploadBtnText}>Upload PDF/Image</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.docUploadBox}>
            <View style={styles.docHeader}>
              <Ionicons name="document-text" size={24} color="#4F46E5" />
              <Text style={styles.docTitle}>Income Certificate</Text>
            </View>
            {incomeDoc ? (
              <View style={styles.docSuccess}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.docSuccessText}>{incomeDoc}</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.uploadBtn} onPress={() => handleMockUpload(setIncomeDoc, 'Income Certificate')}>
                <Text style={styles.uploadBtnText}>Upload PDF/Image</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Application</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: {
    marginBottom: 10,
  },
  headerTitle: {
    color: '#E0E7FF',
    fontSize: 16,
    fontWeight: '500',
  },
  schemeName: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 10,
  },
  docUploadBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#F9FAFB',
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 10,
  },
  uploadBtn: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
  },
  uploadBtnText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  docSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
  },
  docSuccessText: {
    color: '#059669',
    marginLeft: 8,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
