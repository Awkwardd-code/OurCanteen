import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';
import "@/global.css";
// import { AuthProvider } fro../context/AuthContextext';
import AuthProvider from '../context/AuthContext';

// import { ClerkProvider } from '@clerk/clerk-expo'
// import { tokenCache } from '@clerk/clerk-expo/token-cache'

export default function RootLayout() {


  const [loaded] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    Jakarta: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(root)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          {/* <Stack.Screen name="restaurant" options={{ headerShown: false }} /> */}
          <Stack.Screen name="product" options={{ headerShown: false }} />
          <Stack.Screen name="order" options={{ headerShown: false }} />

          <Stack.Screen name="+not-found" />
        </Stack>
    </AuthProvider>

  );
}
