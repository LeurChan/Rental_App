import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// ⚠️ CHANGE THIS TO MATCH YOUR ROUTE TOO!
const API_URL = 'http://10.0.2.2:8000/api/properties';
const STORAGE_URL = 'http://10.0.2.2:8000/storage/';

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [house, setHouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
  try {
    // 2. This will now correctly call: http://10.0.2.2:8000/api/properties/1
    const response = await axios.get(`${API_URL}/${id}`);
    setHouse(response.data);
  } catch (error) {
    console.error("Error fetching details:", error);
  } finally {
    setLoading(false);
  }
};

  if (loading) return <ActivityIndicator size="large" color="#3F51B5" style={styles.center} />;
  
  if (!house) return (
    <View style={styles.center}>
      <Text>Property not found</Text>
      <TouchableOpacity onPress={() => router.back()} style={{marginTop: 20}}>
         <Text style={{color: 'blue'}}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView>
        <Image 
          source={house.image_path ? { uri: `${STORAGE_URL}${house.image_path}` } : { uri: 'https://via.placeholder.com/400' }} 
          style={styles.image} 
        />
        <View style={styles.content}>
          <Text style={styles.title}>{house.name}</Text>
          <Text style={styles.price}>${house.price} <Text style={{fontSize: 14, color: '#666'}}>/ month</Text></Text>
          <Text style={styles.location}>📍 {house.location || "Phnom Penh"}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{house.description || "No description provided."}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10, backgroundColor: 'white', padding: 8, borderRadius: 20, elevation: 5 },
  image: { width: '100%', height: 300 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5, color: '#1A1A1A' },
  price: { fontSize: 22, color: '#3F51B5', fontWeight: 'bold', marginBottom: 10 },
  location: { fontSize: 16, color: '#666', marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 14, color: '#444', lineHeight: 22 },
});