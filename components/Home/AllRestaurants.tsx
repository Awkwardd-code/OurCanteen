/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-duplicates */
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { fetchAPI } from "@/lib/fetch";
import { Restaurant } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import RestaurantCardSkeleton from "../Skeletons/RestaurantCardSkeleton";
import { RefreshControl } from "react-native";

type RootStackParamList = {
  RestaurantDetails: { restaurantId: string };
  // Add other screens here as needed
};

const PAGE_LIMIT = 10;

interface Props {
  onPressRestaurant?: (restaurant: Restaurant) => void;
  showTitle?: boolean;
}

const AllRestaurants: React.FC<Props> = ({ onPressRestaurant, showTitle = true }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async (pageNumber: number, isRefreshing = false) => {
    if (loading && !isRefreshing) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetchAPI(
        `/(api)/restaurant?page=${pageNumber}&limit=${PAGE_LIMIT}`
      );
      
      if (!response || response.length === 0) {
        setHasMore(false);
      } else {
        const formattedData = response.map((r: any) => ({
          ...r,
          image: r.logo ? { uri: r.logo } : undefined,
          rating: typeof r.rating === 'number' ? r.rating : 0,
        }));

        if (pageNumber === 1 || isRefreshing) {
          setRestaurants(formattedData);
        } else {
          setRestaurants((prev) => [...prev, ...formattedData]);
        }
      }
    } catch (err) {
      setError("Failed to load restaurants. Please try again.");
      console.error("Restaurant fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchRestaurants(1, true);
  }, []);

  useEffect(() => {
    fetchRestaurants(1);
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !loading && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRestaurants(nextPage);
    }
  };

  const handlePressRestaurant = useCallback(
    (restaurant: Restaurant) => {
      onPressRestaurant?.(restaurant) ||
        navigation.navigate("RestaurantDetails", { restaurantId: restaurant.id });
    },
    [navigation, onPressRestaurant]
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <ActivityIndicator 
        size="large" 
        color={theme.colors.primary} 
        style={styles.loader} 
      />
    );
  };

  const renderItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handlePressRestaurant(item)}
      style={[styles.card, { backgroundColor: theme.colors.card }]}
    >
      <View style={styles.imageContainer}>
        {item.image?.uri ? (
          <Image
            source={{ uri: item.image.uri }}
            style={styles.image}
            resizeMode="cover"
            onError={() => console.log("Image failed to load")}
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>
              No Image
            </Text>
          </View>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <Text 
          style={[styles.name, { color: theme.colors.text }]} 
          numberOfLines={1}
        >
          {item.name}
        </Text>
        
        <View style={styles.metaContainer}>
          <Text style={[styles.cuisine, { color: theme.colors.primary }]} numberOfLines={1}>
            {item.cuisine || "Various Cuisines"}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={[styles.rating, { color: theme.colors.accent }]}>
              ★ {typeof item.rating === 'number' ? item.rating.toFixed(1) : 'N/A'}
            </Text>
          </View>
        </View>

        <Text 
          style={[styles.address, { color: theme.colors.textSecondary }]} 
          numberOfLines={2}
        >
          {item.address || "Address not available"}
        </Text>
        
        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {item.phone ? `📞 ${item.phone}` : "Phone not available"}
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {item.openingHours ? `🕒 ${item.openingHours}` : "Hours not available"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && page === 1 && !refreshing) {
    return (
      <View style={styles.skeletonContainer}>
        {[...Array(3)].map((_, i) => (
          <RestaurantCardSkeleton key={`skeleton-${i}`} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showTitle && (
        <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            All Restaurants
          </Text>
        </View>
      )}

      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!showTitle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
  },
  header: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: 180,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 14,
  },
  detailsContainer: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cuisine: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  ratingContainer: {
    marginLeft: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
  },
  address: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 12,
    flex: 1,
  },
  loader: {
    marginVertical: 16,
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  error: {
    textAlign: "center",
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  skeletonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default AllRestaurants;