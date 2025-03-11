import React, { useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types/movies';
import { useHls } from '../hooks/useHls';
import { useVideoControls } from '../hooks/useVideoControls';
import { useVideoProgress } from '../hooks/useVideoProgress';
import { useCart } from '../hooks/useCart';
import { calculateProgress } from '../utils/video';
import { VideoControls } from './video/VideoControls';
import { VideoProgressBar } from './video/VideoProgressBar';
import { VideoInfo } from './video/VideoInfo';
import { AddToCartPanel } from './video/AddToCartPanel';

interface VideoPopupProps {
  movie: Movie;
  onClose: () => void;
}

export const VideoPopup = ({ movie, onClose }: VideoPopupProps) => {
  const [showAddToCart, setShowAddToCart] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Custom hooks
  useHls(videoRef, movie.video_url);
  const {
    isMuted,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    toggleMute,
  } = useVideoControls(videoRef);

  const { handleSeekStart } = useVideoProgress({
    videoRef,
    progressRef,
    progressBarRef,
    duration,
  });

  const { isAdded, handleAddToCart } = useCart(movie);

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAddToCart(!showAddToCart);
  };

  const handleGoToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/cart');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50" onClick={onClose} />
      <div
        ref={popupRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:w-[90vw] max-w-5xl z-50 bg-zinc-900 rounded-lg overflow-hidden shadow-2xl"
      >
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover"
            autoPlay
            playsInline
            muted={isMuted}
            onClick={togglePlay}
          />

          <button
            onClick={onClose}
            className="absolute top-2 sm:top-4 left-2 sm:left-4 p-1.5 sm:p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition z-10"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>

          {/* Video Controls */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <VideoProgressBar
              progress={calculateProgress(currentTime, duration)}
              progressRef={progressRef}
              progressBarRef={progressBarRef}
              onSeekStart={handleSeekStart}
            />

            <div className="flex items-center justify-between">
              <VideoControls
                isPlaying={isPlaying}
                isMuted={isMuted}
                currentTime={currentTime}
                duration={duration}
                togglePlay={togglePlay}
                toggleMute={toggleMute}
              />

              <VideoInfo 
                movie={movie}
                onPlusClick={handlePlusClick}
              />
            </div>
          </div>

          {/* Add to Cart Panel */}
          {showAddToCart && (
            <AddToCartPanel
              movie={movie}
              isAdded={isAdded}
              onAddToCart={handleAddToCart}
              onGoToCart={handleGoToCart}
              onBack={() => setShowAddToCart(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};