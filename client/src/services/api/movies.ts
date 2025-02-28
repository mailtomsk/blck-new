import api from './axios';
import { MoviesResponse, MovieResponse } from '../../types/movies';

export const getTrendingMovies = async (): Promise<MoviesResponse> => {
  try {
    const response = await api.get('/movie?tags=upcoming');
    return { ok: true, data: response.data };
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return { ok: false, message: 'Failed to fetch trending movies' };
  }
};

export const getMovieById = async (id: number): Promise<MovieResponse> => {
  try {
    const response = await api.get(`/movie/${id}`);
    return { ok: true, data: response.data };
  } catch (error) {
    console.error(`Error fetching movie with id ${id}:`, error);
    return { ok: false, message: 'Failed to fetch movie details' };
  }
};

export const getContinueWatching = async (): Promise<MoviesResponse> => {
  try {
    const response = await api.get('/movie/continue-watching');
    return { ok: true, data: response.data };
  } catch (error) {
    console.error('Error fetching continue watching:', error);
    return { ok: false, message: 'Failed to fetch continue watching' };
  }
};

export const getPopularMovies = async (): Promise<MoviesResponse> => {
  try {
    const response = await api.get('/movie?tags=popular');
    return { ok: true, data: response.data };
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return { ok: false, message: 'Failed to fetch popular movies' };
  }
};

export const getNewReleases = async (): Promise<MoviesResponse> => {
  try {
    const response = await api.get('/movie?tags=anime');
    return { ok: true, data: response.data };
  } catch (error) {
    console.error('Error fetching new releases:', error);
    return { ok: false, message: 'Failed to fetch new releases' };
  }
};