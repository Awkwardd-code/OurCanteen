import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@clerk/clerk-expo';

const UserButton: React.FC = () => {
  const { theme } = useTheme();
  const {user} = useUser()

  return (
    <TouchableOpacity style={styles.container}>
      <View style={[styles.innerContainer, { backgroundColor: theme.colors.cardBackground }]}>
        <Image
          source={{ uri: user?.imageUrl }}
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: theme.colors.textPrimary }]}>
          {user?.fullName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  name: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default UserButton;