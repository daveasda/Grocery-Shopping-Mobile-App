// src/app/(auth)/login.tsx

import React, { useState } from 'react';

import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { useRouter } from 'expo-router';
import { authService } from '../../services/authService';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    console.log('LOGIN BUTTON PRESSED');
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // SIGN UP
      if (isSignUp) {
        const result = await authService.signUpWithEmail(
          email.trim(),
          password
        );

        if (result.error) {
          Alert.alert(
            'Sign Up Error',
            result.error.message
          );
          return;
        }

        Alert.alert(
          'Success',
          'Account created. Check your email if confirmation is required.'
        );

        setEmail('');
        setPassword('');
        setIsSignUp(false);
      }

      // SIGN IN
      else {
        const result = await authService.signInWithEmail(
          email.trim(),
          password
        );

        if (result.error) {
          Alert.alert(
            'Login Error',
            result.error.message
          );
          return;
        }

        console.log(
          '[Login] Login successful:',
          result.data.user?.email
        );

        // Go to Home
        router.replace('/(app)/home' as any);
      }
    } catch (error) {
      console.error('[Login] Auth error:', error);

      Alert.alert(
        'Error',
        'An error occurred during authentication'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);

    try {
      const result = await authService.signInWithGoogle();

      if (result.error) {
        Alert.alert(
          'Google Auth Error',
          result.error.message
        );
      }
    } catch (error) {
      console.error('[Login] Google auth error:', error);

      Alert.alert(
        'Error',
        'Google authentication failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-4 py-12">

        <Text className="text-4xl font-bold mb-8 text-center">
          Grocery App
        </Text>

        <Text className="text-lg font-semibold mb-4">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
          className="border border-gray-300 px-4 py-3 rounded-lg mb-4 text-base"
          placeholderTextColor="#999"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
          className="border border-gray-300 px-4 py-3 rounded-lg mb-6 text-base"
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          onPress={handleEmailAuth}
          disabled={loading}
          className="bg-blue-500 py-3 rounded-lg mb-4"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-center">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGoogleAuth}
          disabled={loading}
          className="border border-gray-300 py-3 rounded-lg mb-6"
        >
          <Text className="text-gray-700 font-semibold text-center">
            Sign in with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsSignUp(!isSignUp)}
          disabled={loading}
        >
          <Text className="text-center text-gray-600">
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}