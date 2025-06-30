/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import SignOutButton from '@/components/MenuBar/LogoutHeader';
import { useAuth } from '@/context/AuthContext';

const AccountPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <SafeAreaView style={[styles.container]}>
      {/* <View style={styles.headerSection}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Account</Text>
      </View> */}
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || '?'}</Text>
          </View>
          <Text style={styles.name}>{user?.name || '-'}</Text>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user?.phoneNumber || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Student ID</Text>
            <Text style={styles.infoValue}>{user?.studentId || '-'}</Text>
          </View>
          <View style={styles.editProfileContainer}>
            <Text style={styles.editProfileButton} onPress={() => {/* TODO: Add navigation to edit profile */ }}>
              Edit Profile
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <SignOutButton />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f3f6fb',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  headerSection: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    // paddingTop: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  card: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    borderWidth: 3,
    borderColor: '#4f8cff',
    borderRadius: 50,
    padding: 6,
    marginBottom: 12,
    backgroundColor: '#e3eafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4f8cff',
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 70,
    letterSpacing: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  infoLabel: {
    fontSize: 15,
    color: '#4f8cff',
    fontWeight: '600',
    flex: 1.2,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    flex: 2,
    textAlign: 'right',
    fontWeight: '500',
  },
  editProfileContainer: {
    width: '100%',
    marginTop: 24,
    alignItems: 'center',
  },
  editProfileButton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderRadius: 10,
    backgroundColor: '#4f8cff',
    width: '100%',
    textAlign: 'center',
    overflow: 'hidden',
    marginBottom: 2,
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 24,
  },
});

export default AccountPage;