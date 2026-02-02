import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
      if(!email) {
          Alert.alert("Error", "Please enter your email address.");
          return;
      }
      
      setLoading(true);
      try {
          const response = await axios.post('http://10.0.2.2:8000/api/forgot-password', { email });
          if(response.data.status) {
              Alert.alert("Success", "Reset link sent to your email!");
              router.back();
          }
      } catch (error) {
          Alert.alert("Error", "Email not found in our database.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Reset Password</Text>
        
        <Text style={{textAlign: 'center', marginBottom: 20, color: '#666'}}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <TextInput 
          style={styles.input} 
          placeholder="Enter your email address" 
          value={email} 
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.btn} onPress={handleReset}>
          {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>Send Reset Link</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={{marginTop: 30}}>
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', padding: 30, borderRadius: 20, elevation: 5 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#1a237e', textAlign: 'center', marginBottom: 10 },
  input: { backgroundColor: '#f0f2f5', borderRadius: 10, padding: 15, marginBottom: 20, fontSize: 16 },
  btn: { backgroundColor: '#1a237e', padding: 15, borderRadius: 25, alignItems: 'center' },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#1a237e', textAlign: 'center', fontWeight: 'bold' }
});