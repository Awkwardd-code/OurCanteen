import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Simple Badge component
const Badge: React.FC<{ color: 'success' | 'error'; children: React.ReactNode }> = ({
  color,
  children,
}) => {
  const backgroundColor = color === 'success' ? '#daf5dc' : '#fddede';
  const textColor = color === 'success' ? '#3a8d31' : '#d32f2f';

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>{children}</Text>
    </View>
  );
};

export default function EcommerceMetrics() {
  return (
    <View style={styles.container}>
      {/* Monthly Revenue Metric */}
      <View style={styles.metricCard}>
        <View style={styles.iconContainer}>
          <Ionicons name="cash-outline" size={24} color="#333" />
        </View>

        <View style={styles.metricContent}>
          <View>
            <Text style={styles.label}>Monthly Revenue</Text>
            <Text style={styles.value}>$12,345</Text>
          </View>
          <Badge color="success">
            <Ionicons name="arrow-up" size={14} color="#3a8d31" />
            {' 15.8%'}
          </Badge>
        </View>
      </View>

      {/* Successful Sales Metric */}
      <View style={styles.metricCard}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="check-circle-outline" size={24} color="#333" />
        </View>

        <View style={styles.metricContent}>
          <View>
            <Text style={styles.label}>Successful Sales</Text>
            <Text style={styles.value}>4,865</Text>
          </View>
          <Badge color="success">
            <Ionicons name="arrow-up" size={14} color="#3a8d31" />
            {' 9.2%'}
          </Badge>
        </View>
      </View>

      {/* Orders Metric */}
      <View style={styles.metricCard}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="cube-outline" size={24} color="#333" />
        </View>

        <View style={styles.metricContent}>
          <View>
            <Text style={styles.label}>Orders</Text>
            <Text style={styles.value}>5,359</Text>
          </View>
          <Badge color="error">
            <Ionicons name="arrow-down" size={14} color="#d32f2f" />
            {' 9.05%'}
          </Badge>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    gap: 16,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricContent: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    marginTop: 6,
    fontWeight: '700',
    fontSize: 22,
    color: '#222',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
