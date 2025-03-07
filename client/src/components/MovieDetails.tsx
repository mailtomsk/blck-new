import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  Play,
  Plus,
  ThumbsUp,
  Volume2,
  VolumeX,
  ShoppingCart,
  Star,
  Info,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Movie } from '../types/movies';
import { MovieInfoModal } from './MovieInfoModal';
import Hls from 'hls.js';

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
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstance = useRef<Hls | null>(null);

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

  const handleMoreInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowInfoModal(true);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Get category name from the single category
  const categoryName = movie.category?.name || '';

  // Initialize HLS player
  useEffect(() => {
    if (!videoRef.current || !movie.video_url || !isVideoPlaying) return;

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
  }, [movie.video_url, isVideoPlaying]);

  // Close popup when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        onClose();
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen, onClose]);

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

  // If it's a popup, don't use the full-screen overlay
  if (isPopup) {
    return (
      <>
        <div 
          className="bg-zinc-900 rounded-lg overflow-hidden shadow-xl w-[350px] sm:w-[400px] max-w-[95vw]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            {isVideoPlaying && movie.video_url ? (
              <video
                ref={videoRef}
                className="w-full h-[225px] object-cover"
                autoPlay
                loop
                playsInline
                muted={isMuted}
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
            <button
              onClick={toggleMute}
              className="absolute bottom-2 right-2 p-1.5 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition z-10"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
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
                <button
                  onClick={handleMoreInfo}
                  className="p-1.5 bg-gray-500 bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
                >
                  <Info className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 text-white mb-3 text-sm">
              {movie.rating && (
                <span className="flex items-center text-green-500">
                  <Star className="w-3 h-3 mr-1 inline" fill="currentColor" />
                  {movie.rating}/5
                </span>
              )}
              <span>{movie.release_year}</span>
              <span className="px-1 py-0.5 text-xs border border-gray-500 rounded">
                {movie.rating}
              </span>
              <span>{movie.duration}</span>
              <span className="px-1 py-0.5 text-xs bg-gray-800 rounded">HD</span>
            </div>

            {/* Show name if available */}
            {movie.show && (
              <div className="mb-3 text-sm">
                <span className="text-gray-400">Show:</span>{' '}
                <span className="text-white font-medium">{movie.show}</span>
              </div>
            )}

            {/* Category display */}
            {categoryName && (
              <div className="mb-3 text-sm">
                <span className="inline-block px-2 py-1 bg-zinc-800 text-gray-300 rounded text-xs">{categoryName}</span>
              </div>
            )}

            <p className="text-white text-sm mb-3 line-clamp-3">
              {movie.description}
            </p>

            {/* Hosts information */}
            {movie.hosts && movie.hosts.length > 0 && (
              <div className="mb-3">
                <h3 className="text-gray-400 text-sm mb-2">Hosts:</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {movie.hosts.map(host => (
                    <div key={host.id} className="flex-none">
                      <div className="flex flex-col items-center">
                        <span className="text-white text-xs">{host.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key highlights preview */}
            {highlightsList.length > 0 && (
              <div className="mb-3">
                <h3 className="text-gray-400 text-sm mb-1">Highlights:</h3>
                <p className="text-white text-xs line-clamp-2">
                  {highlightsList[0].replace(/^-\s*/, '')}
                  {highlightsList.length > 1 ? ' ...' : ''}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Full info modal */}
        {showInfoModal && (
          <MovieInfoModal 
            isOpen={showInfoModal} 
            onClose={() => setShowInfoModal(false)} 
            movie={movie} 
          />
        )}
      </>
    );
  }

  // For full-screen modal (when not a popup)
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div 
          className="bg-zinc-900 rounded-lg overflow-hidden shadow-xl w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            {isVideoPlaying && movie.video_url ? (
              <video
                ref={videoRef}
                className="w-full h-[225px] sm:h-[300px] object-cover"
                autoPlay
                loop
                playsInline
                muted={isMuted}
              />
            ) : (
              <img
                src={movie.thumbnail_url}
                alt={movie.title}
                className="w-full h-[225px] sm:h-[300px] object-cover"
              />
            )}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={toggleMute}
              className="absolute bottom-2 right-2 p-1.5 bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition z-10"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
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
                <button
                  onClick={handleMoreInfo}
                  className="p-1.5 bg-gray-500 bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
                >
                  <Info className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2 text-white mb-4 text-sm">
              {movie.rating && (
                <span className="flex items-center text-green-500">
                  <Star className="w-3 h-3 mr-1 inline" fill="currentColor" />
                  {movie.rating}/5
                </span>
              )}
              <span>{movie.release_year}</span>
              <span className="px-1 py-0.5 text-xs border border-gray-500 rounded">
                {movie.rating}
              </span>
              <span>{movie.duration}</span>
              <span className="px-1 py-0.5 text-xs bg-gray-800 rounded">HD</span>
            </div>

            {/* Show name if available */}
            {movie.show && (
              <div className="mb-4 text-sm">
                <span className="text-gray-400">Show:</span>{' '}
                <span className="text-white font-medium">{movie.show}</span>
              </div>
            )}

            {/* Category display */}
            {categoryName && (
              <div className="mb-4 text-sm">
                <span className="text-gray-300">{categoryName}</span>
              </div>
            )}

            <p className="text-white text-sm mb-4">
              {movie.description}
            </p>

            {/* Hosts information */}
            {movie.hosts && movie.hosts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-gray-400 text-sm mb-3">Hosts:</h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {movie.hosts.map(host => (
                    <div key={host.id} className="flex-none">
                      <div className="flex flex-col items-center">
                        <img 
                          src={host.profile_image} 
                          alt={host.name}
                          className="w-16 h-16 rounded-full object-cover mb-2"
                        />
                        <span className="text-white text-sm">{host.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products reviewed */}
            {productsList.length > 0 && (
              <div className="mb-4">
                <h3 className="text-gray-400 text-sm mb-2">Products Reviewed:</h3>
                <ul className="text-white text-sm space-y-1 list-disc pl-5">
                  {productsList.map((product, index) => (
                    <li key={index}>{product.replace(/^\d+\.\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key highlights */}
            {highlightsList.length > 0 && (
              <div className="mb-4">
                <h3 className="text-gray-400 text-sm mb-2">Key Highlights:</h3>
                <ul className="text-white text-sm space-y-1 list-disc pl-5">
                  {highlightsList.map((highlight, index) => (
                    <li key={index}>{highlight.replace(/^-\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional context */}
            {additionalContextList.length > 0 && (
              <div className="mb-4">
                <h3 className="text-gray-400 text-sm mb-2">Additional Information:</h3>
                <ul className="text-white text-sm space-y-1 list-disc pl-5">
                  {additionalContextList.map((context, index) => (
                    <li key={index}>{context.replace(/^-\s*/, '')}</li>
                  ))}
                </ul>
              </div>
            )}

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

      {/* Full info modal */}
      {showInfoModal && (
        <MovieInfoModal 
          isOpen={showInfoModal} 
          onClose={() => setShowInfoModal(false)} 
          movie={movie} 
        />
      )}
    </>
  );
};