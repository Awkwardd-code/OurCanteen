import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useTheme } from "@/context/ThemeContext";
import { fetchAPI } from "@/lib/fetch";
import { Cuisine } from "@/types";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.25;
const ITEM_HEIGHT = 100;

type PopularCuisinesCarouselProps = {
  restaurantId: string; // receive restaurant_id as prop
};

const PopularCuisinesCarousel: React.FC<PopularCuisinesCarouselProps> = ({
  restaurantId,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const data = await fetchAPI("/(api)/cuisine");
        setCuisines(data);
      } catch (error) {
        console.error("Error fetching cuisines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCuisines();
  }, []);

  const handleCuisinePress = (cuisineId: number, restaurantId: number) => {
    router.push({
      pathname: "/(root)/restaurant/cuisine",
      params: {
        restaurant_id: restaurantId.toString(),
        cuisine_id: cuisineId.toString(),
      },
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Popular Cuisines
        </Text>
      </View>

      <Carousel
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
        data={cuisines}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleCuisinePress(item.id, item.restaurant_id)}
            activeOpacity={0.7}
          >
            <View style={[styles.imageContainer, { backgroundColor: theme.colors.card }]}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.image}
                  resizeMode="contain"
                />
              ) : (
                <Text style={[styles.placeholder, { color: theme.colors.textSecondary }]}>
                  {item.name.charAt(0)}
                </Text>
              )}
            </View>
            <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        loop
        autoPlay
        autoPlayInterval={3000}
        style={{ width: '100%' }}
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
  item: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  imageContainer: {
    width: ITEM_WIDTH - 16,
    height: ITEM_WIDTH - 16,
    borderRadius: (ITEM_WIDTH - 16) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  placeholder: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  name: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    maxWidth: ITEM_WIDTH - 16,
  },
});

export default PopularCuisinesCarousel;
