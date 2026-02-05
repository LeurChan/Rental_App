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
      // ⚠️ Ensure your Backend has Route::get('/admin/bookings', ...)
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
      // ⚠️ Ensure your Backend has Route::put('/bookings/{id}', ...)
      await axios.put(`${API_URL}/bookings/${id}`, 
        { status: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", `Booking ${status}!`);
      fetchBookings(); // Refresh the list
    } catch (error) {
      Alert.alert("Error", "Failed to update booking.");
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    // Image Handling
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
          
          {/* Status Badge */}
          <View style={[styles.badge, 
            item.status === 'confirmed' ? styles.bgGreen : 
            item.status === 'cancelled' ? styles.bgRed : styles.bgOrange
          ]}>
            <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Action Buttons (Only show if Pending) */}
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
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Manage Bookings', headerShadowVisible: false }} />
      
      {loading ? (
        <ActivityIndicator size="large" color="#3F51B5" style={{ marginTop: 50 }} />
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