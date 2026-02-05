import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const handleChangePassword = async () => {
    if (form.new_password !== form.new_password_confirmation) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post('http://10.0.2.2:8000/api/user/change-password', form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        Alert.alert('Success', 'Password updated successfully');
        router.back();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Password</Text>
      <TextInput 
        style={styles.input} 
        secureTextEntry 
        onChangeText={(text) => setForm({...form, current_password: text})} 
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput 
        style={styles.input} 
        secureTextEntry 
        onChangeText={(text) => setForm({...form, new_password: text})} 
      />

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput 
        style={styles.input} 
        secureTextEntry 
        onChangeText={(text) => setForm({...form, new_password_confirmation: text})} 
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Update Password</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});