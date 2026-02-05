import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function AddProperty() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Apartment', // 👈 1. Added category default
    price: '',
    location: 'Phnom Penh',
    description: '',
    bedrooms: '',
    bathrooms: '',
    phone_number: '',
    floor_area: ''
  });

  const handleInputChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = async () => {
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
    if (!form.name || !form.price || !form.description) {
      Alert.alert("Missing Info", "Please fill in Name, Price, and Description.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      const formData = new FormData();
      
      formData.append('name', form.name);
      formData.append('category', form.category); // 👈 2. Send category to backend
      formData.append('price', form.price);
      formData.append('location', form.location);
      formData.append('description', form.description);
      formData.append('bedrooms', form.bedrooms);
      formData.append('bathrooms', form.bathrooms);
      formData.append('phone_number', form.phone_number);
      formData.append('floor_area', form.floor_area);

      if (image) {
        // @ts-ignore
        formData.append('image', {
          uri: image.uri,
          name: 'property.jpg',
          type: 'image/jpeg',
        });
      }

      await axios.post('http://10.0.2.2:8000/api/properties', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert("Success", "Property Published!");
      router.back(); 
    } catch (error: any) {
      console.log("Upload error:", error);
      Alert.alert("Upload Failed", "Could not save property.");
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

      {/* 👇 3. NEW CATEGORY PICKER */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.category}
            onValueChange={(itemValue) => handleInputChange('category', itemValue)}
          >
            <Picker.Item label="Apartment" value="Apartment" />
            <Picker.Item label="House" value="House" />
            <Picker.Item label="Villa" value="Villa" />
            <Picker.Item label="Room" value="Room" />
            <Picker.Item label="Penthouse" value="Penthouse" />
          </Picker>
      </View>

      <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Price ($)</Text>
            <TextInput 
                style={styles.input} 
                placeholder="500" 
                keyboardType="numeric"
                value={form.price}
                onChangeText={(text) => handleInputChange('price', text)}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Floor Area (m²)</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Ex: 80" 
                value={form.floor_area}
                onChangeText={(text) => handleInputChange('floor_area', text)}
            />
          </View>
      </View>

      <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Bedrooms</Text>
            <TextInput 
                style={styles.input} 
                placeholder="2" 
                keyboardType="numeric"
                value={form.bedrooms}
                onChangeText={(text) => handleInputChange('bedrooms', text)}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Bathrooms</Text>
            <TextInput 
                style={styles.input} 
                placeholder="1" 
                keyboardType="numeric"
                value={form.bathrooms}
                onChangeText={(text) => handleInputChange('bathrooms', text)}
            />
          </View>
      </View>

      <Text style={styles.label}>Phone Number</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ex: 012 345 678" 
        keyboardType="phone-pad"
        value={form.phone_number}
        onChangeText={(text) => handleInputChange('phone_number', text)}
      />

      <Text style={styles.label}>Location</Text>
      <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.location}
            onValueChange={(itemValue) => handleInputChange('location', itemValue)}
          >
            <Picker.Item label="Phnom Penh" value="Phnom Penh" />
            <Picker.Item label="Siem Reap" value="Siem Reap" />
            <Picker.Item label="Sihanoukville" value="Sihanoukville" />
            <Picker.Item label="Battambang" value="Battambang" />
            <Picker.Item label="Kampot" value="Kampot" />
          </Picker>
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Details about the house..." 
        multiline
        numberOfLines={4}
        value={form.description}
        onChangeText={(text) => handleInputChange('description', text)}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Publish Property</Text>}
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
  submitText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#f9f9f9' }
});