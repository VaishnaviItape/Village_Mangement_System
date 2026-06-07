import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../../../components/CustomButton';
import Colors from '../../../constants/Colors';

export default function ReportsMenu() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports Dashboard</Text>
      <Text style={styles.subtitle}>Select a report to view detailed metrics.</Text>

      <CustomButton 
        title="Tax Collection Report" 
        onPress={() => router.push('/(admin)/reports/taxes')} 
        style={styles.btn}
      />
      <CustomButton 
        title="Complaints Report" 
        onPress={() => router.push('/(admin)/reports/complaints')} 
        type="secondary"
        style={styles.btn}
      />
      <CustomButton 
        title="User Demographics Report" 
        onPress={() => router.push('/(admin)/reports/users')} 
        type="outline"
        style={styles.btn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 40,
    textAlign: 'center',
  },
  btn: {
    marginBottom: 15,
  }
});
