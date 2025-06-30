import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View, Text } from "react-native";
import { icons } from "@/constants";

// Define a modern dark red color for active tab
const ACTIVE_TAB_COLOR = "#B22234"; // Modern dark red (can be adjusted)
const INACTIVE_TAB_COLOR = "#858585";

const TabIcon = ({
  source,
  focused,
  title,
}: {
  source: ImageSourcePropType;
  focused: boolean;
  title: string;
}) => (
  <View className="flex-1 items-center justify-start pt-3 relative w-full">
    {/* Top border positioned absolutely */}
    {focused && (
      <View className="absolute top-0 w-10 border-t-2" style={{ borderColor: ACTIVE_TAB_COLOR, borderRadius: 6, shadowColor: ACTIVE_TAB_COLOR, shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }} />
    )}

    {/* Icon above the title with less margin */}
    <View className="items-center">
      <Image
        source={source}
        tintColor={focused ? ACTIVE_TAB_COLOR : INACTIVE_TAB_COLOR}
        resizeMode="contain"
        className="w-7 h-7 -mb-1" // slightly larger icon for modern look
        style={{
          shadowColor: focused ? ACTIVE_TAB_COLOR : undefined,
          shadowOpacity: focused ? 0.25 : 0,
          shadowRadius: focused ? 6 : 0,
          shadowOffset: { width: 0, height: 2 },
        }}
      />
      {/* Modernized title text */}
      <Text
        className={`text-[8px] mt-2 font-semibold tracking-wide`}
        style={{ color: focused ? ACTIVE_TAB_COLOR : INACTIVE_TAB_COLOR, }}
        numberOfLines={1} 
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    </View>
  </View>
);

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff", // white based background
          height: 78,
          borderTopWidth: 0,
          zIndex: 999,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 0,
          marginBottom: 0,
          shadowColor: ACTIVE_TAB_COLOR,
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: "Offers",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.offers} focused={focused} title="Offers" />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.orders} focused={focused} title="Orders" />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.menu} focused={focused} title="Account" />
          ),
        }}
      />
    </Tabs>
  );
}