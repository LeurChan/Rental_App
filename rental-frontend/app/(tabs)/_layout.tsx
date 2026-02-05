import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
      {/* 1. Home Tab */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> 
        }} 
      />

      {/* 2. Favorites Tab */}
      <Tabs.Screen 
        name="favorites" 
        options={{ 
          title: 'Favorites', 
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={24} color={color} /> 
        }} 
      />

      {/* 3. Profile Tab */}
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile', 
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> 
        }} 
      />
      
      {/* ❌ THIS REMOVES THE EXPLORE BUTTON FROM THE SCREEN */}
      <Tabs.Screen 
        name="explore" 
        options={{ 
          href: null, // This hides the tab from the bottom bar
        }} 
      />

      {/* Hide other unused routes */}
      <Tabs.Screen name="forgotpassword" options={{ href: null }} /> 
    </Tabs>
  );
}