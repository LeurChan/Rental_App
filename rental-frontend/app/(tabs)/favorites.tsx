import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropertyCard from '@/components/PropertyCard'; // 👈 Capitalize P and C👈 Import the shared component
import { Ionicons } from '@expo/vector-icons';
import { styles, Colors } from './home.styles';

// --- CONFIGURATION ---
const FAVORITES_URL = 'http://10.0.2.2:8000/api/favorites';
const TOGGLE_URL = 'http://10.0.2.2:8000/api/favorites/toggle';

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 👇 Refresh the list every time the user enters the Favorites tab
  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const fetchFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(FAVORITES_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data);
    } catch (error) {
      console.error("Fetch favorites error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleFavorite = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(TOGGLE_URL, { property_id: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // 🟢 Smooth UI: Remove the item from the local list immediately
      setFavorites((prev) => prev.filter((item: any) => item.id !== id));
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  if (loading) return <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ padding: 20, flex: 1 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: Colors.primary, marginBottom: 20 }}>
          My Favorites
        </Text>

        <FlatList
          data={favorites}
          keyExtractor={(item: any) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PropertyCard 
              item={item} 
              isFavorited={true} // In this screen, they are always favorited
              onToggleFavorite={handleToggleFavorite}
              onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchFavorites} />}
          ListEmptyComponent={
            <View style={{ marginTop: 50, alignItems: 'center' }}>
              <Ionicons name="heart-dislike-outline" size={50} color="#ccc" />
              <Text style={{ color: '#999', marginTop: 10 }}>You haven't liked any properties yet.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}