/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderWithSearch from '@/components/HeaderWithSearch';
import OrderDetails from '@/components/Orders/OrderDetails';
import { useTheme } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import Loader from '@/components/Loader';
import { fetchAPI } from '@/lib/fetch';
import { useUser } from '@clerk/clerk-expo';

interface Order {
  id: number;
  product_name: string;
  image: string | null;
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
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await fetchAPI(`/(api)/order?user_id=${user.id}`, {
        method: 'GET',
      });

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: Expected an array');
      }

      // Validate and normalize orders
      const normalizedOrders = data.map((order) => ({
        ...order,
        id: order.id,
        image: order.image ?? null,
      }));

      setOrders(normalizedOrders);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err.message);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]); // Add user?.id as a dependency

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={theme.dark ? 'light' : 'dark'} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <View style={[styles.headerContainer, { backgroundColor: theme.colors.background }]}>
        <HeaderWithSearch />
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)} // Convert id to string
        renderItem={({ item }) => <OrderDetails item={item} />}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Your Orders
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No orders found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listHeader: {
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Orders;