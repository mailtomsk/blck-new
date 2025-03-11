export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  title?: string;
}

export interface PaymentDetails {
  paymentMethodId: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  customerDetails: {
    name: string;
    email: string;
    address: string;
  };
  paymentDetails: PaymentDetails;
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
  paymentDetails: PaymentDetails;
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export interface OrderResponse {
  ok: boolean;
  data?: Order;
  message?: string;
}
