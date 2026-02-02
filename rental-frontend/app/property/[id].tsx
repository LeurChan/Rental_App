import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the structure of a Property
interface Property {
  id: number;
  name: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  image_path?: string;
}

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [house, setHouse] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ CORRECT URL for details page
  const API_URL = 'http://10.0.2.2:8000/api/properties';
  
  // ✅ BOOKING URL
  const BOOKING_URL = 'http://10.0.2.2:8000/api/bookings';

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      // Fetch specific house by ID
      const response = await axios.get(`${API_URL}/${id}`);
      setHouse(response.data);
    } catch (err) {
      console.log("Error fetching details:", err);
      setError('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  // 👇 NEW: Handle Booking Function
  const handleBookNow = async () => {
    try {
      // 1. Get the user's token
      const token = await AsyncStorage.getItem('userToken');

      // 2. If not logged in, stop them
      if (!token) {
        Alert.alert('Login Required', 'You must be logged in to book a house.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/(tabs)/profile') }
        ]);
        return;
      }

      // 3. Send booking to Laravel
      const response = await axios.post(
        BOOKING_URL,
        { property_id: house?.id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 4. Success!
      Alert.alert('Success', 'Booking request sent successfully!');
      console.log('Booking Saved:', response.data);

    } catch (error) {
      console.log('Booking Error:', error);
      Alert.alert('Error', 'Failed to book this property. You might have already booked it.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !house) {
    return (
      <View style={styles.center}>
        <Text>Property not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: 'blue' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Image */}
        <Image 
          source={{ uri: house.image_path ? `http://10.0.2.2:8000/storage/${house.image_path}` : 'https://via.placeholder.com/400x300' }} 
          style={styles.image} 
        />

        {/* Details Container */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{house.name}</Text>
          <Text style={styles.price}>${house.price}/month</Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.location}>{house.location}</Text>
          </View>

          {/* Features Row (Beds/Baths) */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <Ionicons name="bed-outline" size={24} color="#007AFF" />
              <Text style={styles.featureText}>{house.bedrooms} Beds</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="water-outline" size={24} color="#007AFF" />
              <Text style={styles.featureText}>{house.bathrooms} Baths</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{house.description}</Text>
        </View>
      </ScrollView>

      {/* Book Now Button (Fixed at Bottom) */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 100, // Space for the footer
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30, // Pull up over the image slightly
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});