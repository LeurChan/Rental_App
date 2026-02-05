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
const STORAGE_URL = 'http://10.0.2.2:8000/storage/';

interface Property {
  id: number;
  name: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  floor_area?: string;   
  phone_number?: string; 
  description: string;
  image_url?: string;
}

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [house, setHouse] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <ActivityIndicator size="large" color="#007AFF" style={styles.center} />;
  if (!house) return <Text style={styles.center}>Property not found</Text>;

  // Image Logic
  let imageUrl = { uri: 'https://via.placeholder.com/400x300' };
  if (house.image_url) {
    imageUrl = house.image_url.startsWith('http') 
      ? { uri: house.image_url } 
      : { uri: `${STORAGE_URL}${house.image_url}` };
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Header */}
        <View style={styles.imageContainer}>
            <Image source={imageUrl} style={styles.image} />
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
               <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
        </View>

        {/* Details Container */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{house.name}</Text>
          <Text style={styles.price}>${house.price} <Text style={{fontSize:16, color:'#666'}}>/ month</Text></Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.location}>{house.location}</Text>
          </View>

          {/* Features Row */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Ionicons name="bed-outline" size={24} color="#007AFF" />
              <Text style={styles.featureText}>{house.bedrooms || 0} Beds</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="water-outline" size={24} color="#007AFF" />
              <Text style={styles.featureText}>{house.bathrooms || 0} Baths</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="expand-outline" size={24} color="#007AFF" />
              <Text style={styles.featureText}>{house.floor_area || 0} m²</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{house.description}</Text>
        </View>
      </ScrollView>


      {/* --- ADMIN ACTION FOOTER --- */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btn, styles.viewBookingBtn]} 
          onPress={() => router.push('/admin/booking')}
        >
           <Ionicons name="list-outline" size={20} color="#2196F3" />
           <Text style={styles.viewBookingBtnText}>View User Booking</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
            style={[styles.btn, styles.editBtn]} 
            onPress={() => router.push({
                pathname: '/admin/edit-property',
                params: { id: house.id }
            })}
        >
           <Ionicons name="create-outline" size={20} color="#fff" />
           <Text style={styles.editBtnText}>Edit Property</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- STYLES AT THE BOTTOM ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 100 },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 300, resizeMode: 'cover' },
  backButton: { 
    position: 'absolute', top: 50, left: 20, zIndex: 10, 
    backgroundColor: 'white', padding: 8, borderRadius: 20, elevation: 5 
  },
  detailsContainer: { 
    padding: 20, backgroundColor: '#fff', 
    borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, elevation: 5 
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  price: { fontSize: 22, fontWeight: '700', color: '#007AFF', marginBottom: 15 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  location: { fontSize: 16, color: '#666', marginLeft: 5 },
  featuresRow: { 
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, 
    paddingVertical: 15, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee' 
  },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 14, fontWeight: '600', color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10, color: '#333' },
  description: { fontSize: 16, lineHeight: 24, color: '#555' },
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: '#fff', padding: 15, borderTopWidth: 1, borderTopColor: '#eee', 
    flexDirection: 'row', gap: 10 
  },
  btn: { 
    flex: 1, paddingVertical: 14, borderRadius: 10, 
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 
  },
  viewBookingBtn: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#2196F3' },
  viewBookingBtnText: { color: '#2196F3', fontSize: 14, fontWeight: 'bold' },
  editBtn: { backgroundColor: '#2196F3', elevation: 2 },
  editBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
