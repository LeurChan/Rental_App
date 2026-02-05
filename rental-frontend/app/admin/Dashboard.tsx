import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView, 
  RefreshControl,
  Alert
} from 'react-native';
import { useRouter, useFocusEffect, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:8000/api/admin/stats'; 

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    users: 0, 
    properties: 0, 
    bookings: 0 
  });

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error: any) {
      console.log('Error fetching stats:', error);
      Alert.alert("Error", "Failed to load stats.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4c86f9" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* --- 👇 UPDATED HEADER WITH CENTERED TITLE --- */}
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Dashboard</Text>
        
        {/* Empty View to keep Dashboard centered */}
        <View style={{ width: 45 }} /> 
      </View>

      <ScrollView 
        style={styles.container} 
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchStats} />}
      >
        <View style={styles.content}>
          {/* Stats Cards */}
          <View style={[styles.card, styles.cardBlue]}>
            <View>
              <Text style={styles.cardValue}>{stats.users}</Text>
              <Text style={styles.cardLabel}>Total Customers</Text>
            </View>
            <Ionicons name="people" size={40} color="rgba(255,255,255,0.3)" />
          </View>

          <View style={[styles.card, styles.cardGreen]}>
            <View>
              <Text style={styles.cardValue}>{stats.properties}</Text>
              <Text style={styles.cardLabel}>Total Posts</Text>
            </View>
            <Ionicons name="home" size={40} color="rgba(255,255,255,0.3)" />
          </View>

          <View style={[styles.card, styles.cardPurple]}>
            <View>
              <Text style={styles.cardValue}>{stats.bookings}</Text>
              <Text style={styles.cardLabel}>Total Rents</Text>
            </View>
            <Ionicons name="calendar" size={40} color="rgba(255,255,255,0.3)" />
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/admin/add-property')}>
            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="add-circle" size={24} color="#2196F3" />
            </View>
            <Text style={styles.actionText}>Add New Property</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/admin/booking')}>
            <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="checkmark-done-circle" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.actionText}>Approve Bookings</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // --- 👇 NEW HEADER STYLES ---
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#f8f9fa',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  backBtn: { 
    backgroundColor: '#fff', 
    width: 45, 
    height: 45, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },

  content: { padding: 20, paddingTop: 10 }, 
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 4 },
  cardValue: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  cardLabel: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 5 },
  cardBlue: { backgroundColor: '#4c86f9' },   
  cardGreen: { backgroundColor: '#5fc265' },  
  cardPurple: { backgroundColor: '#8e24aa' }, 
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10, marginBottom: 15 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 12, elevation: 2 },
  iconBox: { width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  actionText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
});