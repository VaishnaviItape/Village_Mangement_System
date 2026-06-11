import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { registerUser } from '../../api/authService';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    setLoading(true);
    try {
      await registerUser({ 
        full_name: name, 
        email: email, 
        username: phone, 
        password: password,
        role: 'villager'
      });
      Alert.alert('Success', 'Registration successful. Please login.');
      router.replace('/auth/login');
    } catch (error) {
      Alert.alert('Registration Failed', error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the Village Management System</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Full Name"
            iconName="person-outline"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />
          
          <CustomInput
            label="Email"
            iconName="mail-outline"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            label="Phone Number"
            iconName="call-outline"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <CustomInput
            label="Password"
            iconName="lock-closed-outline"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            password
          />

          <CustomButton 
            title="Register" 
            onPress={handleRegister} 
            isLoading={loading}
            style={{ marginTop: 20 }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Text style={styles.loginText} onPress={() => router.push('/auth/login')}>
              Login
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  form: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: Colors.textLight,
  },
  loginText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
