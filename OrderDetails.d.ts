// OrderDetails.d.ts
declare module '@/components/Orders/OrderDetails' {
  import { FC } from 'react';

  interface Order {
    id: string;
    name: string;
    restaurant: string;
    price: string;
    orderDate: string | undefined;
    user_id: string;
    image: string | null;
    quantity: number;
    description: string;
    is_paid: boolean;
    created_at: string;
    updated_at: string;
  }

  interface Props {
    order: Order;
  }

  const OrderDetails: FC<Props>;
  export default OrderDetails;
}