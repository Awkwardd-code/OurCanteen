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
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

import { icons } from '@/constants';
import CustomButton from '@/components/CustomButton';
import { fetchAPI } from '@/lib/fetch';
import { useRouter } from 'expo-router';
import { uploadImageToCloudinary } from '@/lib/cloudinaryUtils';
import InputField from '@/components/InputFieldRestaurent';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [form, setForm] = useState({
    name: '',
    address: '',
    district: '',
    logo: '',
  });

  // Inline validation errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!user?.id) return;

    const fetchRestaurant = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
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
        setUploading(true);
        const secureUrl = await uploadImageToCloudinary(uri, setUploading);
        if (secureUrl) {
          setEditImageUri(secureUrl);
          setForm((prev) => ({ ...prev, logo: secureUrl }));
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        Alert.alert('Image Upload Error', 'Failed to upload the image.');
      } finally {
        setUploading(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Restaurant name is required';
    if (!form.address.trim()) newErrors.address = 'Restaurant address is required';
    if (!form.district.trim()) newErrors.district = 'Restaurant district is required';
    if (!(form.logo || imageUri)) newErrors.logo = 'Restaurant logo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('You must be logged in to update the restaurant.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    const finalLogo = form.logo || imageUri;

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 12, fontSize: 16 }}>Loading restaurant data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Restaurant</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ alignItems: 'center', width: '100%' }}>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.imagePickerContainer}
              accessibilityLabel="Pick restaurant logo"
              accessibilityRole="button"
            >
              <View style={styles.imageWrapper}>
                {editImageUri || imageUri ? (
                  <Image
                    source={{ uri: (editImageUri || imageUri) as string }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={icons.camera}
                    style={styles.cameraIcon}
                    resizeMode="contain"
                  />
                )}
              </View>
              <Text style={styles.imagePickerText}>Tap to change logo</Text>
              {!!errors.logo && <Text style={styles.errorText}>{errors.logo}</Text>}
            </TouchableOpacity>

            <View style={{ width: '100%' }}>
              <InputField
                label="Restaurant Name"
                placeholder="Enter Restaurant name"
                icon={icons.person}
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
                error={errors.name}
              />
              <InputField
                label="Restaurant Address"
                placeholder="Enter Restaurant Address"
                icon={icons.location}
                value={form.address}
                onChangeText={(value) => setForm({ ...form, address: value })}
                error={errors.address}
              />
              <InputField
                label="Restaurant District"
                placeholder="Enter Restaurant District"
                icon={icons.district}
                value={form.district}
                onChangeText={(value) => setForm({ ...form, district: value })}
                error={errors.district}
              />

              <CustomButton
                title={uploading ? 'Uploading...' : 'Update'}
                onPress={handleSubmit}
                disabled={uploading}
                style={{ marginTop: 24 }}
                accessibilityLabel="Update restaurant details"
                accessibilityRole="button"
              />
              {uploading && (
                <ActivityIndicator size="small" color="#2563EB" style={{ marginTop: 8, alignSelf: 'center' }} />
              )}

            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 30,
    marginLeft: 8,
    color: '#1F2937',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  imagePickerContainer: {
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cameraIcon: {
    width: 48,
    height: 48,
    opacity: 0.5,
  },
  imagePickerText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#6B7280',
  },
  errorText: {
    marginTop: 4,
    color: '#DC2626',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Update;
