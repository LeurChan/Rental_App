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

// --- CONFIGURATION ---
// ⚠️ Ensure this matches your actual backend URL
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


      {/* --- NEW USER ACTION FOOTER (Call & Book) --- */}
      <View style={styles.footer}>
        
        {/* Button 1: Call Now */}
        <TouchableOpacity 
          style={styles.callBtn} 
          onPress={() => {
             const phone = house.phone_number || '0123456789'; // Default if empty
             Linking.openURL(`tel:${phone}`);
          }}
        >
          <Ionicons name="call-outline" size={20} color="#007AFF" />
          <Text style={styles.callBtnText}>Call Now</Text>
        </TouchableOpacity>

        {/* Button 2: Book Now */}
        <TouchableOpacity 
          style={styles.bookBtn} 
          onPress={() => {
            // Navigate to Booking Screen with the Property ID
            router.push({
                pathname: '/booking/create', // ⚠️ Make sure to create this file next!
                params: { propertyId: house.id }
            });
          }}
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

// --- STYLES ---
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
  
  // --- Updated Footer Styles ---
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#eee', 
    flexDirection: 'row', gap: 12,
    elevation: 10, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#007AFF', // Blue Outline
    backgroundColor: '#fff',
  },
  callBtnText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bookBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#007AFF', // Solid Blue
    elevation: 2,
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});