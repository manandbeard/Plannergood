import { useState, useEffect, useRef } from 'react';
import { usePhotos } from '@/hooks/usePhotos';
import { Photo } from '@shared/schema';

const PhotoSlideshow = () => {
  const { photos, isLoading, isError, getPhotoUrl } = usePhotos();
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
    if (photos && photos.length > 0) {
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
      }, 8000); // 8 seconds per slide
    }
  }, [photos, currentIndex]);
  
  // Placeholder for no photos or loading
  if (isLoading) {
    return (
      <div className="calendar-card bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full">
        <div className="bg-[#C7B8D5] text-white text-center py-2 px-3">
          <h2 className="text-xl font-semibold">Family Photos</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-[#7A7A7A]">Loading photos...</p>
        </div>
      </div>
    );
  }
  
  if (isError || !photos || photos.length === 0) {
    return (
      <div className="calendar-card bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full">
        <div className="bg-[#C7B8D5] text-white text-center py-2 px-3">
          <h2 className="text-xl font-semibold">Family Photos</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-[#7A7A7A]">
            {isError 
              ? "Error loading photos" 
              : "Upload photos in settings to see them here"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-card bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full">
      <div className="bg-[#C7B8D5] text-white text-center py-2 px-3">
        <h2 className="text-xl font-semibold">Family Photos</h2>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        {currentPhoto && (
          <img 
            src={getPhotoUrl(currentPhoto)} 
            alt="Family photo" 
            className={`absolute inset-0 w-full h-full object-cover slideshow-fade ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
          />
        )}
      </div>
    </div>
  );
};

export default PhotoSlideshow;
