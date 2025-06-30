/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useTheme } from "@/context/ThemeContext";
import Loader from "../Loader";
import { useAuth } from "@/context/AuthContext";

const screenWidth = Dimensions.get("window").width;
const carouselItemWidth = screenWidth * 0.92; // 92% of screen width for margins (4% each side)

type MenuItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  cuisine_id: number;
  offer_id?: number;
  specialities?: string;
  restaurant_id?: number;
  restaurant_name?: string;
};

const OurMenu = () => {
  const { theme } = useTheme();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { token } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const MenuData = await axios.get("https://ourcanteennbackend.vercel.app/api/product", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      console.log('MenuData.data:', MenuData.data);
      setMenuItems(Array.isArray(MenuData.data) ? MenuData.data : []);
    } catch (error) {
      console.error("Failed to fetch menu:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePressItem = (item: MenuItem) => {
    console.log("Pressed item:", item);

    // item.restaurant_name = item.restaurant_name || "No restaurant name"; // Ensure restaurant_name is defined
    router.push({
      pathname: "/product/productDetails",
      params: {
        product: JSON.stringify(item),
      },
    });
  };

  if (loading && !refreshing) return <Loader />;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      <View className="p-4 mb-4" style={{ backgroundColor: theme.colors.card }}>
        <Text className="text-2xl font-bold text-center" style={{ color: theme.colors.text }}>
          Our Menu
        </Text>
      </View>
      {/* Debug: Show MenuData array
      {menuItems.length > 0 && (
        <View style={{ marginHorizontal: 16, marginBottom: 12, backgroundColor: '#f3f4f6', borderRadius: 8, padding: 8 }}>
          <Text style={{ fontSize: 12, color: '#333' }} selectable>
            {JSON.stringify(menuItems, null, 2)}
          </Text>
        </View>
      )} */}

      {menuItems.length > 0 ? (
        <View style={{ paddingHorizontal: 8 }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id ? String(item.id) : item.name + index}
              onPress={() => handlePressItem(item)}
              style={{
                flexDirection: 'row',
                backgroundColor: theme.colors.card,
                borderRadius: 12,
                marginBottom: 12,
                overflow: 'hidden',
                minHeight: 100,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#f1f1f1',
              }}
              accessibilityLabel={`View details for ${item.name}`}
              accessibilityRole="button"
            >
              {item.image && typeof item.image === 'string' && item.image.startsWith('http') ? (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 90, height: 90, borderTopLeftRadius: 12, borderBottomLeftRadius: 12, backgroundColor: '#f3f4f6' }}
                  resizeMode="cover"
                  onError={() => console.log(`Failed to load image for ${item.name}`)}
                />
              ) : (
                <View
                  style={{ width: 90, height: 90, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background, borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}
                >
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>No Image</Text>
                </View>
              )}
              <View style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 14, justifyContent: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.text, marginBottom: 2 }} numberOfLines={1}>
                  {item.name}
                </Text>
                {/* Show restaurant name if available */}
                {item.restaurant_name && (
                  <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 3 }} className="font-bold" numberOfLines={1}>
                    {item.restaurant_name}
                  </Text>
                )}
                {item.description && (
                  <Text style={{ fontSize: 11, color: theme.colors.textSecondary, marginBottom: 6 }} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
                <Text style={{ fontSize: 13, fontWeight: '500', color: theme.colors.primary, marginTop: 2 }}>
                  ৳ {item.price ?? '0.00'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View className="items-center mt-10">
          <Text
            className="text-base"
            style={{ color: theme.colors.textSecondary }}
          >
            No menu items available
          </Text>
          <TouchableOpacity
            onPress={handleRefresh}
            className="mt-4 px-4 py-2 rounded-lg"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default OurMenu;