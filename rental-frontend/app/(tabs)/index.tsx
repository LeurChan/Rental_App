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
  Alert,
  Modal, // 👈 Added Modal
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 👇 Import Styles
import { styles, Colors } from './home.styles';

// --- CONFIGURATION ---
const API_URL = 'http://10.0.2.2:8000/api/home'; 
const STORAGE_URL = 'http://10.0.2.2:8000/storage/'; 
const FAVORITE_TOGGLE_URL = 'http://10.0.2.2:8000/api/favorites/toggle';

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
  const [favorites, setFavorites] = useState<number[]>([]);

  // 👇 1. Added state for Filter Modal
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const categories = ['All', 'House', 'Apartment', 'Room', 'Villa', 'Penthouse'];

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    let result = properties;

    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Apply Price Filters
    if (minPrice) result = result.filter(item => item.price >= parseInt(minPrice));
    if (maxPrice) result = result.filter(item => item.price <= parseInt(maxPrice));

    if (searchText) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase()) || 
        item.location.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredProperties(result);
  }, [properties, selectedCategory, searchText, minPrice, maxPrice]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(API_URL);
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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

  const renderPropertyCard = ({ item, horizontal = false }: { item: Property, horizontal?: boolean }) => {
    const cardStyle = horizontal ? styles.cardHorizontal : styles.cardVertical;
    const imageStyle = horizontal ? styles.cardImageHorizontal : styles.cardImageVertical;
    const isFavorited = favorites.includes(item.id);

    let imageUrl = { uri: 'https://via.placeholder.com/400x300.png?text=No+Image' };
    if (item.image_url) {
        imageUrl = item.image_url.startsWith('http') 
            ? { uri: item.image_url } 
            : { uri: `${STORAGE_URL}${item.image_url}` };
    }

    return (
      <TouchableOpacity 
        style={cardStyle} 
        onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
      >
        <View style={styles.imageContainer}>
            <Image source={imageUrl} style={imageStyle} resizeMode="cover" />
            <TouchableOpacity style={styles.heartIcon} onPress={() => toggleFavorite(item.id)}>
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
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={Colors.textLight} style={{marginRight: 4}}/>
            <Text style={styles.locationTextCard} numberOfLines={1}>{item.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* 👇 2. Filter Modal Component */}
      <Modal visible={isFilterVisible} animationType="slide" transparent={true}>
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <View style={localStyles.modalHeader}>
                <Text style={localStyles.modalTitle}>Filter Properties</Text>
                <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
            </View>

            <Text style={localStyles.label}>Category</Text>
            <View style={localStyles.categoryGrid}>
                {categories.map((cat) => (
                    <TouchableOpacity 
                        key={cat} 
                        style={[localStyles.catBtn, selectedCategory === cat && localStyles.activeCat]}
                        onPress={() => setSelectedCategory(cat)}
                    >
                        <Text style={selectedCategory === cat ? localStyles.activeText : localStyles.inactiveText}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={localStyles.label}>Price Range ($)</Text>
            <View style={localStyles.priceRow}>
                <TextInput 
                    placeholder="Min" 
                    keyboardType="numeric" 
                    style={localStyles.priceInput}
                    value={minPrice}
                    onChangeText={setMinPrice}
                />
                <Text style={{marginHorizontal: 10, alignSelf:'center'}}>-</Text>
                <TextInput 
                    placeholder="Max" 
                    keyboardType="numeric" 
                    style={localStyles.priceInput}
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                />
            </View>

            <TouchableOpacity 
              style={localStyles.applyBtn} 
              onPress={() => setIsFilterVisible(false)}
            >
              <Text style={localStyles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => {
                  setSelectedCategory('All');
                  setMinPrice('');
                  setMaxPrice('');
              }}
              style={{marginTop: 15, alignItems: 'center'}}
            >
                <Text style={{color: Colors.red}}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
      >
        <View style={styles.header}>
          <View>
              <Text style={{fontSize: 26, fontWeight: 'bold', color: Colors.primary}}>House Rental</Text>
              <Text style={{fontSize: 14, color: Colors.textLight}}>Find your perfect home</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}> 
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} style={styles.profileImage} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainerRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={24} color={Colors.textLight} style={styles.searchIcon} />
            <TextInput
              placeholder="Search..."
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          {/* 👇 3. Filter Button triggers Modal */}
          <TouchableOpacity style={styles.filterBtn} onPress={() => setIsFilterVisible(true)}>
            <MaterialIcons name="tune" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Existing Content... */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
              {selectedCategory === 'All' ? 'Nearby Properties' : `${selectedCategory}s`}
          </Text>
          <FlatList
            data={filteredProperties}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => 'nearby-' + item.id.toString()}
            renderItem={({ item }) => renderPropertyCard({ item, horizontal: true })}
            contentContainerStyle={{ paddingLeft: 20, paddingBottom: 10 }}
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>All Properties</Text>
           <View style={{paddingHorizontal: 20}}>
              {filteredProperties.map((item) => (
                 <View key={'all-' + item.id}>{renderPropertyCard({ item, horizontal: false })}</View>
              ))}
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Additional Modal Styles
const localStyles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 40 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 22, fontWeight: 'bold' },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 10, marginTop: 10 },
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    catBtn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: '#eee' },
    activeCat: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    activeText: { color: '#fff' },
    inactiveText: { color: '#666' },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    priceInput: { flex: 1, borderWidth: 1, borderColor: '#eee', borderRadius: 10, padding: 10 },
    applyBtn: { backgroundColor: Colors.primary, padding: 15, borderRadius: 15, marginTop: 30, alignItems: 'center' },
    applyText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});