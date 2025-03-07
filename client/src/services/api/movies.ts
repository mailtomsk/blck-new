import api from './axios';
import { MoviesResponse, MovieResponse } from '../../types/movies';

export const getMoviesByCategory = async (categoryId?: number): Promise<MoviesResponse> => {
  try {
    // Update the URL to match the actual API endpoint structure
    const url = categoryId ? `/movie?categoryId=${categoryId}` : '/movie';
    const response = await api.get(url);
    
    // Return the response in the expected format
    return response.data || { ok: true, data: response };
  } catch (error) {
    console.error('Error fetching movies by category:', error);
    return { ok: false, message: 'Failed to fetch movies by category' };
  }
};

export const getMovieById = async (id: number): Promise<MovieResponse> => {
  try {
    const response = await api.get(`/movie/${id}`);
    
    // Handle different response formats
    if (response.data) {
      // If response.data exists, use it directly
      return response.data;
    } else {
      // Fallback for direct response
      return { ok: true, data: response };
    }
  } catch (error) {
    console.error(`Error fetching movie with id ${id}:`, error);
    return { ok: false, message: 'Failed to fetch movie details' };
  }
};

export const getContinueWatching = async (): Promise<MoviesResponse> => {
  try {
    const response = await api.get('/movie/continue-watching');
    return response.data || { ok: true, data: response };
  } catch (error) {
    console.error('Error fetching continue watching:', error);
    return { ok: false, message: 'Failed to fetch continue watching' };
  }
};