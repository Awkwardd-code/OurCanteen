import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useTheme } from "@/context/ThemeContext";
import { Restaurant } from "@/types";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width - 32; // Subtracting horizontal padding
const ITEM_HEIGHT = 280; // Increased height for better visibility

interface BengaliItem extends Restaurant {
  offer?: string;
  discount?: string;
  description?: string; // Added description to the interface
}

const OurBengaliItemsCarousel = () => {
  const { theme } = useTheme();
  const carouselRef = useRef(null);
  
  // Sample data - replace with your actual data fetching logic
  const bengaliItems: BengaliItem[] = [
    {
      id: "1",
      name: "Bengali Fish Curry",
      image: require("@/assets/specialities/sushi.png"),
      rating: 4.5,
      cuisine: "Bengali",
      offer: "Buy 1 Get 1 Free",
      discount: "20% Off",
      description: "Authentic macher jhol with mustard and spices.",
      address: "123 Food Street",
      phone: "123-456-7890",
      openingHours: "10AM - 10PM"
    },
    // Add more items...
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Our Bengali Specials
        </Text>
      </View>

      <Carousel
        ref={carouselRef}
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
        data={bengaliItems}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: theme.colors.card }]}
          >
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.details}>
              <View style={styles.textRow}>
                <Text style={[styles.name, { color: theme.colors.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.rating, { color: theme.colors.accent }]}>
                  ★ {item.rating.toFixed(1)}
                </Text>
              </View>
              <Text style={[styles.cuisine, { color: theme.colors.primary }]}>
                {item.cuisine}
              </Text>
              <View style={styles.offerContainer}>
                <Text style={[styles.offer, { color: theme.colors.text }]}>
                  {item.offer}
                </Text>
                <Text style={[styles.discount, { color: theme.colors.primary }]}>
                  {item.discount}
                </Text>
              </View>
              {item.description && (
                <Text 
                  style={[styles.description, { color: theme.colors.textSecondary }]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        loop
        autoPlay
        autoPlayInterval={4000}
        style={styles.carousel}
        // Removed panGestureHandlerProps as it's not supported in this version
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingBottom: 20,
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
  carousel: {
    width: '100%',
    paddingHorizontal: 16,
  },
  item: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 140,
  },
  details: {
    padding: 16,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cuisine: {
    fontSize: 14,
    marginBottom: 8,
  },
  offerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  offer: {
    fontSize: 14,
    fontWeight: '500',
  },
  discount: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default OurBengaliItemsCarousel;