import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import { useTheme } from '@/context/ThemeContext';

// Dimensions setup (same as AdminOrderDetails)
const { width } = Dimensions.get('window');
const HORIZONTAL_MARGIN = 16;
const ITEM_WIDTH = width - HORIZONTAL_MARGIN * 2;

export interface CleanOrder {
  id: number;
  product_name: string;
  restaurant_name: string;
  price: number;
  is_paid: boolean;
  created_at: string;
  image: string | null;
  number: number;
  amount: number;
  quantity: number;
  student_id: number;
  user_id: string;
  cuisine_name: string | null;
  updated_at: string;
}

type Props = {
  item: CleanOrder;
};

const CleanOrderCard: React.FC<Props> = ({ item }) => {
  const { theme } = useTheme();

  const [imageError, setImageError] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const handleRequestPermission = useCallback(async () => {
    try {
      setIsRequestingPermission(true);
      const result = await requestPermission();
      if (!result.granted && !result.canAskAgain && Platform.OS !== 'web') {
        await Linking.openSettings();
      } else if (!result.granted && Platform.OS === 'web') {
        Alert.alert(
          'Camera Permission',
          'Camera access is required for QR scanning. Please enable it in your browser settings.'
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      Alert.alert('Error', 'Failed to request camera permission.');
    } finally {
      setIsRequestingPermission(false);
    }
  }, [requestPermission]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      accessibilityLabel={`View details for ${item.product_name} order from ${item.restaurant_name}`}
      accessibilityHint="Opens detailed view of the order"
      accessibilityRole="button"
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.cardBackground || '#fff',
          shadowColor: theme.colors.shadow || '#000',
        },
      ]}
    >
      <View style={styles.imageRow}>
        <View style={styles.imageContainer}>
          {imageError || !item.image ? (
            <View
              style={[
                styles.imagePlaceholder,
                { backgroundColor: theme.colors.placeholder || '#f0f0f0' },
              ]}
            >
              <Text style={{ color: theme.colors.textSecondary || '#666' }}>
                {imageError ? 'Failed to load' : 'No Image'}
              </Text>
            </View>
          ) : (
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
              onError={() => setImageError(true)}
              accessibilityLabel={`Image of ${item.product_name}`}
            />
          )}
        </View>

        <View
          style={[
            styles.qrContainer,
            { backgroundColor: theme.colors.background || '#F5F5F5' },
          ]}
        >
          {permission === null ? (
            <ActivityIndicator color={theme.colors.primary || '#007AFF'} />
          ) : permission?.granted ? (
            <Link href="/scanner" asChild>
              <Pressable
                style={styles.qrButton}
                accessibilityLabel="Open QR code scanner for order verification"
                accessibilityHint="Scans a QR code to verify or track this order"
                accessibilityRole="button"
              >
                <Image
                  source={require('@/assets/scanner.gif')}
                  style={styles.qrImage}
                  resizeMode="contain"
                  accessibilityLabel="QR code scanner icon"
                />
              </Pressable>
            </Link>
          ) : (
            <Pressable
              onPress={handleRequestPermission}
              style={[
                styles.permissionButton,
                { backgroundColor: theme.colors.primary || '#007AFF' },
              ]}
              disabled={isRequestingPermission}
              accessibilityLabel={
                isRequestingPermission
                  ? 'Requesting camera permission'
                  : permission?.canAskAgain
                  ? 'Request camera access permission'
                  : 'Open device settings to enable camera permission'
              }
              accessibilityRole="button"
            >
              {isRequestingPermission ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.permissionButtonText}>
                  {permission?.canAskAgain ? 'Allow Camera' : 'Open Settings'}
                </Text>
              )}
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <Text
          style={[styles.nameText, { color: theme.colors.textPrimary || '#000' }]}
          numberOfLines={1}
          accessibilityLabel={`Order: ${item.product_name}`}
        >
          {item.product_name}
        </Text>

        <Text
          style={[styles.detailText, { color: theme.colors.primary || '#007AFF' }]}
          numberOfLines={1}
          accessibilityLabel={`From: ${item.restaurant_name}`}
        >
          From: {item.restaurant_name}
        </Text>

        <Text
          style={[styles.detailText, { color: theme.colors.primary || '#007AFF' }]}
          numberOfLines={1}
          accessibilityLabel={`Price: $${(item.price * item.quantity).toFixed(2)}`}
        >
          Price: ${(item.price * item.quantity).toFixed(2)}
        </Text>

        <Text
          style={[styles.dateText, { color: theme.colors.textSecondary || '#666' }]}
          numberOfLines={1}
          accessibilityLabel={`Date: ${item.created_at}`}
        >
          Date: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    width: ITEM_WIDTH,
    alignSelf: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    width: (ITEM_WIDTH - 2 * HORIZONTAL_MARGIN - 8) / 2,
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: (ITEM_WIDTH - 2 * HORIZONTAL_MARGIN - 8) / 2,
    height: 80,
  },
  qrButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  qrImage: {
    width: 48,
    height: 48,
  },
  permissionButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    marginVertical: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 6,
  },
});

export default CleanOrderCard;
