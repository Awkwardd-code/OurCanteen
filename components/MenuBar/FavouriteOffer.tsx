import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  FlatList,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

interface ComboOffer {
  id: string;
  name: string;
  type: string;
  cuisine: string;
  description: string;
  image: ImageSourcePropType;
  offerEndDate: string;
  restaurant: string;
}

const { width } = Dimensions.get("window");
const HORIZONTAL_MARGIN = 16;
const ITEM_PADDING = 12;
const ITEM_WIDTH = width - HORIZONTAL_MARGIN * 2;

const ComboOfferCard: React.FC<{ item: ComboOffer; onPress?: (item: ComboOffer) => void }> = ({
  item,
  onPress,
}) => {
  const navigation = useNavigation();

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(item);
    } else {
      // Example fallback navigation:
      // navigation.navigate("ComboOfferDetails", { offerId: item.id });
      console.log("Pressed:", item.name);
    }
  }, [item, onPress, navigation]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      accessibilityLabel={`${item.name} combo offer at ${item.restaurant}`}
      accessibilityRole="button"
      className="bg-white rounded-xl mb-4 p-3 shadow-md items-center"
      style={{ width: ITEM_WIDTH, alignSelf: "center" }}
    >
      <View
        className="rounded-xl overflow-hidden justify-center items-center"
        style={{ width: ITEM_WIDTH - ITEM_PADDING * 2, height: 180 }}
      >
        {item.image ? (
          <Image
            source={item.image}
            className="w-full h-full rounded-xl border border-gray-200"
            resizeMode="cover"
            onError={() => console.log(`Failed to load ${item.name} image`)}
          />
        ) : (
          <View className="w-full h-full bg-gray-200 rounded-xl justify-center items-center">
            <Text className="text-gray-400 text-xs text-center">No Image</Text>
          </View>
        )}
      </View>
      <View
        className="pt-2 w-full"
        style={{ width: ITEM_WIDTH - ITEM_PADDING * 2 }}
      >
        <Text className="text-gray-900 text-lg font-semibold mb-1" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-blue-500 text-sm font-medium mb-1" numberOfLines={1}>
          Restaurant: {item.restaurant}
        </Text>
        <Text className="text-blue-500 text-sm font-medium mb-1" numberOfLines={1}>
          Type: {item.type}
        </Text>
        <Text className="text-blue-500 text-sm font-medium mb-1" numberOfLines={1}>
          Cuisine: {item.cuisine}
        </Text>
        <Text className="text-gray-500 text-xs mb-1" numberOfLines={2}>
          {item.description}
        </Text>
        <Text className="text-gray-500 text-xs font-medium mt-1" numberOfLines={1}>
          Offer Ends: {item.offerEndDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const comboOffersData: ComboOffer[] = [
  {
    id: "1",
    name: "Family Pizza Feast",
    type: "Combo",
    cuisine: "Italian",
    description: "Two large pizzas, garlic bread, and a 2L soda.",
    image: require("@/assets/combo-offers/pizza-feast.png"),
    offerEndDate: "2025-06-30",
    restaurant: "Pizzaria Italiana",
  },
  {
    id: "2",
    name: "Indian Curry Duo",
    type: "Combo",
    cuisine: "Indian",
    description: "Butter chicken, palak paneer, naan, and rice for two.",
    image: require("@/assets/combo-offers/curry-duo.png"),
    offerEndDate: "2025-07-15",
    restaurant: "Spice Haven",
  },
  {
    id: "3",
    name: "Sushi Lover’s Platter",
    type: "Combo",
    cuisine: "Japanese",
    description: "20-piece sushi platter with miso soup and edamame.",
    image: require("@/assets/combo-offers/sushi-platter.png"),
    offerEndDate: "2025-06-25",
    restaurant: "Sushi Zen",
  },
  {
    id: "4",
    name: "Vegan Delight Bundle",
    type: "Combo",
    cuisine: "Vegetarian",
    description: "Vegan bowl, smoothie, and dessert for one.",
    image: require("@/assets/combo-offers/vegan-bundle.png"),
    offerEndDate: "2025-07-10",
    restaurant: "Green Eats",
  },
];

const Favourites: React.FC = () => {
  return (
    <View className="flex-1 bg-[#f5f5f5]">
      <Text className="text-2xl font-bold text-gray-900 px-5 pt-5 pb-3">
        Your Favourites
      </Text>
      <FlatList
        data={comboOffersData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ComboOfferCard item={item} />}
        contentContainerStyle={{ paddingVertical: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Favourites;
