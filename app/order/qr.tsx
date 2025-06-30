// app/order/qr.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function QRPage() {
  const { data } = useLocalSearchParams();
  const router = useRouter();

  let jsonData = {};
  try {
    jsonData = data ? JSON.parse(decodeURIComponent(data as string)) : {};
  } catch {
    jsonData = { error: "Invalid QR Data" };
  }

  console.log('QR Data:', jsonData);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <TouchableOpacity
        style={{ position: 'absolute', top: 48, left: 24, zIndex: 10, backgroundColor: '#fff', borderRadius: 16, padding: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 }}
        onPress={() => router.replace("/")}
        accessibilityLabel="Go to Home"
        accessibilityRole="button"
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#222" />
      </TouchableOpacity>
      <Text style={{ fontSize: 17, fontWeight: '600', color: '#8e24aa', marginBottom: 18, marginTop: 32, textAlign: 'center' }}>
        Ask Provider to scan this QR on his app
      </Text>
      <QRCode value={JSON.stringify(jsonData)} size={250} />
    </View>
  );
}
