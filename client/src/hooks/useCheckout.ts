import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { createOrder } from '../services/api/orders';

interface UserDetails {
  name: string;
  email: string;
  address: string;
}

export const useCheckout = () => {
  const [error, setError] = useState<string | null>(null);
  const [isUserDetailsValid, setUserDetailsValid] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const navigate = useNavigate();
  const { items, total: getTotal, clearCart } = useCartStore();

  const total = getTotal();
  const tax = total * 0.1;
  const finalTotal = total + tax;

  const handleCheckout = async () => {
    if (!isUserDetailsValid || !userDetails) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          title: item.title
        })),
        customerDetails: userDetails,
        paymentDetails: {
          cardNumber: '4242424242424242', // Demo card number
          expiryDate: '12/25',
          cvc: '123'
        },
        subtotal: total,
        tax,
        total: finalTotal
      };

      const response = await createOrder(orderData);

      if (response.ok && response.data) {
        clearCart();
        navigate('/order-confirmation', { 
          state: { order: response.data }
        });
      } else {
        setError(response.message || 'Failed to process order');
      }
    } catch (err) {
      setError('An error occurred while processing your order');
    }
  };

  return {
    error,
    setError,
    isUserDetailsValid,
    setUserDetailsValid,
    setUserDetails,
    total,
    handleCheckout,
  };
};