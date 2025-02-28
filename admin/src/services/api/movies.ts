import { Movie, MovieResponse, MoviesResponse } from '../../types/movie';
import api from './axios';

export const moviesApi = {
  getMovies: async (): Promise<MoviesResponse> => {
    return api.get('/movie');
  },
  
  createMovie: async (formData: FormData): Promise<MovieResponse> => {
    return api.post('/movie', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updateMovie: async (id: number, formData: FormData): Promise<MovieResponse> => {
    return api.put(`/movie/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteMovie: async (id: number): Promise<MovieResponse> => {
    return api.delete(`/movie/${id}`);
  },
};