import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 👇 1. Welcome Screen (Placed first to show first) */}
      <Stack.Screen name="welcome" /> 

      {/* 2. Main Tabs */}
      <Stack.Screen name="(tabs)" />

      {/* 3. Auth Screens */}
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />

      {/* 4. Other Screens */}
      <Stack.Screen name="my-booking" options={{ title: 'My Bookings', headerShown: true }} />
      <Stack.Screen name="property/[id]" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}