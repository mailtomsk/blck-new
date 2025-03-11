export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  password: string;
  date_born?: Date;
  last_session?: Date;
  update_at: Date;
  created_at: Date;
  role: 'USER' | 'ADMIN';
}

export interface Movie {
  id: number;
  title: string;
  categoryId: number;
  video_url: string;
  thumbnail_url: string;
  description: string;
  show?: string;
  products_reviewed?: string;
  key_highlights?: string;
  rating?: string;
  additional_context?: string;
  duration: string;
  release_year: number;
  cast: string;
  director: string;
  created_at: Date;
  updated_at: Date;
  category?: Category;
  hosts?: Host[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  movies?: Movie[];
}

export interface Host {
  id: number;
  name: string;
  bio?: string;
  created_at: Date;
  updated_at: Date;
  movies?: Movie[];
}

export interface MovieHost {
  movieId: number;
  hostId: number;
  movie?: Movie;
  host?: Host;
  created_at: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  address: string;
}

export interface PaymentDetails {
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  paymentMethodId: string;
}

export interface Order {
  items: OrderItem[];
  customerDetails: CustomerDetails;
  paymentDetails: PaymentDetails;
  subtotal: number;
  tax: number;
  total: number;
}

export interface OrderStatus {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}