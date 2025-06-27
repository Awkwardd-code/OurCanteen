export interface Order {
  id: number;
  product_name: string;
  restaurant_name: string;
  price: number;
  is_paid: boolean;
  created_at: string;
  image: string | null;
  number: number;
  amount: number;
  quantity: number;
  student_id: number;
  user_id: string;
  cuisine_name: string | null;
  updated_at: string;
}