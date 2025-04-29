
import { useState, useEffect, useRef, RefObject } from 'react';

export const useControllerVisibility = (controllerRef: RefObject<HTMLDivElement>) => {
  const [isVisible, setIsVisible] = useState(true);
  const mouseTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const controllerElement = controllerRef.current;
      if (!controllerElement) return;
      
      const controllerRect = controllerElement.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      
      // Check if mouse is near the controller (within 200px)
      const isNearController = 
        mouseY > controllerRect.top - 200 &&
        mouseY < controllerRect.bottom + 100;
      
      // Show controller if mouse is near
      if (isNearController) {
        setIsVisible(true);
        
        // Clear any existing timeout
        if (mouseTimeoutRef.current) {
          window.clearTimeout(mouseTimeoutRef.current);
        }
      } else {
        // Set a timeout to hide the controller after 2 seconds
        if (mouseTimeoutRef.current) {
          window.clearTimeout(mouseTimeoutRef.current);
        }
        
        mouseTimeoutRef.current = window.setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }
    };
    
    // Initial visibility control - show for a few seconds then fade
    setIsVisible(true);
    mouseTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 4000);
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimeoutRef.current) {
        window.clearTimeout(mouseTimeoutRef.current);
      }
    };
  }, [controllerRef]);

  return { isVisible };
};
