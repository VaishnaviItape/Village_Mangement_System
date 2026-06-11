import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Colors from '../../constants/Colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import apiClient from '../../api/client';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AgricultureLand() {
  const [surveyNo, setSurveyNo] = useState('');
  const [landArea, setLandArea] = useState('');
  const [cropType, setCropType] = useState('');
  const [document, setDocument] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get('/sv/land/my');
      if (res.data.success) setHistory(res.data.data);
    } catch (e) { console.log(e); } finally { setFetchingHistory(false); }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
      if (!result.canceled && result.assets) setDocument(result.assets[0]);
    } catch (err) { console.log(err); }
  };

  const handleSubmit = async () => {
    if (!surveyNo || !landArea || !cropType) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('survey_number', surveyNo);
      formData.append('land_area', landArea);
      formData.append('crop_type', cropType);
      
      if (document) {
        formData.append('document', {
          uri: document.uri, name: document.name, type: document.mimeType || 'application/octet-stream',
        });
      }

      const res = await apiClient.post('/sv/land', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success) {
        Alert.alert('Success', res.data.message);
        setSurveyNo(''); setLandArea(''); setCropType(''); setDocument(null);
        fetchHistory();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to register land');
    } finally { setLoading(false); }
  };

  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Agriculture & Land</Text>
          <Text style={styles.headerSubtitle}>Register your land and crop details.</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Register Land & Crops</Text>
        
        <CustomInput placeholder="Survey No / Gut No" value={surveyNo} onChangeText={setSurveyNo} icon="map-outline" />
        <CustomInput placeholder="Land Area (e.g. 2 Acres)" value={landArea} onChangeText={setLandArea} icon="expand-outline" />
        <CustomInput placeholder="Crop Type (e.g. Wheat, Sugarcane)" value={cropType} onChangeText={setCropType} icon="leaf-outline" />

        <CustomButton title={document ? `Selected: ${document.name}` : "Upload 7/12 Extract"} onPress={handleDocumentPick} type="outline" style={styles.uploadBtn} />
        <CustomButton title={loading ? "Submitting..." : "Register Land"} onPress={handleSubmit} disabled={loading} />
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.cardTitle}>My Land Records</Text>
        {fetchingHistory ? <ActivityIndicator size="small" color={Colors.primary} /> : history.length > 0 ? (
          history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View>
                <Text style={styles.historyType}>Survey: {item.survey_number}</Text>
                <Text style={styles.historyName}>{item.crop_type} ({item.land_area})</Text>
              </View>
              <View style={[styles.statusBadge, item.status === 'Approved' ? styles.statusApproved : item.status === 'Rejected' ? styles.statusRejected : styles.statusPending]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          ))
        ) : <Text style={styles.noData}>No land registered.</Text>}
      </View>
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
  formCard: { backgroundColor: Colors.white, padding: 20, borderRadius: 12, marginBottom: 20, elevation: 2 },
  historyCard: { backgroundColor: Colors.white, padding: 20, borderRadius: 12, marginBottom: 30, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 15 },
  uploadBtn: { marginBottom: 20 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  historyType: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  historyName: { fontSize: 14, color: Colors.textLight },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  statusPending: { backgroundColor: '#FFF3CD' },
  statusApproved: { backgroundColor: '#D4EDDA' },
  statusRejected: { backgroundColor: '#F8D7DA' },
  statusText: { fontSize: 12, fontWeight: 'bold', color: Colors.text },
  noData: { color: Colors.textLight, fontStyle: 'italic', textAlign: 'center', marginTop: 10 }
});
