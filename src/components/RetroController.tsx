
import { useRef, useEffect } from 'react';
import ControllerBody from './controller/ControllerBody';
import { useControllerNavigation } from '@/hooks/useControllerNavigation';
import { useControllerVisibility } from '@/hooks/useControllerVisibility';

const RetroController = () => {
  const controllerRef = useRef<HTMLDivElement>(null);
  const { activeDirection, activeButton, keyPressed, handleDPadClick, handleButtonClick, navigateToTabByName } = useControllerNavigation();
  const { isVisible } = useControllerVisibility(controllerRef);

  // Initialize tabs as soon as component mounts
  useEffect(() => {
    // Force initial tab selection
    const timer = setTimeout(() => {
      // Try to navigate to the "about" tab to ensure initial tab is active
      navigateToTabByName('about');
    }, 200);

    return () => clearTimeout(timer);
  }, [navigateToTabByName]);

  return (
    <div 
      ref={controllerRef} 
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-20'}`}
    >
      <ControllerBody 
        activeDirection={activeDirection}
        activeButton={activeButton}
        keyPressed={keyPressed}
        onDirectionClick={handleDPadClick}
        onButtonClick={handleButtonClick}
      />
    </div>
  );
};

export default RetroController;
