/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CleanOrderCard, { CleanOrder } from '@/components/Orders/CleanOrderCard';  // new component import
import { useTheme } from '@/context/ThemeContext';
import { fetchAPI } from '@/lib/fetch';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/clerk-expo';
import HeaderWithSearch from '@/components/HeaderWithSearch';

const Orders = () => {
  const { theme } = useTheme();
  const { user } = useUser();

  const [orders, setOrders] = useState<CleanOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchOrders().finally(() => setRefreshing(false));
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await fetchAPI(`/(api)/order?user_id=${user?.id}`, {
        method: 'GET',
      });

      if (!Array.isArray(data)) throw new Error('Invalid response format');

      // Normalize image to never be undefined
      const normalizedOrders = data.map((order: any) => ({
        ...order,
        image: order.image ?? null,
      }));

      setOrders(normalizedOrders);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
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
      <HeaderWithSearch />

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CleanOrderCard item={item} />}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Orders</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>No orders found.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
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
    marginBottom: 50,
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
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});

export default Orders;
