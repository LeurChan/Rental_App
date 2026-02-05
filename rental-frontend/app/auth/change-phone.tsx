import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChangePhoneScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePhone = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      // Connecting to your updateContact method in AuthController
      const response = await axios.put('http://10.0.2.2:8000/api/user/update-contact', {
        phone_number: phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        Alert.alert('Success', 'Phone number updated successfully');
        router.back(); // Return to Profile screen
      }
    } catch (error: any) {
      console.log("Update error:", error);
      Alert.alert('Error', 'Failed to update phone number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Phone Number</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>New Phone Number</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. 012345678" 
          keyboardType="number-pad" // Ensures whole numbers only per your preference
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleUpdatePhone}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Phone Number</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  form: { padding: 20, marginTop: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 8 },
  input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});