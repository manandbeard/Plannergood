import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppSettings } from '@shared/types';

export const useScreensaver = () => {
  const [isScreensaverActive, setIsScreensaverActive] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  let timeoutId: number | null = null;

  // Get the screensaver timeout from settings
  const { data: settings } = useQuery<AppSettings>({
    queryKey: ['/api/settings'],
  });
  
  const timeoutMinutes = settings?.screensaverTimeout || 10;
  const timeoutMs = timeoutMinutes * 60 * 1000;

  // Handle user activity
  const handleUserActivity = useCallback(() => {
    setLastActivityTime(Date.now());
    
    if (isScreensaverActive) {
      setIsScreensaverActive(false);
    }
  }, [isScreensaverActive]);

  // Check for inactivity
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      if (now - lastActivityTime > timeoutMs) {
        setIsScreensaverActive(true);
      }
      timeoutId = window.setTimeout(checkInactivity, 10000); // Check every 10 seconds
    };
    
    timeoutId = window.setTimeout(checkInactivity, timeoutMs);
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [lastActivityTime, timeoutMs]);

  // Set up event listeners for user activity
  useEffect(() => {
    const activityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'touchmove'];
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [handleUserActivity]);

  // Force exit screensaver
  const exitScreensaver = () => {
    setIsScreensaverActive(false);
    setLastActivityTime(Date.now());
  };

  return {
    isScreensaverActive,
    exitScreensaver
  };
};
