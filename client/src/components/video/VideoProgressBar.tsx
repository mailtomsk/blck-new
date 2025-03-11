import React from 'react';

interface VideoProgressBarProps {
  progress: number;
  progressRef: React.RefObject<HTMLDivElement>;
  progressBarRef: React.RefObject<HTMLDivElement>;
  onSeekStart: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const VideoProgressBar: React.FC<VideoProgressBarProps> = ({
  progress,
  progressRef,
  progressBarRef,
  onSeekStart,
}) => {
  return (
    <div 
      ref={progressRef}
      className="w-full h-1 bg-gray-600 mb-2 sm:mb-4 cursor-pointer relative"
      onMouseDown={onSeekStart}
    >
      <div 
        ref={progressBarRef}
        className="absolute top-0 left-0 h-full bg-brand-yellow"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-brand-yellow rounded-full transform scale-0 hover:scale-100 transition-transform"></div>
      </div>
    </div>
  );
};