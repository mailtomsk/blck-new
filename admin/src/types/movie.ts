import { Category } from './category';

export interface Movie {
  id: number;
  title: string;
  categoryId: number;
  duration: string;
  release_year: number;
  rating: string;
  video_url?: string;
  thumbnail_url?: string;
  description: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  categories?: Array<Category | number>; // Can be array of Category objects or IDs
  cast?: string;
  director?: string;
  tags?: string;
}

export interface MovieResponse {
  ok: boolean;
  data?: Movie;
  message?: string;
}

export interface MoviesResponse {
  ok: boolean;
  data?: Movie[];
  message?: string;
}

export type MovieFormData = {
  title: string;
  categoryId: number;
  duration: string;
  release_year: number;
  rating: string;
  video: File | null;
  thumbnail: File | null;
  description: string;
  cast: string;
  director: string;
  tags: string;
};