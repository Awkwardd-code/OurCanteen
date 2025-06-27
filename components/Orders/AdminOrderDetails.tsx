import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { router } from "expo-router";

export interface Order {
  id: number;
  product_name: string;
  image: string | null;
  number: number;
  amount: number;
  price: number;
  quantity: number;
  is_paid: boolean;
  student_id: number;
  user_id: string;
  restaurant_name: string | null;
  cuisine_name: string | null;
  status?: string;
  orderDate?: string;
}

const { width } = Dimensions.get("window");
const HORIZONTAL_MARGIN = 16;
const ITEM_PADDING = 12;
const ITEM_WIDTH = width - HORIZONTAL_MARGIN * 2;

const COLORS = {
  buttonBackground: "#152239",
  buttonText: "#ffffff",
  primary: "#3b82f6",
  secondary: "#10b981",
};

interface Props {
  item: Order;
}

const AdminOrderDetails: React.FC<Props> = ({ item }) => {
  const [imageError, setImageError] = useState(false);
  const qrRef = useRef(null);

  const handlePressItem = useCallback(() => {
    router.push({
      pathname: "/order/orderDetails",
      params: { order: JSON.stringify(item) },
    });
  }, [item]);

  // Generate deep link URL for QR code
  const deepLinkUrl = `myapp://order/details/${item.id}`;

  const handleShareQR = async () => {
    try {
      if (!qrRef.current) {
        Alert.alert("Error", "QR Code not available for sharing");
        return;
      }
      
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });
      
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Sharing not available on this device");
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share Order QR Code',
        UTI: 'public.png',
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
      Alert.alert("Error", "Failed to share QR code");
    }
  };

  const handleViewDetails = () => {
    router.push({
      pathname: "/order/orderDetails",
      params: { order: JSON.stringify(item) },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePressItem}
      accessibilityLabel={`${item.product_name} order from ${item.restaurant_name}`}
      accessibilityRole="button"
      style={[styles.card, { width: ITEM_WIDTH }]}
    >
      {/* First row: Image and QR Code */}
      <View className="mb-9" style={styles.topRow}>
        <View style={styles.imageContainer}>
          {imageError || !item.image ? (
            <View style={styles.imagePlaceholder}>
              <Text
                accessibilityLabel={imageError ? "Failed to load image" : "No image available"}
                accessible={true}
                style={styles.imagePlaceholderText}
              >
                {imageError ? "Failed to load image" : "No Image"}
              </Text>
            </View>
          ) : (
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
              onError={() => setImageError(true)}
              accessibilityLabel={`Image of ${item.product_name}`}
              accessible={true}
            />
          )}
        </View>

        <View style={styles.qrColumn}>
          <View ref={qrRef} collapsable={false} style={styles.qrContainer}>
            <QRCode
              value={deepLinkUrl}
              size={80}
              color={COLORS.buttonText}
              backgroundColor={COLORS.buttonBackground}
            />
          </View>
          <Text style={styles.qrHintText}>
            Scan to view order details
          </Text>
        </View>
      </View>

      {/* Order details */}
      <View style={styles.detailsContainer}>
        <Text
          style={styles.productName}
          numberOfLines={1}
          accessibilityLabel={`Order name: ${item.product_name}`}
          accessible={true}
        >
          {item.product_name}
        </Text>
        <Text
          style={styles.restaurantName}
          numberOfLines={1}
          accessibilityLabel={`Restaurant: ${item.restaurant_name}`}
          accessible={true}
        >
          Restaurant: {item.restaurant_name ?? "N/A"}
        </Text>
        <Text
          style={styles.price}
          numberOfLines={1}
          accessibilityLabel={`Price: ${item.price}`}
          accessible={true}
        >
          Price: ${item.price}
        </Text>
        {item.orderDate && (
          <Text
            style={styles.orderDate}
            numberOfLines={1}
            accessibilityLabel={`Order date: ${item.orderDate}`}
            accessible={true}
          >
            Order Date: {item.orderDate}
          </Text>
        )}

        {/* Action buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            onPress={handleViewDetails}
            style={[styles.button, { backgroundColor: COLORS.primary }]}
            accessibilityLabel="View order details"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleShareQR}
            style={[styles.button, { backgroundColor: COLORS.secondary }]}
            accessibilityLabel="Share QR code"
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Share QR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: ITEM_PADDING,
    marginBottom: 16,
    alignSelf: "center",
    elevation: 5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  imageContainer: {
    width: (ITEM_WIDTH - ITEM_PADDING * 3) / 2,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  imagePlaceholderText: {
    color: "#6b7280",
    fontSize: 12,
    textAlign: "center",
  },
  qrColumn: {
    width: (ITEM_WIDTH - ITEM_PADDING * 3) / 2,
    alignItems: "center",
  },
  qrContainer: {
    width: "100%",
    height: 120,
    backgroundColor: COLORS.buttonBackground,
    borderRadius: 12,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  qrHintText: {
    color: "#6b7280",
    fontSize: 12,
    textAlign: "center",
  },
  detailsContainer: {
    width: ITEM_WIDTH - ITEM_PADDING * 2,
    paddingTop: 6,
  },
  productName: {
    color: "#1f2937",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  restaurantName: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  price: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  orderDate: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default AdminOrderDetails;