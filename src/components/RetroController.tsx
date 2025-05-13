import { useRef, useEffect } from 'react';
import ControllerBody from './controller/ControllerBody';
import { useControllerNavigation } from '@/hooks/useControllerNavigation';
import { useControllerVisibility } from '@/hooks/useControllerVisibility';
import { Direction } from './controller/DPad';
import { Button } from './controller/types';
import { useNavigation } from './ArcadeScreen'; // Import for direct tab control

const RetroController = () => {
  const controllerRef = useRef<HTMLDivElement>(null);
  const { currentSection, setCurrentSection } = useNavigation(); // Get navigation context
  const { 
    activeDirection, 
    activeButton, 
    keyPressed, 
    handleDPadClick, 
    handleButtonClick,
    navigateToTabByName
  } = useControllerNavigation();
  const { isVisible } = useControllerVisibility(controllerRef);
  const initialized = useRef(false);

  // Force select a tab programmatically (more direct than DOM click)
  const forceSelectTab = (tabName: string) => {
    console.log(`Forcing tab selection: ${tabName}`);
    // Try direct context update first (most reliable)
    try {
      setCurrentSection(tabName);
      return true;
    } catch (error) {
      console.error("Error setting section via context:", error);
    }

    // Fallback to DOM manipulation
    try {
      return navigateToTabByName(tabName);
    } catch (error) {
      console.error("Error navigating to tab:", error);
      return false;
    }
  };

  // Initialize aggressively on mount to ensure tabs are active immediately
  useEffect(() => {
    console.log("RetroController mounted, initializing navigation");

    // Immediate initialization attempt
    if (!initialized.current) {
      // Pre-select the about tab or current section
      const initialTab = currentSection || 'about';
      
      // Try immediately
      let success = forceSelectTab(initialTab);
      
      // And also set up retries with increasing intervals
      if (!success) {
        const retryTimes = [100, 200, 300, 500, 1000, 2000];
        retryTimes.forEach((delay, index) => {
          setTimeout(() => {
            if (!initialized.current) {
              console.log(`Retry ${index + 1} for tab initialization`);
              success = forceSelectTab(initialTab);
              if (success) {
                initialized.current = true;
              }
            }
          }, delay);
        });
      } else {
        initialized.current = true;
      }
    }
  }, [currentSection, navigateToTabByName, setCurrentSection]);

  // Direct mapping of button to tab values
  const buttonToTabMap: Record<string, string> = {
    'a': 'about',
    'b': 'contact',
    'x': 'skills',
    'y': 'experience'
  };

  // Enhanced handler for button clicks with direct tab setting
  const onButtonClick = (button: Button) => {
    console.log(`RetroController: Button clicked: ${button}`);
    
    // Ensure we're initialized on first click
    if (!initialized.current) {
      forceSelectTab('about');
      initialized.current = true;
    }
    
    // If clicked a mapped button, force select the corresponding tab
    if (button && buttonToTabMap[button]) {
      forceSelectTab(buttonToTabMap[button]);
    }
    
    // Also call the original handler for state updates
    handleButtonClick(button);
  };

  // Enhanced handler for D-pad clicks with direct tab navigation
  const onDirectionClick = (direction: Direction) => {
    console.log(`RetroController: Direction clicked: ${direction}`);
    
    // Ensure we're initialized on first click
    if (!initialized.current) {
      forceSelectTab('about');
      initialized.current = true;
    }
    
    // Handle left/right navigation directly
    if (direction === 'left' || direction === 'right') {
      // Get all tab values in order
      const tabValues = ['about', 'skills', 'experience', 'contact'];
      
      // Find current position or default to first tab
      let currentIndex = tabValues.indexOf(currentSection);
      if (currentIndex === -1) currentIndex = 0;
      
      // Calculate next tab index
      let newIndex;
      if (direction === 'left') {
        newIndex = (currentIndex - 1 + tabValues.length) % tabValues.length;
      } else { // right
        newIndex = (currentIndex + 1) % tabValues.length;
      }
      
      // Force select the new tab
      forceSelectTab(tabValues[newIndex]);
    }
    
    // Also call the original handler for scrolling/state updates
    handleDPadClick(direction);
  };

  return (
    <div 
      ref={controllerRef} 
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-20'}`}
      onMouseEnter={() => {
        // Ensure tabs are initialized when mouse hovers over controller
        if (!initialized.current) {
          forceSelectTab('about');
          initialized.current = true;
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
