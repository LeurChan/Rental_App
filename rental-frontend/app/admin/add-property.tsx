import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function AddProperty() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    price: '',
    location: '',
    description: '',
  });

  const handleInputChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.location || !form.description) {
      Alert.alert("Missing Info", "Please fill in Name, Price, Location, and Description.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');

      // Create FormData
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('location', form.location);
      formData.append('description', form.description);

      if (image) {
        // @ts-ignore
        formData.append('image', {
          uri: image.uri,
          name: 'property.jpg',
          type: 'image/jpeg',
        });
      }

      // ⚠️ Use 10.0.2.2 for Android Emulator (localhost for iOS)
      await axios.post('http://10.0.2.2:8000/api/properties', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      Alert.alert("Success", "Property Published!");
      router.back(); 
    } catch (error: any) {
      console.log("Upload error:", error);
      
      // 👇 SHOW THE REAL ERROR MESSAGE FROM SERVER
      const message = error.response?.data?.message || "Check your internet connection";
      Alert.alert("Upload Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
           <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Property</Text>
      </View>

      {/* Image Picker */}
      <TouchableOpacity onPress={pickImage} style={styles.imagePickerBtn}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera" size={40} color="#ccc" />
            <Text style={styles.placeholderText}>Tap to Upload Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Property Title</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ex: Luxury Villa" 
        value={form.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />

      <Text style={styles.label}>Price ($/month)</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ex: 500" 
        keyboardType="numeric"
        value={form.price}
        onChangeText={(text) => handleInputChange('price', text)}
      />

      <Text style={styles.label}>Location</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ex: Phnom Penh" 
        value={form.location}
        onChangeText={(text) => handleInputChange('location', text)}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Details about the house..." 
        multiline
        numberOfLines={4}
        value={form.description}
        onChangeText={(text) => handleInputChange('description', text)}
      />

      <TouchableOpacity 
        style={styles.submitBtn} 
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
            <ActivityIndicator color="#fff" />
        ) : (
            <Text style={styles.submitText}>Publish Property</Text>
        )}
      </TouchableOpacity>
      
      <View style={{height: 50}} /> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginLeft: 10, color: '#333' },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 5, marginTop: 15 },
  input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  imagePickerBtn: { width: '100%', height: 200, borderRadius: 12, overflow: 'hidden', marginBottom: 10, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed' },
  imagePreview: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9' },
  placeholderText: { color: '#888', marginTop: 10 },
  submitBtn: { backgroundColor: '#1a237e', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  submitText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});