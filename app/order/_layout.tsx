import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="orderDetails" options={{ headerShown: false }} />
      <Stack.Screen name="orderSuccess" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;