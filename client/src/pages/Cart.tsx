import React from 'react';
import { useCartStore } from '../store/cartStore';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyCart } from '../components/cart/EmptyCart';

export function Cart() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="pt-24 sm:pt-32 min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-8">
        Shopping Cart
      </h1>
      
      <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.id}
              {...item}
              onRemove={removeItem}
              onUpdateQuantity={updateQuantity}
            />
          ))}
        </div>
        
        <div>
          <CartSummary subtotal={total()} />
        </div>
      </div>
    </div>
  );
}