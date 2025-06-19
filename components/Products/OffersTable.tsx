import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary } from '@/lib/cloudinaryUtils';
import { fetchAPI } from '@/lib/fetch';
import Loader from '../Loader';
import InputField from '../InputField';
import { icons } from '@/constants';
import { useUser } from '@clerk/clerk-expo';

type Offer = {
  id: number;
  title: string;
  discount: number;
  image: string;
  created_at: string;
  updated_at: string;
};
type Restaurant = {
  id: number;
  name: string;
  logo?: string;
  address?: string;
  district?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};
const OffersTable = () => {
  const {user} = useUser();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [visibleOffers, setVisibleOffers] = useState(5);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', discount: '' });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI(`/(api)/offer`);
      setOffers(data);
    } finally {
      setLoading(false);
    }
  };
  const fetchRestaurantData = useCallback(async () => {
      if (!user?.id) return;
  
      try {
        setLoading(true);
        
        const response = await fetchAPI(`/(api)/restaurant?user_id=${user.id}`, {
          method: "GET",
        });
  
        if (response && response.length > 0) {
          setRestaurant(response[0]);
        } else {
          setRestaurant(null);
        }
      } catch (error) {
        console.error("Failed to fetch restaurant:", error);
      } finally {
        setLoading(false);
        
      }
    }, [user?.id]);
  useEffect(() => {
    fetchOffers();
    fetchRestaurantData();
  }, []);

  const handleLoadMore = () => {
    setVisibleOffers((prev) => Math.min(prev + 5, offers.length));
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
      if (secureUrl) setImageUri(secureUrl);
    }
  };

  const resetForm = () => {
    setForm({ title: '', discount: '' });
    setImageUri(null);
    setSelectedOffer(null);
    setEditMode(false);
    setModalVisible(false);
  };

  const handleAddOffer = async () => {
    if (!form.title || !form.discount || !imageUri) {
      alert('Fill all fields & select an image');
      return;
    }

    const payload = {
      title: form.title,
      discount: parseFloat(form.discount),
      image: imageUri,
      restaurant_id: restaurant?.id,
    };

    if (editMode && selectedOffer) {
      await fetchAPI(`/(api)/offer`, {
        method: 'PUT',
        body: JSON.stringify({
          id: selectedOffer?.id,
          title: form.title,
          discount: parseFloat(form.discount),
          image: imageUri,
        }),
      });
    } else {
      await fetchAPI(`/(api)/offer`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    fetchOffers();
    resetForm();
  };

  const handleEditOffer = (offer: Offer) => {
    setForm({ title: offer.title, discount: offer.discount.toString() });
    setImageUri(offer.image);
    setEditMode(true);
    setSelectedOffer(offer);
    setModalVisible(true);
  };

  const handleDeleteOffer = async (id: number) => {
    await fetchAPI(`/(api)/offer`, {
      method: 'DELETE',
      body: JSON.stringify({
        id
      }),
    });
    fetchOffers();
  };

  if (loading) return <Loader />;

  return (
    <View className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-gray-900">Offers</Text>
        <TouchableOpacity
          className="bg-emerald-500 px-4 py-2 rounded-md"
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Text className="text-white font-medium text-sm">+ Add Offer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="min-w-[600px]">
          <View className="flex-row bg-gray-50 py-3 border-b border-gray-200">
            <Text className="w-20 text-sm font-semibold text-gray-600 text-center">Image</Text>
            <Text className="w-60 text-sm font-semibold text-gray-600">Title</Text>
            <Text className="w-36 text-sm font-semibold text-gray-600 text-right pr-4">Discount (%)</Text>
            <Text className="w-24 text-sm font-semibold text-gray-600 text-right">Actions</Text>
          </View>

          {offers.slice(0, visibleOffers).map((offer) => (
            <View key={offer.id} className="flex-row items-center py-4 border-b border-gray-100">
              <View className="w-20 items-center">
                <Image source={{ uri: offer.image }} className="w-10 h-10 rounded-md" />
              </View>
              <Text className="w-60 text-sm text-gray-800">{offer.title}</Text>
              <Text className="w-36 text-sm text-gray-800 text-right pr-4">{offer.discount}%</Text>
              <View className="w-24 flex-row justify-end space-x-3 pr-2">
                <TouchableOpacity onPress={() => handleEditOffer(offer)}>
                  <Ionicons name="create-outline" size={20} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteOffer(offer.id)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {visibleOffers < offers.length && (
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-5 py-2 rounded-md self-center"
          onPress={handleLoadMore}
        >
          <Text className="text-white font-medium text-sm">Load More</Text>
        </TouchableOpacity>
      )}

      {/* Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 items-center justify-center bg-black/40"
        >
          <View className="bg-white w-11/12 rounded-xl p-5">
            <Text className="text-lg font-semibold mb-3">
              {editMode ? 'Edit Offer' : 'Add New Offer'}
            </Text>

            {/* <TextInput
              placeholder="Title"
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
              className="border border-gray-300 rounded-md p-3 mb-3 text-sm"
            /> */}
            <InputField
              label="Title"
              placeholder="Title"
              value={form.title}
              onChangeText={(val) => setForm({ ...form, title: val })}
              icon={icons.list}
              className="mb-4"
            />

            {/* <TextInput
              placeholder="Discount (e.g. 15.5)"
              keyboardType="numeric"
              value={form.discount}
              onChangeText={(text) => setForm({ ...form, discount: text })}
              className="border border-gray-300 rounded-md p-3 mb-3 text-sm"
            /> */}
            <InputField
              label="Discount"
              placeholder="E.g. 5%, 10%"
              value={form.discount}
              onChangeText={(val) => setForm({ ...form, discount: val })}
              icon={icons.dollar}
              className="mb-4"
            />

            <TouchableOpacity
              onPress={pickImage}
              className="flex-row items-center bg-gray-100 rounded-md p-3 mb-3"
            >
              <Ionicons name="image-outline" size={20} color="#6B7280" />
              <Text className="ml-2 text-sm text-gray-700">
                {imageUri ? 'Change Image' : 'Select Image'}
              </Text>
            </TouchableOpacity>

            {uploading && <Text className="text-blue-500 mb-2">Uploading...</Text>}

            {imageUri && (
              <Image source={{ uri: imageUri }} className="w-full h-40 rounded-md mb-3" />
            )}

            <View className="flex-row justify-between mt-2">
              <TouchableOpacity
                className="bg-gray-500 px-4 py-2 rounded-md"
                onPress={resetForm}
              >
                <Text className="text-white text-sm font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={uploading}
                className={`px-4 py-2 rounded-md ${uploading ? 'bg-blue-300' : 'bg-blue-600'}`}
                onPress={handleAddOffer}
              >
                <Text className="text-white text-sm font-medium">
                  {editMode ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default OffersTable;
