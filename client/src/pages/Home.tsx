import React, { useEffect, useState } from 'react';
import { FeaturedContent } from '../components/FeaturedContent';
import { ContentRow } from '../components/ContentRow';
import { GenreFilter } from '../components/GenreFilter';
import { Movie } from '../types/movies';
import { Category } from '../types/category';
import { getMoviesByCategory } from '../services/api/movies';
import { getAllCategories } from '../services/api/categories';

export function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Group movies by category
  const moviesByCategory = React.useMemo(() => {
    if (!movies.length) return {};
    
    return movies.reduce<Record<number, Movie[]>>((acc, movie) => {
      if (movie.category && movie.category.id) {
        if (!acc[movie.category.id]) {
          acc[movie.category.id] = [];
        }
        acc[movie.category.id].push(movie);
      }
      return acc;
    }, {});
  }, [movies]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        
        if (response.ok && response.data) {
          setCategories(response.data);
        } else if (Array.isArray(response)) {
          // Handle case where response is directly an array
          setCategories(response);
        } else {
          setError('Failed to load categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('An error occurred while loading categories');
      }
    };

    fetchCategories();
  }, []);

  // Fetch movies based on selected category
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);
      setIsTransitioning(true);
      
      try {
        const response = await getMoviesByCategory(selectedCategoryId || undefined);
        
        if (response.ok && response.data) {
          setMovies(response.data);
        } else if (Array.isArray(response)) {
          // Handle case where response is directly an array
          setMovies(response);
        } else {
          setError(response.message || 'Failed to load movies');
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('An error occurred while loading movies');
      } finally {
        setIsLoading(false);
        // Add a small delay before removing the transition state
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }
    };

    fetchMovies();
  }, [selectedCategoryId]);

  const handleSelectCategory = (categoryId: number | null) => {
    setIsTransitioning(true);
    setSelectedCategoryId(categoryId);
  };

  return (
    <>
      <FeaturedContent />
      <GenreFilter 
        categories={categories} 
        selectedCategoryId={selectedCategoryId} 
        onSelectCategory={handleSelectCategory} 
      />
      <div className={`mt-8 transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {isLoading ? (
          <ContentRow 
            title="Loading..." 
            items={[]} 
            isLoading={true} 
          />
        ) : error ? (
          <div className="text-center text-white py-8">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-brand-yellow text-black rounded-md transition-all duration-300 hover:bg-opacity-90 hover:scale-105"
            >
              Retry
            </button>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center text-white py-8 animate-fadeIn">
            <p>No movies found for the selected category</p>
          </div>
        ) : selectedCategoryId === null ? (
          // Show all categories when "All" is selected
          categories.map(category => {
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
          })
        ) : (
          // Show only the selected category
          <ContentRow 
            title={categories.find(c => c.id === selectedCategoryId)?.name || 'Movies'} 
            items={movies} 
            isLoading={false} 
          />
        )}
      </div>
    </>
  );
}