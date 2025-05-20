import { useState, useEffect, useRef } from 'react';
import { usePhotos } from '@/hooks/usePhotos';
import { Photo } from '@shared/schema';

interface ScreensaverProps {
  isActive: boolean;
  onExit: () => void;
}

const Screensaver = ({ isActive, onExit }: ScreensaverProps) => {
  const { photos, getPhotoUrl } = usePhotos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  
  // Refs for animation handling
  const fadeTimer = useRef<number | null>(null);
  const slideTimer = useRef<number | null>(null);
  
  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      if (slideTimer.current) clearTimeout(slideTimer.current);
    };
  }, []);
  
  // Update current photo when photos load or index changes
  useEffect(() => {
    if (isActive && photos && photos.length > 0) {
      setCurrentPhoto(photos[currentIndex]);
      
      // Start slideshow timer
      if (slideTimer.current) clearTimeout(slideTimer.current);
      slideTimer.current = window.setTimeout(() => {
        setFadeOut(true);
        
        // After fade out, change image
        fadeTimer.current = window.setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
          setFadeOut(false);
        }, 750); // Match the CSS transition time
      }, 10000); // 10 seconds per slide in screensaver
    }
  }, [isActive, photos, currentIndex]);
  
  if (!isActive) return null;
  
  // No photos case
  if (!photos || photos.length === 0) {
    return (
      <div 
        className="fixed inset-0 z-40 bg-black flex items-center justify-center"
        onClick={onExit}
      >
        <p className="text-white text-xl">No photos available</p>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-40 bg-black"
      onClick={onExit}
    >
      {currentPhoto && (
        <img 
          src={getPhotoUrl(currentPhoto)} 
          alt="Family photo screensaver" 
          className={`absolute inset-0 w-full h-full object-contain slideshow-fade ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
    </div>
  );
};

export default Screensaver;
