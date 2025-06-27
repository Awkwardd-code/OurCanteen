import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  item: Order;
};

const OrderDetails = ({ item }: Props) => {
  return (
    <View>
      <Text>{item.product_name}</Text>
    </View>
  );
};

export default OrderDetails;
