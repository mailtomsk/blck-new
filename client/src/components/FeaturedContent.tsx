import React from 'react';
import { Play, Info, Clock } from 'lucide-react';

export const FeaturedContent = () => (
  <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]">
    <img
      src="https://wordpress.iqonic.design/product/wp/streamit/wp-content/uploads/2025/02/long.webp"
      alt="Featured Movie"
      className="w-full h-full object-cover object-top"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
    <div className="absolute left-4 sm:left-16 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl px-4 sm:px-0 bottom-8 sm:bottom-16 md:bottom-24 lg:bottom-32">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">
        Inception
      </h1>
      <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4 text-gray-300 text-xs sm:text-sm">
        <span className="px-1 sm:px-2 py-0.5 sm:py-1 text-xs border border-gray-500 rounded">
          PG-13
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 sm:w-4 sm:h-4" /> 2h 28m
        </span>
        <span className="text-green-500">98% Match</span>
        <span className="hidden sm:inline">2010</span>
      </div>
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4 text-xs sm:text-sm">
        <span className="text-gray-300">Action</span>
        <span className="text-gray-500">•</span>
        <span className="text-gray-300">Sci-Fi</span>
        <span className="text-gray-500">•</span>
        <span className="text-gray-300">Thriller</span>
      </div>
      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 mb-4 sm:mb-8 line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
        A thief who steals corporate secrets through dream-sharing technology is
        given the inverse task of planting an idea into the mind of a C.E.O.
      </p>
      <div className="flex gap-2 sm:gap-4">
        <button className="flex items-center gap-1 sm:gap-2 bg-white text-black px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-3 rounded hover:bg-opacity-90 transition text-xs sm:text-sm md:text-base">
          <Play className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> Play
        </button>
        <button className="flex items-center gap-1 sm:gap-2 bg-gray-500 bg-opacity-70 text-white px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-3 rounded hover:bg-opacity-60 transition text-xs sm:text-sm md:text-base">
          <Info className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> More Info
        </button>
      </div>
    </div>
  </div>
);