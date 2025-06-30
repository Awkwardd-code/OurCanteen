import {
  View,
  Text,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import ReactNativeModal from "react-native-modal";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from "@/context/AuthContext";

const SignUp = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    institute: "",
    studentId: "",
    phoneNumber: "880",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [avaInstitution, setAvaInstitution] = useState([
    { id: "111", name: "University of Dhaka(DU)" },
    { id: "112", name: "University of Rajshahi(RU)" },
    { id: "113", name: "Rangpur Medical College(RpMC)" },
  ]);

  const { setAuth } = useAuth();

  // Helper function to validate email format
  const isValidEmail = (email: string) => {
    // Simple regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Helper function to serialize phone number (remove non-digits and limit to 13 chars)
  const serializePhoneNumber = (phone: string) => {
    return phone.replace(/\D/g, "").slice(0, 13);
  };

  const onSignUpPress = async () => {
    setErrorMsg("");
    // Validate for empty fields
    const emptyField = Object.entries(form).find(([key, value]) => !value.trim());
    if (emptyField) {
      setErrorMsg(`Please fill in your ${emptyField[0].replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
      setShowErrorModal(true);
      return;
    }
    // Validate password length
    if (form.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setShowErrorModal(true);
      return;
    }
    // Validate email format
    if (!isValidEmail(form.email)) {
      setErrorMsg("Please enter a valid email address.");
      setShowErrorModal(true);
      return;
    }
    // Validate phone number: must start with 8801 and be exactly 13 digits
    const serializedPhone = serializePhoneNumber(form.phoneNumber);
    if (!/^8801\d{9}$/.test(serializedPhone)) {
      setErrorMsg("Phone number must start with 8801 and be exactly 13 digits.");
      setShowErrorModal(true);
      return;
    }
    // Serialize phone number before sending
    const serializedForm = {
      ...form,
      phoneNumber: serializedPhone,
    };
    try {
      const response = await axios.post(
        "https://ourcanteennbackend.vercel.app/api/auth/signup",
        serializedForm
      );
      console.log("User saved:", response.data);

      if (response.data.token && response.data.user) {

        setAuth({ user: response.data.user, token: response.data.token });
        // Optionally store auth token here using SecureStore or AsyncStorage
        // await SecureStore.setItemAsync("authToken", response.data.token);
        router.replace("/(root)/(tabs)/home");
      } else {
        setErrorMsg(response.data?.message || "Try again.");
        setShowErrorModal(true);
      }

      setShowSuccessModal(true);
    } catch (err: any) {
      const apiError = err.response?.data?.error;
      const fallbackMsg = err.response?.data?.message || err.message;
      const error = apiError || fallbackMsg || "Something went wrong.";
      setErrorMsg(error);
      setShowErrorModal(true);
      console.error("Signup error:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
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
                  Create Your Account
                </Text>
                <Text className="text-base text-neutral-500 font-Jakarta">
                  Sign up to get started
                </Text>
              </View>
            </View>

            {/* Form */}
            <View
              className="p-5 bg-white mx-4 mt-2 rounded-2xl shadow-md"
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              <InputField
                label="Name"
                placeholder="Enter name"
                icon={<MaterialIcons name="person" size={20} color="#888" />}
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
              />
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
              {/* Institution Picker (Unified Design) */}
              <View className="my-2 w-full">
                <Text className="text-lg font-JakartaSemiBold mb-3">Institution</Text>
                <View className="flex flex-row items-center bg-neutral-100 rounded-md border border-neutral-100">
                  <MaterialIcons name="school" size={20} color="#888" style={{ marginLeft: 10 }} />
                  <Picker
                    selectedValue={form.institute}
                    onValueChange={(itemValue) => setForm({ ...form, institute: itemValue })}
                    style={{ flex: 1, height: 48, marginLeft: 2 }}
                    dropdownIconColor="#888"
                  >
                    <Picker.Item label="Select Institution" value="" />
                    {avaInstitution.map((inst) => (
                      <Picker.Item key={inst.id} label={inst.name} value={inst.id} />
                    ))}
                  </Picker>
                </View>
              </View>
              <InputField
                label="Student Id"
                placeholder="Enter Student Id"
                icon={<MaterialIcons name="badge" size={20} color="#888" />}
                value={form.studentId}
                onChangeText={(value) => setForm({ ...form, studentId: value })}
              />
              <InputField
                label="Phone Number"
                placeholder="Enter Phone Number"
                icon={<MaterialIcons name="phone" size={20} color="#888" />}
                value={form.phoneNumber}
                onChangeText={(value) =>
                  setForm({ ...form, phoneNumber: serializePhoneNumber(value) })
                }
              />
              <CustomButton
                title="Sign Up"
                onPress={onSignUpPress}
                className="mt-6"
              />
              <TouchableOpacity
                onPress={() => router.push("/(auth)/sign-in")}
                style={{ marginTop: 40 }}
                activeOpacity={0.7}
              >
                <Text style={{ textAlign: 'center', fontSize: 16, color: '#64748b' }}>
                  Already have an account?{' '}
                  <Text style={{ color: '#3b82f6', fontWeight: 'bold' }}>Log In</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Success Modal */}
            <ReactNativeModal isVisible={showSuccessModal}>
              <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <Image
                  source={images.check}
                  className="w-[110px] h-[110px] mx-auto my-5"
                />
                <Text className="text-3xl font-JakartaBold text-center">
                  Registered
                </Text>
                <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
                  Your account has been created successfully.
                </Text>
                <CustomButton
                  title="Browse Home"
                  onPress={() => {
                    router.push(`/(root)/(tabs)/home`);
                    setShowSuccessModal(false);
                  }}
                  className="mt-5"
                />
              </View>
            </ReactNativeModal>

            {/* Error Modal */}
            <ReactNativeModal isVisible={showErrorModal} onBackdropPress={() => setShowErrorModal(false)}>
              <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 28, minHeight: 180, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 8 }}>
                <View style={{ backgroundColor: '#ffeaea', borderRadius: 50, padding: 16, marginBottom: 18 }}>
                  <MaterialIcons name="error-outline" size={40} color="#ff4d4f" />
                </View>
                <Text style={{ color: '#ff4d4f', fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>Oops!</Text>
                <Text style={{ color: '#333', fontSize: 16, textAlign: 'center', marginBottom: 24, lineHeight: 22 }}>{errorMsg}</Text>
                <CustomButton
                  title="Close"
                  onPress={() => setShowErrorModal(false)}
                  style={{ width: 120, borderRadius: 8, backgroundColor: '#ff4d4f' }}
                />
              </View>
            </ReactNativeModal>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
