export const calculateProgress = (currentTime: number, duration: number): number => {
    if (duration <= 0 || isNaN(duration)) return 0;
    const progress = (currentTime / duration) * 100;
    return isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress));
  };
  
  export const formatTime = (time: number): string => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };