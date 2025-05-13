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

  // Initialize navigation on mount to ensure tabs are active
  useEffect(() => {
    console.log("RetroController mounted, initializing navigation");
    // Pre-select the current section or default to 'about'
    const initialTab = currentSection || 'about';
    setTimeout(() => {
      navigateToTabByName(initialTab);
    }, 300);
  }, [currentSection, navigateToTabByName]);

  // Direct mapping of button to tab values - handle null case separately
  const buttonToTabMap: Partial<Record<string, string>> = {
    'a': 'about',
    'b': 'contact',
    'x': 'skills',
    'y': 'experience'
  };

  // Enhanced handler for button clicks with direct tab setting
  const onButtonClick = (button: Button) => {
    console.log(`RetroController: Button clicked: ${button}`);
    handleButtonClick(button);
    
    // Also directly set the tab using the context if possible
    if (button && buttonToTabMap[button]) {
      try {
        setCurrentSection(buttonToTabMap[button] as string);
      } catch (error) {
        console.error("Error setting section:", error);
      }
    }
  };

  // Enhanced handler for D-pad clicks
  const onDirectionClick = (direction: Direction) => {
    console.log(`RetroController: Direction clicked: ${direction}`);
    handleDPadClick(direction);
    
    // For left/right, modify tab directly when possible
    if (direction === 'left' || direction === 'right') {
      // Get all tab values in order
      const tabValues = ['about', 'skills', 'experience', 'contact'];
      const currentIndex = tabValues.indexOf(currentSection);
      
      if (currentIndex !== -1) {
        let newIndex;
        if (direction === 'left') {
          newIndex = (currentIndex - 1 + tabValues.length) % tabValues.length;
        } else { // right
          newIndex = (currentIndex + 1) % tabValues.length;
        }
        
        try {
          setCurrentSection(tabValues[newIndex]);
        } catch (error) {
          console.error("Error setting section:", error);
        }
      }
    }
  };

  return (
    <div 
      ref={controllerRef} 
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-20'}`}
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
