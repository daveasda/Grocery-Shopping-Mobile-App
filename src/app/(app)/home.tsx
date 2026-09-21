import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useRouter } from 'expo-router';

import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export default function HomeScreen() {
  const { session } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.signOut();

      console.log('[Home] Logged out successfully');

      router.replace('/(auth)/login' as any);
    } catch (error) {
      console.error('[Home] Logout error:', error);

      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <View className="flex-1 bg-white justify-center items-center px-4">

      <Text className="text-2xl font-bold mb-4">
        Welcome!
      </Text>

      <Text className="text-lg mb-8">
        Logged in as: {session?.user?.email}
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">
          Sign Out
        </Text>
      </TouchableOpacity>

    </View>
  );
}