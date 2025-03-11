import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { Movie } from '../types/movies';

export const useCart = (movie: Movie) => {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: movie.id.toString(),
      title: movie.title,
      price: 14.99,
      imageId: movie.thumbnail_url || '',
    });
    setIsAdded(true);
  };

  return {
    isAdded,
    handleAddToCart,
  };
};