export interface Movie {
    id: number;
    title: string;
    thumbnail_url?: string;
    description: string;
    show: string;
    products_reviewed: string;
    key_highlights: string;
    rating: string;
    additional_context: string;
  }
  
  export interface OrderItem {
    id: number;
    orderId: number;
    movieId: number;
    quantity: number;
    price: number;
    created_at: string;
    updated_at: string;
    movie: Movie;
  }
  
  export interface PaymentDetails {
    id: number;
    orderId: number;
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface OrderStatus {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Order {
    id: number;
    customerName: string;
    customerEmail: string;
    customerAddress: string;
    subtotal: number;
    tax: number;
    total: number;
    statusId: number;
    created_at: string;
    updated_at: string;
    items: OrderItem[];
    paymentDetails: PaymentDetails;
    orderStatus: OrderStatus;
  }
  
  export interface OrdersResponse {
    ok: boolean;
    data?: Order[];
    message?: string;
  }