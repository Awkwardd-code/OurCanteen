import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const MenuItemSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={[styles.image, { backgroundColor: theme.colors.background }]} />
      
      <View style={styles.content}>
        <View style={[styles.title, { backgroundColor: theme.colors.background }]} />
        <View style={[styles.price, { backgroundColor: theme.colors.background }]} />
        <View style={[styles.offer, { backgroundColor: theme.colors.background }]} />
        <View style={[styles.cuisine, { backgroundColor: theme.colors.background }]} />
        <View style={[styles.description, { backgroundColor: theme.colors.background }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 220,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    padding: 12,
  },
  title: {
    height: 20,
    width: '80%',
    borderRadius: 4,
    marginBottom: 8,
  },
  price: {
    height: 18,
    width: '30%',
    borderRadius: 4,
    marginBottom: 6,
  },
  offer: {
    height: 14,
    width: '50%',
    borderRadius: 4,
    marginBottom: 6,
  },
  cuisine: {
    height: 14,
    width: '60%',
    borderRadius: 4,
    marginBottom: 6,
  },
  description: {
    height: 12,
    width: '90%',
    borderRadius: 4,
    marginBottom: 4,
  },
});

export default MenuItemSkeleton;