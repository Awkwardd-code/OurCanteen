/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {  useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-react';
import { icons } from '@/constants';
import GoogleTextInput from '../GoogleTextInput';
import { fetchAPI } from '@/lib/fetch';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';

type Restaurant = {
  id: number;
  name: string;
  logo?: string;
  address?: string;
  district?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

const AdminDashboardHeader = ({ onSearchPress }: { onSearchPress?: () => void }) => {
  const { user } = useUser();
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRestaurantData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetchAPI(`/(api)/restaurant?user_id=${user.id}`, {
        method: "GET",
      });

      if (response && response.length > 0) {
        setRestaurant(response[0]);
      } else {
        setRestaurant(null);
      }
    } catch (error) {
      console.error("Failed to fetch restaurant:", error);
      setError("Failed to load restaurant data");
      Alert.alert("Error", "Could not load restaurant data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchRestaurantData();
    }, [fetchRestaurantData])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  const handleRestaurantPress = useCallback(() => {
    if (restaurant?.name) {
      router.push('/restaurant/Update');
    } else {
      router.push('/restaurant/Create');
    }
  }, [restaurant]);

  const handleNotificationPress = useCallback(() => {
    // router.push('/notifications');
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top, backgroundColor: theme.colors.background }]}>
      <View style={[styles.innerCard, { backgroundColor: theme.colors.card }]}>
        {/* Business Logo */}
        <TouchableOpacity 
          onPress={handleRestaurantPress}
          accessibilityLabel="Restaurant logo"
          accessibilityHint="Press to edit restaurant details"
          activeOpacity={0.7}
        >
          <Image
            source={{
              uri: restaurant?.logo || 'https://img.icons8.com/color/100/restaurant.png'
            }}
            style={[styles.logo, { borderColor: theme.colors.border }]}
            onError={() => console.log("Failed to load logo")}
            // defaultSource={require('@/assets/images/default-restaurant.png')}
          />
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.info}>
          <View style={styles.rowBetween}>
            <Text 
              style={[styles.title, { color: theme.colors.text }]} 
              numberOfLines={1} 
              ellipsizeMode="tail"
              accessibilityLabel={`Restaurant name: ${restaurant?.name || 'Not set'}`}
            >
              {restaurant?.name || "My Restaurant"}
            </Text>

            {/* Notification Bell with Badge */}
            <TouchableOpacity
              onPress={handleNotificationPress}
              style={[styles.bellContainer, { backgroundColor: theme.colors.background }]}
              accessibilityLabel="Notifications"
              accessibilityHint="View your notifications"
              activeOpacity={0.7}
            >
              <Image
                source={icons.bell}
                style={[styles.bellIcon, { tintColor: theme.colors.primary }]}
                resizeMode="contain"
              />
              {/* Unread notification badge would go here */}
            </TouchableOpacity>
          </View>

          {/* Subtitle & Admin Badge */}
          <Text 
            style={[styles.subTitle, { color: theme.colors.textSecondary }]} 
            numberOfLines={1} 
            ellipsizeMode="tail"
            accessibilityLabel={`Restaurant address: ${restaurant?.address ? `${restaurant.address}, ${restaurant.district}` : 'Not set'}`}
          >
            {restaurant?.address ? `${restaurant.address}, ${restaurant.district}` : "Add your restaurant address"}
          </Text>

          <View style={styles.metaRow}>
            <Text 
              style={[styles.welcomeText, { color: theme.colors.text }]}
              accessibilityLabel={`Welcome ${user?.firstName || ''}`}
            >
              Welcome 👋
            </Text>

            <View style={[styles.labelContainer]}>
              <Text style={[styles.labelText, { color: theme.colors.accent }]}>Admin</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Search Input */}
      {/* <View style={styles.searchContainer}>
        <GoogleTextInput
          icon={icons.search}
          containerStyle={styles.searchInput}
          iconColor={theme.colors.primary}
          placeholderTextColor={theme.colors.textSecondary}
          handlePress={onSearchPress}
          placeholder="Search restaurants or dishes..."
          // testID="dashboard-search-input"
        />
      </View> */}

      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bellContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  subTitle: {
    fontSize: 12,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  labelContainer: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    marginTop: 16,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
  },
});

export default AdminDashboardHeader;