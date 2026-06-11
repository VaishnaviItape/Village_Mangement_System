import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

export default function VillagerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'Complaints',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alert-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hardware-chip-outline" size={size} color={color} />
          ),
        }}
      />
      
      {/* Hidden Screens but still accessible via routing */}
      <Tabs.Screen name="civic" options={{ href: null, title: 'Civic Services' }} />
      <Tabs.Screen name="utilities" options={{ href: null, title: 'Utilities' }} />
      <Tabs.Screen name="business" options={{ href: null, title: 'Business' }} />
      <Tabs.Screen name="agriculture" options={{ href: null, title: 'Agriculture' }} />
      <Tabs.Screen name="panchayat" options={{ href: null, title: 'Gram Sabha' }} />
      <Tabs.Screen name="taxes" options={{ href: null, title: 'Taxes' }} />
      <Tabs.Screen name="certificates" options={{ href: null, title: 'Certificates' }} />
      <Tabs.Screen name="marketplace" options={{ href: null, title: 'Marketplace' }} />
      <Tabs.Screen name="health" options={{ href: null, title: 'Health' }} />
      <Tabs.Screen name="schemes" options={{ href: null, title: 'Govt Schemes' }} />
      <Tabs.Screen name="schemeApplication" options={{ href: null, title: 'Apply' }} />
    </Tabs>
  );
}
