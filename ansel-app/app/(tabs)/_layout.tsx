import { Tabs, router } from 'expo-router';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4A90E2', // Planımızdaki Accent rengi
      }}>
      <Tabs.Screen
        name="kalemler"
        options={{
          title: 'Kalemler',
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mesajlar"
        options={{
          title: 'Mesajlar',
          headerShown: true,
          tabBarIcon: ({ color, size }) => <Feather name="message-circle" size={size} color={color} />,
          headerRight: () => (
            <Pressable onPress={() => router.push('/kullanicilar')} style={{ marginRight: 15 }}>
              <Feather name="plus-square" size={24} color="#4A90E2" />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}