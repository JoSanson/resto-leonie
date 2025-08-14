export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus = 'pending' | 'delivered';

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO string for storage
  deliveredAt?: string; // ISO string for storage
}
