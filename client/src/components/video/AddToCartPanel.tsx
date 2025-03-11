import React, { useState } from 'react';
import { ShoppingCart, ArrowRight, ArrowLeft, Star } from 'lucide-react';
import { Movie } from '../../types/movies';

interface AddToCartPanelProps {
  movie: Movie;
  isAdded: boolean;
  onAddToCart: (e: React.MouseEvent) => void;
  onGoToCart: (e: React.MouseEvent) => void;
  onBack?: () => void;
}

export const AddToCartPanel: React.FC<AddToCartPanelProps> = ({
  movie,
  isAdded,
  onAddToCart,
  onGoToCart,
  onBack,
}) => {
  const [showPlusOne, setShowPlusOne] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    onAddToCart(e);
    setShowPlusOne(true);
    setTimeout(() => setShowPlusOne(false), 1000);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0">
      {/* Navigation buttons - positioned above the panel */}
      <div className="flex justify-between px-6 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-300 rounded-full text-black hover:bg-brand-yellow transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        {isAdded && (
          <button
            onClick={onGoToCart}
            className="relative flex items-center gap-2 px-4 py-2 bg-yellow-300 rounded-full text-black hover:bg-brand-yellow transition font-medium group overflow-hidden"
          >
            <span className={`transition-transform duration-300 ${showPlusOne ? 'translate-y-8' : 'translate-y-0'}`}>
              Go to Cart
            </span>
            <span 
              className={`absolute left-1/2 -translate-x-1/2 transition-transform duration-300 ${
                showPlusOne ? 'translate-y-0' : '-translate-y-8'
              }`}
            >
              +1
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main panel */}
      <div 
        className="bg-[#2626268c] backdrop-blur-sm px-6 py-6 mx-6 mb-6 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-6">
          <img
            src={movie.thumbnail_url}
            alt={movie.title}
            className="w-24 sm:w-40 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">{movie.title}</h3>
            <div className="flex items-start gap-2 mb-2">
              <div className="flex items-center px-2 py-1 bg-brand-yellow rounded text-xs font-medium">
                <Star className="w-3 h-3 mr-0.5 sm:mr-1" fill='currentColor'/>
                <span className="text-black">4.7</span>
              </div>
              {movie.category && (
                <span className="px-2 py-1 bg-zinc-800 text-gray-300 rounded text-xs">
                  {movie.category.name}
                </span>
              )}
            </div>
            <p className="text-gray-300 text-xs sm:text-sm line-clamp-3">{movie.description}</p>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full mt-6 bg-brand-yellow text-black py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-opacity-90 transition font-semibold text-sm sm:text-lg"
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          Add to Cart - $14.99
        </button>
      </div>
    </div>
  );
};