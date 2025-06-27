import { fetchAPI } from "@/lib/fetch";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import Carousel from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";

type Offer = {
  id: number;
  title: string;
  discount: number;
  image: string;
  restaurant_id: number;
  created_at: string;
  updated_at: string;
};

const { width } = Dimensions.get("window");
const horizontalPadding = 20;
const sliderItemWidth = width - horizontalPadding * 2;

const OffersSection: React.FC = () => {
  const carouselRef = useRef(null);
  const { theme } = useTheme();
  const router = useRouter();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAPI("/(api)/offer");
      if (!Array.isArray(data)) throw new Error("Invalid response format");
      setOffers(data);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
      setError("Something went wrong while loading offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handlePressOffer = (offer: Offer) => {
    router.push({
      pathname: "/(root)/restaurant/offer",
      params: {
        offer_id: offer.id.toString(),
        restaurant_id: offer.restaurant_id.toString(),
      },
    });
  };

  const renderSliderItem = ({ item }: { item: string }) => (
    <TouchableOpacity activeOpacity={0.9} style={{ flex: 1 }}>
      <Image
        source={{ uri: item }}
        style={styles.sliderImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderOfferItem = ({ item }: { item: Offer }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => handlePressOffer(item)}
      style={[styles.offerCard, { backgroundColor: theme.colors.card }]}
    >
      <Text style={styles.discountText}>{item.discount}% OFF</Text>
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.offerImage}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <Text style={[styles.offerTitle, { color: theme.colors.text }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const sliderImages = offers
    .map((offer) => offer.image)
    .filter((img) => typeof img === "string" && img.trim() !== "");

  return (
    <View style={styles.container}>
      {/* Carousel Section */}
      <View style={styles.carouselContainer}>
        {sliderImages.length > 0 ? (
          <Carousel
            ref={carouselRef}
            width={sliderItemWidth}
            height={180}
            data={sliderImages}
            renderItem={renderSliderItem}
            loop
            autoPlay
            autoPlayInterval={3000}
            pagingEnabled
            snapEnabled
            style={{ width: sliderItemWidth }}
            mode="horizontal-stack"
            modeConfig={{
              snapDirection: "left",
              stackInterval: 0,
              scaleInterval: 0,
              opacityInterval: 0,
            }}
            scrollAnimationDuration={300}
          />
        ) : (
          <View style={styles.carouselPlaceholder}>
            <Text style={{ color: "#888" }}>No promotional images available</Text>
          </View>
        )}
      </View>

      {/* Grid Section */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading offers...</Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Text style={{ color: "red" }}>{error}</Text>
        </View>
      ) : offers.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No offers available.</Text>
        </View>
      ) : (
        <FlatList
          data={offers}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOfferItem}
          scrollEnabled={false}
          contentContainerStyle={{ paddingTop: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: horizontalPadding,
  },
  carouselContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  sliderImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },
  carouselPlaceholder: {
    height: 180,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#888",
  },
  offerCard: {
    width: "47%",
    marginBottom: 20,
    alignItems: "center",
    padding: 12,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: "1.5%",
  },
  discountText: {
    fontSize: 12,
    color: "red",
    marginBottom: 4,
  },
  offerImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 12,
    color: "#666",
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default OffersSection;
