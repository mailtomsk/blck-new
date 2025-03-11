export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  customerDetails: {
    name: string;
    email: string;
    address: string;
  };
  paymentDetails: {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
  };
  subtotal: number;
  tax: number;
  total: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customerDetails: {
    name: string;
    email: string;
    address: string;
  };
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface OrderResponse {
  ok: boolean;
  data?: Order;
  message?: string;
}