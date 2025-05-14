import { useState, useEffect, useCallback, useRef } from 'react';
import { Direction } from '@/components/controller/DPad';
import { Button } from '@/components/controller/types';

export const useControllerNavigation = () => {
  const [activeDirection, setActiveDirection] = useState<Direction>('neutral');
  const [activeButton, setActiveButton] = useState<Button>(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  
  // Set up event listeners for navigation
  useEffect(() => {
    // Scroll handling for up/down directions
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScrollPosition) {
        setActiveDirection('down');
      } else if (currentScroll < lastScrollPosition) {
        setActiveDirection('up');
      }
      setLastScrollPosition(currentScroll);

      // Reset direction after a short delay
      setTimeout(() => {
        setActiveDirection('neutral');
      }, 150);
    };

    // Global event handler for keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(`Key pressed: ${e.key}`);
      
      switch (e.key) {
        case 'ArrowUp':
          setActiveDirection('up');
          window.scrollBy(0, -100);
          setKeyPressed('up');
          break;
        case 'ArrowDown':
          setActiveDirection('down');
          window.scrollBy(0, 100);
          setKeyPressed('down');
          break;
        case 'ArrowLeft':
          setActiveDirection('left');
          setKeyPressed('left');
          break;
        case 'ArrowRight':
          setActiveDirection('right');
          setKeyPressed('right');
          break;
        case 'a':
        case 'A':
          setActiveButton('a');
          break;
        case 'b':
        case 'B':
          setActiveButton('b');
          break;
        case 'x':
        case 'X':
          setActiveButton('x');
          break;
        case 'y':
        case 'Y':
          setActiveButton('y');
          break;
        default:
          break;
      }
    };

    const handleKeyUp = () => {
      setActiveDirection('neutral');
      setActiveButton(null);
      setKeyPressed(null);
    };

    // Add all event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [lastScrollPosition]);

  // Function to handle D-pad button click
  const handleDPadClick = (direction: Direction) => {
    console.log(`D-pad clicked: ${direction}`);
    setActiveDirection(direction);
    
    switch (direction) {
      case 'up':
        window.scrollBy(0, -150);
        break;
      case 'down':
        window.scrollBy(0, 150);
        break;
      // We don't handle left/right here anymore - this is delegated to the RetroController
      default:
        break;
    }
    
    // Return to neutral position after a short delay
    setTimeout(() => {
      setActiveDirection('neutral');
    }, 200);
  };

  // Function to handle action button click
  const handleButtonClick = (button: Button) => {
    console.log(`Button clicked: ${button}`);
    setActiveButton(button);
    
    // Reset button after a short delay
    setTimeout(() => {
      setActiveButton(null);
    }, 150);
  };

  return {
    activeDirection,
    activeButton,
    keyPressed,
    handleDPadClick,
    handleButtonClick
  };
};
