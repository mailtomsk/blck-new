import { Play, Info, Star, BugPlay, ShoppingBagIcon } from 'lucide-react';

export const FeaturedContent = () => (
  <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] top-[86px]">
    <img
      src="https://blck-videos.s3.us-east-1.amazonaws.com/thumbnails/82dcf8a6-26f9-4ab3-b2b1-2e2c2f35b008.jpg"
      alt="Featured Movie"
      className="w-full h-full object-cover object-top"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
    <div className="absolute left-4 sm:left-16 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl px-4 sm:px-0 bottom-8 sm:bottom-16 md:bottom-24 lg:bottom-32">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">
        Seat Armor
      </h1>
      <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4 text-gray-300 text-xs sm:text-sm">
        <Star />
        <span className="text-green-500">4.6</span>
        <span className="hidden sm:inline">2010</span>
      </div>
      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 mb-4 sm:mb-8 line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
      Seat Armor offers a comprehensive line of vehicle protection products designed to shield car seats, consoles, and interiors from spills, stains, odors, sweat, pet hair, and scratches. Compatible with GM, Ford, and Mopar vehicles, these protective accessories provide convenience, comfort, and durability for daily use.
      </p>
      <div className="flex gap-2 sm:gap-4">
        <button className="flex items-center gap-1 sm:gap-2 bg-white text-black px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-3 rounded hover:bg-opacity-90 transition text-xs sm:text-sm md:text-base">
          <ShoppingBagIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> Buy now
        </button>
      </div>
    </div>
  </div>
);