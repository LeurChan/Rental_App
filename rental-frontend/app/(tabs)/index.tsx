import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 Added for token

// 👇 Import Styles
import { styles, Colors } from './home.styles';

// --- CONFIGURATION ---
const API_URL = 'http://10.0.2.2:8000/api/home'; 
const STORAGE_URL = 'http://10.0.2.2:8000/storage/'; 
const FAVORITE_TOGGLE_URL = 'http://10.0.2.2:8000/api/favorites/toggle'; // 👈 Added

interface Property {
  id: number;
  name: string;
  price: number;
  location: string;
  image_url?: string;
  category?: string;
  bedrooms?: number;   
  bathrooms?: number;  
  floor_area?: string; 
}

export default function HomeScreen() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // 👇 1. Added state for favorites
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const categories = ['All', 'House', 'Apartment', 'Room', 'Villa', 'Penthouse'];

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    let result = properties;

    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    if (searchText) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase()) || 
        item.location.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredProperties(result);
  }, [properties, selectedCategory, searchText]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(API_URL);
      setProperties(response.data);
      
      // If your API returns user's current favorites, set them here:
      // setFavorites(response.data.user_favorites || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 👇 2. Toggle Favorite Function
  const toggleFavorite = async (propertyId: number) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert("Login Required", "Please login to favorite properties.");
        return;
      }

      const response = await axios.post(
        FAVORITE_TOGGLE_URL,
        { property_id: propertyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.is_favorite) {
        setFavorites([...favorites, propertyId]);
      } else {
        setFavorites(favorites.filter(id => id !== propertyId));
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProperties();
  }, []);

  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => setSelectedCategory(item)}
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.categoryItemActive,
      ]}
    >
      <Text style={[styles.categoryText, selectedCategory === item && styles.categoryTextActive]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderPropertyCard = ({ item, horizontal = false }: { item: Property, horizontal?: boolean }) => {
    const cardStyle = horizontal ? styles.cardHorizontal : styles.cardVertical;
    const imageStyle = horizontal ? styles.cardImageHorizontal : styles.cardImageVertical;
    
    // 👇 3. Check if current item is favorited
    const isFavorited = favorites.includes(item.id);

    let imageUrl = { uri: 'https://via.placeholder.com/400x300.png?text=No+Image' };
    
    if (item.image_url) {
        if (item.image_url.startsWith('http')) {
            imageUrl = { uri: item.image_url };
        } else {
            imageUrl = { uri: `${STORAGE_URL}${item.image_url}` };
        }
    }

    return (
      <TouchableOpacity 
        style={cardStyle} 
        onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
      >
        <View style={styles.imageContainer}>
            <Image source={imageUrl} style={imageStyle} resizeMode="cover" />
            
            {/* 👇 4. Updated Favorite Icon with Logic */}
            <TouchableOpacity 
              style={styles.heartIcon} 
              onPress={() => toggleFavorite(item.id)}
            >
                 <Ionicons 
                   name={isFavorited ? "heart" : "heart-outline"} 
                   size={20} 
                   color={isFavorited ? "#ff0000" : Colors.red} 
                 />
            </TouchableOpacity>

             <View style={styles.typeTag}>
                 <Text style={styles.typeTagText}>{item.category || 'Property'}</Text>
             </View>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.houseTitle} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.price}>${item.price} <Text style={styles.priceSuffix}>/ month</Text></Text>
          
          <View style={{flexDirection: 'row', marginBottom: 8, marginTop: 4}}>
              {item.bedrooms ? (
                  <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                      <Ionicons name="bed-outline" size={16} color={Colors.textLight} />
                      <Text style={{marginLeft: 4, color: Colors.textLight, fontSize: 12}}>{item.bedrooms}</Text>
                  </View>
              ) : null}

              {item.bathrooms ? (
                  <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                      <Ionicons name="water-outline" size={16} color={Colors.textLight} />
                      <Text style={{marginLeft: 4, color: Colors.textLight, fontSize: 12}}>{item.bathrooms}</Text>
                  </View>
              ) : null}

              {item.floor_area ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Ionicons name="expand-outline" size={16} color={Colors.textLight} />
                      <Text style={{marginLeft: 4, color: Colors.textLight, fontSize: 12}}>{item.floor_area}m²</Text>
                  </View>
              ) : null}
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={Colors.textLight} style={{marginRight: 4}}/>
            <Text style={styles.locationTextCard} numberOfLines={1}>{item.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        
        <View style={styles.header}>
          <View>
              <Text style={{fontSize: 26, fontWeight: 'bold', color: Colors.primary}}>House Rental</Text>
              <Text style={{fontSize: 14, color: Colors.textLight}}>Find your perfect home</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}> 
              <Image 
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
                  style={styles.profileImage} 
              />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainerRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={24} color={Colors.textLight} style={styles.searchIcon} />
            <TextInput
              placeholder="Search..."
              placeholderTextColor={Colors.textLight}
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <MaterialIcons name="tune" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View>
              <FlatList
               data={categories}
               horizontal
               showsHorizontalScrollIndicator={false}
               keyExtractor={(item) => item}
               renderItem={renderCategoryItem}
               contentContainerStyle={styles.categoriesList}
             />
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
                {selectedCategory === 'All' ? 'Nearby Properties' : `${selectedCategory}s`}
            </Text>
            <TouchableOpacity onPress={() => setSelectedCategory('All')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {filteredProperties.length === 0 ? (
             <Text style={{marginLeft: 20, color: '#999', marginTop: 10}}>No properties found.</Text>
          ) : (
              <FlatList
                data={filteredProperties}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => 'nearby-' + item.id.toString()}
                renderItem={({ item }) => renderPropertyCard({ item, horizontal: true })}
                contentContainerStyle={{ paddingLeft: 20, paddingBottom: 10 }}
              />
          )}
        </View>

        <View style={styles.adsBannerContainer}>
            <View style={styles.dummyAdsBanner}>
                <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>Find Your DREAM HOME</Text>
                <Text style={{color: 'white', fontSize: 14}}>FOR SALE</Text>
            </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Properties</Text>
          </View>

           <View style={{paddingHorizontal: 20}}>
              {filteredProperties.map((item) => (
                 <View key={'all-' + item.id}>
                     {renderPropertyCard({ item, horizontal: false })}
                 </View>
              ))}
           </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}