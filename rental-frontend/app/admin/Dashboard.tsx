import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ total_users: 0, total_properties: 0, total_bookings: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // ⚠️ Use 10.0.2.2 for Android Emulator
      const response = await axios.get('http://10.0.2.2:8000/api/admin/stats', {
         headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.log("Error fetching stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
           <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.card, { backgroundColor: '#4c6ef5' }]}>
            <View>
                <Text style={styles.cardNumber}>{stats.total_users}</Text>
                <Text style={styles.cardLabel}>Total Customers</Text>
            </View>
            <Ionicons name="people" size={40} color="rgba(255,255,255,0.3)" />
        </View>

        <View style={[styles.card, { backgroundColor: '#4caf50' }]}>
            <View>
                <Text style={styles.cardNumber}>{stats.total_properties}</Text>
                <Text style={styles.cardLabel}>Total Posts</Text>
            </View>
            <Ionicons name="home" size={40} color="rgba(255,255,255,0.3)" />
        </View>

        <View style={[styles.card, { backgroundColor: '#7b1fa2' }]}>
            <View>
                <Text style={styles.cardNumber}>{stats.total_bookings}</Text>
                <Text style={styles.cardLabel}>Total Rents</Text>
            </View>
            <Ionicons name="calendar" size={40} color="rgba(255,255,255,0.3)" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <TouchableOpacity 
        style={styles.actionBtn} 
        onPress={() => router.push('/admin/add-property' as any)}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[styles.iconBox, {backgroundColor: '#e3f2fd'}]}>
                <Ionicons name="add-circle" size={24} color="#1a237e" />
            </View>
            <Text style={styles.actionText}>Add New Property</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[styles.iconBox, {backgroundColor: '#ffebee'}]}>
                <Ionicons name="settings" size={24} color="#d32f2f" />
            </View>
            <Text style={styles.actionText}>Settings</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginLeft: 10, color: '#333' },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { 
      width: '100%', 
      height: 110, 
      borderRadius: 15, 
      padding: 20, 
      marginBottom: 15, 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2
  },
  cardNumber: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  cardLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600', marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 15, color: '#333' },
  actionBtn: { 
      backgroundColor: 'white', 
      padding: 15, 
      borderRadius: 12, 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      marginBottom: 10,
      elevation: 2
  },
  iconBox: { width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  actionText: { fontSize: 16, fontWeight: '600', color: '#333' }
});