import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Define Colors based on your design
const Colors = {
  primary: '#3F51B5', // The blue color
  background: '#F5F7FB', // Light gray background
  textDark: '#1A1A1A',
  textLight: '#999999',
  white: '#FFFFFF',
  red: '#FF5A5F', // For heart icons
};

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [houses, setHouses] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Apartment');

  const categories = ['Apartment', 'Room', 'Penthouse', 'Duplex'];

  useEffect(() => {
    // ⚠️ REPLACE WITH YOUR IP (e.g., http://192.168.1.5:8000/api/home)
    // Use http://10.0.2.2:8000/api/home for Android Emulator
    fetch('http://10.0.2.2:8000/api/home')
      .then((res) => res.json())
      .then((data) => setHouses(data))
      .catch((err) => console.error(err));
  }, []);

  // --- Render Component: Category Item ---
  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => setSelectedCategory(item)}
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.categoryItemActive,
      ]}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.categoryTextActive,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  // --- Render Component: Property Card (Used for both Nearby and Favorites) ---
  const renderPropertyCard = ({ item, horizontal = false }: { item: any, horizontal?: boolean }) => {
    const cardStyle = horizontal ? styles.cardHorizontal : styles.cardVertical;
    const imageStyle = horizontal ? styles.cardImageHorizontal : styles.cardImageVertical;

    // Dummy image if none exists (replace with item.image_url later)
    const imageUrl = 'https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg';

    return (
      <TouchableOpacity style={cardStyle} onPress={() => console.log('Details page not implemented yet')}>
        <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={imageStyle} resizeMode="cover" />
             {/* Heart Icon Overlay */}
            <TouchableOpacity style={styles.heartIcon}>
                 <Ionicons name="heart-outline" size={20} color={Colors.red} />
            </TouchableOpacity>
            {/* Tag Overlay (e.g., Apartment) */}
             <View style={styles.typeTag}>
                 <Text style={styles.typeTagText}>Apartment</Text>
             </View>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.houseTitle} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.price}>${item.price} <Text style={styles.priceSuffix}>/ month</Text></Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={Colors.textLight} style={{marginRight: 4}}/>
            <Text style={styles.locationTextCard} numberOfLines={1}>Dhaka, Bangladesh (Placeholder)</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      {/* Main ScrollView for the whole page */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Header */}
        <View style={styles.header}>
          <View>
             <Text style={{fontSize: 12, color: Colors.textLight}}>Location</Text>
             <View style={{flexDirection:'row', alignItems:'center', marginTop: 4}}>
                 <Ionicons name="location-sharp" size={20} color={Colors.primary} />
                 <Text style={styles.headerLocationText}>Dhaka Bangladesh</Text>
                 <Ionicons name="chevron-down" size={16} color={Colors.textLight} />
             </View>
          </View>
          {/* Profile Image Placeholder */}
          <TouchableOpacity onPress={() => router.push('/login' as any)}>
             <Image 
                 source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
                 style={styles.profileImage} 
             />
          </TouchableOpacity>
        </View>

        {/* 2. Search Bar & Filter */}
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

        {/* 3. Categories */}
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

        {/* 4. Nearby Properties Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Properties</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={houses} // Using same data for demo
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => 'nearby-' + item.id.toString()}
            renderItem={({ item }) => renderPropertyCard({ item, horizontal: true })}
            contentContainerStyle={{ paddingLeft: 20, paddingBottom: 10 }}
          />
        </View>

        {/* 5. Ads Banner */}
        <View style={styles.adsBannerContainer}>
             {/* Replace with a real banner image */}
            <View style={styles.dummyAdsBanner}>
                <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>Find Your DREAM HOME</Text>
                <Text style={{color: 'white', fontSize: 14}}>FOR SALE</Text>
            </View>
        </View>

        {/* 6. Most Favorite Properties Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Most Favorite Properties</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

           {/* Using map here because it's inside a ScrollView. 
               Nested virtualized lists (FlatList inside ScrollView) give warnings. */}
           <View style={{paddingHorizontal: 20}}>
              {houses.map((item) => (
                 <View key={'fav-' + item.id}>
                     {renderPropertyCard({ item, horizontal: false })}
                 </View>
              ))}
           </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  // --- Header Styles ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerLocationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginHorizontal: 5,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#ddd',
  },
  // --- Search Styles ---
  searchContainerRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 50,
    marginRight: 15,
    elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textDark,
  },
  filterBtn: {
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // --- Category Styles ---
  categoriesList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  categoryItemActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textLight,
  },
  categoryTextActive: {
    color: Colors.white,
  },
  // --- Section Styles ---
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  // --- Property Card Styles ---
  cardHorizontal: {
    width: width * 0.7, // 70% of screen width
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginRight: 15,
    padding: 12,
    elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardVertical: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: 20,
    padding: 12,
    elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  imageContainer: {
      position: 'relative',
  },
  cardImageHorizontal: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    marginBottom: 10,
  },
  cardImageVertical: {
    width: '100%',
    height: 180,
    borderRadius: 15,
    marginBottom: 10,
  },
  heartIcon: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: Colors.white,
      padding: 6,
      borderRadius: 20,
  },
  typeTag: {
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor: Colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
  },
  typeTagText: {
      color: Colors.white,
      fontSize: 10,
      fontWeight: 'bold',
  },
  cardContent: {
      paddingHorizontal: 5,
      paddingBottom: 5
  },
  houseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textDark,
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceSuffix: {
      fontSize: 12,
      color: Colors.textLight,
      fontWeight: 'normal'
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextCard: {
    fontSize: 12,
    color: Colors.textLight,
  },
  // --- Ads Banner Styles ---
  adsBannerContainer: {
      paddingHorizontal: 20,
      marginBottom: 25,
  },
  dummyAdsBanner: {
      width: '100%',
      height: 140,
      backgroundColor: '#003366', // Dark blue placeholder
      borderRadius: 20,
      justifyContent: 'center',
      paddingLeft: 25,
      // In real app, use an Image component here
  }
});