import React, { useState, useCallback } from 'react'; // 👈 Added useCallback
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter, useFocusEffect } from 'expo-router'; // 👈 Added useFocusEffect
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://10.0.2.2:8000/api/user';

  // ✅ THIS RUNS EVERY TIME YOU VIEW THE SCREEN
  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );

  const getUser = async () => {
    try {
      setLoading(true); // Show loading spinner while checking
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);
    } catch (error) {
      console.log("Error fetching profile:", error);
      // If token is invalid, clear it
      await AsyncStorage.removeItem('userToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUser(null); // Clear user state immediately
      Alert.alert('Logged Out', 'You have been logged out successfully.');
      router.replace('/(tabs)'); 
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // 1. NOT LOGGED IN VIEW
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="person-circle-outline" size={100} color="#ccc" />
          <Text style={styles.notLoggedInText}>You are not logged in.</Text>
          
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginButtonText}>Login / Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 2. LOGGED IN VIEW
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://ui-avatars.com/api/?name=' + user.first_name + '+' + user.last_name + '&background=0D8ABC&color=fff' }} 
          style={styles.avatar} 
        />
        <Text style={styles.name}>{user.first_name} {user.last_name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.body}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => router.push('/my-booking')}
        >
          <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
          <Text style={styles.menuText}>View My Bookings</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { backgroundColor: '#fff', padding: 30, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 16, color: '#666', marginTop: 5 },
  body: { padding: 20, marginTop: 10 },
  notLoggedInText: { fontSize: 18, color: '#666', marginVertical: 20 },
  loginButton: { backgroundColor: '#007AFF', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  menuButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, elevation: 2, marginBottom: 10 },
  menuText: { fontSize: 16, fontWeight: '600', marginLeft: 15, color: '#333' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF3B30', padding: 15, borderRadius: 12 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});