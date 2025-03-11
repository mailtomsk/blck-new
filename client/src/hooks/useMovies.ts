import { useState, useEffect } from 'react';
import { Movie } from '../types/movies';
import { Category } from '../types/category';
import { getMoviesByCategory } from '../services/api/movies';
import { getAllCategories } from '../services/api/categories';

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Group movies by category
  const moviesByCategory = movies.reduce<Record<number, Movie[]>>((acc, movie) => {
    if (movie.category && movie.category.id) {
      if (!acc[movie.category.id]) {
        acc[movie.category.id] = [];
      }
      acc[movie.category.id].push(movie);
    }
    return acc;
  }, {});

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        
        if (response.ok && response.data) {
          setCategories(response.data);
        } else if (Array.isArray(response)) {
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
          setMovies(response);
        } else {
          setError(response.message || 'Failed to load movies');
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('An error occurred while loading movies');
      } finally {
        setIsLoading(false);
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

  return {
    movies,
    categories,
    selectedCategoryId,
    isLoading,
    error,
    isTransitioning,
    moviesByCategory,
    handleSelectCategory,
  };
};