import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";

// Constants
const { width } = Dimensions.get("window");
const HORIZONTAL_MARGIN = 16;
const ITEM_WIDTH = width - HORIZONTAL_MARGIN * 2;

// Colors (consistent with OurMenu, ComboOffers)
const COLORS = {
  primary: "#3b82f6",
  background: "#f5f5f5",
  cardBackground: "#ffffff",
  textPrimary: "#1f2937",
  textSecondary: "#6b7280",
  accent: "#f59e0b",
};

// Social media icons (placeholder paths, replace with your assets)
const SOCIAL_ICONS = [
  {
    id: "1",
    name: "Instagram",
    icon: require("@/assets/icons/instagram.png"),
    url: "https://www.instagram.com/foodiehub",
  },
  {
    id: "2",
    name: "Facebook",
    icon: require("@/assets/icons/facebook.png"),
    url: "https://www.facebook.com/foodiehub",
  },
  {
    id: "3",
    name: "Twitter",
    icon: require("@/assets/icons/twitter.png"),
    url: "https://www.twitter.com/foodiehub",
  },
];

// Navigation links
const NAV_LINKS = [
  { id: "1", title: "Home", screen: "Home" },
  { id: "2", title: "Menu", screen: "MenuList" },
  { id: "3", title: "Offers", screen: "OffersList" },
  { id: "4", title: "Contact", screen: "Contact" },
];

const Footer: React.FC = () => {
  const navigation = useNavigation();

  const handleNavLinkPress = useCallback(
    (screen: string) => {
      navigation.navigate(screen);
    },
    [navigation]
  );

  const handleSocialPress = useCallback(async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Cannot open URL: ${url}`);
    }
  }, []);

  return (
    <View
      className="bg-white rounded-t-xl shadow-md pt-6 pb-4 px-4 mt-4" // Reduced pb-8 to pb-4
      style={{ width }}
    >
      {/* Navigation Links */}
      <View className="flex-row flex-wrap justify-center mb-6" style={{ width: ITEM_WIDTH }}>
        {NAV_LINKS.map((link) => (
          <TouchableOpacity
            key={link.id}
            onPress={() => handleNavLinkPress(link.screen)}
            activeOpacity={0.7}
            accessibilityLabel={`Navigate to ${link.title}`}
            accessibilityRole="button"
            className="px-3 py-2"
          >
            <Text className="text-[#1f2937] text-sm font-medium">
              {link.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Social Media Icons */}
      <View className="flex-row justify-center mb-2" style={{ width: ITEM_WIDTH }}>
        {SOCIAL_ICONS.map((social) => (
          <TouchableOpacity
            key={social.id}
            onPress={() => handleSocialPress(social.url)}
            activeOpacity={0.7}
            accessibilityLabel={`Open ${social.name}`}
            accessibilityRole="button"
            className="mx-3"
          >
            <Image
              source={social.icon}
              className="w-8 h-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Contact Info */}
      <View className="mb-6" style={{ width: ITEM_WIDTH }}>
        <Text className="text-[#1f2937] text-sm font-semibold mb-2 text-center">
          Contact Us
        </Text>
        <Text className="text-[#6b7280] text-xs text-center">
          Email: support@foodiehub.com
        </Text>
        <Text className="text-[#6b7280] text-xs text-center">
          Phone: +1 (800) 123-4567
        </Text>
      </View>

      {/* Copyright */}
      <View style={{ width: ITEM_WIDTH }}>
        <Text className="text-[#6b7280] text-xs text-center">
          © {new Date().getFullYear()} FoodieHub. All rights reserved.
        </Text>
      </View>
    </View>
  );
};

export default Footer;