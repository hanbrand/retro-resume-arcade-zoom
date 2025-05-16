import React from 'react';
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
    <div className="relative w-80 h-40 rounded-full shadow-xl">
      {/* Controller Body with gradient and shadow */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-400 rounded-[40px] shadow-inner border border-gray-400">
        {/* Controller details - top inset */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-40 h-3 bg-gradient-to-b from-gray-600 to-gray-500 rounded-b-xl border-t-0 border border-gray-500"></div>
        
        {/* Controller details - bottom inset */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-40 h-3 bg-gradient-to-b from-gray-500 to-gray-600 rounded-t-xl border-b-0 border border-gray-500"></div>
      </div>

      {/* D-pad */}
      <DPad 
        activeDirection={activeDirection} 
        keyPressed={keyPressed} 
        onDirectionClick={onDirectionClick} 
      />
      
      {/* Center area with select/start buttons */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-28 h-8 flex justify-between items-center transform rotate-[-20deg]">
          <button 
            className="w-10 h-2 bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 active:bg-gray-700 transition-colors"
            aria-label="Select button"
          ></button>
          <button 
            className="w-10 h-2 bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 active:bg-gray-700 transition-colors"
            aria-label="Start button"
          ></button>
        </div>
        <div className="mt-6 flex justify-center space-x-6">
          <div className="text-[8px] text-arcade-pink font-press-start">SELECT</div>
          <div className="text-[8px] text-arcade-pink font-press-start">START</div>
        </div>
      </div>

      {/* Action Buttons */}
      <ActionButtons activeButton={activeButton} onButtonClick={onButtonClick} />

      {/* Instruction label with button mappings */}
      <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 text-xs text-arcade-cyan/90 font-vt323 flex flex-col items-center bg-black/30 p-2 rounded-md">
        <div className="whitespace-nowrap">◀/▶ = Switch Tabs | ▲/▼ = Scroll</div>
        <div className="whitespace-nowrap mt-1">
          <span className="text-arcade-purple">A</span>=About • 
          <span className="text-arcade-pink">X</span>=Skills • 
          <span className="text-arcade-cyan">Y</span>=Experience • 
          <span className="text-arcade-orange">B</span>=Contact
        </div>
      </div>
      
      {/* Controller texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[40px] pointer-events-none"></div>
    </div>
  );
};

export default ControllerBody;
