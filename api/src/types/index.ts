export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  password: string;
  date_born?: Date;
  last_session?: Date;
  update_at: Date;
  created_at: Date;
  role: 'USER' | 'ADMIN';
}

export interface Movie {
  id: number;
  title: string;
  duration: string;
  release_year: number;
  rating: string;
  video_url: string;
  thumbnail_url: string;
  description: string;
  cast: string;         
  director: string;     
  tags: string;
  created_at: Date;
  updated_at: Date;
  categories?: Category[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  movies?: Movie[];
}

export interface MovieCategory {
  movieId: number;
  categoryId: number;
  created_at: Date;
}