import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export const useHls = (videoRef: React.RefObject<HTMLVideoElement>, videoUrl?: string) => {
  const hlsInstance = useRef<Hls | null>(null);

  useEffect(() => {
    if (!videoRef.current || !videoUrl) return;

    const isHlsStream = videoUrl.includes('.m3u8');
    const formattedUrl = videoUrl.replace(/\/master\.m3u8$/, '/_AQUAPAW.m3u8');

    if (isHlsStream && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
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

      hlsInstance.current = hls;
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = formattedUrl;
    } else {
      videoRef.current.src = videoUrl;
    }

    return () => {
      if (hlsInstance.current) {
        hlsInstance.current.destroy();
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
    };
  }, [videoUrl]);
};