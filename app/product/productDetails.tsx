/* eslint-disable import/no-unresolved */
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
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { set } from "date-fns";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  specialities: string;
  description: string;
  rating?: number;
  restaurant_name: string;
  restaurant_id?: string;
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
  return (
    <View style={styles.quantityContainerMinimal}>
      <TouchableOpacity
        onPress={onDecrease}
        style={styles.quantityButtonMinimal}
        accessibilityLabel="Decrease quantity"
        accessibilityRole="button"
        activeOpacity={0.7}
      >
        <Ionicons name="remove" size={22} color="#3867d6" />
      </TouchableOpacity>
      <Text style={styles.quantityValueMinimal}>{quantity}</Text>
      <TouchableOpacity
        onPress={onIncrease}
        style={styles.quantityButtonMinimal}
        accessibilityLabel="Increase quantity"
        accessibilityRole="button"
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={22} color="#3867d6" />
      </TouchableOpacity>
    </View>
  );
};

const ProductDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  // const { user } = useUser();
  const { restaurant_name, cuisine_name } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [qrOrderId, setQrOrderId] = useState<string | null>(null);
  const [qrUserId, setQrUserId] = useState<string | null>(null);

  const { token, user } = useAuth();

  const product = useMemo(() => {
    try {
      const parsed = JSON.parse(params.product as string) as Product;

      return {
        ...parsed,
        // restaurant_name: restaurant_name ?? "",
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

    let orderData = {
      productId: product._id.toString(),
      price: product.price,
      quantity,
      userId: user?.id,
      image: product.image,
      studentId: user?.studentId,
      email: user?.email,
      restaurant_id: product.restaurant_id,
      restaurant_name: product.restaurant_name
    }

    console.log("Order Data:", orderData);

    setIsSubmitting(true);
    try {
      let resp = await axios.post("https://ourcanteennbackend.vercel.app/api/order", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Order Response:", resp.data);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);


      setQrOrderId(resp.data.id || resp.data._id);
      setQrUserId(resp.data.userId);

      setIsModalVisible(false);
      setShowSuccessModal(true);
    } catch (error) {
      Alert.alert("Error", "Failed to place order. Please try again.");
      console.error("Order submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [product, quantity, user?.id]);

  const totalAmount = useMemo(() => {
    return product ? (product.price * quantity).toLocaleString() : "0";
  }, [product, quantity]);

  if (!product) return null;

  return (
    <SafeAreaView style={styles.safeAreaMinimal}>
      {!isModalVisible && (
        <ScrollView
          contentContainerStyle={styles.scrollContainerMinimal}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Section */}
          <View style={styles.imageContainerMinimal}>
            <Image
              source={
                imageError || !product.image
                  ? { uri: "https://via.placeholder.com/600x400?text=No+Image" }
                  : { uri: product.image }
              }
              style={styles.productImageMinimal}
              resizeMode="cover"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
            <TouchableOpacity
              style={styles.backButtonMinimal}
              onPress={router.back}
              accessibilityLabel="Go back"
              accessibilityRole="button"
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#222" />
            </TouchableOpacity>
          </View>

          {/* Content Section */}
          <View style={styles.contentContainerMinimal}>
            <Text style={styles.productNameMinimal} numberOfLines={2}>
              {product.name}
            </Text>
            {/* Show restaurant name above price */}
            {product.restaurant_name && (
              <Text style={{ fontSize: 14, color: '#8e24aa', fontWeight: '600', marginBottom: 2 }} numberOfLines={1}>
                {product.restaurant_name}
              </Text>
            )}
            {product.rating && (
              <View style={styles.ratingContainerMinimal}>
                <Ionicons name="star" size={16} color="#f39c12" />
                <Text style={styles.ratingTextMinimal}>
                  {product.rating.toFixed(1)}
                </Text>
              </View>
            )}
            <Text style={styles.priceMinimal}>৳ {product.price.toLocaleString()}</Text>
            {/* Specialities restored */}
            {product.specialities && (
              <View style={styles.specialitiesBoxMinimal}>
                {product.specialities.split(",").map((item, idx) => (
                  <View key={idx} style={styles.specialityTagMinimalBox}>
                    <Text style={styles.specialityMinimalTextBox}>
                      {item.trim()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            <Text style={styles.sectionContentMinimal}>
              {product.description || "No description available"}
            </Text>
            <QuantitySelector
              quantity={quantity}
              onIncrease={increaseQty}
              onDecrease={decreaseQty}
            />
            <TouchableOpacity
              style={styles.orderButtonMinimal}
              onPress={handleOrderNow}
              activeOpacity={0.9}
            >
              <Text style={styles.orderButtonTextMinimal}>
                Order Now • ৳ {totalAmount}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Order Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => !isSubmitting && setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.popupOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.popupContainer}
              keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
            >
              <View style={styles.popupContent}>
                <View style={styles.modalHeaderMinimal}>
                  <Text style={styles.modalTitleMinimal}>Order</Text>
                  <TouchableOpacity
                    style={styles.closeButtonMinimal}
                    onPress={() => !isSubmitting && setIsModalVisible(false)}
                    disabled={isSubmitting}
                  >
                    <Ionicons name="close" size={22} color="#888" />
                  </TouchableOpacity>
                </View>
                {/* Show user info instead of input fields */}
                <View style={[styles.orderPopupInfoBox, { marginBottom: 18 }]}>
                  <View style={styles.orderPopupRow}>
                    <Ionicons name="person-circle" size={22} color="#8e24aa" style={{ marginRight: 8 }} />
                    <Text style={styles.orderPopupLabel}>Name:</Text>
                    <Text style={styles.orderPopupValue}>{user?.name || '-'}</Text>
                  </View>
                  <View style={styles.orderPopupRow}>
                    <Ionicons name="school" size={20} color="#8e24aa" style={{ marginRight: 8 }} />
                    <Text style={styles.orderPopupLabel}>Student ID:</Text>
                    <Text style={styles.orderPopupValue}>{user?.studentId || '-'}</Text>
                  </View>
                  <View style={styles.orderPopupRow}>
                    <Ionicons name="call" size={20} color="#8e24aa" style={{ marginRight: 8 }} />
                    <Text style={styles.orderPopupLabel}>Phone:</Text>
                    <Text style={styles.orderPopupValue}>{user?.phoneNumber || '-'}</Text>
                  </View>
                  <View style={styles.orderPopupRow}>
                    <Ionicons name="restaurant" size={20} color="#8e24aa" style={{ marginRight: 8 }} />
                    <Text style={styles.orderPopupLabel}>Restaurant:</Text>
                    <Text style={styles.orderPopupValue}>{product.restaurant_name || '-'}</Text>
                  </View>
                </View>
                <View style={styles.orderSummaryMinimal}>
                  <Text style={styles.summaryMinimal}>
                    {quantity} × {product.name} = ৳ {totalAmount}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.placeOrderButtonMinimal, isSubmitting && styles.disabledButton]}
                  onPress={handlePlaceOrder}
                  activeOpacity={0.9}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.placeOrderButtonTextMinimal}>Confirm Order</Text>
                  )}
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Success Modal */}
      {showSuccessModal && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={showSuccessModal}
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.popupOverlay}>
            <View style={styles.popupContainer}>
              <View style={styles.popupContent}>
                <Ionicons name="checkmark-circle" size={48} color="#4BB543" style={{ alignSelf: 'center', marginBottom: 10 }} />
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#222', textAlign: 'center', marginBottom: 10 }}>Order Submitted Successfully!</Text>
                <Text style={{ fontSize: 15, color: '#444', textAlign: 'center', marginBottom: 20 }}>Thank you for your order. You can go to home or show your QR now.</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                  <TouchableOpacity
                    style={[styles.placeOrderButtonMinimal, { flex: 1, backgroundColor: '#3867d6' }]}
                    onPress={() => {
                      setShowSuccessModal(false);
                      router.replace("/");
                    }}
                  >
                    <Text style={styles.placeOrderButtonTextMinimal}>Go to Home</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    style={[styles.placeOrderButtonMinimal, { flex: 1, backgroundColor: '#8e24aa' }]}
                    onPress={() => {
                      setShowSuccessModal(false);
                      router.push("/order/qr"); 
                    }}
                  >
                    <Text style={styles.placeOrderButtonTextMinimal}>Show QR Now</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={[styles.placeOrderButtonMinimal, { flex: 1, backgroundColor: '#8e24aa' }]}
                    onPress={() => {
                      const data = {
                        orderId: qrOrderId,
                        userId: qrUserId,
                      };

                      const encodedData = encodeURIComponent(JSON.stringify(data));

                      setShowSuccessModal(false);
                      router.push({
                        pathname: "/order/qr",
                        params: { data: encodedData },
                      });
                    }}
                  >
                    <Text style={styles.placeOrderButtonTextMinimal}>Show QR Now</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  disabledButton: {
    opacity: 0.7,
  },
  // Minimalist styles
  safeAreaMinimal: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainerMinimal: {
    paddingBottom: 24,
    paddingHorizontal: 0,
  },
  imageContainerMinimal: {
    width: "100%",
    height: 260,
    backgroundColor: "#f5f6fa",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
    position: "relative",
    marginBottom: 0,
  },
  productImageMinimal: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  backButtonMinimal: {
    position: "absolute",
    top: 18,
    left: 16,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 2,
  },
  contentContainerMinimal: {
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: "#fff",
  },
  productNameMinimal: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  ratingContainerMinimal: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingTextMinimal: {
    fontSize: 15,
    fontWeight: "600",
    color: "#f39c12",
    marginLeft: 4,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  priceMinimal: {
    fontSize: 22,
    fontWeight: "900",
    color: "#ff0000",
    marginBottom: 18,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  sectionContentMinimal: {
    fontSize: 15,
    color: "#444",
    marginBottom: 18,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  quantityContainerMinimal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 0,
  },
  quantityButtonMinimal: {
    borderWidth: 1,
    borderColor: "#e1e4ea",
    borderRadius: 16,
    padding: 6,
    marginHorizontal: 8,
    backgroundColor: "#f8f9fb",
  },
  quantityValueMinimal: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginHorizontal: 8,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  orderButtonMinimal: {
    borderRadius: 32,
    backgroundColor: "#e74c3c", // red
    marginTop: 8,
    marginBottom: 32,
    paddingVertical: 14,
    alignItems: "center",
  },
  orderButtonTextMinimal: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  // Modal minimalist
  modalContainerMinimal: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlayMinimal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.12)",
    zIndex: 10,
  },
  modalContentMinimal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 22,
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  modalHeaderMinimal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitleMinimal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  closeButtonMinimal: {
    padding: 4,
  },
  inputMinimal: {
    borderWidth: 1,
    borderColor: "#e1e4ea",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
    color: "#222",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  orderSummaryMinimal: {
    marginVertical: 10,
    alignItems: "center",
  },
  summaryMinimal: {
    fontSize: 15,
    color: "#444",
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  placeOrderButtonMinimal: {
    borderRadius: 32,
    backgroundColor: "#e74c3c", // red
    marginTop: 8,
    paddingVertical: 13,
    alignItems: "center",
  },
  placeOrderButtonTextMinimal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  specialitiesBoxMinimal: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "transparent",
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginBottom: 16,
    marginTop: 2,
  },
  specialityTagMinimalBox: {
    backgroundColor: "#f3e8ff", // light purple
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  specialityMinimalTextBox: {
    color: "#8e24aa", // purple
    fontWeight: "600",
    fontSize: 13,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  popupContainer: {
    width: '90%',
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 200,
  },
  orderPopupInfoBox: {
    backgroundColor: '#f8f6ff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#8e24aa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  orderPopupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderPopupLabel: {
    fontSize: 14,
    color: '#8e24aa',
    fontWeight: '700',
    marginRight: 4,
  },
  orderPopupValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
  },
});

export default ProductDetails;
