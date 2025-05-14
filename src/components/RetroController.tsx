import { useRef, useEffect, useState } from 'react';
import ControllerBody from './controller/ControllerBody';
import { useControllerNavigation } from '@/hooks/useControllerNavigation';
import { useControllerVisibility } from '@/hooks/useControllerVisibility';
import { Direction } from './controller/DPad';
import { Button } from './controller/types';
import { useNavigation } from './ArcadeScreen'; // Import for direct tab control

// Define tab order for consistent navigation
const TAB_VALUES = ['about', 'skills', 'experience', 'contact'];

const RetroController = () => {
  const controllerRef = useRef<HTMLDivElement>(null);
  const { currentSection, setCurrentSection } = useNavigation(); // Get navigation context
  const { 
    activeDirection, 
    activeButton, 
    keyPressed, 
    handleDPadClick: originalHandleDPadClick,
    handleButtonClick: originalHandleButtonClick
  } = useControllerNavigation();
  const { isVisible } = useControllerVisibility(controllerRef);
  const initialized = useRef(false);
  const [navigationDebug, setNavigationDebug] = useState<string>('');

  // Map for button to tab values
  const buttonToTabMap: Record<string, string> = {
    'a': 'about',
    'b': 'contact',
    'x': 'skills',
    'y': 'experience'
  };

  // Programmatically click the tab element
  const clickTabElement = (tabValue: string) => {
    const tabId = `${tabValue}-tab`;
    const tabElement = document.getElementById(tabId);
    if (tabElement) {
      // Use the actual DOM click method to trigger the tab
      tabElement.click();
      return true;
    }
    return false;
  };

  // Simple initialization to ensure a tab is selected on mount
  useEffect(() => {
    console.log("RetroController mounted, initializing navigation");
    setNavigationDebug('Controller mounted');

    if (!initialized.current) {
      initialized.current = true;
      // Only set the section if it's not already set
      if (!TAB_VALUES.includes(currentSection)) {
        // Set state AND click the DOM element
        setCurrentSection('about');
        setTimeout(() => clickTabElement('about'), 100);
        setNavigationDebug('Initialized to about tab');
      }
    }
  }, [currentSection, setCurrentSection]);

  // Enhanced handler for D-pad clicks with direct tab navigation
  const onDirectionClick = (direction: Direction) => {
    console.log(`RetroController: Direction clicked: ${direction}`);
    setNavigationDebug(`Direction clicked: ${direction}`);
    
    // For left/right, navigate between tabs
    if (direction === 'left' || direction === 'right') {
      // Find current position in tab order
      const currentIndex = TAB_VALUES.indexOf(currentSection);
      if (currentIndex !== -1) {
        // Calculate next tab index
        const newIndex = direction === 'left'
          ? (currentIndex - 1 + TAB_VALUES.length) % TAB_VALUES.length
          : (currentIndex + 1) % TAB_VALUES.length;
        
        const newTab = TAB_VALUES[newIndex];
        
        // Update state AND programmatically click the tab
        setCurrentSection(newTab);
        setTimeout(() => clickTabElement(newTab), 10);
        setNavigationDebug(`Navigated to ${newTab}`);
      }
    }
    
    // Call original handler for other actions (scroll up/down)
    originalHandleDPadClick(direction);
  };

  // Enhanced handler for button clicks with direct tab setting
  const onButtonClick = (button: Button) => {
    console.log(`RetroController: Button clicked: ${button}`);
    setNavigationDebug(`Button clicked: ${button}`);
    
    // If clicked a mapped button, change to the corresponding tab
    if (button && buttonToTabMap[button]) {
      const tabName = buttonToTabMap[button];
      
      // Update state AND programmatically click the tab
      setCurrentSection(tabName);
      setTimeout(() => clickTabElement(tabName), 10);
      setNavigationDebug(`Activated ${tabName} tab`);
    }
    
    // Call original handler for state updates
    originalHandleButtonClick(button);
  };

  // Manually focus the active tab when keyboard events occur
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'b', 'x', 'y', 'A', 'B', 'X', 'Y'].includes(e.key)) {
        // Ensure we have focus on the tab container for keyboard navigation to work
        const tabsList = document.querySelector('[role="tablist"]');
        if (tabsList) {
          (tabsList as HTMLElement).focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div 
      ref={controllerRef} 
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-20'}`}
      onMouseEnter={() => {
        // Ensure tabs are initialized when mouse hovers over controller
        if (!initialized.current) {
          initialized.current = true;
          if (!TAB_VALUES.includes(currentSection)) {
            setCurrentSection('about');
            setTimeout(() => clickTabElement('about'), 100);
          }
          setNavigationDebug(`Initialized on mouse enter`);
        }
      }}
    >
      {/* Add debugging info, only visible during development */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="absolute -top-24 left-0 right-0 p-2 bg-black/80 text-white text-xs max-w-xs mx-auto">
          <div>Current Section: {currentSection}</div>
          <div>Debug: {navigationDebug}</div>
        </div>
      )}
      
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
