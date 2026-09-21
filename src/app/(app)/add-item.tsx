import React, {
  useContext,
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { useRouter } from 'expo-router';

import { AuthContext } from '../../context/AuthContext';
import { groceryService } from '../../services/groceryService';


export default function AddItemScreen() {

  const { session } = useContext(AuthContext);

  const router = useRouter();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [loading, setLoading] = useState(false);


  const handleAddItem = async () => {

    if (!name.trim()) {
      Alert.alert(
        'Error',
        'Please enter an item name'
      );

      return;
    }


    if (!session?.user) {
      Alert.alert(
        'Error',
        'You must be logged in'
      );

      return;
    }


    const quantityNumber = Number(quantity);

    if (
      !Number.isInteger(quantityNumber) ||
      quantityNumber < 1
    ) {
      Alert.alert(
        'Error',
        'Please enter a valid quantity'
      );

      return;
    }


    setLoading(true);


    try {

      const result = await groceryService.addItem(
        session.user.id,
        name.trim(),
        quantityNumber
      );


      if (result.error) {
        Alert.alert(
          'Error',
          result.error.message
        );

        return;
      }


      router.replace('/(app)/home' as any);

    } catch (error) {

      console.error(
        '[Add Item] Error:',
        error
      );

      Alert.alert(
        'Error',
        'Could not add grocery item'
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <View className="flex-1 bg-white px-4 py-12">

      <Text className="text-2xl font-bold mb-6">
        Add Grocery
      </Text>


      <Text className="mb-2">
        Item Name
      </Text>

      <TextInput
        placeholder="Milk"
        value={name}
        onChangeText={setName}
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
      />


      <Text className="mb-2">
        Quantity
      </Text>

      <TextInput
        placeholder="1"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="number-pad"
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
      />


      <TouchableOpacity
        onPress={handleAddItem}
        disabled={loading}
        className="bg-blue-500 py-3 rounded-lg"
      >

        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold">
            Add Item
          </Text>
        )}

      </TouchableOpacity>

      

    </View>
  );
}