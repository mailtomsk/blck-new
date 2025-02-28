import React from 'react';
import {
  X,
  Play,
  Plus,
  ThumbsUp,
  Volume2,
  VolumeX,
  ShoppingCart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Movie } from '../types/movies';

interface MovieDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  isPopup?: boolean;
}

export const MovieDetails = ({
  isOpen,
  onClose,
  movie,
  isPopup = false,
}: MovieDetailsProps) => {
  if (!isOpen) return null;
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);

  const handlePlay = () => {
    onClose();
    navigate(`/watch/${movie.id}`);
  };

  const handleAddToCart = () => {
    addItem({
      id: movie.id.toString(),
      title: movie.title,
      price: 14.99,
      imageId: movie.thumbnail_url || '',
    });
    navigate('/cart');
  };

  // Get category names from the categories array or fallback to the single category
  const categoryNames = movie.categories?.map(cat => cat.name) || 
                       (movie.category?.name ? [movie.category.name] : []);

  React.useEffect(() => {
    // Auto-play video preview after a short delay
    const timer = setTimeout(() => {
      setIsVideoPlaying(true);
    }, 800);

    return () => {
      clearTimeout(timer);
      setIsVideoPlaying(false);
    };
  }, [movie.id]);

  // If it's a popup, don't use the full-screen overlay
  if (isPopup) {
    return (
      <div 
        className="bg-zinc-900 rounded-lg overflow-hidden shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {isVideoPlaying && movie.video_url ? (
            <video
              src={movie.video_url}
              className="w-full h-[225px] object-cover"
              autoPlay
              muted
              loop
            />
          ) : (
            <img
              src={movie.thumbnail_url}
              alt={movie.title}
              className="w-full h-[225px] object-cover"
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-900 to-transparent">
            <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
            <div className="flex gap-2">
              <button
                onClick={handlePlay}
                className="flex items-center gap-1 bg-white text-black px-4 py-1.5 rounded-md hover:bg-opacity-90 transition text-sm"
              >
                <Play className="w-4 h-4" /> Play
              </button>
              <button className="p-1.5 bg-gray-500 bg-opacity-50 rounded-full hover:bg-opacity-70 transition">
                <Plus className="w-4 h-4 text-white" />
              </button>
              <button className="p-1.5 bg-gray-500 bg-opacity-50 rounded-full hover:bg-opacity-70 transition">
                <ThumbsUp className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={handleAddToCart}
                className="p-1.5 bg-gray-500 bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
              >
                <ShoppingCart className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 text-white mb-3 text-sm">
            <span className="text-green-500">98% Match</span>
            <span>{movie.release_year}</span>
            <span className="px-1 py-0.5 text-xs border border-gray-500 rounded">
              {movie.rating}
            </span>
            <span>{movie.duration}</span>
            <span className="px-1 py-0.5 text-xs bg-gray-800 rounded">HD</span>
          </div>

          {/* Categories display with bullet separators */}
          <div className="flex flex-wrap gap-1 mb-3 text-sm">
            {categoryNames.map((category, index) => (
              <React.Fragment key={index}>
                <span className="text-gray-300">{category}</span>
                {index < categoryNames.length - 1 && (
                  <span className="text-gray-500">•</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="text-white text-sm mb-3 line-clamp-3">
            {movie.description}
          </p>

          {/* Cast information */}
          {movie.cast && (
            <div className="mb-3 text-sm">
              <span className="text-gray-400">Cast:</span>{' '}
              <span className="text-white">{movie.cast}</span>
            </div>
          )}

          {/* Director information */}
          {movie.director && (
            <div className="text-sm">
              <span className="text-gray-400">Director:</span>{' '}
              <span className="text-white">{movie.director}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // For full-screen modal (when not a popup)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-zinc-900 rounded-lg overflow-hidden shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {isVideoPlaying && movie.video_url ? (
            <video
              src={movie.video_url}
              className="w-full h-[225px] object-cover"
              autoPlay
              muted
              loop
            />
          ) : (
            <img
              src={movie.thumbnail_url}
              alt={movie.title}
              className="w-full h-[225px] object-cover"
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-900 to-transparent">
            <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
            <div className="flex gap-2">
              <button
                onClick={handlePlay}
                className="flex items-center gap-1 bg-white text-black px-4 py-1.5 rounded-md hover:bg-opacity-90 transition text-sm"
              >
                <Play className="w-4 h-4" /> Play
              </button>
              <button className="p-1.5 bg-gray-500 bg-opacity-50 rounded-full hover:bg-opacity-70 transition">
                <Plus className="w-4 h-4 text-white" />
              </button>
              <button className="p-1.5 bg-gray-500 bg-opacity-50 rounded-full hover:bg-opacity-70 transition">
                <ThumbsUp className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={handleAddToCart}
                className="p-1.5 bg-gray-500 bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
              >
                <ShoppingCart className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 text-white mb-3 text-sm">
            <span className="text-green-500">98% Match</span>
            <span>{movie.release_year}</span>
            <span className="px-1 py-0.5 text-xs border border-gray-500 rounded">
              {movie.rating}
            </span>
            <span>{movie.duration}</span>
            <span className="px-1 py-0.5 text-xs bg-gray-800 rounded">HD</span>
          </div>

          {/* Categories display with bullet separators */}
          <div className="flex flex-wrap gap-1 mb-3 text-sm">
            {categoryNames.map((category, index) => (
              <React.Fragment key={index}>
                <span className="text-gray-300">{category}</span>
                {index < categoryNames.length - 1 && (
                  <span className="text-gray-500">•</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="text-white text-sm mb-3 line-clamp-3">
            {movie.description}
          </p>

          {/* Cast information */}
          {movie.cast && (
            <div className="mb-3 text-sm">
              <span className="text-gray-400">Cast:</span>{' '}
              <span className="text-white">{movie.cast}</span>
            </div>
          )}

          {/* Director information */}
          {movie.director && (
            <div className="text-sm">
              <span className="text-gray-400">Director:</span>{' '}
              <span className="text-white">{movie.director}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};