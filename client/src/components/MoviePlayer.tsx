import React, { useState, useEffect, useRef } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMovieById } from '../services/api/movies';
import { Movie } from '../types/movies';

interface MoviePlayerProps {
  movieId: number;
}

export const MoviePlayer = ({ movieId }: MoviePlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<number | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Format time in MM:SS format
  const formatTime = (time: number): string => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Format time in HH:MM:SS format for longer videos
  const formatLongTime = (time: number): string => {
    if (isNaN(time) || time === 0) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours > 0 ? `${hours}:` : ''}${minutes < 10 && hours > 0 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      try {
        const response = await getMovieById(movieId);
        if (response.ok && response.data) {
          setMovie(response.data);
        } else {
          setError(response.message || 'Failed to load movie');
        }
      } catch (err) {
        setError('An error occurred while loading the movie');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set a default duration for testing if needed
    if (!movie?.video_url) {
      setDuration(120); // 2 minutes default
    }

    const handleTimeUpdate = () => {
      if (!isDragging && video.currentTime !== currentTime) {
        setCurrentTime(video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      console.log("Video metadata loaded, duration:", video.duration);
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        setDuration(video.duration);
      }
    };

    const handleDurationChange = () => {
      console.log("Duration changed:", video.duration);
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        setDuration(video.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);

    // Force load metadata
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    // Set a hard-coded fallback duration if all else fails
    const fallbackTimer = setTimeout(() => {
      if (duration === 0) {
        console.log("Using fallback duration");
        setDuration(120); // 2 minutes default
      }
    }, 2000);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
      clearTimeout(fallbackTimer);
    };
  }, [currentTime, duration, isDragging, movie]);

  // Handle mouse movement to show/hide controls
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleMouseMove = () => {
      setShowControls(true);
      player.style.cursor = 'default';
      
      // Clear existing timeout
      if (controlsTimeout) {
        window.clearTimeout(controlsTimeout);
      }
      
      // Set new timeout to hide controls after 3 seconds
      const timeout = window.setTimeout(() => {
        if (isPlaying && !isDragging) {
          setShowControls(false);
          player.style.cursor = 'none';
        }
      }, 3000);
      
      setControlsTimeout(timeout as unknown as number);
    };

    player.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      player.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeout) {
        window.clearTimeout(controlsTimeout);
      }
    };
  }, [isPlaying, controlsTimeout, isDragging]);

  // Update fullscreen state when fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Set a default video URL for testing if none is provided
  useEffect(() => {
    if (movie && !movie.video_url) {
      // Use a fallback video URL that's guaranteed to work
      const fallbackVideo = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      setMovie({
        ...movie,
        video_url: fallbackVideo
      });
    }
  }, [movie]);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && progressRef.current && videoRef.current) {
        const progressRect = progressRef.current.getBoundingClientRect();
        let seekPosition = (e.clientX - progressRect.left) / progressRect.width;
        
        // Clamp the value between 0 and 1
        seekPosition = Math.max(0, Math.min(1, seekPosition));
        
        const seekTime = duration * seekPosition;
        setCurrentTime(seekTime);
        
        // Update the progress bar visually during drag
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${seekPosition * 100}%`;
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging && videoRef.current) {
        videoRef.current.currentTime = currentTime;
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration, currentTime]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    // Only toggle play if the click is directly on the video, not on controls
    if (e.target === videoRef.current) {
      togglePlay();
    }
  };

  const handleSeekStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!progressRef.current || !videoRef.current || duration <= 0) return;
    
    setIsDragging(true);
    
    const progressRect = progressRef.current.getBoundingClientRect();
    const seekPosition = (e.clientX - progressRect.left) / progressRect.width;
    
    if (seekPosition >= 0 && seekPosition <= 1) {
      const seekTime = duration * seekPosition;
      setCurrentTime(seekTime);
      
      // Update the progress bar visually during drag
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${seekPosition * 100}%`;
      }
    }
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!progressRef.current || !videoRef.current || duration <= 0) return;
    
    const progressRect = progressRef.current.getBoundingClientRect();
    const seekPosition = (e.clientX - progressRect.left) / progressRect.width;
    
    if (seekPosition >= 0 && seekPosition <= 1) {
      const seekTime = duration * seekPosition;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const skipForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const skipBackward = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(-1);
  };

  // Calculate progress percentage safely
  const calculateProgress = () => {
    if (duration <= 0 || isNaN(duration)) return 0;
    const progress = (currentTime / duration) * 100;
    return isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
        <div className="text-white text-xl mb-4">{error || 'Movie not found'}</div>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-brand-yellow text-black rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={playerRef}
      className="fixed inset-0 bg-black z-50"
    >
      <div className="relative w-full h-full">
        {/* Video Element */}
        <video
          ref={videoRef}
          src={movie.video_url || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
          className="w-full h-full object-contain"
          autoPlay
          playsInline
          muted={isMuted}
          onClick={handleVideoClick}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          preload="auto"
          controls={false}
        />
        
        {/* Back button (always visible) */}
        <button
          onClick={handleBackClick}
          className={`absolute top-4 left-4 p-2 text-white hover:bg-white/10 rounded-full transition z-20 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Pause overlay with "You're watching" */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-start justify-end p-8 sm:p-16">
            <div className="max-w-2xl">
              <p className="text-gray-400 mb-2">You're watching</p>
              <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">{movie.title}</h1>
              <div className="flex items-center gap-2 text-white mb-4">
                <span>{movie.release_year}</span>
                <span className="px-2 py-1 text-xs border border-gray-500 rounded">
                  {movie.rating}
                </span>
                <span>{movie.duration}</span>
              </div>
              <p className="text-white text-sm sm:text-lg mb-8 sm:mb-16 max-w-3xl">
                {movie.description}
              </p>
            </div>
          </div>
        )}
        
        {/* Controls overlay */}
        <div 
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent pt-16 pb-4 px-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress bar */}
          <div 
            ref={progressRef}
            className="w-full h-2 bg-gray-600 mb-4 cursor-pointer relative"
            onClick={handleSeekClick}
            onMouseDown={handleSeekStart}
          >
            <div 
              ref={progressBarRef}
              className="absolute top-0 left-0 h-full bg-brand-yellow"
              style={{ width: `${calculateProgress()}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-brand-yellow rounded-full transform scale-100"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={togglePlay}
                className="p-2 text-white hover:bg-white/10 rounded-full transition"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
              
              <button
                onClick={skipBackward}
                className="p-2 text-white hover:bg-white/10 rounded-full transition"
              >
                <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <button
                onClick={skipForward}
                className="p-2 text-white hover:bg-white/10 rounded-full transition"
              >
                <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <button
                onClick={toggleMute}
                className="p-2 text-white hover:bg-white/10 rounded-full transition"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
              
              <div className="text-white text-xs sm:text-sm">
                {formatTime(currentTime)} / {formatLongTime(duration)}
              </div>
            </div>
            
            {/* Title (center) - hidden on small screens */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-white font-medium hidden sm:block">
              {movie.title}
            </div>
            
            {/* Right controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                className="p-2 text-white hover:bg-white/10 rounded-full transition hidden sm:block"
              >
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <button
                onClick={toggleFullscreen}
                className="p-2 text-white hover:bg-white/10 rounded-full transition"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};