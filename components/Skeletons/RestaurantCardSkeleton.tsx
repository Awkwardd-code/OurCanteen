import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const RestaurantCardSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={[styles.image, { backgroundColor: theme.colors.background }]} />
      
      <View style={styles.content}>
        <View style={[styles.title, { backgroundColor: theme.colors.background }]} />
        <View style={styles.metaContainer}>
          <View style={[styles.cuisine, { backgroundColor: theme.colors.background }]} />
          <View style={[styles.rating, { backgroundColor: theme.colors.background }]} />
        </View>
        <View style={[styles.address, { backgroundColor: theme.colors.background }]} />
        <View style={styles.infoContainer}>
          <View style={[styles.info, { backgroundColor: theme.colors.background }]} />
          <View style={[styles.info, { backgroundColor: theme.colors.background }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  title: {
    height: 24,
    width: '70%',
    borderRadius: 4,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cuisine: {
    height: 16,
    width: '50%',
    borderRadius: 4,
  },
  rating: {
    height: 16,
    width: '20%',
    borderRadius: 4,
  },
  address: {
    height: 16,
    width: '90%',
    borderRadius: 4,
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    height: 14,
    width: '40%',
    borderRadius: 4,
  },
});

export default RestaurantCardSkeleton;