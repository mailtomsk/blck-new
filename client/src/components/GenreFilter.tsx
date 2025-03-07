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
    <div className="px-4 sm:px-16 py-4 flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
      <button
        key="all"
        className={`px-3 sm:px-4 py-1 text-xs sm:text-sm rounded-full whitespace-nowrap transition-all duration-300 ease-in-out transform hover:scale-105 ${
          selectedCategoryId === null 
            ? 'text-black bg-brand-yellow font-semibold shadow-lg' 
            : 'text-gray-300 bg-gray-900 hover:bg-gray-800'
        }`}
        onClick={() => onSelectCategory(null)}
      >
        All
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          className={`px-3 sm:px-4 py-1 text-xs sm:text-sm rounded-full whitespace-nowrap transition-all duration-300 ease-in-out transform hover:scale-105 ${
            selectedCategoryId === category.id 
              ? 'text-black bg-brand-yellow font-semibold shadow-lg' 
              : 'text-gray-300 bg-gray-900 hover:bg-gray-800'
          }`}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};