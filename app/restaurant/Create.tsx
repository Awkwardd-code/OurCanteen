/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
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

import { icons } from '@/constants';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import { fetchAPI } from '@/lib/fetch';
import { useRouter } from 'expo-router';
import { uploadImageToCloudinary } from '@/lib/cloudinaryUtils';

const Create = () => {
  const { user } = useUser();
  const router = useRouter();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    district: '',
    logo: '', // This will store the Cloudinary URL
  });

  /* ------------------Image---------------- */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const localUri = result.assets[0].uri;
      setImageUri(localUri);

      // Upload to Cloudinary and get secure URL
      const secureUrl = await uploadImageToCloudinary(localUri, setUploading);
      if (secureUrl) {
        // Update form.logo with Cloudinary URL for submission
        setForm(prev => ({ ...prev, logo: secureUrl }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (!user) {
        alert('You must be logged in to create a restaurant.');
        return;
      }

      // Validate all fields including logo URL
      if (!form.name || !form.address || !form.district || !form.logo) {
        alert('All fields including logo are required.');
        return;
      }

      await fetchAPI("/(api)/restaurant", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          district: form.district,
          logo: form.logo, // Send Cloudinary URL, not local URI
          userId: user?.id,
        }),
      });

      alert('Restaurant created successfully!');

      // Reset form and image preview
      setForm({
        name: '',
        address: '',
        district: '',
        logo: '',
      });
      setImageUri(null);

      // Navigate to admin home
      router.push('/(admin)/(tabs)/home');
    } catch (err: any) {
      console.error('Submit Error:', err);
      alert(
        `Failed to create restaurant: ${err.message.includes('Network')
          ? 'Cannot connect to server. Please ensure the server is running and accessible.'
          : err.message
        }`
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 items-center justify-center px-5">
            {/* Logo Picker */}
            <TouchableOpacity onPress={pickImage} className="mb-6">
              <View className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden items-center justify-center">
                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={icons.camera}
                    className="w-12 h-12 opacity-50"
                    resizeMode="contain"
                  />
                )}
              </View>
              <Text className="text-center mt-2 text-sm text-gray-500">Tap to add logo</Text>
            </TouchableOpacity>

            {/* Form Section */}
            <View className="w-full">
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
                title={uploading ? "Uploading..." : "Submit"}
                onPress={handleSubmit}
                disabled={uploading}
                className="mt-6"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Create;
