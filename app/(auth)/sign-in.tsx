/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { View, Text, ScrollView, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import { icons, images } from '@/constants';
import InputField from '@/components/InputField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import OAuth from '@/components/OAuth';
import { useSignIn } from '@clerk/clerk-expo';

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, [isLoaded, form]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 bg-white"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="relative w-full h-[250px]">
            <Image source={images.signUpCar} className="z-0 w-full h-full" resizeMode="cover" />
            <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
              Welcome
            </Text>
          </View>

          {/* Form */}
          <View className="p-5">
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

            <View className="mt-6">
              <CustomButton
                title="Sign In"
                onPress={onSignInPress}
                className="w-full bg-primary-500"
              />
            </View>

            <OAuth />

            <Link
              href="/sign-up"
              className="text-lg text-center text-general-200 mt-10"
            >
              Don't have an account?{" "}
              <Text className="text-primary-500">Sign Up</Text>
            </Link>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
