import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithSearch from "@/components/HeaderWithSearch";
import { useTheme } from "@/context/ThemeContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import RestaurantMenu from "@/components/Products/RestaurantMenu";
import RestaurantDetails from "@/components/Products/RestaurantDetails";

import { Ionicons } from "@expo/vector-icons";

const HomeMenu = () => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const { restaurant_id } = useLocalSearchParams();
  const router = useRouter();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleBackToHome = () => {
    router.push("/"); // change if your home route differs
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Sticky Header */}
      <View style={styles.headerContainer}>
        <HeaderWithSearch />
      </View>

      {/* Restaurant Details + Menu */}
      <FlatList
        data={[]}
        keyExtractor={(_, index) => `empty-${index}`}
        renderItem={null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListHeaderComponent={
          <>
            <RestaurantDetails restaurantId={restaurant_id as string} />
            <RestaurantMenu restaurantId={restaurant_id as string} />
            
            {/* Back to Home Button */}
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleBackToHome}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.backButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    zIndex: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 16,
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

export default HomeMenu;
