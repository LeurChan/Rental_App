import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    // REPLACE THIS with your Laptop's IP Address
    fetch('http://192.168.1.178:8000/api/home') 
      .then((response) => response.json())
      .then((data) => setHouses(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar is useful for Android */}
      <StatusBar barStyle="dark-content" />
      
      <Text style={styles.header}>Rental Home Page</Text>
      
      <FlatList
        data={houses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.price}>${item.price} / month</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', paddingTop: 30 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, margin: 10, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: 'bold' },
  price: { fontSize: 16, color: 'green', marginTop: 5 }
});