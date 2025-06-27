import React, { useCallback, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithSearch from "@/components/HeaderWithSearch";
import { useTheme } from "@/context/ThemeContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import RestaurantDetails from "@/components/Products/RestaurantDetails";
import OfferMenu from "@/components/Products/OfferMenu";
import { Ionicons } from "@expo/vector-icons";

const Offer = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { offer_id, restaurant_id } = useLocalSearchParams<{
    offer_id: string;
    restaurant_id: string;
  }>();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleBackToHome = () => {
    router.push("/");
  };

  const ListHeader = () => (
    <>
      <View style={styles.headerContainer}>
        <HeaderWithSearch />
      </View>
      <RestaurantDetails restaurantId={restaurant_id} />
    </>
  );

  const ListFooter = () => (
    <TouchableOpacity
      style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
      onPress={handleBackToHome}
      activeOpacity={0.7}
    >
      <Ionicons name="arrow-back" size={20} color="#fff" />
      <Text style={styles.backButtonText}>Back to Home</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <OfferMenu
        offerId={offer_id!}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  offerText: {
    textAlign: "center",
    marginVertical: 12,
    fontSize: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
});

export default Offer;
