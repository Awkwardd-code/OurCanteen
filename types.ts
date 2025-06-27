// Restaurant related types
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  address: string;
  phone: string;
  openingHours: string;
  logo?: string;
  image?: { uri: string };
  deliveryTime?: string;
  minOrder?: number;
  isOpen?: boolean;
  tags?: string[];
}

// Menu item types
export interface MenuItem {
  id: number;
  name: string;
  offer_id: number;
  cuisine_id: number;
  restaurant_id: number;
  description: string;
  price: number;
  image: string;
  specialities: string;
  isPopular: boolean;
  isBengali: boolean;
  isSpecial: boolean;
  calories?: number;
  preparationTime?: string;
  ingredients?: string[];
  dietaryTags?: string[];
}

// Offer/Cuisine types
export interface Offer {
  id: number;
  title: string;
  discount?: number;
  description?: string;
  validUntil?: string;
}

export type Cuisine = {
  id: number;
  name: string;
  image?: string;
  restaurant_id: number; // ✅ Add this line
  created_at?: string;
  updated_at?: string;
};

// Theme types
export interface ThemeColors {
  info: string;
  shadow: string;
  placeholder: string;
  buttonBackground: string;
  cardBackground: string;
  textPrimary: ColorValue | undefined;
  primary: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export interface Theme {
  dark: any;
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
