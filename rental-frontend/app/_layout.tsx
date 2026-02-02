import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. Main Tabs (This handles your Home/Index) */}
      <Stack.Screen name="(tabs)" />

      {/* 2. Auth Screens (Matches 'app/auth/login.tsx') */}
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />

      {/* 3. My Booking (Matches 'app/my-booking.tsx') */}
      <Stack.Screen name="my-booking" options={{ title: 'My Bookings', headerShown: true }} />

      {/* 4. Property Details (Matches 'app/property/[id].tsx') */}
      <Stack.Screen name="property/[id]" />

      {/* 5. Modal (Matches 'app/modal.tsx') */}
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}