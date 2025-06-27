/* eslint-disable react/no-unescaped-entities */
import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ImageSourcePropType,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useUser } from '@clerk/clerk-expo';
import { fetchAPI } from '@/lib/fetch';

type Order = {
  id: string;
  restaurant_name: string;
  product_name: string;
  price: string;
  orderDate: string;
  image?: ImageSourcePropType | string;
  quantity?: number;
  description?: string;
  user_id: string;
  customerName?: string;
  deliveryAddress?: string;
};

const OrderSuccess = () => {
  const { theme } = useTheme();
  const { user } = useUser();
  const router = useRouter();
  const { order } = useLocalSearchParams();
  console.log(order)
  // Log the raw order parameter for debugging
  console.log('Raw order parameter:', order);
  console.log('Order type:', typeof order);

  const parsedOrder = useMemo<Order | null>(() => {
    if (!order || typeof order !== 'string') {
      console.log('Order invalid: not a string or undefined');
      return null;
    }

    try {
      const decoded = decodeURIComponent(order);
      console.log('Decoded order:', decoded);
      const data = JSON.parse(decoded) as Partial<Order>;
      console.log('Parsed order data:', data);

      // Ensure required fields are present
      if (!data.id || !data.user_id) {
        console.log('Validation failed: missing id or user_id');
        return null;
      }

      return {
        id: data.id,
        user_id: data.user_id, // Now guaranteed to be string due to validation
        product_name: data.product_name || 'Unknown Item',
        restaurant_name: data.restaurant_name || 'Unknown Restaurant',
        price: data.price || '$0.00',
        orderDate: data.orderDate || new Date().toISOString(),
        image: data.image,
        quantity: data.quantity || 1,
        description: data.description,
        customerName: data.customerName,
        deliveryAddress: data.deliveryAddress,
      };
    } catch (error) {
      console.error('Error parsing order:', error);
      return null;
    }
  }, [order]);


  const formattedDate = useMemo(() => {
    if (!parsedOrder?.orderDate) return 'N/A';
    try {
      return format(new Date(parsedOrder.orderDate), 'MMMM d, yyyy - h:mm a');
    } catch {
      return parsedOrder.orderDate;
    }
  }, [parsedOrder]);

  const totalPrice = useMemo(() => {
    if (!parsedOrder) return '0.00';
    const unitPrice = parseFloat(parsedOrder.price.replace('$', '')) || 0;
    const quantity = parsedOrder.quantity || 1;
    return (unitPrice * quantity).toFixed(2);
  }, [parsedOrder]);

  const handleContinue = useCallback(() => {
    router.push('/(root)/(tabs)/home');
  }, [router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const userId = user?.id;
  const userIdFromOrder = parsedOrder?.user_id;

  const getPaid = async () => {
      await fetchAPI("/(api)/order", {
      method: "PUT",
      body: JSON.stringify({
        id: userId,
        is_paid : true,
      }),
    });
  }

  if (userId === userIdFromOrder) {
    getPaid();
  }

  if (!parsedOrder) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="warning-outline"
            size={48}
            color={theme.colors.error}
            style={styles.errorIcon}
            accessible
            accessibilityLabel="Warning icon"
          />
          <Text
            style={[styles.errorText, { color: theme.colors.error }]}
            accessible
            accessibilityLabel="Error message"
          >
            We couldn't load your order details
          </Text>
          <View style={styles.errorButtonContainer}>
            <TouchableOpacity
              onPress={handleBack}
              style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
              accessibilityLabel="Go back to previous screen"
              accessibilityRole="button"
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(root)/(tabs)/home')}
              style={[styles.retryButton, { borderColor: theme.colors.primary }]}
              accessibilityLabel="Return to home screen"
              accessibilityRole="button"
            >
              <Text style={[styles.retryButtonText, { color: theme.colors.primary }]}>
                Go Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backButton, { backgroundColor: theme.colors.card }]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Order Confirmation
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header */}
        <View style={styles.successHeader}>
          <Ionicons
            name="checkmark-circle"
            size={64}
            color={theme.colors.success}
            accessible
            accessibilityLabel="Order confirmed icon"
          />
          <Text
            style={[styles.successTitle, { color: theme.colors.text }]}
            accessible
            accessibilityLabel="Order confirmed"
          >
            Order Confirmed!
          </Text>
          <Text
            style={[styles.orderNumber, { color: theme.colors.textSecondary }]}
            accessible
          // accessibilityLabel={`Order number ${parsedOrder.id.slice(0, 8).toUpperCase()}`}
          >
            {/* #{parsedOrder.id.slice(0, 8).toUpperCase()} */}
          </Text>
        </View>

        {/* Order Summary Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Your Order</Text>
          {parsedOrder.image ? (
            <Image
              source={
                typeof parsedOrder.image === 'string'
                  ? { uri: parsedOrder.image }
                  : parsedOrder.image
              }
              style={[styles.productImage, { borderColor: theme.colors.border }]}
              resizeMode="cover"
              accessibilityLabel={`Image of ${parsedOrder.product_name}`}
            />
          ) : (
            <View
              style={[styles.imagePlaceholder, { backgroundColor: theme.colors.backgroundSecondary }]}
              accessible
              accessibilityLabel="No image available"
            >
              <Ionicons
                name="fast-food-outline"
                size={40}
                color={theme.colors.textSecondary}
              />
            </View>
          )}
          <Text
            style={[styles.productName, { color: theme.colors.text }]}
            accessible
            accessibilityLabel={`Product: ${parsedOrder.product_name}`}
          >
            {parsedOrder.product_name}
          </Text>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Restaurant
            </Text>
            <Text
              style={[styles.detailValue, { color: theme.colors.text }]}
              accessible
              accessibilityLabel={`Restaurant: ${parsedOrder.restaurant_name}`}
            >
              {parsedOrder.restaurant_name}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Quantity
            </Text>
            <Text
              style={[styles.detailValue, { color: theme.colors.text }]}
              accessible
              accessibilityLabel={`Quantity: ${parsedOrder.quantity}`}
            >
              {parsedOrder.quantity}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Unit Price
            </Text>
            <Text
              style={[styles.detailValue, { color: theme.colors.text }]}
              accessible
              accessibilityLabel={`Unit price: ${parsedOrder.price}`}
            >
              {parsedOrder.price}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Total Price
            </Text>
            <Text
              style={[styles.detailValue, { color: theme.colors.text }]}
              accessible
              accessibilityLabel={`Total price: $${totalPrice}`}
            >
              ${totalPrice}
            </Text>
          </View>
        </View>

        {/* Order Details Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Order Details</Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Ordered On
            </Text>
            <Text
              style={[styles.detailValue, { color: theme.colors.text }]}
              accessible
              accessibilityLabel={`Ordered on: ${formattedDate}`}
            >
              {formattedDate}
            </Text>
          </View>
          {parsedOrder.customerName && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Customer
              </Text>
              <Text
                style={[styles.detailValue, { color: theme.colors.text }]}
                accessible
                accessibilityLabel={`Customer: ${parsedOrder.customerName}`}
              >
                {parsedOrder.customerName}
              </Text>
            </View>
          )}
          {parsedOrder.deliveryAddress && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Delivery Address
              </Text>
              <Text
                style={[styles.detailValue, { color: theme.colors.text }]}
                accessible
                accessibilityLabel={`Delivery address: ${parsedOrder.deliveryAddress}`}
              >
                {parsedOrder.deliveryAddress}
              </Text>
            </View>
          )}
          {parsedOrder.description && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                Notes
              </Text>
              <Text
                style={[styles.detailValue, { color: theme.colors.text }]}
                accessible
                accessibilityLabel={`Notes: ${parsedOrder.description}`}
              >
                {parsedOrder.description}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleContinue}
            style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
            accessibilityLabel="Continue shopping"
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorButtonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
  },
  retryButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
  },
  orderNumber: {
    fontSize: 16,
    marginTop: 8,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default OrderSuccess;