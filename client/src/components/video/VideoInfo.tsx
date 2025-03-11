import React from 'react';
import { Plus, Star } from 'lucide-react';
import { Movie } from '../../types/movies';

interface VideoInfoProps {
  movie: Movie;
  onPlusClick: (e: React.MouseEvent) => void;
}

export const VideoInfo: React.FC<VideoInfoProps> = ({ movie, onPlusClick }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <div>
        <h2 className="text-white font-medium text-xs sm:text-sm">{movie.title}</h2>
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          {movie.rating && (
            <span className="flex items-center text-green-500">
              <Star className="w-3 h-3 mr-0.5 sm:mr-1" fill="currentColor" />
              {movie.rating}
            </span>
          )}
          {movie.category && (
            <span className="px-1.5 sm:px-2 py-0.5 bg-zinc-800 text-gray-300 rounded text-xs">
              {movie.category.name}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={onPlusClick}
        className="p-1.5 sm:p-2 bg-yellow-400 rounded-full hover:bg-opacity-90 transition"
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
      </button>
    </div>
  );
};