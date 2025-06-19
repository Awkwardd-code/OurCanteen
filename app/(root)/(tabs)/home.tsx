import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderWithSearch from "@/components/HeaderWithSearch";
import OffersSection from "@/components/Home/OffersSection";
import PopularCuisinesCarousel from "@/components/Home/PopularCuisinesCarousel";
import OurBengaliItemsCarousel from "@/components/Home/OurBengaliItemsCarousel";
import OurMenu from "@/components/Home/OurMenu";
import ComboOffers from "@/components/Home/ComboOffers";
import AllRestaurants from "@/components/Home/AllRestaurants";
import { useTheme } from "@/context/ThemeContext";


const Home = () => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Sticky Header */}
      <View style={styles.headerContainer}>
        <HeaderWithSearch />
      </View>

      {/* Content */}
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
          <View style={styles.contentContainer}>
            <OffersSection />
            <PopularCuisinesCarousel />
            <OurBengaliItemsCarousel />
            <AllRestaurants />
            <OurMenu />
            <ComboOffers />
          </View>
        }
        keyboardShouldPersistTaps="handled"
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
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  listContent: {
    paddingBottom: 16,
  flexGrow: 1,
  },
});

export default Home;