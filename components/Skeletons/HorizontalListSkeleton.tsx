import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const HorizontalListSkeleton = () => {
  const { theme } = useTheme();

  const renderItem = () => (
    <View style={[styles.item, { backgroundColor: theme.colors.card }]}>
      <View style={[styles.image, { backgroundColor: theme.colors.background }]} />
      <View style={[styles.text, { backgroundColor: theme.colors.background }]} />
    </View>
  );

  return (
    <FlatList
      horizontal
      data={[1, 2, 3, 4]}
      renderItem={renderItem}
      keyExtractor={(item) => item.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  item: {
    width: 120,
    height: 160,
    borderRadius: 8,
    marginRight: 12,
    padding: 8,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 6,
    marginBottom: 8,
  },
  text: {
    width: '80%',
    height: 12,
    borderRadius: 4,
  },
});

export default HorizontalListSkeleton;