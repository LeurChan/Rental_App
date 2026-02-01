import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, SafeAreaView } from 'react-native';

export default function HomeScreen() {
  // "any[]" tells TypeScript: "Trust me, this list will have data later."
  const [houses, setHouses] = useState<any[]>([]);

  useEffect(() => {
    // ⚠️ Check your IP Address again here!
    fetch('http://192.168.1.XX:8000/api/home') 
      .then((response) => response.json())
      .then((data) => setHouses(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 50, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Rental Home Page
      </Text>
      
      <FlatList
        data={houses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 20, borderBottomWidth: 1, borderColor: '#ccc' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ color: 'green' }}>${item.price}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}