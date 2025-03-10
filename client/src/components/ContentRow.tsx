import React, { useState, useRef, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight, Info, Star } from 'lucide-react';
import { MovieDetails } from './MovieDetails';
import { Movie } from '../types/movies';

interface ContentRowProps {
  title: string;
  items: Movie[];
  isLoading?: boolean;
}

export const ContentRow = ({ title, items, isLoading = false }: ContentRowProps) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hoveredMovie, setHoveredMovie] = useState<Movie | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const rowRef = useRef<HTMLDivElement>(null);

  // Close hover card on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (hoveredMovie) {
        setHoveredMovie(null);
      }
      if (selectedMovie) {
        setSelectedMovie(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hoveredMovie, selectedMovie]);

  const scrollRow = (direction: 'left' | 'right') => {
    const container = document.getElementById(`scroll-container-${title}`);
    if (container) {
      const scrollAmount =
        direction === 'left' ? -container.clientWidth : container.clientWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
      
      // Close any open popups when scrolling
      setHoveredMovie(null);
      setSelectedMovie(null);
    }
  };

  const handleMouseEnter = (movie: Movie, event: React.MouseEvent) => {
    // Clear any existing timeout
    if (hoverTimeout !== null) {
      clearTimeout(hoverTimeout);
    }
    
    // Set position for the hover card
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setHoverPosition({
      x: Math.min(rect.left, window.innerWidth - 400), // Ensure popup doesn't go off-screen
      y: rect.top
    });
    
    // Set a timeout to show the hover card
    const timeout = window.setTimeout(() => {
      setHoveredMovie(movie);
    }, 800); // 800ms delay before showing the hover card
    
    setHoverTimeout(timeout as unknown as number);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout !== null) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    
    // Small delay before hiding to allow moving to the hover card
    setTimeout(() => {
      if (!document.querySelector(':hover > .hover-card')) {
        setHoveredMovie(null);
      }
    }, 300);
  };

  const handleMovieClick = (movie: Movie, event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setClickPosition({
      x: Math.min(rect.left, window.innerWidth - 400), // Ensure popup doesn't go off-screen
      y: rect.top
    });
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
                className="flex-none w-[160px] sm:w-[200px] md:w-[250px] lg:w-[300px] relative first:ml-4 last:mr-4 transition-transform duration-300 ease-in-out hover:z-10"
                onMouseEnter={(e) => handleMouseEnter(item, e)}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  onClick={(e) => setHoveredMovie(item)}
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[375px] object-cover rounded-md transition transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 rounded-md flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="flex flex-col items-center gap-4 transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                    <Play
                      onClick={(e) => {
                        e.stopPropagation();
                        setHoveredMovie(item);
                      }}
                      className="w-8 h-8 sm:w-12 sm:h-12 text-white cursor-pointer hover:scale-110 transition-transform duration-300"
                    />
                  </div>
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
                      <span className="px-1 border border-gray-500 text-xs">
                        {item.rating}
                      </span>
                      {item.show && (
                        <span className="truncate max-w-[100px]">{item.show}</span>
                      )}
                    </div>
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
      
      {/* Hover card */}
      {hoveredMovie && (
        <div 
          className="hover-card fixed z-50 transition-opacity duration-300 ease-in-out animate-fade-in"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y - 50}px`,
          }}
          onMouseEnter={() => clearTimeout(hoverTimeout as number)}
          onMouseLeave={() => setHoveredMovie(null)}
        >
          <MovieDetails
            isOpen={true}
            onClose={() => setHoveredMovie(null)}
            movie={hoveredMovie}
            isPopup={true}
          />
        </div>
      )}
      
      {/* Click modal */}
      {selectedMovie && (
        <div 
          className="fixed z-50 transition-opacity duration-300 ease-in-out animate-fade-in"
          style={{
            left: `${clickPosition.x}px`,
            top: `${clickPosition.y - 50}px`,
          }}
        >
          <MovieDetails
            isOpen={!!selectedMovie}
            onClose={() => setSelectedMovie(null)}
            movie={selectedMovie}
            isPopup={true}
          />
        </div>
      )}
    </div>
  );
};