import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, Colors } from '../app/(tabs)/home.styles'; 

const STORAGE_URL = 'http://10.0.2.2:8000/storage/';

// 👇 1. Define what a "Property" looks like
interface Property {
  id: number;
  name: string;
  price: number;
  location: string;
  category?: string;
  image_url?: string;
  bedrooms?: number;
  bathrooms?: number;
}

// 👇 2. Define the Props for this component
interface PropertyCardProps {
  item: Property;
  isFavorited: boolean;
  onToggleFavorite: (id: number) => void;
  onPress: () => void;
}

export default function PropertyCard({ item, isFavorited, onToggleFavorite, onPress }: PropertyCardProps) {
  let imageUrl = { uri: 'https://via.placeholder.com/400x300.png?text=No+Image' };
  
  if (item.image_url) {
    imageUrl = item.image_url.startsWith('http') 
      ? { uri: item.image_url } 
      : { uri: `${STORAGE_URL}${item.image_url}` };
  }

  return (
    <TouchableOpacity style={styles.cardVertical} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={imageUrl} style={styles.cardImageVertical} resizeMode="cover" />
        <TouchableOpacity 
          style={styles.heartIcon} 
          onPress={() => onToggleFavorite(item.id)}
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
          <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
            <Ionicons name="bed-outline" size={16} color={Colors.textLight} />
            <Text style={{marginLeft: 4, color: Colors.textLight, fontSize: 12}}>{item.bedrooms || 0}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
            <Ionicons name="water-outline" size={16} color={Colors.textLight} />
            <Text style={{marginLeft: 4, color: Colors.textLight, fontSize: 12}}>{item.bathrooms || 0}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color={Colors.textLight} style={{marginRight: 4}}/>
          <Text style={styles.locationTextCard} numberOfLines={1}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}