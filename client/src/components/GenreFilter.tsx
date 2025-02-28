import React from 'react';

export const GenreFilter = () => {
  const genres = ['All', 'Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Documentary', 'Animation'];
  
  return (
    <div className="px-4 sm:px-16 py-4 flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
      {genres.map((genre) => (
        <button
          key={genre}
          className="px-3 sm:px-4 py-1 text-xs sm:text-sm text-gray-300 bg-gray-900 rounded-full hover:bg-gray-800 transition whitespace-nowrap"
        >
          {genre}
        </button>
      ))}
    </div>
  );
};