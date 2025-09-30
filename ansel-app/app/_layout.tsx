import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/src/firebaseConfig';
import { ActivityIndicator, View } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Inter_700Bold } from '@expo-google-fonts/inter'; // Import Inter_700Bold

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...Feather.font,
    ...MaterialIcons.font,
    Inter_700Bold: Inter_700Bold, // Load Inter_700Bold font
  });
  const [authLoaded, setAuthLoaded] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    console.log("onAuthStateChanged listener setup");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged fired, user:", user);
      setAuthLoaded(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authLoaded || !loaded) return; // Wait for both auth and fonts to load

    const inAuthGroup = segments[0] === '(tabs)';
    const inLoginScreen = segments[0] === 'login';
    const inSignUpScreen = segments[0] === 'signup'; // Check for signup screen

    // If the user is signed in, and they are on the login or signup screen, redirect them to the tabs.
    if (auth.currentUser && (inLoginScreen || inSignUpScreen)) {
      router.replace('/(tabs)/kalemler');
    }
    // If the user is NOT signed in, and they are NOT in the tabs group AND NOT on the login/signup screen, redirect them to the login screen.
    else if (!auth.currentUser && !inAuthGroup && !inLoginScreen && !inSignUpScreen) {
      router.replace('/login');
    }
  }, [authLoaded, loaded, segments, router]); // Add 'loaded' to dependencies

  // The initial layout is now always a Stack, and the useEffect handles routing.
  // The loading state is implicitly handled by the router not moving until auth/fonts are loaded.
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} /> {/* Add signup screen */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}