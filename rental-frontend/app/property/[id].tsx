import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
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
  Linking 
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- CONFIGURATION ---
const API_URL = 'http://10.0.2.2:8000/api/properties';
const BOOKING_URL = 'http://10.0.2.2:8000/api/bookings';
const STORAGE_URL = 'http://10.0.2.2:8000/storage/';

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [house, setHouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setHouse(response.data);
    } catch (err) {
      Alert.alert("Error", "Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async () => {
    try {
      setBookingLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Login Required', 'You must be logged in to book.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/auth/login') }
        ]);
        return;
      }

      await axios.post(
        BOOKING_URL,
        { property_id: house?.id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Success', 'Booking request sent!');

      // ✅ Updated: Redirect to Home screen instead of admin dashboard
      router.replace('/'); 

    } catch (error) {
      Alert.alert('Error', 'Failed to book. You might have already booked it.');
    } finally {
        setBookingLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#007AFF" style={styles.center} />;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          source={{ uri: house.image_url?.startsWith('http') ? house.image_url : `${STORAGE_URL}${house.image_url}` }} 
          style={styles.image} 
        />
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
           <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{house.name}</Text>
          {/* Using whole numbers for clean UI per your preference */}
          <Text style={styles.price}>${Math.round(house.price)} <Text style={{fontSize:16, color:'#666'}}>/ month</Text></Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.location}>{house.location}</Text>
          </View>

          <View style={styles.featuresRow}>
            <View style={styles.featureItem}><Ionicons name="bed-outline" size={24} color="#007AFF" /><Text>{house.bedrooms} Beds</Text></View>
            <View style={styles.featureItem}><Ionicons name="water-outline" size={24} color="#007AFF" /><Text>{house.bathrooms} Baths</Text></View>
            <View style={styles.featureItem}><Ionicons name="expand-outline" size={24} color="#007AFF" /><Text>{house.floor_area} m²</Text></View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{house.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBookNow} disabled={bookingLoading}>
          {bookingLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.bookBtnText}>Book Now</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center' },
  scrollContent: { paddingBottom: 100 },
  image: { width: '100%', height: 300 },
  backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: 'white', padding: 8, borderRadius: 20 },
  detailsContainer: { padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  price: { fontSize: 22, fontWeight: '700', color: '#007AFF', marginBottom: 15 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  location: { fontSize: 16, color: '#666', marginLeft: 5 },
  featuresRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, color: '#555', lineHeight: 24 },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  bookBtn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center' },
  bookBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});