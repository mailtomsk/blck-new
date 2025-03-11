import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Star } from 'lucide-react';
import { Movie } from '../types/movies';
import { VideoPopup } from './VideoPopup';

interface ContentRowProps {
  title: string;
  items: Movie[];
  isLoading?: boolean;
}

export const ContentRow = ({ title, items, isLoading = false }: ContentRowProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const scrollRow = (direction: 'left' | 'right') => {
    const container = document.getElementById(`scroll-container-${title}`);
    if (container) {
      const scrollAmount = direction === 'left' ? -container.clientWidth : container.clientWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  if (isLoading) {
    return (
      <div className="mb-8 animate-pulse">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[2400px] mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
          <div className="flex gap-4 overflow-x-scroll scrollbar-hide pb-4 -mx-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div
                key={index}
                className="flex-none w-[160px] sm:w-[200px] md:w-[250px] lg:w-[300px] h-[200px] sm:h-[250px] md:h-[300px] lg:h-[375px] bg-zinc-800 rounded-md first:ml-4 last:mr-4"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 animate-fadeIn" ref={rowRef}>
      <div className="relative group">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[2400px] mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
          <div
            id={`scroll-container-${title}`}
            className="flex gap-4 overflow-x-scroll scrollbar-hide pb-4 scroll-smooth -mx-4"
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-none w-[200px] sm:w-[280px] md:w-[320px] lg:w-[400px] relative first:ml-4 last:mr-4 transition-transform duration-300 ease-in-out cursor-pointer group"
                onClick={() => handleMovieClick(item)}
              >
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full object-cover rounded-md transition transform duration-300 ease-in-out group-hover:brightness-75"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-sm sm:text-base text-white font-semibold truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-300">
                    {item.rating && (
                      <span className="flex items-center text-green-500">
                        <Star className="w-3 h-3 mr-1 inline" fill="currentColor" />
                        {item.rating}
                      </span>
                    )}
                    {item.category && (
                      <span className="px-1 border border-gray-500 text-xs rounded">
                        {item.category.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => scrollRow('left')}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-8 bg-black bg-opacity-50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-75 disabled:opacity-0 z-10 transform hover:scale-110"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={() => scrollRow('right')}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-8 bg-black bg-opacity-50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-75 disabled:opacity-0 z-10 transform hover:scale-110"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Video Popup */}
      {selectedMovie && (
        <VideoPopup
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};