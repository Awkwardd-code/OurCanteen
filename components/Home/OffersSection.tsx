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
} from "react-native";
import { useTheme } from "@/context/ThemeContext";
import Carousel from "react-native-reanimated-carousel";

type Offer = {
  id: number;
  title: string;
  discount: number;
  image: string;
  created_at: string;
  updated_at: string;
};

const { width } = Dimensions.get("window");
const horizontalPadding = 20;
const sliderItemWidth = width - horizontalPadding * 2;

const OffersSection = () => {
  const carouselRef = useRef(null);
  const { theme } = useTheme();
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
    } catch (err: any) {
      console.error("Failed to fetch offers:", err);
      setError("Something went wrong while loading offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);
  
  const sliderImages = offers
    .map((offer) => offer.image)
    .filter((image) => typeof image === "string" && image.trim() !== "");

  const renderSliderItem = ({ item }: { item: string }) => (
    <TouchableOpacity activeOpacity={0.8} style={{ flex: 1 }}>
      {item ? (
        <Image
          source={{ uri: item }}
          style={{
            width: "100%",
            height: 180,
            borderRadius: 10,
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: 180,
            borderRadius: 10,
            backgroundColor: "#e5e5e5",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 12, color: "#888" }}>No Image</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderOfferItem = ({ item }: { item: Offer }) => (
    <View
      style={{
        width: "47%",
        marginBottom: 20,
        alignItems: "center",
        backgroundColor: "white",
        padding: 12,
        marginTop: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        marginHorizontal: "1.5%",
      }}
    >
      <Text style={{ fontSize: 12, color: "red", marginBottom: 4 }}>
        {item.discount}% OFF
      </Text>
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={{ width: 96, height: 96, borderRadius: 8, marginBottom: 8 }}
          resizeMode="contain"
        />
      ) : (
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 8,
            marginBottom: 8,
            backgroundColor: "#ddd",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 12, color: "#666" }}>No Image</Text>
        </View>
      )}
      <Text style={{ fontSize: 14, fontWeight: "500", textAlign: "center" }}>
        {item.title}
      </Text>
    </View>
  );

  return (
    <View style={{ width: "100%", paddingHorizontal: horizontalPadding }}>
      {/* Carousel */}
      <View style={{ width: "100%", alignItems: "center", marginTop: 8 }}>
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
          <View
            style={{
              height: 180,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#888" }}>
              No promotional images available
            </Text>
          </View>
        )}
      </View>

      {/* Offer Grid */}
      {loading ? (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#ff4444" />
          <Text style={{ marginTop: 8, color: "#888", fontSize: 14 }}>
            Loading offers...
          </Text>
        </View>
      ) : error ? (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <Text style={{ color: "red", fontSize: 14 }}>{error}</Text>
        </View>
      ) : offers.length === 0 ? (
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
          <Text style={{ color: "#888", fontSize: 14 }}>
            No offers available.
          </Text>
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

export default OffersSection;
