import React from 'react';
import { useCartStore } from '../../store/cartStore';

export const OrderSummary = () => {
  const { items, total } = useCartStore();
  const tax = total() * 0.1;

  return (
    <div className="bg-zinc-900 rounded-lg p-4 sm:p-6 mb-4 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Order Summary</h2>
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm sm:text-base text-gray-400">
            <span className="truncate mr-2">{item.title}</span>
            <span>${item.price.toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-gray-700 pt-2 mt-2">
          <div className="flex justify-between text-white font-semibold text-sm sm:text-base">
            <span>Subtotal</span>
            <span>${total().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white font-semibold text-sm sm:text-base">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white font-semibold text-sm sm:text-base">
            <span>Total (including tax)</span>
            <span>${(total() + tax).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
