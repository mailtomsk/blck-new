import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartSummaryProps {
  subtotal: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ subtotal }) => {
  const navigate = useNavigate();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="bg-zinc-900 rounded-lg p-4 sm:p-6 h-fit">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Order Summary</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-400 text-sm sm:text-base">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-400 text-sm sm:text-base">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-700 pt-2 mt-2">
          <div className="flex justify-between text-white font-semibold text-sm sm:text-base">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate('/checkout')}
        className="w-full bg-brand-yellow text-black py-2 sm:py-3 rounded flex items-center justify-center gap-2 hover:bg-opacity-90 transition font-semibold text-sm sm:text-base"
      >
        Proceed to Checkout <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};