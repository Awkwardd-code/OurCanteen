import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const ProductsMetrics = () => {
  const { theme } = useTheme();
  
  // Mock data - replace with your actual data
  const metrics = [
    { label: 'Total Products', value: '128', change: '+12%' },
    { label: 'Active Offers', value: '24', change: '+5%' },
    { label: 'Top Selling', value: 'Chicken Biryani', change: '32%' },
    { label: 'Low Stock', value: '8', change: '-3%' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Product Overview
      </Text>
      
      <View style={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <View 
            key={index} 
            style={[
              styles.metricCard, 
              { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              }
            ]}
          >
            <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
              {metric.label}
            </Text>
            <Text style={[styles.metricValue, { color: theme.colors.text }]}>
              {metric.value}
            </Text>
            <Text 
              style={[
                styles.metricChange,
                { 
                  color: metric.change.startsWith('+') 
                    ? theme.colors.success 
                    : metric.change.startsWith('-')
                    ? theme.colors.error
                    : theme.colors.textSecondary
                }
              ]}
            >
              {metric.change}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ProductsMetrics;