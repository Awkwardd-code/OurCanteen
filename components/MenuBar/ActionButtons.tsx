
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@clerk/clerk-expo';
import { fetchAPI } from '@/lib/fetch';
import ActionButton from './ActionButton';
import Loader from '../Loader';

interface User {
  id: number;
  name: string;
  email: string;
  clerk_id: string;
  phone: string;
  is_admin?: boolean;
  is_owner?: boolean;
}

const ActionButtons: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useUser();

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const data = await fetchAPI(`/(api)/user?clerkId=${user.id}`, {
        method: 'GET',
      });

      setUserData(data);
    } catch (err: any) {
      console.error('Failed to fetch user:', err);
      setError('Failed to load user data.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const fallbackAdminEmail = 'dhruba.fahad2004@gmail.com';
  const isAdmin = userData?.is_admin === true || userData?.email === fallbackAdminEmail;

  if (loading) return <Loader />;
  if (error)
    return (
      <Text style={{ color: theme.colors.error || '#F44336', textAlign: 'center' }}>
        {error}
      </Text>
    );

  return (
    <View style={[styles.container, { paddingHorizontal: theme.spacing?.sm || 16 }]}>
      {isAdmin && (
        <View style={styles.row}>
          <ActionButton
            iconName="admin-panel-settings"
            iconSet="MaterialIcons"
            label="Admin Panel"
            color={theme.colors.warning || '#FFC107'}
            onPress={() => router.push('/(admin)/(tabs)/home')}
          />
          {/* <ActionButton
            iconName="store"
            iconSet="FontAwesome5"
            label="Restaurant Page"
            color={theme.colors.success || '#4CAF50'}
            onPress={() => router.push('./restaurant')}
          /> */}
        </View>
      )}

      <View style={styles.row}>
        <ActionButton
          iconName="receipt"
          iconSet="FontAwesome5"
          label="Orders"
          color={theme.colors.info || '#2196F3'}
          onPress={() => router.push('/orders')}
        />
        {/* <ActionButton
          iconName="delivery-dining"
          iconSet="MaterialIcons"
          label="Delivery Status"
          color={theme.colors.error || '#F44336'}
          onPress={() => router.push('./delivery-status')}
        /> */}
      </View>

     {/*  <View style={[styles.row, styles.centeredRow]}>
        <ActionButton
          iconName="admin-panel-settings"
          iconSet="MaterialIcons"
          label="User Panel"
          color={theme.colors.warning || '#FFC107'}
          onPress={() => router.push('/(root)/(tabs)/home')}
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  centeredRow: {
    justifyContent: 'center',
  },
});

export default ActionButtons;
