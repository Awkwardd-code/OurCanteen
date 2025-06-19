import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import ComboOfferItem from "./ComboOfferItem";
import { fetchAPI } from "@/lib/fetch";

interface ComboOffer {
  id: string;
  name: string;
  type: string;
  cuisine: string;
  description: string;
  image?: { uri: string };
  offerEndDate: string;
  restaurant: string;
  price?: number;
}

const ComboOffersList = () => {
  const { theme } = useTheme();
  const [comboOffers, setComboOffers] = useState<ComboOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async (isRefreshing = false) => {
    try {
      setLoading(!isRefreshing);
      setRefreshing(isRefreshing);
      setError(null);
      
      const data = await fetchAPI("/(api)/combo_offer");
      const formattedData = data.map((offer: any) => ({
        ...offer,
        image: offer.image ? { uri: offer.image } : undefined,
        price: offer.price || 0,
      }));
      
      setComboOffers(formattedData);
    } catch (err) {
      setError("Failed to load combo offers. Please try again.");
      console.error("Error fetching combo offers:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchOffers(true);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.primary }]}>
          Loading combo offers...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Combo Deals
        </Text>
      </View>

      <FlatList
        data={comboOffers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ComboOfferItem item={item} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No combo offers available
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    marginBottom : 20,
  },
  header: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ComboOffersList;