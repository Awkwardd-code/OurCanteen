import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

const Header: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView className='mt-12'>
      <View style={[styles.container, { backgroundColor: theme.colors.cardBackground }]}>
        <View style={styles.innerContainer}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Menu Bar</Text>
          <View style={styles.iconsContainer}>
            <Feather name="bell" size={22} color={theme.colors.textSecondary} />
            <Ionicons
              name="settings-outline"
              size={22}
              color={theme.colors.textSecondary}
              style={styles.settingsIcon}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  settingsIcon: {
    marginLeft: 8,
  },
});

export default Header;