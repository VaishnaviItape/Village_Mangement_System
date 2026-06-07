import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { loginUser } from '../../api/authService';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      // Assuming loginUser expects { email, password }
      const response = await loginUser({ email, password });
      
      if (response && response.token) {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        
        // Route based on role
        if (response.user.role === 'admin') {
          router.replace('/(tabs)/admin/dashboard');
        } else {
          router.replace('/(tabs)/villager/dashboard');
        }
      } else {
        Alert.alert('Error', 'Invalid login response');
      }
    } catch (error) {
      Alert.alert('Login Failed', error?.message || 'Something went wrong');
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to Village Management System</Text>
        </View>

        <View style={styles.form}>
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
            label="Password"
            iconName="lock-closed-outline"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            password
          />

          <Text style={styles.forgotPassword} onPress={() => router.push('/auth/forgotPassword')}>
            Forgot Password?
          </Text>

          <CustomButton 
            title="Login" 
            onPress={handleLogin} 
            isLoading={loading}
            style={{ marginTop: 20 }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Text style={styles.registerText} onPress={() => router.push('/auth/register')}>
              Register
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
  forgotPassword: {
    color: Colors.secondary,
    alignSelf: 'flex-end',
    marginBottom: 20,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: Colors.textLight,
  },
  registerText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
