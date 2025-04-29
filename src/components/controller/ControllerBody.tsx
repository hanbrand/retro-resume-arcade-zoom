
import DPad from './DPad';
import ActionButtons from './ActionButtons';
import { Direction } from './DPad';
import { Button } from './types';

interface ControllerBodyProps {
  activeDirection: Direction;
  activeButton: Button;
  keyPressed: string | null;
  onDirectionClick: (direction: Direction) => void;
  onButtonClick: (button: Button) => void;
}

const ControllerBody = ({ 
  activeDirection, 
  activeButton, 
  keyPressed,
  onDirectionClick,
  onButtonClick
}: ControllerBodyProps) => {
  return (
    <div className="relative w-80 h-40 bg-gray-200 rounded-full px-4 shadow-2xl">
      {/* Controller Body with rounded edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-300 rounded-[40px] shadow-inner border border-gray-400"></div>

      {/* D-pad */}
      <DPad 
        activeDirection={activeDirection} 
        keyPressed={keyPressed} 
        onDirectionClick={onDirectionClick} 
      />
      
      {/* Center area with select/start buttons */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-24 h-8 flex justify-between items-center transform rotate-[-20deg]">
          <div className="w-10 h-3 bg-gray-600 rounded-md"></div>
          <div className="w-10 h-3 bg-gray-600 rounded-md"></div>
        </div>
        <div className="mt-8 flex justify-center space-x-2">
          <div className="text-[8px] text-arcade-pink font-press-start">SELECT</div>
          <div className="text-[8px] text-arcade-pink font-press-start">START</div>
        </div>
      </div>

      {/* Action Buttons */}
      <ActionButtons activeButton={activeButton} onButtonClick={onButtonClick} />

      {/* Subtle instruction label at bottom */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-arcade-pink/80 font-vt323 whitespace-nowrap">
        Use arrows to navigate | A to select | B to go back
      </div>
    </div>
  );
};

export default ControllerBody;
