import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

interface ComboOffer {
  id: string;
  name: string;
  type: string;
  cuisine: string;
  description: string;
  image?: ImageSourcePropType;
  offerEndDate: string;
  restaurant: string;
}

interface Props {
  item: ComboOffer;
  onPressOffer?: (offer: ComboOffer) => void;
}

const { width } = Dimensions.get("window");
const HORIZONTAL_MARGIN = 16;
const ITEM_PADDING = 12;
const ITEM_WIDTH = width - HORIZONTAL_MARGIN * 2;

const ComboOfferItem: React.FC<Props> = ({ item, onPressOffer }) => {
  const navigation = useNavigation();

  const handlePress = useCallback(() => {
    if (onPressOffer) {
      onPressOffer(item);
    } else {
    //   navigation.navigate("ComboOfferDetails", { offerId: item.id });
    }
  }, [navigation, onPressOffer, item]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      accessibilityLabel={`${item.name} combo offer at ${item.restaurant}`}
      accessibilityRole="button"
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 16,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        alignItems: "center",
        width: ITEM_WIDTH,
        alignSelf: "center",
      }}
    >
      <View
        style={{
          borderRadius: 16,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
          width: ITEM_WIDTH - ITEM_PADDING * 2,
          height: 180,
        }}
      >
        {item.image ? (
          <Image
            source={item.image}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
            resizeMode="cover"
            onError={() => console.log(`Failed to load ${item.name} image`)}
          />
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#e5e7eb",
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#6b7280", fontSize: 12, textAlign: "center" }}>
              No Image
            </Text>
          </View>
        )}
      </View>

      <View style={{ paddingTop: 8, width: ITEM_WIDTH - ITEM_PADDING * 2 }}>
        <Text
          style={{
            color: "#1f2937",
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 4,
          }}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text
          style={{ color: "#3b82f6", fontSize: 14, fontWeight: "500", marginBottom: 4 }}
          numberOfLines={1}
        >
          Restaurant: {item.restaurant}
        </Text>
        <Text
          style={{ color: "#3b82f6", fontSize: 14, fontWeight: "500", marginBottom: 4 }}
          numberOfLines={1}
        >
          Type: {item.type}
        </Text>
        <Text
          style={{ color: "#3b82f6", fontSize: 14, fontWeight: "500", marginBottom: 4 }}
          numberOfLines={1}
        >
          Cuisine: {item.cuisine}
        </Text>
        <Text
          style={{ color: "#6b7280", fontSize: 12, marginBottom: 4 }}
          numberOfLines={2}
        >
          {item.description}
        </Text>
        <Text
          style={{ color: "#6b7280", fontSize: 12, fontWeight: "500", marginTop: 8 }}
          numberOfLines={1}
        >
          Offer Ends: {item.offerEndDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ComboOfferItem;
