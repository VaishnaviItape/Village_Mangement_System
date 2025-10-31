// app/system-details/page.js
import Constants from 'expo-constants';
import { StyleSheet, Text, View } from 'react-native';

export default function SystemDetails() {
  const apiUrl = Constants.expoConfig.extra.apiUrl;
  const appVersion = Constants.expoConfig.version;
  const buildNumber = Constants.expoConfig.ios.buildNumber;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>System Details</Text>
      <Text style={styles.label}>API URL:</Text>
      <Text style={styles.value}>{apiUrl}</Text>
      <Text style={styles.label}>App Version:</Text>
      <Text style={styles.value}>{appVersion}</Text>
      <Text style={styles.label}>Build Number:</Text>
      <Text style={styles.value}>{buildNumber}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  value: { fontSize: 16, color: '#333', marginTop: 2 }
});
