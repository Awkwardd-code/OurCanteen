/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { fetchAPI } from "@/lib/fetch";
import { useTheme } from "@/context/ThemeContext";
import Loader from "../Loader";

interface RestaurantMenuProps {
  restaurantId: string;
}

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
};

type Cuisine = {
  id: number;
  name: string;
};

type Restaurant = {
  id: number;
  name: string;
};

const RestaurantMenu: React.FC<RestaurantMenuProps> = ({ restaurantId }) => {
  const { theme } = useTheme();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cuisineMap, setCuisineMap] = useState<Record<number, string>>({});
  const [restaurantMap, setRestaurantMap] = useState<Record<number, string>>({});
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [products, cuisines, restaurants] = await Promise.all([
        fetchAPI(`/(api)/product?restaurant_id=${restaurantId}`),
        fetchAPI("/(api)/cuisine"),
        fetchAPI("/(api)/restaurant"),
      ]);

      setMenuItems(Array.isArray(products) ? products : []);

      const cuisineMap: Record<number, string> = {};
      if (Array.isArray(cuisines)) {
        cuisines.forEach((c: Cuisine) => {
          cuisineMap[c.id] = c.name;
        });
      }
      setCuisineMap(cuisineMap);

      const restaurantMap: Record<number, string> = {};
      if (Array.isArray(restaurants)) {
        restaurants.forEach((r: Restaurant) => {
          restaurantMap[r.id] = r.name;
        });
      }
      setRestaurantMap(restaurantMap);
    } catch (error) {
      console.error("Failed to fetch data:", error);
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
    if (restaurantId) fetchData();
  }, [restaurantId]);

  const handlePressItem = (item: MenuItem) => {
    const cuisineName = cuisineMap[item.cuisine_id] ?? "Unknown";
    const restaurantName = item.restaurant_id && restaurantMap[item.restaurant_id]
      ? restaurantMap[item.restaurant_id]
      : "Unknown";

    router.push({
      pathname: "/product/productDetails",
      params: {
        product: JSON.stringify(item),
        restaurant_name: restaurantName,
        cuisine_name: cuisineName,
      },
    });
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      onPress={() => handlePressItem(item)}
      style={[
        styles.itemContainer,
        {
          backgroundColor: theme.colors.card,
          width: screenWidth - 32,
        },
      ]}
    >
      <View style={styles.itemContent}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
        ) : (
          <View
            style={[
              styles.itemImage,
              styles.imagePlaceholder,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <Text style={{ color: theme.colors.textSecondary }}>No Image</Text>
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={[styles.itemName, { color: theme.colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>
            ৳ {item.price}
          </Text>
          {item.description && (
            <Text
              style={[styles.itemDescription, { color: theme.colors.textSecondary }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );



  if (loading && !refreshing) return <Loader />;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Our Menu</Text>
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No menu items available
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 40,
  },
  header: {
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  itemContainer: {
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: "#eaeaea",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});

export default RestaurantMenu;
