import { OrdersResponse } from '../../types/order';
import api from './axios';

export const ordersApi = {
  getOrders: async (): Promise<OrdersResponse> => {
    return api.get('/order');
  },
};