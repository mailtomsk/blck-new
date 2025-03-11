import { useState, useEffect, RefObject } from 'react';

interface UseVideoProgressProps {
  videoRef: RefObject<HTMLVideoElement>;
  progressRef: RefObject<HTMLDivElement>;
  progressBarRef: RefObject<HTMLDivElement>;
  duration: number;
}

export const useVideoProgress = ({
  videoRef,
  progressRef,
  progressBarRef,
  duration,
}: UseVideoProgressProps) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && progressRef.current && videoRef.current) {
        const progressRect = progressRef.current.getBoundingClientRect();
        let seekPosition = (e.clientX - progressRect.left) / progressRect.width;
        seekPosition = Math.max(0, Math.min(1, seekPosition));
        
        const seekTime = duration * seekPosition;
        if (videoRef.current) {
          videoRef.current.currentTime = seekTime;
        }
        
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${seekPosition * 100}%`;
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration]);

  const handleSeekStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    
    if (progressRef.current && videoRef.current) {
      const progressRect = progressRef.current.getBoundingClientRect();
      const seekPosition = (e.clientX - progressRect.left) / progressRect.width;
      
      if (seekPosition >= 0 && seekPosition <= 1) {
        const seekTime = duration * seekPosition;
        videoRef.current.currentTime = seekTime;
      }
    }
  };

  return {
    isDragging,
    handleSeekStart,
  };
};