import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';

// Initialize Stripe only if we have the public key
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

export function Checkout() {
  const { items, total } = useCartStore();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  const handleCheckout = async () => {
    // Simulate successful payment
    alert('Demo: Payment processed successfully!');
    navigate('/');
  };

  return (
    <div className="pt-32 min-h-screen px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>
      
      <div className="bg-zinc-900 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-400">
              <span>{item.title}</span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-700 pt-2 mt-2">
            <div className="flex justify-between text-white font-semibold">
              <span>Total (including tax)</span>
              <span>${(total() * 1.1).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Payment Details</h2>
        <div className="space-y-4">
          {error && (
            <div className="bg-brand-yellow bg-opacity-10 border border-brand-yellow text-brand-yellow px-4 py-2 rounded">
              {error}
            </div>
          )}
          <div>
            <label className="block text-gray-400 mb-2">Card Number</label>
            <input
              defaultValue="4242 4242 4242 4242"
              type="text"
              placeholder="4242 4242 4242 4242"
              className="w-full bg-zinc-800 text-white px-4 py-2 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Expiry Date</label>
              <input
                defaultValue="12/25"
                type="text"
                placeholder="MM/YY"
                className="w-full bg-zinc-800 text-white px-4 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">CVC</label>
              <input
                defaultValue="123"
                type="text"
                placeholder="123"
                className="w-full bg-zinc-800 text-white px-4 py-2 rounded"
              />
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-brand-yellow text-black py-3 rounded mt-6 hover:bg-opacity-90 transition font-semibold"
          >
            Pay ${(total() * 1.1).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}