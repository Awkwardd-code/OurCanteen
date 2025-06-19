import React, { useMemo, useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface Order {
  id: string;
  name: string;
  restaurant: string;
  price: string;
  orderDate: string;
  image?: string;
  quantity?: number;
  description?: string;
}

const OrderDetails = () => {
  const { theme } = useTheme();
  const { order } = useLocalSearchParams();
  const qrRef = useRef(null);

  const parsedOrder: Order | null = useMemo(() => {
    if (!order || typeof order !== 'string') return null;
    try {
      return JSON.parse(order);
    } catch {
      return null;
    }
  }, [order]);

  if (!parsedOrder) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background || '#F7FFF7' }}>
        <View style={styles.centered}>
          <Text style={[styles.errorText, { color: theme.colors.text || '#292F36' }]}>
            Invalid order data
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate total price
  const quantity = parsedOrder.quantity || 1;
  const unitPrice = parseFloat(parsedOrder.price.replace('$', '')) || 0;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  // Generate deep link URL for QR code
  const deepLinkUrl = `myapp://order/orderSuccess?order=${encodeURIComponent(JSON.stringify(parsedOrder))}`;

  const handleBack = () => {
    router.back();
  };

  const handleRedirectToOrderSuccess = () => {
    router.push({
      pathname: '/order/orderSuccess',
      params: { order: JSON.stringify(parsedOrder) },
    });
  };

  const handleShareQR = async () => {
    try {
      if (!qrRef.current) return;
      
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });
      
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share Order QR Code',
        UTI: 'public.png',
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background || '#F7FFF7' }}
      edges={['top', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: theme.colors.card || '#fff' }]}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.primary || '#FF6B6B'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text || '#292F36' }]}>
            {parsedOrder.name}
          </Text>
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          {parsedOrder.image ? (
            <Image
              source={{ uri: parsedOrder.image }}
              style={[styles.image, { borderColor: theme.colors.border || '#E0E0E0' }]}
              resizeMode="cover"
              accessibilityLabel={`Image of ${parsedOrder.name}`}
            />
          ) : (
            <View
              style={[styles.imagePlaceholder, { backgroundColor: theme.colors.backgroundSecondary || '#F9FAFB' }]}
            >
              <Text style={[styles.placeholderText, { color: theme.colors.textSecondary || '#6C757D' }]}>
                No Image Available
              </Text>
            </View>
          )}
        </View>

        {/* Order Details */}
        <View style={[styles.detailsContainer, { backgroundColor: theme.colors.card || '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text || '#292F36' }]}>Order Details</Text>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary || '#6C757D' }]}>Restaurant</Text>
            <Text style={[styles.value, { color: theme.colors.text || '#292F36' }]}>{parsedOrder.restaurant}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary || '#6C757D' }]}>Price</Text>
            <Text style={[styles.value, { color: theme.colors.text || '#292F36' }]}>{parsedOrder.price}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary || '#6C757D' }]}>Quantity</Text>
            <Text style={[styles.value, { color: theme.colors.text || '#292F36' }]}>{quantity}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary || '#6C757D' }]}>Total Price</Text>
            <Text style={[styles.value, { color: theme.colors.text || '#292F36' }]}>${totalPrice}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary || '#6C757D' }]}>Order Date</Text>
            <Text style={[styles.value, { color: theme.colors.text || '#292F36' }]}>{parsedOrder.orderDate}</Text>
          </View>
          {parsedOrder.description && (
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.label, { color: theme.colors.textSecondary || '#6C757D', marginBottom: 4 }]}>
                Description
              </Text>
              <Text style={[styles.value, { color: theme.colors.text || '#292F36' }]}>{parsedOrder.description}</Text>
            </View>
          )}
        </View>

        {/* QR Code Section */}
        <View style={[styles.qrSection, { backgroundColor: theme.colors.card || '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text || '#292F36' }]}>
            Order QR Code
          </Text>
          <View
            style={[styles.qrCodeWrapper, { backgroundColor: theme.colors.backgroundSecondary || '#F9FAFB' }]}
            accessible
            accessibilityLabel="Order QR code"
          >
            {deepLinkUrl ? (
              <View ref={qrRef} collapsable={false}>
                <QRCode 
                  value={deepLinkUrl} 
                  size={160} 
                  color={theme.colors.text || '#292F36'} 
                  backgroundColor={theme.colors.backgroundSecondary || '#F9FAFB'}
                />
              </View>
            ) : (
              <Text style={[styles.errorText, { color: theme.colors.error || '#FF0000' }]}>
                Could not generate QR code
              </Text>
            )}
            
            <Text style={[styles.qrHintText, { color: theme.colors.textSecondary || '#6C757D' }]}>
              Scan this QR code to open your order details
            </Text>
            
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={handleRedirectToOrderSuccess}
                style={[styles.button, { 
                  backgroundColor: theme.colors.primary || '#FF6B6B',
                  marginRight: 8,
                }]}
                accessibilityLabel="View Order Success"
                accessibilityRole="button"
              >
                <Text style={[styles.buttonText, { color: theme.colors.card || '#fff' }]}>
                  View Success
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleShareQR}
                style={[styles.button, { 
                  backgroundColor: theme.colors.secondary || '#4ECDC4',
                }]}
                accessibilityLabel="Share QR Code"
                accessibilityRole="button"
              >
                <Text style={[styles.buttonText, { color: theme.colors.card || '#fff' }]}>
                  Share QR
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  imageContainer: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
  },
  detailsContainer: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  qrSection: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCodeWrapper: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  qrHintText: {
    marginTop: 12,
    marginBottom: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default OrderDetails;