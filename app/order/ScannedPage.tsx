/* eslint-disable @typescript-eslint/no-unused-vars */
// app/order/qr-result.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function QRResultPage() {
  const { data } = useLocalSearchParams();

  let parsed = null;
  try {
    parsed = data ? JSON.parse(decodeURIComponent(data as string)) : {};
  } catch (err) {
    parsed = { error: 'Invalid data format' };
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-lg font-bold mb-4">Scanned JSON</Text>
      <Text className="text-sm text-gray-700">{JSON.stringify(parsed, null, 2)}</Text>
    </ScrollView>
  );
}
