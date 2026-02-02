import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:8000/api/user'; // Ensure this route exists in Laravel

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const token = await AsyncStorage.getItem('token');
    
    // Check if token exists
    if (!token) {
      console.log("No token found");
      router.replace('/login');
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error: any) {
      // 🔍 LOG THE EXACT ERROR HERE
      if (error.response) {
        // The server responded with a status code (e.g., 401, 404, 500)
        console.error("Server Error:", error.response.status, error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Network Error: No response received");
      } else {
        console.error("Error Message:", error.message);
      }
      
      // If unauthorized, force logout
      if (error.response && error.response.status === 401) {
          await AsyncStorage.removeItem('token');
          router.replace('/login');
      }
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.replace('/login');
  };

  if (!user) return <ActivityIndicator size="large" color="#3F51B5" style={{flex:1}} />;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Welcome, {user.first_name}!</Text>
      <Text style={styles.email}>{user.email}</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  email: { fontSize: 16, color: '#666', marginBottom: 30 },
  logoutBtn: { backgroundColor: '#FF5A5F', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  logoutText: { color: 'white', fontWeight: 'bold' }
});