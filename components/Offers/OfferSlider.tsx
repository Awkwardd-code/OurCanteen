/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

type Offer = {
  _id: string;
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
  const { token } = useAuth();
  const carouselRef = useRef(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("https://ourcanteennbackend.vercel.app/api/offer", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = response.data;
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
            height: "100%",
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

  
  return (
    <View style={{ width: "100%", paddingHorizontal: horizontalPadding }}>
      {/* Carousel */}
      <View style={{ width: "100%", alignItems: "center", marginTop: 8 }}>
        {sliderImages.length > 0 ? (
          <Carousel
            ref={carouselRef}
            width={sliderItemWidth}
            height={200}
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
              height: 200,
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
    </View>
  );
};

export default OffersSection;
