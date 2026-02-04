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
  RefreshControl 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

// 👇 Import Styles
import { styles, Colors } from './home.styles';

// --- CONFIGURATION ---
const API_URL = 'http://10.0.2.2:8000/api/home'; 
const STORAGE_URL = 'http://10.0.2.2:8000/storage/'; 

// 1. Updated Interface (Added Bed, Bath, Area)
interface Property {
  id: number;
  name: string;
  price: number;
  location: string;
  image_url?: string;
  category?: string;
  bedrooms?: number;   // 👈 Added
  bathrooms?: number;  // 👈 Added
  floor_area?: string; // 👈 Added
}

export default function HomeScreen() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Apartment');

  const categories = ['Apartment', 'Room', 'Penthouse', 'Duplex'];

  useEffect(() => {
    fetchProperties();
  }, []);

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

  // 2. Updated Card Render (Now shows Icons!)
  const renderPropertyCard = ({ item, horizontal = false }: { item: Property, horizontal?: boolean }) => {
    const cardStyle = horizontal ? styles.cardHorizontal : styles.cardVertical;
    const imageStyle = horizontal ? styles.cardImageHorizontal : styles.cardImageVertical;

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
        onPress={() => router.push(`/property/${item.id}`)}
      >
        <View style={styles.imageContainer}>
            <Image source={imageUrl} style={imageStyle} resizeMode="cover" />
            <TouchableOpacity style={styles.heartIcon}>
                 <Ionicons name="heart-outline" size={20} color={Colors.red} />
            </TouchableOpacity>
             <View style={styles.typeTag}>
                 <Text style={styles.typeTagText}>{item.category || 'House'}</Text>
             </View>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.houseTitle} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.price}>${item.price} <Text style={styles.priceSuffix}>/ month</Text></Text>
          
          {/* 👇 NEW SECTION: Bed, Bath, Area Icons */}
          <View style={{flexDirection: 'row', marginBottom: 8, marginTop: 4}}>
              
              {/* Bedroom Icon */}
              {item.bedrooms ? (
                  <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                      <Ionicons name="bed-outline" size={16} color={Colors.textLight} />
                      <Text style={{marginLeft: 4, color: Colors.textLight, fontSize: 12}}>{item.bedrooms}</Text>
                  </View>
              ) : null}

              {/* Bathroom Icon */}
              {item.bathrooms ? (
                  <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                      <Ionicons name="water-outline" size={16} color={Colors.textLight} />
                      <Text style={{marginLeft: 4, color: Colors.textLight, fontSize: 12}}>{item.bathrooms}</Text>
                  </View>
              ) : null}

              {/* Area Icon */}
              {item.floor_area ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Ionicons name="expand-outline" size={16} color={Colors.textLight} />
                      <Text style={{marginLeft: 4, color: Colors.textLight, fontSize: 12}}>{item.floor_area}m²</Text>
                  </View>
              ) : null}

          </View>
          {/* 👆 End of New Section */}

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
        
        {/* Header */}
        <View style={styles.header}>
          <View>
              <Text style={{fontSize: 12, color: Colors.textLight}}>Location</Text>
              <View style={{flexDirection:'row', alignItems:'center', marginTop: 4}}>
                  <Ionicons name="location-sharp" size={20} color={Colors.primary} />
                  <Text style={styles.headerLocationText}>Phnom Penh, Cambodia</Text>
                  <Ionicons name="chevron-down" size={16} color={Colors.textLight} />
              </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}> 
              <Image 
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
                  style={styles.profileImage} 
              />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
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

        {/* Categories */}
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

        {/* Nearby Properties */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Properties</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={properties}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => 'nearby-' + item.id.toString()}
            renderItem={({ item }) => renderPropertyCard({ item, horizontal: true })}
            contentContainerStyle={{ paddingLeft: 20, paddingBottom: 10 }}
          />
        </View>

        {/* Ads Banner */}
        <View style={styles.adsBannerContainer}>
            <View style={styles.dummyAdsBanner}>
                <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>Find Your DREAM HOME</Text>
                <Text style={{color: 'white', fontSize: 14}}>FOR SALE</Text>
            </View>
        </View>

        {/* All Properties */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Properties</Text>
          </View>

           <View style={{paddingHorizontal: 20}}>
              {properties.map((item) => (
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