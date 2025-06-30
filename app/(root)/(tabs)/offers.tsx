import React from "react";
import {
  FlatList,
  View,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OfferSlider from "@/components/Offers/OfferSlider";
import { SpecialItemOffersList } from "@/components/Offers/SpecialItemOffers";
import { useTheme } from "@/context/ThemeContext";

const Offers = () => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView className="bg-red-800 pb-16" style={[styles.container]}>
      {/* Sticky Header */}
      <View style={styles.headerContainer}>
        {/* <HeaderWithSearch /> */}
      </View>

      {/* Content */}
      <FlatList
        className="bg-white pb-9"
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
            <OfferSlider />
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <SpecialItemOffersList />
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
    // paddingBottom: 8,
  },
  footerContainer: {
    // paddingTop: 0,
    marginTop: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
});

export default Offers;