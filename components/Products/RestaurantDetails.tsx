/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { fetchAPI } from "@/lib/fetch";
import { Restaurant } from "@/types";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  restaurantId: string;
  showTitle?: boolean;
}

const RestaurantDetails: React.FC<Props> = ({ restaurantId, showTitle = true }) => {
  const { theme } = useTheme();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurant = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAPI(`/(api)/restaurant?id=${restaurantId}`);

      if (!response || response.length === 0) {
        setError("Restaurant not found");
        setRestaurant(null);
      } else {
        const r = response[0];
        setRestaurant({
          ...r,
          image: r.logo ? { uri: r.logo } : undefined,
          rating: typeof r.rating === "number" ? r.rating : 0,
        });
      }
    } catch (err) {
      setError("Failed to load restaurant. Please try again.");
      console.error("Restaurant fetch error:", err);
      setRestaurant(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRestaurant();
  };

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurant();
    }
  }, [restaurantId]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: theme.colors.textSecondary }}>No restaurant data available</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <View style={styles.imageContainer}>
          {restaurant.image?.uri ? (
            <Image source={{ uri: restaurant.image.uri }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.background }]}>
              <Text style={{ color: theme.colors.textSecondary }}>No Image Available</Text>
            </View>
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{restaurant.name}</Text>

          <View style={styles.metaContainer}>
            <Text style={[styles.cuisine, { color: theme.colors.primary }]}>
              {restaurant.cuisine || "Various Cuisines"}
            </Text>
            <Text style={[styles.rating, { color: theme.colors.accent }]}>
              ★ {restaurant.rating.toFixed(1)}
            </Text>
          </View>

          <Text style={[styles.address, { color: theme.colors.textSecondary }]}>
            {restaurant.address || "Address not available"}
          </Text>

          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              {restaurant.phone ? `📞 ${restaurant.phone}` : "Phone not available"}
            </Text>
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              {restaurant.openingHours ? `🕒 ${restaurant.openingHours}` : "Hours not available"}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: 220,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    padding: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cuisine: {
    fontSize: 16,
    fontWeight: "600",
  },
  rating: {
    fontSize: 16,
    fontWeight: "700",
  },
  address: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  errorText: {
    fontSize: 16,
  },
});

export default RestaurantDetails;
