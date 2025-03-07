export interface Host {
  id: number;
  name: string;
  bio: string;
  profile_image: string;
  created_at: string;
  updated_at: string;
}

export interface Movie {
  id: number;
  title: string;
  categoryId?: number;
  duration: string;
  release_year: number;
  rating: string;
  video_url?: string;
  thumbnail_url?: string;
  description: string;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
    description: string;
  };
  genres?: string[];
  cast?: string;
  director?: string;
  // New fields
  show?: string;
  products_reviewed?: string;
  key_highlights?: string;
  additional_context?: string;
  hosts?: Host[];
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
  video: File;
  thumbnail: File;
  description: string;
  genres?: string[];
  cast?: string;
  director?: string;
  show?: string;
  products_reviewed?: string;
  key_highlights?: string;
  additional_context?: string;
  hosts?: number[]; // Host IDs
};