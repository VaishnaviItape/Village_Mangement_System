import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import Colors from '../../constants/Colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import apiClient from '../../api/client';

export default function UtilityRequests() {
  const [requestType, setRequestType] = useState('Water Connection');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [assetId, setAssetId] = useState('');
  const [document, setDocument] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [infrastructure, setInfrastructure] = useState([]);

  useEffect(() => {
    fetchHistory();
    fetchInfrastructure();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get('/utility/my');
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching utility history:', error);
    } finally {
      setFetchingHistory(false);
    }
  };

  const fetchInfrastructure = async () => {
    try {
      const res = await apiClient.get('/infrastructure');
      if (res.data.success) {
        setInfrastructure(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching infrastructure:', error);
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setDocument(result.assets[0]);
      }
    } catch (err) {
      console.log('Document picking error', err);
    }
  };

  const handleSubmit = async () => {
    if (!location) {
      Alert.alert('Error', 'Please provide a location.');
      return;
    }
    if (requestType === 'Repair Request' && !assetId) {
      Alert.alert('Error', 'Please select an infrastructure asset for the repair.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('request_type', requestType);
      formData.append('description', description);
      formData.append('location', location);
      if (requestType === 'Repair Request') {
        formData.append('asset_id', assetId);
      }
      
      if (document) {
        formData.append('document', {
          uri: document.uri,
          name: document.name,
          type: document.mimeType || 'application/octet-stream',
        });
      }

      const res = await apiClient.post('/utility', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        Alert.alert('Success', res.data.message);
        setDescription('');
        setLocation('');
        setAssetId('');
        setDocument(null);
        fetchHistory();
      }
    } catch (error) {
      console.log('Submit error:', error);
      Alert.alert('Error', 'Failed to submit utility request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.cardTitle}>New Request</Text>
        
        <Text style={styles.label}>Request Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={requestType}
            onValueChange={(itemValue) => setRequestType(itemValue)}
          >
            <Picker.Item label="Water Connection (Nal)" value="Water Connection" />
            <Picker.Item label="Building Construction NOC" value="Building NOC" />
            <Picker.Item label="Infrastructure Repair" value="Repair Request" />
          </Picker>
        </View>

        {requestType === 'Repair Request' && (
          <>
            <Text style={styles.label}>Select Asset to Repair</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={assetId}
                onValueChange={(itemValue) => setAssetId(itemValue)}
              >
                <Picker.Item label="-- Select Asset --" value="" />
                {infrastructure.map((item) => (
                  <Picker.Item key={item.asset_id} label={`${item.asset_name} (${item.asset_type})`} value={item.asset_id} />
                ))}
              </Picker>
            </View>
          </>
        )}

        <CustomInput
          placeholder="Location / Address"
          value={location}
          onChangeText={setLocation}
          icon="location-outline"
        />
        
        <CustomInput
          placeholder="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          icon="document-text-outline"
        />

        <CustomButton
          title={document ? `Selected: ${document.name}` : "Upload Building Plan / Photo"}
          onPress={handleDocumentPick}
          type="outline"
          style={styles.uploadBtn}
        />

        <CustomButton
          title={loading ? "Submitting..." : "Submit Request"}
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.cardTitle}>My Requests</Text>
        {fetchingHistory ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : history.length > 0 ? (
          history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyInfo}>
                <Text style={styles.historyType}>{item.request_type}</Text>
                <Text style={styles.historyLoc}>{item.location}</Text>
                {item.asset_name && <Text style={styles.historyAsset}>Asset: {item.asset_name}</Text>}
              </View>
              <View style={[
                styles.statusBadge, 
                item.status === 'Approved' ? styles.statusApproved : 
                item.status === 'Rejected' ? styles.statusRejected : styles.statusPending
              ]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No utility requests submitted yet.</Text>
        )}
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
  formCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  historyCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
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
  },
  label: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 5,
    marginLeft: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#FAFAFA',
  },
  uploadBtn: {
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  historyInfo: {
    flex: 1,
    paddingRight: 10,
  },
  historyType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  historyLoc: {
    fontSize: 14,
    color: Colors.textLight,
  },
  historyAsset: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#FFF3CD',
  },
  statusApproved: {
    backgroundColor: '#D4EDDA',
  },
  statusRejected: {
    backgroundColor: '#F8D7DA',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text,
  },
  noData: {
    color: Colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  }
});
