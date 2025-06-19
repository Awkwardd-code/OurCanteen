import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';

const AdminHeader: React.FC = () => {
  return (
    <View>
      <View style={styles.innerCard}>
        <Image
          source={{ uri: 'https://img.icons8.com/color/100/restaurant.png' }}
          style={styles.logo}
        />

        <View style={styles.info}>
          <Text style={styles.title}>The Gourmet Haven</Text>
          <Text style={styles.subTitle}>123 Flavor Street, Food City</Text>
        </View>

        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>Admin</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB', // light neutral background
  },
  innerCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderColor: '#e5e7eb',
    borderWidth: 1,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  subTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  labelContainer: {
    backgroundColor: '#eef2ff',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  labelText: {
    fontSize: 11,
    color: '#4338ca',
    fontWeight: '600',
  },
});

export default AdminHeader;
