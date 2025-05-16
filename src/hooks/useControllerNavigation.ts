import React, { useState, useEffect, useCallback } from 'react';
import { Direction } from '@/components/controller/DPad';
import { Button } from '@/components/controller/types';

export const useControllerNavigation = () => {
  const [activeDirection, setActiveDirection] = useState<Direction>('neutral');
  const [activeButton, setActiveButton] = useState<Button>(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  
  // Set up event listeners for basic navigation
  useEffect(() => {
    // Scroll handling for up/down directions
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      
      // Only update direction if there's a significant change
      if (Math.abs(currentScroll - lastScrollPosition) > 10) {
      if (currentScroll > lastScrollPosition) {
        setActiveDirection('down');
      } else if (currentScroll < lastScrollPosition) {
        setActiveDirection('up');
      }
        
      setLastScrollPosition(currentScroll);

      // Reset direction after a short delay
        const timer = setTimeout(() => {
        setActiveDirection('neutral');
      }, 150);
        
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollPosition]);

  // Function to handle D-pad button click - only handles scrolling
  const handleDPadClick = useCallback((direction: Direction) => {
    setActiveDirection(direction);
    
    // Handle scrolling for up/down
    if (direction === 'up') {
      window.scrollBy({ top: -150, behavior: 'smooth' });
    } else if (direction === 'down') {
      window.scrollBy({ top: 150, behavior: 'smooth' });
    }
    
    // Left/right navigation is handled in RetroController component
    
    // Return to neutral position after a short delay
    const timer = setTimeout(() => {
      setActiveDirection('neutral');
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to handle action button click - visual feedback only
  const handleButtonClick = useCallback((button: Button) => {
    setActiveButton(button);
    
    // Reset button after a short delay
    const timer = setTimeout(() => {
      setActiveButton(null);
    }, 150);
    
    return () => clearTimeout(timer);
  }, []);

  return {
    activeDirection,
    activeButton,
    keyPressed,
    setActiveDirection,
    setActiveButton,
    setKeyPressed,
    handleDPadClick,
    handleButtonClick
  };
};
