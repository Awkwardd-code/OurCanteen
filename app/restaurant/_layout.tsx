import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="Create" options={{ headerShown: false }} />
      <Stack.Screen name="Update" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;