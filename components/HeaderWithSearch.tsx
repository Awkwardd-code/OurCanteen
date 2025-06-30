import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext";
import { icons } from "@/constants";
import GoogleTextInput from "./GoogleTextInput";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@/context/AuthContext";

const HeaderWithSearch = ({ onSearchPress }: { onSearchPress?: () => void }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  // const { user } = useUser();
  const { isAuthenticated, user } = useAuth();

  const handleNotificationPress = () => {
    navigation.navigate("Notifications" as never);
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.headerContent}>
        {/* Top Section: Welcome and Notification */}
        <View style={styles.topSection}>
          <View style={styles.welcomeContainer} className="px-4">
            <Text style={[styles.welcomeText]} className="text-gray-50">
              Welcome 👋
            </Text>
            <Text style={[styles.nameText]} className="text-gray-100">
              {user?.name}
            </Text>
          </View>

          {/* <TouchableOpacity
            onPress={handleNotificationPress}
            style={[styles.notificationButton, { backgroundColor: theme.colors.card }]}
          >
            <Image 
              source={icons.bell} 
              style={[styles.notificationIcon, { tintColor: theme.colors.primary }]} 
              resizeMode="contain" 
            />
          </TouchableOpacity> */}
        </View>

        {/* Search Component */}
        {/* <GoogleTextInput
          icon={icons.search}
          containerStyle={styles.searchInput}
          iconColor={theme.colors.primary}
          handlePress={onSearchPress}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: ,
    paddingBottom: 8,
  },
  headerContent: {
    width: '100%',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
  },
  welcomeContainer: {
    flexDirection: 'column',
  },

  nameText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4, 
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 20,
    height: 20,
  },
  searchInput: {
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default HeaderWithSearch;