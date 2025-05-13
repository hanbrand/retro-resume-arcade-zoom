import { useRef } from 'react';
import ControllerBody from './controller/ControllerBody';
import { useControllerNavigation } from '@/hooks/useControllerNavigation';
import { useControllerVisibility } from '@/hooks/useControllerVisibility';
import { Direction } from './controller/DPad';
import { Button } from './controller/types';

const RetroController = () => {
  const controllerRef = useRef<HTMLDivElement>(null);
  const { 
    activeDirection, 
    activeButton, 
    keyPressed, 
    handleDPadClick, 
    handleButtonClick
  } = useControllerNavigation();
  const { isVisible } = useControllerVisibility(controllerRef);

  // Enhanced handler for button clicks
  const onButtonClick = (button: Button) => {
    console.log(`RetroController: Button clicked: ${button}`);
    handleButtonClick(button);
  };

  // Enhanced handler for D-pad clicks
  const onDirectionClick = (direction: Direction) => {
    console.log(`RetroController: Direction clicked: ${direction}`);
    handleDPadClick(direction);
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
