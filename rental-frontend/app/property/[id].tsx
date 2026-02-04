import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Linking // 👈 Needed for Phone Calls
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ 1. Updated Interface to match your Database
interface Property {
  id: number;
  name: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  floor_area?: string;   // 👈 Added
  phone_number?: string; // 👈 Added
  description: string;
  image_url?: string;    // 👈 Changed to image_url
}

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [house, setHouse] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  // ⚠️ Use your IP Address here!
  const API_URL = 'http://10.0.2.2:8000/api/properties';
  const BOOKING_URL = 'http://10.0.2.2:8000/api/bookings';
  const STORAGE_URL = 'http://10.0.2.2:8000/storage/';

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setHouse(response.data);
    } catch (err) {
      console.log("Error fetching details:", err);
      Alert.alert("Error", "Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  // 📞 Function to Call Owner
  const handleCall = () => {
    if (house?.phone_number) {
      Linking.openURL(`tel:${house.phone_number}`);
    } else {
      Alert.alert("Info", "No phone number provided for this property.");
    }
  };

  // 📅 Function to Book
  const handleBookNow = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Login Required', 'You must be logged in to book.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/profile') } // Adjusted route
        ]);
        return;
      }

      await axios.post(
        BOOKING_URL,
        { property_id: house?.id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Success', 'Booking request sent!');
    } catch (error) {
      console.log('Booking Error:', error);
      Alert.alert('Error', 'Failed to book. You might have already booked it.');
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#007AFF" style={styles.center} />;
  if (!house) return <Text style={styles.center}>Property not found</Text>;

  // 🖼️ Fixed Image Logic
  let imageUrl = { uri: 'https://via.placeholder.com/400x300' };
  if (house.image_url) {
    imageUrl = house.image_url.startsWith('http') 
      ? { uri: house.image_url } 
      : { uri: `${STORAGE_URL}${house.image_url}` };
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Image */}
        <Image source={imageUrl} style={styles.image} />

        {/* Details Container */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{house.name}</Text>
          <Text style={styles.price}>${house.price} <Text style={{fontSize:16, color:'#666'}}>/ month</Text></Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.location}>{house.location}</Text>
          </View>

          {/* ✨ Features Row (Added Area) */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Ionicons name="bed-outline" size={24} color="#007AFF" />
              <Text style={styles.featureText}>{house.bedrooms || 0} Beds</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="water-outline" size={24} color="#007AFF" />
              <Text style={styles.featureText}>{house.bathrooms || 0} Baths</Text>
            </View>
            {/* 👇 Added Floor Area */}
            <View style={styles.featureItem}>
              <Ionicons name="expand-outline" size={24} color="#007AFF" />
              <Text style={styles.featureText}>{house.floor_area || 0} m²</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{house.description}</Text>
        </View>
      </ScrollView>

      {/* 👇 Dual Buttons: Call & Book */}
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.btn, styles.callBtn]} onPress={handleCall}>
           <Ionicons name="call-outline" size={20} color="#007AFF" />
           <Text style={styles.callBtnText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.btn, styles.bookBtn]} onPress={handleBookNow}>
           <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 100 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, backgroundColor: 'white', padding: 8, borderRadius: 20, elevation: 5 },
  image: { width: '100%', height: 300, resizeMode: 'cover' },
  detailsContainer: { padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  price: { fontSize: 22, fontWeight: '600', color: '#007AFF', marginBottom: 15 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  location: { fontSize: 16, color: '#666', marginLeft: 5 },
  
  // Features Row
  featuresRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, paddingVertical: 15, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee' },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  featureText: { fontSize: 14, fontWeight: '500', color: '#333' },
  
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  description: { fontSize: 16, lineHeight: 24, color: '#444' },
  
  // Footer with Two Buttons
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#eee', flexDirection: 'row', gap: 15 },
  btn: { flex: 1, paddingVertical: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  
  // Call Button (Outline)
  callBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#007AFF' },
  callBtnText: { color: '#007AFF', fontSize: 18, fontWeight: 'bold' },
  
  // Book Button (Filled)
  bookBtn: { backgroundColor: '#007AFF' },
  bookBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});