import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/MenuBar/Header';
import UserButton from '@/components/MenuBar/UserButton';
import ActionButtons from '@/components/MenuBar/ActionButtons';

import SignOutButton from '@/components/MenuBar/LogoutHeader';

type MenuItem = {
  key: string;
  component: React.ReactElement;
};

const MenuBar = () => {
  const { theme } = useTheme();

  // Define menu items with proper React elements
  const menuItems: MenuItem[] = [
    { key: 'user', component: <UserButton /> },
    { key: 'actions', component: <ActionButtons /> },
  ];

  // Properly typed renderItem function that always returns a ReactElement
  const renderItem = ({ item }: { item: MenuItem }) => {
    return item.component;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header />

      <FlatList
        data={menuItems}
        renderItem={renderItem}
        ListFooterComponent={
          <View style={styles.footerContainer}>
            
            <SignOutButton />
          </View>
        }
        keyExtractor={(item) => item.key}
        ListHeaderComponent={<View style={styles.listHeader} />}
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
  },
  listHeader: {
    height: 8,
  },
  footerContainer: {
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default MenuBar;