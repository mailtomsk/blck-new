import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Plus, ThumbsUp, Star, ShoppingCart, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Movie } from '../types/movies';
import Hls from 'hls.js';

interface MovieInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
}

export const MovieInfoModal: React.FC<MovieInfoModalProps> = ({
  isOpen,
  onClose,
  movie,
}) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstance = useRef<Hls | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  
  // Format products reviewed as a list
  const formatProductsList = (productsText?: string) => {
    if (!productsText) return [];
    return productsText.split('\n').filter(item => item.trim().length > 0);
  };

  // Format key highlights as a list
  const formatHighlights = (highlightsText?: string) => {
    if (!highlightsText) return [];
    return highlightsText.split('\n').map(item => item.trim()).filter(item => item.length > 0);
  };

  // Format additional context as a list
  const formatAdditionalContext = (contextText?: string) => {
    if (!contextText) return [];
    return contextText.split('\n').map(item => item.trim()).filter(item => item.length > 0);
  };

  const productsList = formatProductsList(movie.products_reviewed);
  const highlightsList = formatHighlights(movie.key_highlights);
  const additionalContextList = formatAdditionalContext(movie.additional_context);
  
  // Get category name from the single category
  const categoryName = movie.category?.name || '';

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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Initialize HLS player
  useEffect(() => {
    if (!videoRef.current || !movie.video_url) return;

    const isHlsStream = movie.video_url.includes('.m3u8');
    const formattedUrl = movie.video_url.replace(/\/master\.m3u8$/, '/_AQUAPAW.m3u8');

    if (isHlsStream && Hls.isSupported()) {
      // Cleanup previous instance
      if (hlsInstance.current) {
        hlsInstance.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        manifestLoadPolicy: {
          default: {
            maxTimeToFirstByteMs: 10000,
            maxLoadTimeMs: 20000,
            timeoutRetry: {
              maxNumRetry: 6,
              retryDelayMs: 1000,
              maxRetryDelayMs: 8000
            },
            errorRetry: {
              maxNumRetry: 6,
              retryDelayMs: 1000,
              maxRetryDelayMs: 8000
            }
          }
        }
      });

      hls.loadSource(formattedUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (videoRef.current) {
          videoRef.current.play().catch(error => {
            console.error("Error playing video:", error);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      hlsInstance.current = hls;
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari which has built-in HLS support
      videoRef.current.src = formattedUrl;
    } else {
      videoRef.current.src = movie.video_url;
    }

    // Cleanup function
    return () => {
      if (hlsInstance.current) {
        hlsInstance.current.destroy();
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
    };
  }, [movie.video_url]);

  // Close on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div 
          ref={modalRef}
          className="bg-zinc-900 rounded-lg overflow-hidden shadow-2xl w-full max-w-5xl animate-fadeIn"
        >
          {/* Header with video/image */}
          <div className="relative">
            {movie.video_url ? (
              <video
                ref={videoRef}
                className="w-full h-[225px] sm:h-[400px] lg:h-[500px] object-cover"
                autoPlay
                muted={isMuted} // Add mute condition here
                loop
                playsInline
              />
            ) : (
              <img
                src={movie.thumbnail_url}
                alt={movie.title}
                className="w-full h-[225px] sm:h-[400px] lg:h-[500px] object-cover"
              />
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-zinc-800 bg-opacity-70 rounded-full hover:bg-opacity-100 transition z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={toggleMute}
              className="absolute bottom-2 right-2 p-1.5 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition z-10"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
            </button>
            
            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-center gap-4 text-white mb-2">
                {movie.rating && (
                  <span className="flex items-center text-green-500">
                    <Star className="w-4 h-4 mr-1 inline" fill="currentColor" />
                    {movie.rating}/5
                  </span>
                )}
                <span>{movie.release_year}</span>
                <span className="px-2 py-1 text-xs border border-gray-500 rounded">
                  {movie.rating}
                </span>
                <span className="px-2 py-1 text-xs bg-gray-800 rounded">HD</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={handlePlay}
                  className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-md hover:bg-opacity-90 transition font-semibold"
                >
                  <Play className="w-5 h-5" /> Play
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 bg-gray-600 bg-opacity-70 text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition"
                >
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button className="p-2 bg-gray-600 bg-opacity-70 rounded-full hover:bg-opacity-90 transition">
                  <Plus className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 bg-gray-600 bg-opacity-70 rounded-full hover:bg-opacity-90 transition">
                  <ThumbsUp className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Content section */}
          <div className="p-6 sm:p-8">
            {/* Basic Info */}
            <div className="mb-6">
              {/* Show name */}
              {movie.show && (
                <div className="mb-2">
                  <span className="text-gray-400">Show:</span>{' '}
                  <span className="text-white font-medium">{movie.show}</span>
                </div>
              )}
              
              {/* Hosts - Simplified */}
              {movie.hosts && movie.hosts.length > 0 && (
                <div>
                  <span className="text-gray-400">Hosts:</span>{' '}
                  <span className="text-white">
                    {movie.hosts.map(host => host.name).join(', ')}
                  </span>
                </div>
              )}

              {/* Category */}
              {categoryName && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-zinc-800 text-gray-300 rounded text-xs">{categoryName}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-white text-base mb-8">
              {movie.description}
            </p>

            {/* Two-column layout for Products and Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Products reviewed - Left column */}
              {productsList.length > 0 && (
                <div className="bg-zinc-800 rounded-lg p-6">
                  <h3 className="text-gray-400 text-lg mb-4">Products Reviewed</h3>
                  <ul className="text-white space-y-2">
                    {productsList.map((product, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-gray-400">{index + 1}.</span>
                        <span>{product.replace(/^\d+\.\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Key highlights - Right column */}
              {highlightsList.length > 0 && (
                <div className="bg-zinc-800 rounded-lg p-6">
                  <h3 className="text-gray-400 text-lg mb-4">Key Highlights</h3>
                  <ul className="text-white space-y-2">
                    {highlightsList.map((highlight, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-brand-yellow">•</span>
                        <span>{highlight.replace(/^-\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Additional context - Full width */}
            {additionalContextList.length > 0 && (
              <div className="bg-zinc-800 rounded-lg p-6">
                <h3 className="text-gray-400 text-lg mb-4">Additional Information</h3>
                <ul className="text-white space-y-2">
                  {additionalContextList.map((context, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-brand-yellow">•</span>
                      <span>{context.replace(/^-\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};