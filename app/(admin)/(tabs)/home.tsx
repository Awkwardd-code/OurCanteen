import React, { useCallback, useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EcommerceMetrics from '@/components/AdminPanel/EcommerceMetrics';
import MonthlySalesChart from '@/components/AdminPanel/MonthlySalesChart';
import MonthlyTarget from '@/components/AdminPanel/MonthlyTarget';
import StatisticsChart from '@/components/AdminPanel/StatisticsChart';
import AdminDashboardHeader from '@/components/AdminPanel/AdminDashboardHeader';
import CuisinesTable from '@/components/Products/CuisinesTable';
import OffersTable from '@/components/Products/OffersTable';
import { useTheme } from '@/context/ThemeContext';

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']} // Only safe area for top
    >
      {/* Sticky Header */}
      <AdminDashboardHeader />

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* Metrics & Charts Section */}
        <View style={styles.section}>
          <EcommerceMetrics />
          <MonthlySalesChart />
          <MonthlyTarget />
          <StatisticsChart />
        </View>

        {/* Tables Section */}
        <View style={styles.section}>
          <CuisinesTable />
          <OffersTable />
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 24,
    gap: 24,
  },
  section: {
    gap: 24,
    marginBottom: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});