/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import axios from "axios";
import { Restaurant } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Carousel from "react-native-reanimated-carousel";

const AllRestaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { theme } = useTheme();
  const router = useRouter();

  const { token } = useAuth();

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      console.log("Fetching restaurants...");
      const { data } = await axios.get("https://ourcanteennbackend.vercel.app/api/restaurant", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      console.log("Fetched restaurants:", data);
      setRestaurants(data);
    } catch (e) {
      console.error("Error fetching restaurants:", e);
      setError("Failed to load restaurants");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fallbackBanner = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"; // Minimal fallback image

  return (
    <View className="flex-1 mt-2 bg-white">
      <Text className="text-2xl font-bold text-neutral-900 text-center mt-2 mb-4 tracking-tight">All Canteen Near You</Text>

      {error && (
        <View className="bg-red-50 border border-red-200 rounded-lg py-2 px-4 mb-4">
          <Text className="text-red-600 text-center text-base">{error}</Text>
        </View>
      )}

      <View>
        <Carousel
          loop
          width={340}
          height={320}
          data={restaurants}
          autoPlay
          autoPlayInterval={3500}
          scrollAnimationDuration={900}
          style={{ marginBottom: 8, alignSelf: 'center' }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() => router.push(`/restaurant/${item._id}` as any)}
              style={{
                width: 320,
                borderRadius: 22,
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 4,
                overflow: 'hidden',
                alignSelf: 'center',
              }}
            >
              <View style={{ width: '100%', height: 180 }}>
                <Image
                  source={{ uri: item.banner || fallbackBanner }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderTopLeftRadius: 22,
                    borderTopRightRadius: 22,
                    backgroundColor: '#f3f4f6',
                  }}
                  resizeMode="cover"
                />
              </View>
              <View className="px-4 py-3">
                <Text
                  className="text-lg font-bold text-neutral-900 mb-1"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text
                  className="text-base font-semibold text-neutral-600"
                  numberOfLines={1}
                >
                  {item.institute}
                </Text>
                <Text
                  className="text-sm text-neutral-500"
                  numberOfLines={1}
                >
                  {item.location}
                </Text>
                <Text
                  className="text-base text-yellow-600"
                  numberOfLines={1}
                >
                  ★★★★★ 5.0
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 flex-1 items-center justify-center bg-white/60 z-10">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      )}
    </View>
  );
};

export default AllRestaurants;