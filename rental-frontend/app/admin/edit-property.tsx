import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import axios, { AxiosError } from 'axios';
import { Ionicons } from '@expo/vector-icons'; // Added for the Back Button icon

const API_URL = 'http://10.0.2.2:8000/api/properties';

export default function EditProperty() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    name: '',
    price: '',
    location: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    floor_area: '',
  });

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      const data = response.data;
      
      setForm({
        name: data.name,
        price: data.price ? data.price.toString() : '',
        location: data.location,
        description: data.description || '',
        bedrooms: data.bedrooms ? data.bedrooms.toString() : '',
        bathrooms: data.bathrooms ? data.bathrooms.toString() : '',
        floor_area: data.floor_area ? data.floor_area.toString() : '',
      });
    } catch (error) {
      Alert.alert("Error", "Could not load property data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      // Cast values to numbers for Laravel validation
      const dataToUpdate = {
        ...form,
        price: parseFloat(form.price) || 0,
        bedrooms: parseInt(form.bedrooms) || 0,
        bathrooms: parseInt(form.bathrooms) || 0,
      };

      await axios.put(`${API_URL}/${id}`, dataToUpdate);
      
      Alert.alert("Success", "Property updated successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (err) {
      const error = err as AxiosError<any>; 
      if (error.response) {
        console.log("Laravel Error Details:", error.response.data);
        const errorMessage = error.response.data?.message || "Check validation rules.";
        Alert.alert("Update Failed", errorMessage);
      } else {
        Alert.alert("Error", "Check your server connection.");
      }
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#2196F3" />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      
      {/* 👇 FLOATING BACK BUTTON (Matches your screenshot) */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ title: 'Edit Property', headerTitleAlign: 'center', headerShown: false }} />
        
        <View style={styles.form}>
          <Text style={styles.label}>Property Name</Text>
          <TextInput 
            style={styles.input} 
            value={form.name} 
            onChangeText={(t) => setForm({...form, name: t})} 
          />
          
          <View style={styles.row}>
            <View style={[styles.column, { marginRight: 8 }]}>
              <Text style={styles.label}>Price ($)</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={form.price} onChangeText={(t) => setForm({...form, price: t})} />
            </View>
            <View style={[styles.column, { marginRight: 8 }]}>
              <Text style={styles.label}>Beds</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={form.bedrooms} onChangeText={(t) => setForm({...form, bedrooms: t})} />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Baths</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={form.bathrooms} onChangeText={(t) => setForm({...form, bathrooms: t})} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 2, marginRight: 10 }}>
              <Text style={styles.label}>Location</Text>
              <TextInput style={styles.input} value={form.location} onChangeText={(t) => setForm({...form, location: t})} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Area (m²)</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={form.floor_area} onChangeText={(t) => setForm({...form, floor_area: t})} />
            </View>
          </View>

          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} multiline numberOfLines={4} value={form.description} onChangeText={(t) => setForm({...form, description: t})} />

          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
            <Text style={styles.updateBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  form: { padding: 20, paddingTop: 100 }, // Pushes form down so back button doesn't hide inputs
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#666' },
  input: { 
    borderWidth: 1, borderColor: '#eee', borderRadius: 8, 
    padding: 12, marginBottom: 20, fontSize: 16, backgroundColor: '#f9f9f9', color: '#333' 
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  updateBtn: { backgroundColor: '#2196F3', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  updateBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});