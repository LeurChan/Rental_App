import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  ScrollView 
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// ⚠️ CHECK YOUR IP
const API_URL = 'http://10.0.2.2:8000/api/bookings';

export default function CreateBooking() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get data passed from the previous screen
  const propertyId = params.propertyId;
  const pricePerMonth = parseFloat(params.price as string || '0');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fill dates for demo purposes (Optional)
  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);
    
    setStartDate(today.toISOString().split('T')[0]); // YYYY-MM-DD
    setEndDate(nextMonth.toISOString().split('T')[0]);
  }, []);

  const handleBooking = async () => {
    if (!startDate || !endDate || !phone) {
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // 1. Get User Token
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert("Error", "You must be logged in to book.");
        router.replace('/auth/login');
        return;
      }

      // 2. Send Request
      const response = await axios.post(
        API_URL, 
        {
          property_id: propertyId,
          start_date: startDate,
          end_date: endDate,
          phone_number: phone,
          notes: notes,
          total_price: pricePerMonth // Simplification: assuming 1 month price for now
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        Alert.alert("Success!", "Your booking has been sent.", [
          { text: "OK", onPress: () => router.replace('/') }
        ]);
      } else {
        Alert.alert("Failed", response.data.message || "Could not book property.");
      }

    } catch (error: any) {
      console.log("Booking Error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to submit booking. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Book Property', headerBackTitle: 'Back' }} />
      
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.header}>Confirm Booking</Text>
          <Text style={styles.subHeader}>Price: <Text style={styles.price}>${pricePerMonth}/month</Text></Text>

          {/* Form Inputs */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput 
              style={styles.input} 
              placeholder="012 345 678" 
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Start Date</Text>
              <TextInput 
                style={styles.input} 
                placeholder="YYYY-MM-DD" 
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>End Date</Text>
              <TextInput 
                style={styles.input} 
                placeholder="YYYY-MM-DD" 
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput 
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
              placeholder="Any special requests?" 
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.btn} onPress={handleBooking} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Confirm & Book</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb' },
  scroll: { padding: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 3 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  subHeader: { fontSize: 16, color: '#666', marginBottom: 20 },
  price: { color: '#007AFF', fontWeight: 'bold' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#444' },
  input: { 
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8, 
    padding: 12, fontSize: 16, backgroundColor: '#f9f9f9' 
  },
  row: { flexDirection: 'row' },
  btn: { 
    backgroundColor: '#007AFF', padding: 16, borderRadius: 10, 
    alignItems: 'center', marginTop: 10, elevation: 2 
  },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});