import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

import ChartOne from '@/components/Products/Chart';
import TableTwo from '@/components/Products/Table';
import AdminDashboardHeader from '@/components/AdminPanel/AdminDashboardHeader';
import ComboOffersTable from '@/components/Products/ComboOffersTable';
import SpecialOffersTable from '@/components/Products/SpecialOffersTable';
import ProductsMetrics from '@/components/Products/ProductsMetrics';
import ErrorBoundary from '@/components/ErrorBoundary';


const ProductsScreen = () => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'combos', 'specials'

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'combos':
        return <ComboOffersTable />;
      case 'specials':
        return <SpecialOffersTable />;
      default:
        return (
          <>
            <ProductsMetrics />
            <ChartOne />
            <TableTwo />
            <ComboOffersTable />
            <SpecialOffersTable />
          </>
        );
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <AdminDashboardHeader />

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'all' && styles.activeTab,
              activeTab === 'all' && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'all' && { color: theme.colors.card }
            ]}>
              All Products
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'combos' && styles.activeTab,
              activeTab === 'combos' && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setActiveTab('combos')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'combos' && { color: theme.colors.card }
            ]}>
              Combo Offers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'specials' && styles.activeTab,
              activeTab === 'specials' && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setActiveTab('specials')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'specials' && { color: theme.colors.card }
            ]}>
              Special Offers
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { backgroundColor: theme.colors.background }
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderContent()}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default ProductsScreen;