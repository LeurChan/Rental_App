import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const API_URL = 'http://10.0.2.2:8000/api/user/change-password';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(API_URL, {
        old_password: currentPassword, // 👈 Must match Laravel's validation key
        new_password: newPassword,
        new_password_confirmation: confirmPassword, // 👈 Required for 'confirmed' rule
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        Alert.alert("Success", "Password updated successfully");
        router.back();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update password";
      Alert.alert("Error", message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Password</Text>
      <TextInput 
        style={styles.input} 
        secureTextEntry 
        value={currentPassword} 
        onChangeText={setCurrentPassword} 
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput 
        style={styles.input} 
        secureTextEntry 
        value={newPassword} 
        onChangeText={setNewPassword} 
      />

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput 
        style={styles.input} 
        secureTextEntry 
        value={confirmPassword} 
        onChangeText={setConfirmPassword} 
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20 },
  button: { backgroundColor: '#1a237e', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});