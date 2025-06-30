import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

const Page = () => {
  const { user, token, isAuthLoaded } = useAuth();

  console.log("User:", user);
  console.log("Token:", token);

  // Show loading indicator while auth is loading
  if (!isAuthLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user && token) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;

};

export default Page;
