/* eslint-disable import/no-unresolved */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import Loader from '@/components/Loader';
import HeaderWithSearch from '@/components/HeaderWithSearch';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Orders = () => {
  const { theme } = useTheme();
  const router = useRouter();
  // const { user } = useUser();

  const { token, user } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchOrders().finally(() => setRefreshing(false));
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`https://ourcanteennbackend.vercel.app/api/order`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = response.data;

      console.log('Fetched Orders:', data);

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
      className="bg-red-800"
      style={[styles.container]}
      edges={['top']}
    >
      {/* Sticky Header */}
      {/* <HeaderWithSearch /> */}

      {/* Orders List */}
      <FlatList
      className='bg-white'
        data={orders}
        keyExtractor={(item) => (item._id || item.id).toString()}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: theme.colors.card,
            borderRadius: 16,
            padding: 14,
            marginBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.10,
            shadowRadius: 8,
            elevation: 2,
          }}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={{ width: 60, height: 60, borderRadius: 14, marginRight: 12, backgroundColor: '#f3e8ff' }}
              />
            ) : (
              <View style={{ width: 60, height: 60, borderRadius: 14, marginRight: 12, backgroundColor: '#f3e8ff', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="food" size={32} color="#8e24aa" />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 1 }}>{item.restaurant_name}</Text>
              <Text style={{ color: '#8e24aa', fontWeight: '600', marginBottom: 1, fontSize: 13 }}>{item.status}</Text>
              <Text style={{ fontWeight: '500', fontSize: 14 }}>₹{item.amount}</Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 11, marginTop: 1 }}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                marginLeft: 8,
                backgroundColor: '#fff',
                borderRadius: 50,
                padding: 8,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#8e24aa',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 1,
              }}
              onPress={() => {
                const data = {
                  orderId: item._id || item.id,
                  userId: item.userId,
                };
                const encodedData = encodeURIComponent(JSON.stringify(data));
                router.push({
                  pathname: '/order/qr',
                  params: { data: encodedData },
                });
              }}
              accessibilityLabel="Show QR for this order"
            >
              <MaterialCommunityIcons name="qrcode-scan" size={22} color="#8e24aa" />
            </TouchableOpacity>
          </View>
        )}
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
