/* eslint-disable import/no-duplicates */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
import { fetchAPI } from "@/lib/fetch";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { useTheme } from "@/context/ThemeContext";

// Navigation type (assuming a stack navigator)
type RootStackParamList = {
  SpecialOfferDetails: { offerId: string };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Types
interface SpecialItemOffer {
  id: string;
  name: string;
  type: string;
  cuisine: string;
  description: string;
  discount: string;
  image: ImageSourcePropType | null;
  offerEndDate: string;
  restaurant: string;
}

interface Cuisine {
  id: number;
  name: string;
}

interface Restaurant {
  id: number;
  name: string;
}

interface ApiSpecialOffer {
  id: string;
  name: string;
  type: string;
  cuisine_id: number;
  description: string;
  discount: string;
  image_url: string;
  offer_end_date: string;
  restaurant_id: number;
}

interface Props {
  item: SpecialItemOffer;
  onPressOffer?: (offer: SpecialItemOffer) => void;
  theme: any;
}

// Constants
const { width } = Dimensions.get("window");
const HORIZONTAL_MARGIN = 16;
const ITEM_PADDING = 12;
const ITEM_WIDTH = width - HORIZONTAL_MARGIN * 2;

const SpecialItemOffers: React.FC<Props> = ({ item, onPressOffer, theme }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = useCallback(() => {
    onPressOffer?.(item) || navigation.navigate("SpecialOfferDetails", { offerId: item.id });
  }, [navigation, onPressOffer, item]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      accessibilityLabel={`${item.name} special offer at ${item.restaurant}`}
      accessibilityRole="button"
      style={[
        styles.itemContainer,
        { 
          backgroundColor: theme.colors.cardBackground,
          shadowColor: theme.colors.shadow,
        }
      ]}
    >
      <View
        style={[styles.imageContainer, { width: ITEM_WIDTH - ITEM_PADDING * 2 }]}
      >
        {item.image ? (
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="cover"
            onError={() => console.log(`Failed to load ${item.name} image`)}
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.placeholder }]}>
            <Text style={{ color: theme.colors.textSecondary }}>No Image</Text>
          </View>
        )}
      </View>
      <View style={[styles.contentContainer, { width: ITEM_WIDTH - ITEM_PADDING * 2 }]}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.discount, { color: theme.colors.accent }]} numberOfLines={1}>
          {item.discount} % Off
        </Text>
        <Text style={[styles.detail, { color: theme.colors.primary }]} numberOfLines={1}>
          Restaurant: {item.restaurant}
        </Text>
        <Text style={[styles.detail, { color: theme.colors.primary }]} numberOfLines={1}>
          Type: {item.type}
        </Text>
        <Text style={[styles.detail, { color: theme.colors.primary }]} numberOfLines={1}>
          Cuisine: {item.cuisine}
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={[styles.date, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          Offer Ends: {item.offerEndDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const SpecialItemOffersList: React.FC = () => {
  const [comboOffers, setComboOffers] = useState<SpecialItemOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { theme } = useTheme();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [restaurantData, cuisineData, offerData] = await Promise.all([
        fetchAPI(`/(api)/restaurant`),
        fetchAPI(`/(api)/cuisine`),
        fetchAPI(`/(api)/special_offer`),
      ]);

      // Validate API responses
      if (!Array.isArray(restaurantData) || !Array.isArray(cuisineData) || !Array.isArray(offerData)) {
        throw new Error("Invalid API response format");
      }

      const mappedOffers: SpecialItemOffer[] = offerData.map((offer) => ({
        id: offer.id,
        name: offer.name,
        type: offer.type,
        cuisine: cuisineData.find((c) => c.id === offer.cuisine_id)?.name || "Unknown",
        description: offer.description,
        discount: offer.discount,
        image: offer.image && typeof offer.image === "string" ? { uri: offer.image } : null,
        offerEndDate: offer.offer_end_date,
        restaurant: restaurantData.find((r) => r.id === offer.restaurant_id)?.name || "Unknown",
      }));

      setComboOffers(mappedOffers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load offers. Please try again later.";
      console.error("Error fetching data:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Loading offers...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.colors.textPrimary }]}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={fetchData}
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          accessibilityLabel="Retry loading offers"
          accessibilityRole="button"
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
        Special Item Offers
      </Text>
      {comboOffers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No offers available
          </Text>
        </View>
      ) : (
        <FlatList
          data={comboOffers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SpecialItemOffers item={item} theme={theme} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          windowSize={5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    width: ITEM_WIDTH,
    alignSelf: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  discount: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  listContainer: {
    width: '100%',
    paddingHorizontal: HORIZONTAL_MARGIN,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default SpecialItemOffersList;