/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView as RNScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ReactNativeModal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../InputField';
import { icons } from '@/constants';
import { useUser } from '@clerk/clerk-expo';
import { fetchAPI } from '@/lib/fetch';
import { uploadImageToCloudinary } from '@/lib/cloudinaryUtils';
import Loader from '../Loader';

type Restaurant = {
  id: number;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

type Cuisine = {
  id: number;
  name: string;
  image: string;
  restaurant_id: number;
  created_at: string;
  updated_at: string;
};

const CuisinesTable = () => {
  const { user } = useUser();
  const [visibleCuisines, setVisibleCuisines] = useState(5);
  const [isModalVisible, setModalVisible] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine | null>(null);

  const [form, setForm] = useState({
    name: '',
    image: '',
    restaurant_id: 1,
  });

  const handleLoadMore = () => {
    setVisibleCuisines((prev) => Math.min(prev + 5, cuisines.length));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      const secureUrl = await uploadImageToCloudinary(uri, setUploading);
      if (secureUrl) {
        setImageUri(secureUrl);
      }
    }
  };



  const handleAddCuisine = async () => {
    if (!form.name || !imageUri) {
      alert('Please provide a name and upload an image.');
      return;
    }
    try {
      if (editMode && selectedCuisine) {
        await fetchAPI(`/(api)/cuisine`, {
          method: 'PUT',
          body: JSON.stringify({
            id: selectedCuisine?.id,
            name: form.name,
            image: imageUri,
            restaurantId: form.restaurant_id,
          }),
        });
        alert('Cuisine updated successfully!');
      } else {
        await fetchAPI(`/(api)/cuisine`, {
          method: 'POST',
          body: JSON.stringify({
            name: form.name,
            image: imageUri,
            restaurantId: form.restaurant_id,
          }),
        });
        alert('Cuisine created successfully!');
      }
      fetchCuisines();
      resetForm();
    } catch (error) {
      console.error('Error saving cuisine:', error);
    }
  };

  const handleDeleteCuisine = async (id: number) => {
    try {
      await fetchAPI(`/(api)/cuisine`, {
        method: 'DELETE',
        body: JSON.stringify({
          id
        }),
      });
      alert('Cuisine deleted.');
      fetchCuisines();
    } catch (error) {
      console.error('Error deleting cuisine:', error);
    }
  };

  const handleEditCuisine = (cuisine: Cuisine) => {
    setForm({
      name: cuisine.name,
      image: cuisine.image,
      restaurant_id: cuisine.restaurant_id,
    });
    setImageUri(cuisine.image);
    setSelectedCuisine(cuisine);
    setEditMode(true);
    setModalVisible(true);
  };

  const resetForm = () => {
    setForm({ name: '', image: '', restaurant_id: form.restaurant_id });
    setImageUri(null);
    setEditMode(false);
    setSelectedCuisine(null);
    setModalVisible(false);
  };

  const getRestaurant = async () => {
    if (!user?.id) return;
    try {
      setLoading(true); // Start loading
      const response = await fetchAPI(`/(api)/restaurant?user_id=${user.id}`);
      setRestaurant(response);
      if (response.length > 0) {
        setForm((prev) => ({ ...prev, restaurant_id: response[0].id }));
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchCuisines = async () => {
    try {
      setLoading(true); // Start loading
      const data = await fetchAPI(`/(api)/cuisine`);
      setCuisines(data);
      // console.log(data)
    } catch (error) {
      console.error('Error fetching cuisines:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };


  useEffect(() => {
    if (user?.id) {
      getRestaurant();
      fetchCuisines();
    }
  }, [user?.id]);

  if (loading) return <Loader />

  return (
    <View className="bg-white p-4 rounded-lg border border-gray-200 shadow mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900">Cuisines</Text>
        <TouchableOpacity
          onPress={() => {
            setEditMode(false);
            setForm({ name: '', image: '', restaurant_id: form.restaurant_id });
            setModalVisible(true);
          }}
          className="bg-emerald-500 px-4 py-2 rounded-md flex-row items-center space-x-2"
        >
          <Ionicons name="add" size={18} color="#ffffff" />
          <Text className="text-white font-semibold text-sm">Add Cuisine</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="min-w-[600px]">
          <View className="flex-row bg-gray-50 border-b border-gray-200 py-3">
            <View className="w-20 items-center">
              <Text className="text-sm font-semibold text-gray-700">Image</Text>
            </View>
            <View className="w-60">
              <Text className="text-sm font-semibold text-gray-700">Name</Text>
            </View>
            <View className="w-60">
              <Text className="text-sm font-semibold text-gray-700">Restaurant</Text>
            </View>
            <View className="w-28">
              <Text className="text-sm font-semibold text-gray-700 text-center">Actions</Text>
            </View>
          </View>

          {cuisines.slice(0, visibleCuisines).map((cuisine, idx) => (
            <View key={cuisine.id} className="flex-row border-b border-gray-200 py-3 items-center">
              <View className="w-20 items-center">
                <Image source={{ uri: cuisine.image }} className="w-10 h-10 rounded-md" />
              </View>
              <View className="w-60">
                <Text className="text-sm text-gray-800">{cuisine.name}</Text>
              </View>
              <View className="w-60">
                <Text className="text-sm text-gray-800">
                  {restaurant.find((r) => r.id === cuisine.restaurant_id)?.name || 'N/A'}
                </Text>
              </View>
              <View className="w-28 flex-row justify-center space-x-3">
                <TouchableOpacity onPress={() => handleEditCuisine(cuisine)}>
                  <Ionicons name="create-outline" size={20} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteCuisine(cuisine.id)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {visibleCuisines < cuisines.length && (
        <TouchableOpacity
          onPress={handleLoadMore}
          className="mt-4 self-center bg-blue-500 px-5 py-2 rounded-md"
        >
          <Text className="text-white font-semibold text-sm">Load More</Text>
        </TouchableOpacity>
      )}

      <ReactNativeModal
        isVisible={isModalVisible}
        onBackdropPress={resetForm}
        className="m-0 justify-center items-center"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={80}
          style={{ width: '90%' }}
        >
          <View className="bg-white rounded-lg p-5 max-h-[90%]">
            <RNScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-lg font-semibold mb-4">
                {editMode ? 'Edit Cuisine' : 'Add New Cuisine'}
              </Text>

              <InputField
                label="Cuisine Name"
                placeholder="Enter cuisine name"
                icon={icons.cuisine}
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
              />

              <InputField
                label="Restaurant Name"
                value={restaurant[0]?.name}
                icon={icons.restaurant}
                editable={false}
              />

              <TouchableOpacity
                onPress={pickImage}
                className="flex-row items-center justify-center bg-gray-100 p-3 rounded-md my-4"
              >
                <Ionicons name="image-outline" size={20} color="#4B5563" />
                <Text className="ml-2 text-gray-700 font-medium">
                  {imageUri ? 'Change Image' : 'Select Image'}
                </Text>
              </TouchableOpacity>

              {uploading && (
                <Text className="text-blue-500 font-medium mb-2">Uploading image...</Text>
              )}

              {imageUri && (
                <Image source={{ uri: imageUri }} className="w-full h-36 rounded-md mb-3" />
              )}

              <View className="flex-row justify-between space-x-6 mt-2">
                <TouchableOpacity
                  onPress={resetForm}
                  className="flex-row items-center px-4 py-2 border border-gray-300 rounded-md"
                >
                  <Ionicons name="close-circle-outline" size={18} color="#6B7280" />
                  <Text className="ml-2 text-gray-600 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddCuisine}
                  disabled={uploading}
                  className={`flex-row items-center bg-emerald-500 px-4 py-2 rounded-md ${uploading ? 'opacity-50' : ''
                    }`}
                >
                  <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
                  <Text className="ml-2 text-white font-semibold">
                    {editMode ? 'Update' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            </RNScrollView>
          </View>
        </KeyboardAvoidingView>
      </ReactNativeModal>
    </View>
  );
};

export default CuisinesTable;
