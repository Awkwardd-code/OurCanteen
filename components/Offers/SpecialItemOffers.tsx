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
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

// Navigation type (assuming a stack navigator)
type RootStackParamList = {
  SpecialOfferDetails: { offerId: string };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Types
interface SpecialItemOffer {
  id: string;
  title: string;
  discount: string;
  image: ImageSourcePropType | null;
  createdAt: string;
  updatedAt: string;
  restaurantName: string;
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
      activeOpacity={0.85}
      onPress={handlePress}
      accessibilityLabel={`${item.title} special offer`}
      accessibilityRole="button"
      style={[
        styles.itemContainer,
        {
          backgroundColor: theme.colors.cardBackground,
          shadowColor: theme.colors.shadow,
        }
      ]}
    >
      <View style={[styles.imageContainer, { width: ITEM_WIDTH - ITEM_PADDING * 2 }]}>
        {item.image ? (
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="cover"
            onError={() => console.log(`Failed to load ${item.title} image`)}
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.placeholder }]}>
            <Text style={{ color: theme.colors.textSecondary }}>No Image</Text>
          </View>
        )}
        <View style={styles.discountBadge}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>{item.discount}% OFF</Text>
        </View>
      </View>
      <View style={[styles.contentContainer, { width: ITEM_WIDTH - ITEM_PADDING * 2 }]}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.restaurant, { color: '#8e24aa' }]} numberOfLines={1}>
          {item.restaurantName}
        </Text>
        <Text style={[styles.date, { color: theme.colors.textSecondary }]} numberOfLines={1}>
          Added: {new Date(item.createdAt).toLocaleDateString()}
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
  const { user, token } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("https://ourcanteennbackend.vercel.app/api/offer", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const offerData = response.data;
      if (!Array.isArray(offerData)) {
        throw new Error("Invalid API response format");
      }
      // Map API data to SpecialItemOffer type (only available fields)
      const mappedOffers: SpecialItemOffer[] = offerData.map((offer: any) => ({
        id: offer._id || '',
        title: offer.title || '',
        discount: offer.discount ? String(offer.discount) : '',
        image: offer.image && typeof offer.image === "string" ? { uri: offer.image } : null,
        createdAt: offer.created_at || '',
        updatedAt: offer.updated_at || '',
        restaurantName: offer.restaurant_name || '',
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
      <View className="p-4 " style={{ backgroundColor: theme.colors.card }}>
        <Text className="text-2xl font-bold text-center" style={{ color: theme.colors.text }}>
          Avilable Offers
        </Text>
      </View>
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
    borderRadius: 14,
    marginBottom: 18,
    padding: 0,
    width: ITEM_WIDTH,
    alignSelf: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    height: 170,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#e53935',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    padding: 14,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  restaurant: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
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