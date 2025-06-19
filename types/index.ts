// src/types/index.ts
export interface Order {
  id: string;
  name: string;
  restaurant: string;
  price: string;
  status: 'Pending' | 'In Progress' | 'Delivered' | 'Cancelled';
  orderDate: string;
  image: any; // Use ImageSourcePropType if importing from react-native
  customerName?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  specialInstructions?: string;
}

// If you're using React Navigation, you might also want to add:
export type RootStackParamList = {
  OrderDetailsScreen: { orderId: string };
  ScannerScreen: undefined;
  // Add other screens here
};