import React from 'react';
import { Play, Info, Clock } from 'lucide-react';

export const FeaturedContent = () => (
  <div className="relative w-full h-[100vh]">
    <img
      src="https://wordpress.iqonic.design/product/wp/streamit/wp-content/uploads/2025/02/long.webp"
      alt="Featured Movie"
      className="w-full h-full object-cover object-top"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
    <div className="absolute left-4 sm:left-16 max-w-2xl px-4 sm:px-0 bottom-0 sm:bottom-32 md:bottom-[5rem] lg:bottom-[5rem]">
      <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">
        Inception
      </h1>
      <div className="flex items-center gap-4 mb-4 text-gray-300">
        <span className="px-2 py-1 text-xs border border-gray-500 rounded">
          PG-13
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> 2h 28m
        </span>
        <span className="text-green-500">98% Match</span>
        <span className="hidden sm:inline">2010</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm text-gray-300">Action</span>
        <span className="text-gray-500">•</span>
        <span className="text-sm text-gray-300">Sci-Fi</span>
        <span className="text-gray-500">•</span>
        <span className="text-sm text-gray-300">Thriller</span>
      </div>
      <p className="text-base sm:text-lg text-gray-200 mb-8">
        A thief who steals corporate secrets through dream-sharing technology is
        given the inverse task of planting an idea into the mind of a C.E.O.
      </p>
      <div className="flex gap-2 sm:gap-4">
        <button className="flex items-center gap-2 bg-white text-black px-4 sm:px-8 py-2 sm:py-3 rounded hover:bg-opacity-90 transition text-sm sm:text-base">
          <Play className="w-5 h-5" /> Play
        </button>
        <button className="flex items-center gap-2 bg-gray-500 bg-opacity-70 text-white px-4 sm:px-8 py-2 sm:py-3 rounded hover:bg-opacity-60 transition text-sm sm:text-base">
          <Info className="w-5 h-5" /> More Info
        </button>
      </div>
    </div>
  </div>
);
