/* eslint-disable react/no-unescaped-entities */
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState } from "react";
import { icons } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import ReactNativeModal from "react-native-modal";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

import axios from "axios";

const SignIn = () => {

  const { setAuth } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  const onSignInPress = useCallback(async () => {
    setErrorMsg("");
    
    try {
      const response = await axios.post(
        "https://ourcanteennbackend.vercel.app/api/auth/login",
        form
      );

      console.log("Login response:", response.data);

      if (response.data.token && response.data.user) {

        setAuth({ user: response.data.user, token: response.data.token });
        // Optionally store auth token here using SecureStore or AsyncStorage
        // await SecureStore.setItemAsync("authToken", response.data.token);
        router.replace("/(root)/(tabs)/home");
      } else {
        setErrorMsg(response.data?.message || "Try again.");
        setShowErrorModal(true);
      }
    } catch (err: any) {
      console.log("Login error:", err);
      setErrorMsg(
        err.response?.data?.message || "Login failed. Check your credentials."
      );
      setShowErrorModal(true);
    }
  }, [form]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="relative w-full h-[100px] mb-2">
              <View style={{ position: "absolute", bottom: 24, left: 24 }}>
                <Text className="text-3xl text-black font-JakartaBold mb-1">
                  Welcome
                </Text>
                <Text className="text-base text-neutral-500 font-Jakarta">
                  Sign in to continue
                </Text>
              </View>
            </View>

            {/* Form */}
            <View
              className="p-5 bg-white mx-4 mt-2 rounded-2xl shadow-md"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              <InputField
                label="Email"
                placeholder="Enter email"
                icon={<MaterialIcons name="email" size={20} color="#888" />}
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
              />

              <InputField
                label="Password"
                placeholder="Enter password"
                icon={<MaterialIcons name="lock" size={20} color="#888" />}
                secureTextEntry
                value={form.password}
                onChangeText={(value) => setForm({ ...form, password: value })}
              />

              <View className="mt-6">
                <CustomButton
                  title="Sign In"
                  onPress={onSignInPress}
                  className="w-full bg-primary-500"
                />
              </View>

              <TouchableOpacity
                onPress={() => router.push("/(auth)/sign-up")}
                style={{ marginTop: 40 }}
                activeOpacity={0.7}
              >
                <Text style={{ textAlign: "center", fontSize: 16, color: "#64748b" }}>
                  Don't have an account?{" "}
                  <Text style={{ color: "#3b82f6", fontWeight: "bold" }}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Modal */}
            <ReactNativeModal
              isVisible={showErrorModal}
              onBackdropPress={() => setShowErrorModal(false)}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 24,
                  padding: 28,
                  minHeight: 180,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 20,
                  elevation: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#ffeaea",
                    borderRadius: 50,
                    padding: 16,
                    marginBottom: 18,
                  }}
                >
                  <MaterialIcons
                    name="error-outline"
                    size={40}
                    color="#ff4d4f"
                  />
                </View>
                <Text
                  style={{
                    color: "#ff4d4f",
                    fontSize: 22,
                    fontWeight: "700",
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  Oops!
                </Text>
                <Text
                  style={{
                    color: "#333",
                    fontSize: 16,
                    textAlign: "center",
                    marginBottom: 24,
                    lineHeight: 22,
                  }}
                >
                  {errorMsg}
                </Text>
                <CustomButton
                  title="Close"
                  onPress={() => setShowErrorModal(false)}
                  style={{
                    width: 120,
                    borderRadius: 8,
                    backgroundColor: "#ff4d4f",
                  }}
                />
              </View>
            </ReactNativeModal>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
