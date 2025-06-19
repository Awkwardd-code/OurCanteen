/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

import { icons } from '@/constants';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import { fetchAPI } from '@/lib/fetch';
import { useRouter } from 'expo-router';
import { uploadImageToCloudinary } from '@/lib/cloudinaryUtils';

type Restaurant = {
  id: number;
  name: string;
  address: string;
  district: string;
  logo: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

const Update = () => {
  const { user } = useUser();
  const router = useRouter();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [editImageUri, setEditImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    district: '',
    logo: '',
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchRestaurant = async () => {
      try {
        const response = await fetchAPI(`/(api)/restaurant?user_id=${user.id}`, {
          method: 'GET',
        });

        if (response && Array.isArray(response) && response.length > 0) {
          const rest = response[0];
          setRestaurant(rest);
          setForm({
            name: rest.name,
            address: rest.address,
            district: rest.district,
            logo: rest.logo,
          });
          setImageUri(rest.logo);
        } else {
          Alert.alert('No restaurant found to update.');
          router.push('/restaurant/Create');
        }
      } catch (error) {
        console.error('Failed to load restaurant:', error);
        Alert.alert('Error', 'Failed to load restaurant data.');
      }
    };

    fetchRestaurant();
  }, [user?.id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;

      try {
        const secureUrl = await uploadImageToCloudinary(uri, setUploading);
        if (secureUrl) {
          setEditImageUri(secureUrl);
          setForm((prev) => ({ ...prev, logo: secureUrl }));
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        Alert.alert('Image Upload Error', 'Failed to upload the image.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('You must be logged in to update the restaurant.');
      return;
    }

    const finalLogo = form.logo || imageUri;

    if (!form.name || !form.address || !form.district || !finalLogo) {
      Alert.alert('All fields including logo are required.');
      return;
    }

    try {
      await fetchAPI(`/(api)/restaurant`, {
        method: 'PUT',
        body: JSON.stringify({
          id: restaurant?.id,
          name: form.name,
          address: form.address,
          district: form.district,
          logo: finalLogo,
          user_id: user?.id,
        }),
      });

      Alert.alert('Restaurant updated successfully!');
      router.push('/(admin)/(tabs)/home');
    } catch (err: any) {
      console.error('Update Error:', err);
      Alert.alert(
        'Update failed',
        err.message.includes('Network')
          ? 'Cannot connect to server. Please ensure the server is running and accessible.'
          : err.message
      );
    }
  };

  if (!restaurant) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading restaurant data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginBottom: 4 }}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 30, marginLeft: 8, color: '#1F2937' }}>
          Update Restaurant
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={pickImage} style={{ marginBottom: 24 }}>
              <View
                style={{
                  width: 128,
                  height: 128,
                  borderRadius: 64,
                  backgroundColor: '#E5E7EB',
                  overflow: 'hidden',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {editImageUri || imageUri ? (
                  <Image
                    source={{ uri: (editImageUri || imageUri) as string }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={icons.camera}
                    style={{ width: 48, height: 48, opacity: 0.5 }}
                    resizeMode="contain"
                  />
                )}

              </View>
              <Text style={{ textAlign: 'center', marginTop: 8, color: '#6B7280' }}>
                Tap to change logo
              </Text>
            </TouchableOpacity>

            <View style={{ width: '100%' }}>
              <InputField
                label="Restaurant Name"
                placeholder="Enter Restaurant name"
                icon={icons.person}
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
              />
              <InputField
                label="Restaurant Address"
                placeholder="Enter Restaurant Address"
                icon={icons.location}
                value={form.address}
                onChangeText={(value) => setForm({ ...form, address: value })}
              />
              <InputField
                label="Restaurant District"
                placeholder="Enter Restaurant District"
                icon={icons.district}
                value={form.district}
                onChangeText={(value) => setForm({ ...form, district: value })}
              />

              <CustomButton
                title={uploading ? 'Uploading...' : 'Update'}
                onPress={handleSubmit}
                disabled={uploading}
                style={{ marginTop: 24 }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Update;
