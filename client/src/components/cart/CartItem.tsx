import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  id: string;
  title: string;
  price: number;
  imageId: string;
  quantity: number;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  title,
  price,
  imageId,
  quantity,
  onRemove,
  onUpdateQuantity,
}) => {
  return (
    <div className="bg-zinc-900 rounded-lg p-3 sm:p-4 flex gap-2 sm:gap-4">
      <img
        src={imageId}
        alt={title}
        className="w-20 sm:w-32 h-16 sm:h-20 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="text-sm sm:text-base text-white font-semibold">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-400">${price.toFixed(2)}</p>
        
        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => quantity > 1 && onUpdateQuantity(id, quantity - 1)}
            className="p-1 text-gray-400 hover:text-white transition disabled:opacity-50"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-white text-sm">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(id, quantity + 1)}
            className="p-1 text-gray-400 hover:text-white transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => onRemove(id)}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <p className="text-white text-sm font-semibold">
          ${(price * quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};