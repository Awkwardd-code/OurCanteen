import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

// Define all possible theme color keys
type ThemeColorKeys =
  | 'primary'
  | 'primaryLight'
  | 'secondary'
  | 'accent'
  | 'background'
  | 'card'
  | 'cardBackground'
  | 'text'
  | 'textSecondary'
  | 'border'
  | 'error'
  | 'success'
  | 'successLight'
  | 'warning'
  | 'warningLight'
  | 'info'
  | 'textPrimary'
  | 'shadow'
  | 'placeholder'
  | 'buttonBackground'
  | 'backgroundSecondary';

// Strongly typed theme colors
export type ThemeColors = Record<ThemeColorKeys, string>;

// Theme spacing and typography
type ThemeSpacing = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

type ThemeBorderRadius = {
  sm: number;
  md: number;
  lg: number;
};

type ThemeFonts = {
  regular: string;
  medium: string;
  bold: string;
};

// Complete theme type
export type Theme = {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  fonts: ThemeFonts;
  dark: boolean;
};

// Light theme colors
const lightColors: ThemeColors = {
  primary: '#FF6B6B',
  primaryLight: '#FFE6E6',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
  background: '#F7FFF7',
  card: '#FFFFFF',
  cardBackground: '#FFFFFF',
  text: '#292F36',
  textSecondary: '#6C757D',
  border: '#E0E0E0',
  error: '#FF5252',
  success: '#4CAF50',
  successLight: '#F0FDF4',
  warning: '#FFC107',
  warningLight: '#FEFCE8',
  info: '#17A2B8',
  textPrimary: '#FF6B6B',
  shadow: 'rgba(0, 0, 0, 0.1)',
  placeholder: '#9E9E9E',
  buttonBackground: '#FF6B6B',
  backgroundSecondary: '#F9FAFB',
};

// Dark theme colors
const darkColors: ThemeColors = {
  primary: '#FF6B6B',
  primaryLight: '#FF8E8E',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
  background: '#121212',
  card: '#1E1E1E',
  cardBackground: '#1E1E1E',
  text: '#E0E0E0',
  textSecondary: '#A0A0A0',
  border: '#333333',
  error: '#FF5252',
  success: '#4CAF50',
  successLight: '#1A3C34',
  warning: '#FFC107',
  warningLight: '#422006',
  info: '#17A2B8',
  textPrimary: '#BBDEFB',
  shadow: 'rgba(0, 0, 0, 0.6)',
  placeholder: '#B0B0B0',
  buttonBackground: '#BBDEFB',
  backgroundSecondary: '#2A2A2A',
};

// Theme metrics
const spacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const borderRadius: ThemeBorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
};

const fonts: ThemeFonts = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
};

// Context type
type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: {
    colors: lightColors,
    spacing,
    borderRadius,
    fonts,
    dark: false,
  },
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const theme = useMemo<Theme>(() => ({
    colors: isDark ? darkColors : lightColors,
    spacing,
    borderRadius,
    fonts,
    dark: isDark,
  }), [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const setTheme = (dark: boolean) => {
    setIsDark(dark);
  };

  const value = useMemo(() => ({
    theme,
    isDark,
    toggleTheme,
    setTheme,
  }), [theme, isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};