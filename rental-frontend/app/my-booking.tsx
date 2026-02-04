import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity, ListRenderItem } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect, Stack } from 'expo-router'; // 👈 1. Added Stack import
import { Ionicons } from '@expo/vector-icons';

// --- CONFIGURATION ---
const STORAGE_URL = 'http://10.0.2.2:8000/storage/';

// 1. Define Types
interface Property {
  name: string;
  price: number;
  image_url?: string; // 👈 Updated to match your new backend
  location?: string;
}

interface Booking {
  id: number;
  status: string;
  created_at: string;
  property: Property;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      const response = await axios.get('http://10.0.2.2:8000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.log('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBooking: ListRenderItem<Booking> = ({ item }) => {
    // 👇 Improved Image Logic (Handles both URL types)
    let imageUrl = { uri: 'https://via.placeholder.com/150' };
    
    if (item.property?.image_url) {
        if (item.property.image_url.startsWith('http')) {
            imageUrl = { uri: item.property.image_url };
        } else {
            imageUrl = { uri: `${STORAGE_URL}${item.property.image_url}` };
        }
    }

    return (
      <View style={styles.card}>
        <Image source={imageUrl} style={styles.image} />
        
        <View style={styles.details}>
          <Text style={styles.houseName}>{item.property?.name || 'Unknown Property'}</Text>
          <Text style={styles.price}>${item.property?.price}/month</Text>
          
          <View style={[styles.statusBadge, item.status === 'confirmed' ? styles.statusGreen : styles.statusOrange]}>
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>

          <Text style={styles.date}>Booked on: {new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 👇 2. THIS REMOVES THE TOP BAR */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
      ) : bookings.length === 0 ? (
        <Text style={styles.emptyText}>You haven't booked any houses yet.</Text>
      ) : (
        <FlatList 
          data={bookings} 
          keyExtractor={(item) => item.id.toString()} 
          renderItem={renderBooking} 
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { 
    flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#fff', elevation: 2 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  card: { 
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, padding: 10, elevation: 3 
  },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 15 },
  details: { flex: 1, justifyContent: 'center' },
  houseName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  price: { fontSize: 14, color: '#007AFF', marginBottom: 4 },
  date: { fontSize: 12, color: '#888', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 2 },
  statusGreen: { backgroundColor: '#d4edda' },
  statusOrange: { backgroundColor: '#fff3cd' },
  statusText: { fontSize: 10, fontWeight: 'bold', color: '#333' }
});