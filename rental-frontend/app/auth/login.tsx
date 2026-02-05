import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // ⚠️ Use 10.0.2.2 for Android Emulator
      const response = await axios.post('http://10.0.2.2:8000/api/login', { 
        email: email.trim(), 
        password: password.trim() 
      });

      console.log("SERVER RESPONSE:", response.data); 

      if (response.data.status === true) {
        const { token, user } = response.data;

        if (!user) {
            Alert.alert("Error", "Login successful but no User Data received.");
            return;
        }

        // Save Data
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(user));

        Alert.alert("Success", `Welcome back, ${user.first_name || 'User'}!`);
        
        // Navigation Logic
        if (user.role === 'admin') {
            router.replace('/');
        } else {
            // ✅ Correct path for (tabs)/index.tsx
            router.replace('/'); 
        }

      } else {
        Alert.alert("Login Failed", response.data.message || "Invalid credentials");
      }
    } catch (error: any) {
      console.log("LOGIN ERROR:", error);
      Alert.alert("Error", "Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Login</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
            autoCapitalize="none"
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin} style={styles.btn}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Login</Text>}
        </TouchableOpacity>

        {/* Register Link */}
        <TouchableOpacity onPress={() => router.push('/auth/register')} style={styles.footer}>
           <Text style={styles.linkText}>Don't have an account? Register.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', padding: 30, borderRadius: 20, elevation: 5 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#1a237e', textAlign: 'center', marginBottom: 30 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f2f5', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15 },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 15, fontSize: 16 },
  btn: { backgroundColor: '#1a237e', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  footer: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#1a237e', fontWeight: 'bold' }
});