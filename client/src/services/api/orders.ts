import api from './axios';
import { OrderResponse, CreateOrderRequest } from '../../types/order';

export const createOrder = async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
  try {
    const response = await api.post('/order', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    return { ok: false, message: 'Failed to create order' };
  }
};