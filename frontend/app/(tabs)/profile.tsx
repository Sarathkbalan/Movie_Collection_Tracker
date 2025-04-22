import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import styles from '../../assets/styles/profile.styles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen(): JSX.Element {
  const [profile, setProfile] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://192.168.153.101:3000/users/profile', {
          credentials: 'include', // Important for cookie-based auth
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          const error = await res.json();
          Alert.alert('Error', error.message || 'Could not fetch profile');
        }
      } catch (error) {
        console.error('Fetch profile error:', error);
        Alert.alert('Error', 'Network error while fetching profile');
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://192.168.179.101:3000/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        router.replace('/(auth)');
      } else {
        const errorData = await response.json();
        Alert.alert('Logout Failed', errorData.message || 'Please try again later.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Network error during logout.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {profile && (
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
        </View>
      </View>
    )}


        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
