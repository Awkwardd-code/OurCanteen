/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { fetchAPI } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  specialities: string;
  description: string;
  rating?: number;
  restaurant_name?: string;
  cuisine_id: number;
  cuisine_name?: string;
}

interface OrderDetails {
  phone: string;
  student_id: string;
}

const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  const animateButton = useCallback((direction: "in" | "out") => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: direction === "in" ? 0.9 : 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: direction === "in" ? 0.7 : 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleValue, opacityValue]);

  return (
    <View style={styles.quantityContainer}>
      <Text style={styles.quantityLabel}>Quantity</Text>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          onPressIn={() => animateButton("in")}
          onPressOut={() => animateButton("out")}
          onPress={onDecrease}
          style={styles.quantityButton}
          accessibilityLabel="Decrease quantity"
          accessibilityRole="button"
          activeOpacity={1}
        >
          <Animated.View
            style={{
              transform: [{ scale: scaleValue }],
              opacity: opacityValue,
            }}
          >
            <Ionicons name="remove" size={20} color="#4b7bec" />
          </Animated.View>
        </TouchableOpacity>
        <Text style={styles.quantityValue}>{quantity}</Text>
        <TouchableOpacity
          onPressIn={() => animateButton("in")}
          onPressOut={() => animateButton("out")}
          onPress={onIncrease}
          style={styles.quantityButton}
          accessibilityLabel="Increase quantity"
          accessibilityRole="button"
          activeOpacity={1}
        >
          <Animated.View
            style={{
              transform: [{ scale: scaleValue }],
              opacity: opacityValue,
            }}
          >
            <Ionicons name="add" size={20} color="#4b7bec" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ProductDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useUser();
  const { restaurant_name, cuisine_name } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    phone: "",
    student_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const product = useMemo(() => {
    try {
      const parsed = JSON.parse(params.product as string) as Product;

      return {
        ...parsed,
        restaurant_name: restaurant_name ?? "",
        cuisine_name: cuisine_name ?? "",
      };
    } catch (error) {
      Alert.alert("Error", "Invalid product data. Please try again.");
      router.back();
      return null;
    }
  }, [params.product, restaurant_name, cuisine_name]);

  useEffect(() => {
    const keyboardDidShow = (e: { endCoordinates: { height: number } }) => {
      setKeyboardHeight(e.endCoordinates.height);
    };
    const keyboardDidHide = () => {
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener("keyboardDidShow", keyboardDidShow);
    const hideSub = Keyboard.addListener("keyboardDidHide", keyboardDidHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const increaseQty = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity((prev) => prev + 1);
  }, []);

  const decreaseQty = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  const handleOrderNow = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsModalVisible(true);
  }, []);

  const validateInputs = useCallback(({ phone, student_id }: OrderDetails) => {
    if (!phone || !student_id) {
      Alert.alert("Error", "Please fill all the fields");
      return false;
    }

    if (!/^[0-9]{11}$/.test(phone)) {
      Alert.alert("Error", "Please enter a valid 11-digit phone number");
      return false;
    }

    return true;
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    if (!product) return;

    if (!validateInputs(orderDetails)) return;

    setIsSubmitting(true);
    try {
      await fetchAPI("/(api)/order", {
        method: "POST",
        body: JSON.stringify({
          product_name: product.name,
          number: orderDetails.phone,
          amount: product.price * quantity,
          price: product.price,
          quantity,
          user_id: user?.id,
          is_paid: false,
          image: product.image,
          student_id: orderDetails.student_id,
          restaurant_name: product.restaurant_name ?? "",
          cuisine_name: product.cuisine_name ?? "",
        }),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Order Placed",
        `Your order for ${quantity} ${product.name}(s) has been placed. We'll contact you shortly.`
      );
      setIsModalVisible(false);
      setOrderDetails({ student_id: "", phone: "" });
    } catch (error) {
      Alert.alert("Error", "Failed to place order. Please try again.");
      console.error("Order submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [orderDetails, product, quantity, user?.id]);

  const totalAmount = useMemo(() => {
    return product ? (product.price * quantity).toLocaleString() : "0";
  }, [product, quantity]);

  if (!product) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      {!isModalVisible && (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Section */}
          <View style={styles.imageContainer}>
            {imageLoading && !imageError && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4B7bec" />
              </View>
            )}
            <Image
              source={
                imageError || !product.image
                  ? { uri: "https://via.placeholder.com/600x400?text=No+Image" }
                  : { uri: product.image }
              }
              style={styles.productImage}
              resizeMode="cover"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
            <TouchableOpacity
              style={styles.backButton}
              onPress={router.back}
              accessibilityLabel="Go back"
              accessibilityRole="button"
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#2d3436" />
            </TouchableOpacity>
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.productName} numberOfLines={2}>
                {product.name}
              </Text>
              {product.rating && (
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={18} color="#f39c12" />
                  <Text style={styles.ratingText}>
                    {product.rating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.price}>৳ {product.price.toLocaleString()}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Specialities</Text>
              <View style={styles.specialitiesContainer}>
                {product.specialities.split(",").map((item, index) => (
                  <View key={index} style={styles.specialityTag}>
                    <Text style={styles.specialityText}>{item.trim()}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionContent}>
                {product.description || "No description available"}
              </Text>
            </View>

            <QuantitySelector
              quantity={quantity}
              onIncrease={increaseQty}
              onDecrease={decreaseQty}
            />

            <TouchableOpacity
              style={styles.orderButton}
              onPress={handleOrderNow}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#4b7bec", "#3867d6"]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.orderButtonText}>
                  Order Now - ৳ {totalAmount}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Order Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => !isSubmitting && setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          >
            <View
              style={[
                styles.modalOverlay,
                {
                  backgroundColor:
                    keyboardHeight > 0 ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.5)",
                },
              ]}
            />
            <View
              style={[
                styles.modalContent,
                {
                  height: keyboardHeight > 0 ? "100%" : "85%",
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Complete Your Order</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => !isSubmitting && setIsModalVisible(false)}
                  disabled={isSubmitting}
                >
                  <Ionicons name="close" size={24} color="#636e72" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Student Id"
                  placeholderTextColor="#95a5a6"
                  value={orderDetails.student_id}
                  onChangeText={(text) =>
                    setOrderDetails((prev) => ({ ...prev, student_id: text }))
                  }
                  autoCapitalize="words"
                  returnKeyType="next"
                  editable={!isSubmitting}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="#95a5a6"
                  value={orderDetails.phone}
                  onChangeText={(text) =>
                    setOrderDetails((prev) => ({ ...prev, phone: text }))
                  }
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  maxLength={11}
                  editable={!isSubmitting}
                />

                {keyboardHeight === 0 && (
                  <View style={styles.orderSummary}>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Product:</Text>
                      <Text style={styles.summaryValue}>{product.name}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Quantity:</Text>
                      <Text style={styles.summaryValue}>{quantity}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Unit Price:</Text>
                      <Text style={styles.summaryValue}>
                        ৳ {product.price.toLocaleString()}
                      </Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                      <Text style={[styles.summaryLabel, styles.totalLabel]}>
                        Total:
                      </Text>
                      <Text style={[styles.summaryValue, styles.totalValue]}>
                        ৳ {totalAmount}
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>

              <TouchableOpacity
                style={[styles.placeOrderButton, isSubmitting && styles.disabledButton]}
                onPress={handlePlaceOrder}
                activeOpacity={0.9}
                disabled={isSubmitting}
              >
                <LinearGradient
                  colors={["#4b7bec", "#3867d6"]}
                  style={styles.placeOrderGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.placeOrderButtonText}>Confirm Order</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  disabledButton: {
    opacity: 0.7,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  imageContainer: {
    width: "100%",
    height: 380,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    position: "relative",
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 2,
  },
  contentContainer: {
    paddingHorizontal: 25,
    paddingTop: 30,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    marginTop: -20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  productName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2d3436",
    flex: 1,
    paddingRight: 15,
    lineHeight: 34,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(243, 156, 18, 0.15)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e67e22",
    marginLeft: 4,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4b7bec",
    marginBottom: 25,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 10,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  sectionContent: {
    fontSize: 15,
    fontWeight: "500",
    color: "#636e72",
    lineHeight: 22,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  specialitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  specialityTag: {
    backgroundColor: "#f1f2f6",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  specialityText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2d3436",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  quantityContainer: {
    marginBottom: 25,
  },
  quantityLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 12,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: "#4b7bec",
    borderRadius: 20,
    padding: 8,
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4b7bec",
    marginHorizontal: 25,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  orderButton: {
    borderRadius: 40,
    overflow: "hidden",
    marginBottom: 40,
  },
  gradient: {
    paddingVertical: 16,
    borderRadius: 40,
  },
  orderButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingTop: 15,
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2d3436",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  closeButton: {
    padding: 6,
  },
  modalScroll: {
    maxHeight: 250,
  },
  modalScrollContent: {
    paddingBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    color: "#2d3436",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  orderSummary: {
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#636e72",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d3436",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  totalRow: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#dfe6e9",
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "800",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  placeOrderButton: {
    marginTop: 15,
    borderRadius: 40,
    overflow: "hidden",
  },
  placeOrderGradient: {
    paddingVertical: 14,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  placeOrderButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
});

export default ProductDetails;
