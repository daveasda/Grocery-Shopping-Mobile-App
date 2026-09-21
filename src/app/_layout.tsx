import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';

import {
  AuthContext,
  AuthContextProvider,
} from '../context/AuthContext';

import '../../global.css';

function AppContent() {
  const { session, isLoading } = useContext(AuthContext);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const currentScreen = segments[0];

    // Logged in → go to home
    if (session?.user && currentScreen === 'login') {
      router.replace('/(app)/home' as any);
    }

    // Not logged in → go to login
    if (!session?.user && currentScreen === 'home') {
      router.replace('/(auth)/login' as any);
    }
  }, [session, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <AppContent />
    </AuthContextProvider>
  );
}