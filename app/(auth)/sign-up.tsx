/* eslint-disable react/no-unescaped-entities */
import {
  View,
  Alert,
  Text,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link, useRouter } from "expo-router";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import OAuth from "@/components/OAuth";
import ReactNativeModal from "react-native-modal";
import { fetchAPI } from "@/lib/fetch";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  /* const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      // Create account
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      // Split full name
      const [firstName, ...rest] = form.name.trim().split(" ");
      const lastName = rest.join(" ");

      // Update first and last name
      await signUp.update({
        firstName,
        lastName,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification((prev) => ({
        ...prev,
        state: "pending",
      }));
    } catch (err: any) {
      console.log("SignUp error:", JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors?.[0]?.longMessage || "Sign up failed.");
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });

        await setActive({ session: completeSignUp.createdSessionId });

        // Wait for the user session to be active
        setTimeout(async () => {
          if (user) {
            await (user as any).update({
              publicMetadata: {
                fullName: form.name,
              },
            });


          }
          setVerification((prev) => ({
            ...prev,
            state: "success",
          }));
        }, 500); // small delay to ensure user is available
      } else {
        setVerification((prev) => ({
          ...prev,
          error: "Verification failed. Please try again.",
        }));
      }
    } catch (err: any) {
      setVerification((prev) => ({
        ...prev,
        error: err.errors?.[0]?.longMessage || "Verification error",
      }));
    }
  }; */
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      // Create account
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification((prev) => ({
        ...prev,
        state: "pending",
      }));
    } catch (err: any) {
      console.log("SignUp error:", JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors?.[0]?.longMessage || "Sign up failed.");
    }
  };

  const onPressVerify = async () => {
  if (!isLoaded) return;
  try {
    const completeSignUp = await signUp.attemptEmailAddressVerification({
      code: verification.code,
    });

    if (completeSignUp.status === "complete") {
      // Split full name
      

      // Save user data to your backend
      await fetchAPI("/(api)/user", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          clerkId: completeSignUp.createdUserId,
        }),
      });

      // Set active session
      await setActive({ session: completeSignUp.createdSessionId });

      // Update Clerk user metadata or first/last name
      setTimeout(async () => {
        if (user) {
          await user.update({
            username : form.name,
          });
        }
        setVerification((prev) => ({
          ...prev,
          state: "success",
        }));
      }, 500); // Small delay to ensure user is available
    } else {
      setVerification((prev) => ({
        ...prev,
        error: "Verification failed. Please try again.",
      }));
    }
  } catch (err: any) {
    setVerification((prev) => ({
      ...prev,
      error: err.errors?.[0]?.longMessage || "Verification error",
    }));
  }
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 bg-white"
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 bg-white">
            {/* Header Image */}
            <View className="relative w-full h-[250px]">
              <Image
                source={images.signUpCar}
                className="z-0 w-full h-full"
                resizeMode="cover"
              />
              <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
                Create Your Account
              </Text>
            </View>

            {/* Form */}
            <View className="p-5">
              <InputField
                label="Name"
                placeholder="Enter name"
                icon={icons.person}
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
              />
              <InputField
                label="Email"
                placeholder="Enter email"
                icon={icons.email}
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
              />
              <InputField
                label="Password"
                placeholder="Enter password"
                icon={icons.lock}
                secureTextEntry
                value={form.password}
                onChangeText={(value) => setForm({ ...form, password: value })}
              />

              {verification.error !== "" && (
                <Text className="text-red-500 text-sm mt-1">
                  {verification.error}
                </Text>
              )}

              <CustomButton
                title="Sign Up"
                onPress={onSignUpPress}
                className="mt-6"
              />

              <OAuth />

              <Link
                href="/sign-in"
                className="text-lg text-center text-general-200 mt-10"
              >
                Already have an account?{" "}
                <Text className="text-primary-500">Log In</Text>
              </Link>
            </View>

            {/* Verification Modal */}
            <ReactNativeModal
              isVisible={verification.state === "pending"}
              avoidKeyboard
              onModalHide={() => {
                if (verification.state === "success") {
                  setShowSuccessModal(true);
                }
              }}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, justifyContent: "center" }}
              >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                    <Text className="font-JakartaExtraBold text-2xl mb-2">
                      Verification
                    </Text>
                    <Text className="font-Jakarta mb-5">
                      We've sent a verification code to {form.email}.
                    </Text>
                    <InputField
                      label={"Code"}
                      icon={icons.lock}
                      placeholder={"12345"}
                      value={verification.code}
                      keyboardType="numeric"
                      onChangeText={(code) =>
                        setVerification({ ...verification, code })
                      }
                    />
                    {verification.error && (
                      <Text className="text-red-500 text-sm mt-1">
                        {verification.error}
                      </Text>
                    )}
                    <CustomButton
                      title="Verify Email"
                      onPress={onPressVerify}
                      className="mt-5 bg-success-500"
                    />
                  </View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </ReactNativeModal>

            {/* Success Modal */}
            <ReactNativeModal isVisible={showSuccessModal}>
              <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <Image
                  source={images.check}
                  className="w-[110px] h-[110px] mx-auto my-5"
                />
                <Text className="text-3xl font-JakartaBold text-center">
                  Verified
                </Text>
                <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
                  You have successfully verified your account.
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
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
