// components/Loader.tsx
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

type LoaderProps = {
  message?: string;
};

export default function Loader({ message = "Loading..." }: LoaderProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2563eb" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 256, // approx h-64 in px (64*4)
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16, // space-y-4 equivalent (4 * 4 = 16)
  },
  message: {
    marginTop: 12,
    color: '#4b5563', // gray-600
    fontSize: 14,
  },
});

