import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star, ShoppingBagIcon, Volume2, VolumeX } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import Hls from 'hls.js';

export const FeaturedContent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstance = useRef<Hls | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const videoUrl = "https://blck-videos.s3.us-east-1.amazonaws.com/hls-videos/_SEAT_ARMOURS/_SEAT_ARMOURS.m3u8";
    
    if (!videoRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (videoRef.current) {
          videoRef.current.play().catch(error => {
            console.error("Error playing video:", error);
          });
        }
      });

      // Listen for the video to start playing
      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        setIsVideoLoaded(true);
      });

      hlsInstance.current = hls;
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = videoUrl;
      videoRef.current.addEventListener('loadeddata', () => {
        setIsVideoLoaded(true);
      });
    }

    return () => {
      if (hlsInstance.current) {
        hlsInstance.current.destroy();
      }
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleBuyNow = () => {
    addItem({
      id: "5",
      title: 'Seat Armor',
      price: 14.99,
      imageId: 'https://blck-videos.s3.us-east-1.amazonaws.com/thumbnails/82dcf8a6-26f9-4ab3-b2b1-2e2c2f35b008.jpg'
    });
    navigate('/cart');
  };

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] top-[86px] overflow-hidden">
      <div className="absolute inset-0">
        {!isVideoLoaded && (
          <img
            src="https://blck-videos.s3.us-east-1.amazonaws.com/thumbnails/82dcf8a6-26f9-4ab3-b2b1-2e2c2f35b008.jpg"
            alt="Featured Content"
            className="w-full h-full object-cover"
          />
        )}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          autoPlay
          loop
          muted={isMuted}
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>
      
      {/* Mute/Unmute Button */}
      {isVideoLoaded && (
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition z-10"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </button>
      )}

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
          <button 
            onClick={handleBuyNow}
            className="flex items-center gap-1 sm:gap-2 bg-white text-black px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-3 rounded hover:bg-opacity-90 transition text-xs sm:text-sm md:text-base"
          >
            <ShoppingBagIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> Buy now
          </button>
        </div>
      </div>
    </div>
  );
};