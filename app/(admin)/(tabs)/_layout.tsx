import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View, Text } from "react-native";
import { icons } from "@/constants";

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
    {focused && (
      <View className="absolute top-0 w-10 border-t-2 border-primary-500 rounded-sm" />
    )}
    <View className="items-center">
      <Image
        source={source}
        tintColor={focused ? "#0286FF" : "#858585"}
        resizeMode="contain"
        className="w-6 h-6 -mb-1"
      />
      <Text
        className={`text-[8px] mt-2 ${
          focused ? "text-primary-500" : "text-gray-500"
        } uppercase`}
        numberOfLines={1}
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
          backgroundColor: "#FFFFFF",
          height: 78,
          borderTopWidth: 0,
          zIndex: 999,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: 0,
          marginBottom: 0,
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
        name="products"
        options={{
          title: "Products",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.products} focused={focused} title="Products" />
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
            <TabIcon source={icons.menu} focused={focused} title="Menu" />
          ),
        }}
      />
    </Tabs>
  );
}