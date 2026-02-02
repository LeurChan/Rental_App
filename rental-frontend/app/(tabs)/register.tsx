import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [idCard, setIdCard] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  // Date of Birth States
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dobText, setDobText] = useState('Select Date of Birth');

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios'); 
    if (selectedDate) {
      setDate(selectedDate);
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      setDobText(`${day}-${month}-${year}`);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) setIdCard(result.assets[0]);
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || dobText === 'Select Date of Birth' || !address) {
        Alert.alert("Error", "Please fill all fields including Date of Birth and Address");
        return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('dob', dobText); 
    formData.append('address', address);
    
    if (idCard) {
        // @ts-ignore
        formData.append('id_card', { uri: idCard.uri, name: 'id.jpg', type: 'image/jpeg' });
    }

    try {
      // ⚠️ Use your Laptop's IP (e.g. 192.168.1.5) if testing on a real phone
      // Inside handleRegister function
        const response = await axios.post('http://192.168.1.212:8000/api/register', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json' 
          },
        });

      if (response.data.status) {
          await AsyncStorage.setItem('token', response.data.token);
          Alert.alert("Success", "Account Created!");
          router.replace('/'); 
      }
    } catch (error: any) {
      console.log("SERVER ERROR LOG:", error.response?.data);
      Alert.alert("Fail", error.response?.data?.message || "Registration Failed. Check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.header}>Create Account</Text>

          <View style={styles.row}>
            <TextInput style={[styles.input, {flex: 1, marginRight: 5}]} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
            <TextInput style={[styles.input, {flex: 1, marginLeft: 5}]} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
          </View>

          <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateSelector}>
            <Ionicons name="calendar-outline" size={20} color="#666" style={{marginRight: 10}} />
            <Text style={{color: dobText === 'Select Date of Birth' ? '#aaa' : '#000', fontSize: 16}}>
                {dobText}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}

          <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

          <TouchableOpacity onPress={pickImage} style={styles.uploadBtn}>
            <Ionicons name="camera" size={20} color="#1a237e" style={{marginRight: 10}} />
            <Text style={{color: '#1a237e', fontWeight: 'bold'}}>
              {idCard ? "ID Card Selected" : "Upload ID Card (Picture)"}
            </Text>
          </TouchableOpacity>

          {idCard && <Image source={{ uri: idCard.uri }} style={styles.idPreview} resizeMode="cover" />}

          <TouchableOpacity onPress={handleRegister} style={styles.btn} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Register</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={{marginTop: 20}}>
             <Text style={styles.linkText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb' },
  scroll: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  card: { backgroundColor: 'white', padding: 25, borderRadius: 20, elevation: 5 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#1a237e', textAlign: 'center', marginBottom: 25 },
  input: { backgroundColor: '#f0f2f5', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16 },
  dateSelector: { backgroundColor: '#f0f2f5', borderRadius: 10, padding: 15, marginBottom: 15, flexDirection: 'row', alignItems: 'center' },
  row: { flexDirection: 'row', marginBottom: 0 },
  uploadBtn: { backgroundColor: '#e8eaf6', flexDirection: 'row', padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#1a237e', borderStyle: 'dashed' },
  idPreview: { width: '100%', height: 150, borderRadius: 10, marginBottom: 15 },
  btn: { backgroundColor: '#1a237e', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 5 },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  linkText: { color: '#1a237e', textAlign: 'center', fontWeight: 'bold' }
});