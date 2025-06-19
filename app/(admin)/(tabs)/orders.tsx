/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdminOrderDetails from '@/components/Orders/AdminOrderDetails';
import AdminDashboardHeader from '@/components/AdminPanel/AdminDashboardHeader';
import { useTheme } from '@/context/ThemeContext';
import { fetchAPI } from '@/lib/fetch';
import Loader from '@/components/Loader';

interface Order {
  id: number;
  product_name: string;
  image: string | null;  // required, can be null but not undefined
  number: number;
  amount: number;
  price: number;
  quantity: number;
  is_paid: boolean;
  student_id: number;
  user_id: string;
  restaurant_name: string;
  cuisine_name: string | null;
  created_at: string;
  updated_at: string;
}

const Orders = () => {
  const { theme } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await fetchAPI("/(api)/order");
      if (!Array.isArray(data)) throw new Error("Invalid response format");

      // Normalize image to never be undefined
      const normalizedOrders = data.map((order: any) => ({
        ...order,
        image: order.image ?? null,
      }));

      setOrders(normalizedOrders);
    } catch (err: any) {
      console.error("Failed to fetch offers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {/* Sticky Header */}
      <AdminDashboardHeader />

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}  // convert number to string here
        renderItem={({ item }) => <AdminOrderDetails item={item} />}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Orders</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              No orders found.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 16,
  },
  headerSection: {
    gap: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    fontSize: 16,
    fontWeight: '600',
    padding: 8,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});

export default Orders;
