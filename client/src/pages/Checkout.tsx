import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PaymentDetails } from '../components/checkout/PaymentDetails';
import { UserDetails } from '../components/checkout/UserDetails';
import { useCartStore } from '../store/cartStore';

export function Checkout() {
  const { total } = useCartStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isUserDetailsValid, setUserDetailsValid] = useState(false);

  const handleCheckout = async () => {
    if (!isUserDetailsValid) {
      setError('Please fill in all required fields.');
      return;
    }
    // Simulate successful payment
    alert('Demo: Payment processed successfully!');
    navigate('/');
  };

  return (
    <div className="pt-24 sm:pt-32 min-h-screen px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <UserDetails setUserDetailsValid={setUserDetailsValid} />
          <PaymentDetails total={total()} handleCheckout={handleCheckout} error={error} />
        </div>
        <div>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}