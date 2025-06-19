import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Feather, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

interface ActionButtonProps {
  iconName: string;
  iconSet: 'Feather' | 'Ionicons' | 'FontAwesome5' | 'MaterialIcons';
  label: string;
  color?: string; // Optional color prop, defaults to theme primary
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  iconName,
  iconSet,
  label,
  color,
  onPress,
}) => {
  const { theme } = useTheme();

  // Map icon set to component
  const IconComponent = {
    Feather,
    Ionicons,
    FontAwesome5,
    MaterialIcons,
  }[iconSet];

  // Use provided color or fallback to primary
  const iconColor = color || theme.colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.cardBackground || '#FFFFFF',
          shadowColor: theme.colors.shadow || 'rgba(0, 0, 0, 0.1)',
        },
      ]}
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <IconComponent
        name={iconName}
        size={24}
        color={iconColor}
      />
      <Text
        style={[
          styles.label,
          {
            color: iconColor,
            fontFamily: theme.fonts.medium || 'Inter-Medium',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ActionButton;