import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '../../utils/video';

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  togglePlay: (e: React.MouseEvent) => void;
  toggleMute: (e: React.MouseEvent) => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  isMuted,
  currentTime,
  duration,
  togglePlay,
  toggleMute,
}) => {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <button
        onClick={togglePlay}
        className="p-1 sm:p-2 text-white hover:bg-white/10 rounded-full transition"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>

      <button
        onClick={toggleMute}
        className="p-1 sm:p-2 text-white hover:bg-white/10 rounded-full transition"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>

      <div className="text-white text-xs sm:text-sm">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};