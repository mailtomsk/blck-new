import React from 'react';
import { ContentRow } from '../ContentRow';
import { Movie } from '../../types/movies';
import { Category } from '../../types/category';

interface MovieGridProps {
  movies: Movie[];
  categories: Category[];
  selectedCategoryId: number | null;
  isLoading: boolean;
  error: string | null;
  isTransitioning: boolean;
  moviesByCategory: Record<number, Movie[]>;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  categories,
  selectedCategoryId,
  isLoading,
  error,
  isTransitioning,
  moviesByCategory,
}) => {
  if (isLoading) {
    return (
      <ContentRow 
        title="Loading..." 
        items={[]} 
        isLoading={true} 
      />
    );
  }

  if (error) {
    return (
      <div className="text-center text-white py-8">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-brand-yellow text-black rounded-md transition-all duration-300 hover:bg-opacity-90 hover:scale-105"
        >
          Retry
        </button>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center text-white py-8 animate-fadeIn">
        <p>No movies found for the selected category</p>
      </div>
    );
  }

  if (selectedCategoryId === null) {
    return (
      <>
        {categories.map(category => {
          const categoryMovies = moviesByCategory[category.id] || [];
          if (categoryMovies.length === 0) return null;
          
          return (
            <ContentRow 
              key={category.id}
              title={category.name} 
              items={categoryMovies} 
              isLoading={false} 
            />
          );
        })}
      </>
    );
  }

  return (
    <ContentRow 
      title={categories.find(c => c.id === selectedCategoryId)?.name || 'Movies'} 
      items={movies} 
      isLoading={false} 
    />
  );
};