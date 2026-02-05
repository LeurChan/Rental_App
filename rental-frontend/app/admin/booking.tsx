import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// ⚠️ Use your IP (check with ipconfig)
const API_URL = 'http://10.0.2.2:8000/api'; 
const STORAGE_URL = 'http://10.0.2.2:8000/storage/';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
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
      const response = await axios.get(`${API_URL}/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.log('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put(`${API_URL}/bookings/${id}`, 
        { status: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", `Booking ${status}!`);
      fetchBookings(); 
    } catch (error) {
      Alert.alert("Error", "Failed to update booking.");
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    let imageUrl = { uri: 'https://via.placeholder.com/100' };
    if (item.property?.image_url) {
       imageUrl = item.property.image_url.startsWith('http') 
         ? { uri: item.property.image_url } 
         : { uri: `${STORAGE_URL}${item.property.image_url}` };
    }

    return (
      <View style={styles.card}>
        <Image source={imageUrl} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.propName}>{item.property?.name || 'Unknown'}</Text>
          <Text style={styles.userName}>👤 {item.user?.name || 'User'}</Text>
          <Text style={styles.price}>${item.property?.price}/mo</Text>
          <View style={[styles.badge, 
            item.status === 'confirmed' ? styles.bgGreen : 
            item.status === 'cancelled' ? styles.bgRed : styles.bgOrange
          ]}>
            <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        {item.status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => updateStatus(item.id, 'confirmed')} style={styles.btnApprove}>
               <Ionicons name="checkmark" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateStatus(item.id, 'cancelled')} style={styles.btnReject}>
               <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* --- 👇 HEADER WITH CENTERED TITLE & BACK BUTTON --- */}
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Manage Bookings</Text>
        
        {/* Empty View to keep Title centered */}
        <View style={{ width: 45 }} /> 
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4c86f9" style={{ marginTop: 50 }} />
      ) : (
        <FlatList 
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text style={{textAlign:'center', marginTop: 50}}>No bookings found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB' },
  
  // --- HEADER STYLES ---
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    borderWidth: 1,
    borderColor: '#eee'
  },

  // --- CARD STYLES ---
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, padding: 12, marginBottom: 15, elevation: 3 },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  content: { flex: 1, justifyContent: 'center' },
  propName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  userName: { fontSize: 14, color: '#666', marginTop: 2 },
  price: { fontSize: 14, color: '#3F51B5', fontWeight: 'bold', marginTop: 2 },
  
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, marginTop: 5 },
  bgGreen: { backgroundColor: '#E8F5E9' },
  bgOrange: { backgroundColor: '#FFF3E0' },
  bgRed: { backgroundColor: '#FFEBEE' },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#555' },

  actions: { justifyContent: 'space-evenly', paddingLeft: 10 },
  btnApprove: { backgroundColor: '#4CAF50', width: 35, height: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  btnReject: { backgroundColor: '#F44336', width: 35, height: 35, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
});