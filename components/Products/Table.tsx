/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import InputField from '../InputField';
import Loader from '../Loader';
import { icons } from '@/constants';
import { useUser } from '@clerk/clerk-expo';
import { fetchAPI } from '@/lib/fetch';
import { uploadImageToCloudinary } from '@/lib/cloudinaryUtils';

type Products = {
  id: number;
  name: string;
  offer_id: number;
  cuisine_id: number;
  restaurant_id: number;
  description: string;
  price: number;
  image: string;
  specialities: string;
  isPopular: boolean;
  isBengali: boolean;
  isSpecial: boolean;
};

type Cuisine = {
  id: number;
  name: string;
};

type Offer = {
  id: number;
  title: string;
};

type Restaurant = {
  id: number;
  name: string;
};

const ProductsTable = () => {
  const { user } = useUser();

  const [comboOffers, setComboOffers] = useState<Products[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const [visibleCombos, setVisibleCombos] = useState(5);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<Products | null>(null);

  const [form, setForm] = useState({
    name: '',
    specialities: '',
    offer_id: 0,
    cuisine_id: 0,
    price: 0,
    restaurant_id: 0,
    description: '',
    image: '',
  });

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchRestaurant();
      fetchCuisines();
      fetchOffers();
      fetchCombos();
    }
  }, [user?.id]);

  const fetchRestaurant = async () => {
    try {
      const data = await fetchAPI(`/(api)/restaurant?user_id=${user?.id}`);
      if (data.length > 0) {
        setRestaurant(data[0]);
        setForm((prev) => ({ ...prev, restaurant_id: data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    }
  };

  const fetchCuisines = async () => {
    try {
      const data = await fetchAPI(`/(api)/cuisine`);
      setCuisines(data);
    } catch (error) {
      console.error('Error fetching cuisines:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const data = await fetchAPI(`/(api)/offer`);
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };
  console.log(offers);
  const fetchCombos = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI(`/(api)/product`);
      setComboOffers(data);
    } catch (error) {
      console.error('Error fetching combo offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        const secureUrl = await uploadImageToCloudinary(uri, setUploading);
        if (secureUrl) setImageUri(secureUrl);
      }
    } catch (error) {
      console.error('Image picking error:', error);
    }
  };

  const handleSaveCombo = async () => {
    if (!form.name || !form.price || !form.cuisine_id || !imageUri || !form.description || !form.specialities) {
      alert('Please fill all fields and upload an image.');
      return;
    }

    try {
      const body = JSON.stringify({
        id: selectedCombo?.id,
        name: form.name,
        specialities: form.specialities,
        price: form.price,
        offerId: form.offer_id,
        cuisineId: form.cuisine_id,
        restaurantId: form.restaurant_id,
        description: form.description,
        image: imageUri,
      });

      const method = editMode ? 'PUT' : 'POST';
      await fetchAPI('/(api)/product', { method, body });

      alert(editMode ? 'Product updated!' : 'Product created!');
      resetForm();
      fetchCombos();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleDeleteCombo = async (id: number) => {
    try {
      await fetchAPI('/(api)/product', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      alert('Product deleted!');
      fetchCombos();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Delete failed.');
    }
  };

  const handleEditCombo = (combo: Products) => {
    setForm({
      name: combo.name,
      price: combo.price,
      offer_id: combo.offer_id,
      specialities: combo.specialities,
      cuisine_id: combo.cuisine_id,
      restaurant_id: combo.restaurant_id,
      description: combo.description,
      image: combo.image,
    });
    setImageUri(combo.image);
    setEditMode(true);
    setSelectedCombo(combo);
    setModalVisible(true);
  };

  const resetForm = () => {
    setForm((prev) => ({
      name: '',
      specialities: '',
      offer_id: 0,
      price: 0,
      cuisine_id: 0,
      restaurant_id: prev.restaurant_id,
      description: '',
      image: '',
    }));
    setImageUri(null);
    setEditMode(false);
    setSelectedCombo(null);
    setModalVisible(false);
  };

  const handleLoadMore = () => {
    setVisibleCombos((prev) => Math.min(prev + 5, comboOffers.length));
  };

  if (loading) return <Loader />;

  return (
    <View className="bg-white p-5 rounded-2xl border border-gray-100 shadow-lg mb-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-2xl font-bold text-gray-800">Products</Text>
        <TouchableOpacity
          onPress={() => {
            setEditMode(false);
            resetForm();
            setModalVisible(true);
          }}
          className="bg-teal-500 px-5 py-2.5 rounded-lg flex-row items-center space-x-2 shadow-sm"
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text className="text-white font-semibold text-base">Add Product</Text>
        </TouchableOpacity>
      </View>

      {/* Product Table */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ minWidth: 950 }}>
        <View>
          {/* Table Header */}
          <View className="flex-row bg-gray-50 border-b border-gray-200 py-4 px-2">
            <Text className="w-20 text-center font-semibold text-gray-600 text-sm">Image</Text>
            <Text className="w-60 font-semibold text-gray-600 text-sm">Name</Text>
            <Text className="w-60 font-semibold text-gray-600 text-sm">Offer</Text>
            <Text className="w-60 font-semibold text-gray-600 text-sm">Restaurant</Text>
            <Text className="w-60 font-semibold text-gray-600 text-sm">Cuisine</Text>
            <Text className="w-60 font-semibold text-gray-600 text-sm">Speciality</Text>
            <Text className="w-60 font-semibold text-gray-600 text-sm">Description</Text>
            <Text className="w-32 font-semibold text-center text-gray-600 text-sm">Actions</Text>
          </View>

          {/* Table Rows */}
          {comboOffers.slice(0, visibleCombos).map((combo) => {
            const offerTitle = offers.find((o) => o.id === combo.offer_id)?.title || 'N/A';
            const cuisineName = cuisines.find((c) => c.id === combo.cuisine_id)?.name || 'N/A';
            const restaurantName = restaurant?.id === combo.restaurant_id ? restaurant.name : 'N/A';

            return (
              <View key={combo.id} className="flex-row border-b border-gray-100 py-4 px-2 items-center">
                <View className="w-20 items-center">
                  <Image source={{ uri: combo.image }} className="w-12 h-12 rounded-lg border border-gray-200" />
                </View>
                <Text className="w-60 text-sm text-gray-700 font-medium">{combo.name}</Text>
                <Text className="w-60 text-sm text-gray-700 font-medium">{offerTitle}</Text>
                <Text className="w-60 text-sm text-gray-700 font-medium">{restaurantName}</Text>
                <Text className="w-60 text-sm text-gray-700 font-medium">{cuisineName}</Text>
                <Text className="w-60 text-sm text-gray-700 font-medium">{combo.specialities}</Text>
                <Text className="w-60 text-sm text-gray-700 font-medium">{combo.description}</Text>
                <View className="w-28 flex-row justify-center space-x-3">
                  <TouchableOpacity onPress={() => handleEditCombo(combo)}>
                    <Ionicons name="create-outline" size={20} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteCombo(combo.id)}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Load More */}
      {visibleCombos < comboOffers.length && (
        <TouchableOpacity
          onPress={handleLoadMore}
          className="mt-5 bg-indigo-600 px-6 py-3 rounded-lg self-center shadow-md"
        >
          <Text className="text-white font-semibold text-base">Load More</Text>
        </TouchableOpacity>
      )}

      {/* Modal */}
      <ReactNativeModal isVisible={isModalVisible} onBackdropPress={resetForm} className="justify-center mx-4">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView className="bg-white p-6 rounded-2xl max-h-[90%] shadow-2xl">
            <Text className="text-xl font-bold text-gray-800 mb-5">
              {editMode ? 'Edit Product' : 'Add Product'}
            </Text>

            <InputField
              label="Product Name"
              placeholder="Enter product name"
              value={form.name}
              onChangeText={(val) => setForm({ ...form, name: val })}
              icon={icons.cuisine}
              className="mb-4"
            />

            <InputField
              label="Specialities"
              placeholder="E.g. Spicy, Vegan"
              value={form.specialities}
              onChangeText={(val) => setForm({ ...form, specialities: val })}
              icon={icons.type}
              className="mb-4"
            />

            <InputField
              label="Price"
              placeholder="E.g. 9.99"
              value={String(form.price)}
              onChangeText={(val) => setForm({ ...form, price: parseFloat(val) || 0 })}
              icon={icons.dollar}
              className="mb-4"
              keyboardType="numeric"
            />

            <Text className="text-sm font-semibold text-gray-700 mb-2">Cuisine</Text>
            <Picker
              selectedValue={form.cuisine_id}
              onValueChange={(val: number) => setForm({ ...form, cuisine_id: val })}
              style={{ height: Platform.OS === 'ios' ? 120 : 50, color: '#1f2937' }}
              itemStyle={{ height: 80, fontSize: 14, color: '#1f2937' }}
              dropdownIconColor="#6b7280"
            >
              <Picker.Item label="Select Cuisine" value={0} />
              {cuisines.map((cuisine) => (
                <Picker.Item key={cuisine.id} label={cuisine.name} value={cuisine.id} />
              ))}
            </Picker>

            <Text className="text-sm font-semibold text-gray-700 mb-2">Offer</Text>
            <Picker
              selectedValue={form.offer_id}
              onValueChange={(val: number) => setForm({ ...form, offer_id: val })}
              style={{ height: Platform.OS === 'ios' ? 120 : 50, color: '#1f2937' }}
              itemStyle={{ height: 80, fontSize: 14, color: '#1f2937' }}
              dropdownIconColor="#6b7280"
            >
              <Picker.Item label="Select Offer" value={0} />
              {offers.map((offer) => (
                <Picker.Item key={offer.id} label={offer.title} value={offer.id} />
              ))}
            </Picker>

            <Text className="text-sm font-semibold text-gray-700 mb-2">Restaurant</Text>
            <TextInput
              value={restaurant?.name || ''}
              editable={false}
              className="border border-gray-200 p-3 rounded-lg text-gray-600 bg-gray-100 mb-4 text-sm"
            />

            <Text className="text-sm font-semibold text-gray-700 mb-2">Description</Text>
            <TextInput
              placeholder="Enter a short description"
              multiline
              className="border border-gray-200 p-3 rounded-lg text-gray-800 mb-4 min-h-[80px] text-sm"
              numberOfLines={3}
              value={form.description}
              onChangeText={(val) => setForm({ ...form, description: val })}
            />

            <Text className="text-sm font-semibold text-gray-700 mb-2">Image</Text>
            <TouchableOpacity
              onPress={pickImage}
              className="bg-gray-100 border border-gray-200 p-3 rounded-lg mb-4 flex-row items-center space-x-2"
            >
              <Ionicons name="image-outline" size={20} color="#4B5563" />
              <Text className="text-gray-700 font-medium text-sm">
                {imageUri ? 'Change Image' : 'Upload Image'}
              </Text>
            </TouchableOpacity>

            {uploading && <Text className="text-indigo-500 text-sm mb-2">Uploading image...</Text>}
            {imageUri && (
              <Image
                source={{ uri: imageUri }}
                className="w-full h-40 rounded-lg mb-4 border border-gray-200"
                resizeMode="cover"
              />
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
                onPress={handleSaveCombo}
                disabled={uploading}
                className={`flex-row items-center bg-emerald-500 px-4 py-2 rounded-md ${uploading ? 'opacity-50' : ''}`}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
                <Text className="ml-2 text-white font-semibold">
                  {editMode ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ReactNativeModal>

    </View>
  );
};

export default ProductsTable;
