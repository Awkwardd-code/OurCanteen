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

type CuisineMenuProps = {
  cuisineId: string;
  refreshing: boolean;
  onRefresh: () => void;
  ListHeaderComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
};

const CuisineMenu: React.FC<CuisineMenuProps> = ({
  cuisineId,
  refreshing,
  onRefresh,
  ListHeaderComponent,
  ListFooterComponent,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cuisineMap, setCuisineMap] = useState<Record<number, string>>({});

  const fetchData = async () => {
    try {
      setLoading(true);

      const [products, cuisines] = await Promise.all([
        fetchAPI(`/(api)/product?cuisine_id=${cuisineId}`),
        fetchAPI("/(api)/cuisine"),
      ]);

      setMenuItems(Array.isArray(products) ? products : []);

      const cuisineMap: Record<number, string> = {};
      if (Array.isArray(cuisines)) {
        cuisines.forEach((c: Cuisine) => {
          cuisineMap[c.id] = c.name;
        });
      }
      setCuisineMap(cuisineMap);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cuisineId) fetchData();
  }, [cuisineId]);

  const handlePressItem = (item: MenuItem) => {
    const cuisineName = cuisineMap[item.cuisine_id] ?? "Unknown";

    router.push({
      pathname: "/product/productDetails",
      params: {
        product: JSON.stringify(item),
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
          <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>৳ {item.price}</Text>
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
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListHeaderComponent={ListHeaderComponent ?? null}
        ListFooterComponent={ListFooterComponent ?? null}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 40,
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
});

export default CuisineMenu;
