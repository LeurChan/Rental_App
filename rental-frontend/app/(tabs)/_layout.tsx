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

      {/* 2. Profile Tab */}
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile', 
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> 
        }} 
      />
      
      {/* 3. Explore Tab (If you use it) */}
      <Tabs.Screen 
        name="explore" 
        options={{ 
          title: 'Explore', 
          tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} /> 
        }} 
      />

      {/* ❌ DELETE ALL OTHER LINES (No 'auth', no '(tabs)', no 'my-booking') */}
      <Tabs.Screen name="forgotpassword" options={{ href: null }} /> 
    </Tabs>
  );
}