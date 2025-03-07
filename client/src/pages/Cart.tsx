import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export function Cart() {
  const { items, removeItem, total } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="pt-24 sm:pt-32 min-h-screen text-center px-4">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4">Your Cart is Empty</h1>
        <p className="text-gray-400 mb-8">Add some movies or TV shows to get started</p>
        <button
          onClick={() => navigate('/')}
          className="bg-brand-yellow text-black px-6 sm:px-8 py-2 sm:py-3 rounded hover:bg-opacity-90 transition font-semibold"
        >
          Browse Content
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-32 min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-8">Shopping Cart</h1>
      
      <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-zinc-900 rounded-lg p-3 sm:p-4 flex gap-2 sm:gap-4">
              <img
                src={item.imageId}
                alt={item.title}
                className="w-20 sm:w-32 h-16 sm:h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-sm sm:text-base text-white font-semibold">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400">${item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="bg-zinc-900 rounded-lg p-4 sm:p-6 h-fit">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-400 text-sm sm:text-base">
              <span>Subtotal</span>
              <span>${total().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400 text-sm sm:text-base">
              <span>Tax</span>
              <span>${(total() * 0.1).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between text-white font-semibold text-sm sm:text-base">
                <span>Total</span>
                <span>${(total() * 1.1).toFixed(2)}</span>
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
      </div>
    </div>
  );
}