import React, { useRef, useEffect, useState } from 'react';
import ControllerBody from './controller/ControllerBody';
import { useControllerNavigation } from '@/hooks/useControllerNavigation';
import { useControllerVisibility } from '@/hooks/useControllerVisibility';
import { Direction } from './controller/DPad';
import { Button } from './controller/types';
import { useNavigation } from './ArcadeScreen';

// Define tab order for consistent navigation
const TAB_VALUES = ['about', 'skills', 'experience', 'contact'];

const RetroController = () => {
  const controllerRef = useRef<HTMLDivElement>(null);
  const { currentSection, setTab } = useNavigation();
  const { 
    activeDirection, 
    activeButton, 
    keyPressed, 
    handleDPadClick: originalHandleDPadClick,
    handleButtonClick: originalHandleButtonClick,
    setActiveDirection,
    setActiveButton
  } = useControllerNavigation();
  const { isVisible } = useControllerVisibility(controllerRef);
  const [initialized, setInitialized] = useState(false);

  // Map for button to tab values
  const buttonToTabMap: Record<string, string> = {
    'a': 'about',
    'b': 'contact',
    'x': 'skills',
    'y': 'experience'
  };

  // Initialize on mount - ensure a tab is selected
  useEffect(() => {
    if (!initialized) {
      // Default to 'about' if no valid section is selected
      if (!TAB_VALUES.includes(currentSection)) {
        setTab('about');
      } else {
        setTab(currentSection);
      }
      setInitialized(true);
    }
  }, [currentSection, initialized, setTab]);

  // Enhanced handler for D-pad clicks with direct tab navigation
  const onDirectionClick = (direction: Direction) => {
    // Always call the original handler first for visual feedback
    originalHandleDPadClick(direction);
    
    // For left/right, navigate between tabs
    if (direction === 'left' || direction === 'right') {
      // Find current position in tab order
      const currentIndex = TAB_VALUES.indexOf(currentSection);
      if (currentIndex !== -1) {
        // Calculate next tab index with wrap-around
        const newIndex = direction === 'left'
          ? (currentIndex - 1 + TAB_VALUES.length) % TAB_VALUES.length
          : (currentIndex + 1) % TAB_VALUES.length;
        setTab(TAB_VALUES[newIndex]);
      }
    }
  };

  // Enhanced handler for button clicks
  const onButtonClick = (button: Button) => {
    // Always call the original handler first for visual feedback
    originalHandleButtonClick(button);
    
    // If clicked a mapped button, navigate to the corresponding tab
    if (button && buttonToTabMap[button]) {
      setTab(buttonToTabMap[button]);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Update direction based on arrow keys
      if (e.key === 'ArrowLeft') {
        setActiveDirection('left');
        onDirectionClick('left');
      } else if (e.key === 'ArrowRight') {
        setActiveDirection('right');
        onDirectionClick('right');
      } else if (e.key === 'ArrowUp') {
        setActiveDirection('up');
        onDirectionClick('up');
      } else if (e.key === 'ArrowDown') {
        setActiveDirection('down');
        onDirectionClick('down');
      }
      
      // Handle button presses
      const buttonKey = e.key.toLowerCase();
      if (['a', 'b', 'x', 'y'].includes(buttonKey)) {
        setActiveButton(buttonKey as Button);
        onButtonClick(buttonKey as Button);
      }
    };
    
    const handleKeyUp = () => {
      // Reset active states
      setActiveDirection('neutral');
      setActiveButton(null);
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentSection]); // Re-attach when current section changes

  return (
    <div 
      ref={controllerRef} 
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-20'}`}
      onMouseEnter={() => {
        // Make sure navigation is initialized on hover
        if (!initialized) {
          const initialTab = TAB_VALUES.includes(currentSection) ? currentSection : 'about';
          setTab(initialTab);
          setInitialized(true);
        }
      }}
    >
      <ControllerBody 
        activeDirection={activeDirection}
        activeButton={activeButton}
        keyPressed={keyPressed}
        onDirectionClick={onDirectionClick}
        onButtonClick={onButtonClick}
      />
    </div>
  );
};

export default RetroController;
