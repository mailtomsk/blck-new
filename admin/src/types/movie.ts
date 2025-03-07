import { Category } from './category';
import { Host } from './host';

export interface Movie {
  id: number;
  title: string;
  categoryId: number;
  video_url?: string;
  thumbnail_url?: string;
  description: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  hosts?: Host[];
  show?: string;
  products_reviewed?: string;
  key_highlights?: string;
  rating?: string;
  additional_context?: string;
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
  video_url?: string;
  thumbnail: File | null;
  description: string;
  hostIds: number[];
  show: string;
  products_reviewed: string;
  key_highlights: string;
  rating: string;
  additional_context: string;
};