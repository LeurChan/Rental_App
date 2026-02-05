import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function RegisterScreen() {
  const router = useRouter();
  
  // All your fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState(''); // Simple text input (e.g., "1999-01-01") is safest
  
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
        Alert.alert("Error", "Please fill in the required fields");
        return;
    }

    setLoading(true);
    try {
        // ⚠️ Use 10.0.2.2 for Android Emulator
        const response = await axios.post('http://10.0.2.2:8000/api/register', {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            address: address, // ✅ Sending Address
            dob: dob,         // ✅ Sending DOB
        });

        if (response.data.status) {
            Alert.alert("Success", "Account Created! Please Login.");
            router.back();
        }
    } catch (error: any) {
        console.log("REGISTER ERROR:", error.response?.data);
        Alert.alert("Error", error.response?.data?.message || "Registration Failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      
      <View style={styles.row}>
        <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={[styles.input, {flex:1, marginRight:5}]} />
        <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={[styles.input, {flex:1, marginLeft:5}]} />
      </View>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" keyboardType="email-address"/>
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      
      {/* Added Inputs for your Migration Fields */}
      <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={styles.input} />
      <TextInput placeholder="Date of Birth (YYYY-MM-DD)" value={dob} onChangeText={setDob} style={styles.input} />

      <TouchableOpacity onPress={handleRegister} style={styles.btn} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>Register</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.back()} style={{marginTop: 15}}>
          <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: { padding: 30, paddingTop: 50, backgroundColor: '#f5f7fb', flexGrow: 1 },
    header: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#1a237e' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16, elevation: 2 },
    btn: { backgroundColor: '#1a237e', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, elevation: 3 },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
    linkText: { textAlign:'center', color:'#666', fontSize: 16 }
});