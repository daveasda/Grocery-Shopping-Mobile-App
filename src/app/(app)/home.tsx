import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

import { useRouter } from 'expo-router';

import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { groceryService } from '../../services/groceryService';

export default function HomeScreen() {

  const { session } = useContext(AuthContext);

  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);


  // Load groceries
  const loadItems = async () => {

    if (!session?.user) return;

    const result = await groceryService.getItems(
      session.user.id
    );

    if (result.error) {
      Alert.alert(
        'Error',
        'Could not load grocery items'
      );

      return;
    }

    setItems(result.data ?? []);
  };

  const handleToggleBought = async (itemId: number,currentStatus: boolean) => 
    {
      const result = await groceryService.updateItem(
        itemId,
        !currentStatus
      );

      if (result.error) {
        Alert.alert(
          'Error',
          'Could not update item'
        );

        return;
      }

      loadItems();

    };
  
  const handleDeleteItem = async (itemId: number) => 
  {
    const result =
      await groceryService.deleteItem(itemId);

    if (result.error) {

      Alert.alert(
        'Error',
        'Could not delete item'
      );

      return;
    }

    loadItems();
  };

  // Load groceries when session is available
  useEffect(() => {
    loadItems();
  }, [session]);



  // Logout
  const handleLogout = async () => {

    try {
      await authService.signOut();

      router.replace('/(auth)/login' as any);

    } catch (error) {

      console.error(
        '[Home] Logout error:',
        error
      );

      Alert.alert(
        'Error',
        'Failed to sign out'
      );
    }
  };


  return (
    <ScrollView className="flex-1 bg-white">

      <View className="px-4 py-12">

        <TouchableOpacity
            onPress={() =>
              router.push('/(app)/add-item' as any)
            }
            className="bg-blue-500 py-3 rounded-lg mb-6"
          >
          <Text className="text-white text-center font-semibold">
            + Add Item
          </Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold mb-2">
          My Grocery List
        </Text>

        <Text className="mb-6">
          {session?.user?.email}
        </Text>


        {items.map((item) => (

          <View
            key={item.id}
            className="border border-gray-300 rounded-lg p-4 mb-3"
          >

            <Text className="text-lg font-semibold">
              {item.name}
            </Text>

            <Text>
              Quantity: {item.quantity}
            </Text>

            <Text>
              {item.is_bought
                ? 'Bought'
                : 'Not Bought'}
            </Text>
            <TouchableOpacity
                  onPress={() =>
                    handleToggleBought(
                      item.id,
                      item.is_bought
                    )
                  }
                  className="bg-green-500 py-2 rounded-lg"
                >

                  <Text className="text-white text-center">
                    {item.is_bought
                      ? 'Mark Not Bought'
                      : 'Mark Bought'}
                  </Text>

            </TouchableOpacity>

            <TouchableOpacity
                onPress=
                {() => 
                  {

                      Alert.alert(
                        'Delete Item',
                        `Are you sure you want to delete ${item.name}?`,
                        [
                          {
                            text: 'Cancel',
                            style: 'cancel',
                          },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () =>
                              handleDeleteItem(item.id),
                          },
                        ]
                      );

                  }
                }
                className="bg-red-500 py-2 rounded-lg mt-2"
            >
              <Text className="text-white text-center">
                Delete
              </Text>
            </TouchableOpacity>

          </View>

        ))}


        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 py-3 rounded-lg mt-6"
        >
          <Text className="text-white text-center font-semibold">
            Sign Out
          </Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}