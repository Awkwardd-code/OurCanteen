/* eslint-disable import/no-unresolved */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';

const SignOutButton: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const { logout } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await logout();
      console.log('Signed out successfully');
      router.replace('/(auth)/welcome'); 
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  return (
    <View style={[styles.container, { padding: theme.spacing.md }]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.error,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
          },
        ]}
        onPress={handleSignOut}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: theme.colors.card,
              fontFamily: theme.fonts.medium,
            },
          ]}
        >
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});

export default SignOutButton;
