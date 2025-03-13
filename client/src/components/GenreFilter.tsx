import React from 'react';
import { Category } from '../types/category';

interface GenreFilterProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export const GenreFilter: React.FC<GenreFilterProps> = ({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory 
}) => {
  return (
    <div className="px-4 sm:px-16 py-4 flex gap-[45px] overflow-x-auto scrollbar-hide pt-2">
      <button
        key="all"
        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 ${
          selectedCategoryId === null 
            ? 'bg-brand-yellow text-black font-semibold shadow-lg' 
            : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
        }`}
        onClick={() => onSelectCategory(null)}
      >
        <span className="text-xs sm:text-sm text-center">All</span>
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 ${
            selectedCategoryId === category.id 
              ? 'bg-brand-yellow text-black font-semibold shadow-lg' 
              : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
          }`}
          onClick={() => onSelectCategory(category.id)}
        >
          <span className="text-xs sm:text-sm text-center px-2">{category.name}</span>
        </button>
      ))}
    </div>
  );
};