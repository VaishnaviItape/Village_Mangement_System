import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import Colors from '../../constants/Colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import apiClient from '../../api/client';

export default function CivicRegistrations() {
  const [type, setType] = useState('Birth');
  const [applicantName, setApplicantName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get('/civic/my');
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching civic history:', error);
    } finally {
      setFetchingHistory(false);
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
    if (!applicantName || !eventDate || !location) {
      Alert.alert('Error', 'Please fill all required fields (Name, Date, Location)');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('applicant_name', applicantName);
      formData.append('event_date', eventDate); // expecting YYYY-MM-DD
      formData.append('location', location);
      
      if (document) {
        formData.append('document', {
          uri: document.uri,
          name: document.name,
          type: document.mimeType || 'application/octet-stream',
        });
      }

      const res = await apiClient.post('/civic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        Alert.alert('Success', res.data.message);
        // Reset form
        setApplicantName('');
        setEventDate('');
        setLocation('');
        setDocument(null);
        fetchHistory(); // Refresh list
      }
    } catch (error) {
      console.log('Submit error:', error);
      Alert.alert('Error', 'Failed to submit registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formCard}>
        <Text style={styles.cardTitle}>New Civic Registration</Text>
        
        <Text style={styles.label}>Registration Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={type}
            onValueChange={(itemValue) => setType(itemValue)}
          >
            <Picker.Item label="Birth Registration" value="Birth" />
            <Picker.Item label="Death Registration" value="Death" />
            <Picker.Item label="Marriage Registration" value="Marriage" />
          </Picker>
        </View>

        <CustomInput
          placeholder="Name of Applicant / Subject"
          value={applicantName}
          onChangeText={setApplicantName}
          icon="person-outline"
        />
        
        <CustomInput
          placeholder="Event Date (YYYY-MM-DD)"
          value={eventDate}
          onChangeText={setEventDate}
          icon="calendar-outline"
        />

        <CustomInput
          placeholder="Location (e.g., Hospital, Temple)"
          value={location}
          onChangeText={setLocation}
          icon="location-outline"
        />

        <CustomButton
          title={document ? `Selected: ${document.name}` : "Upload Supporting Document (Optional)"}
          onPress={handleDocumentPick}
          type="outline"
          style={styles.uploadBtn}
        />

        <CustomButton
          title={loading ? "Submitting..." : "Submit Application"}
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.cardTitle}>My Applications</Text>
        {fetchingHistory ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : history.length > 0 ? (
          history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View>
                <Text style={styles.historyType}>{item.type}</Text>
                <Text style={styles.historyName}>{item.applicant_name}</Text>
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
          <Text style={styles.noData}>No applications submitted yet.</Text>
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
  historyType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  historyName: {
    fontSize: 14,
    color: Colors.textLight,
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
