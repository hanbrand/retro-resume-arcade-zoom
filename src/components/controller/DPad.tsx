import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export type Direction = 'up' | 'down' | 'left' | 'right' | 'neutral';

interface DPadProps {
  activeDirection: Direction;
  keyPressed: string | null;
  onDirectionClick: (direction: Direction) => void;
}

const DPad = ({ activeDirection, keyPressed, onDirectionClick }: DPadProps) => {
  // Direct handler to pass the direction to parent
  const handleClick = (direction: Direction) => {
    onDirectionClick(direction);
  };

  // Helper to determine if a direction is active
  const isActive = (direction: Direction) => 
    activeDirection === direction || keyPressed === direction;

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center">
      {/* D-pad cross */}
      <div className="relative w-16 h-16 bg-gray-300 rounded-sm shadow-inner overflow-hidden">
        {/* D-pad border outline */}
        <div className="absolute inset-0 border-2 border-black rounded-sm"></div>
        
        {/* Up button */}
        <button 
          onClick={() => handleClick('up')}
          type="button"
          className={`absolute w-5 h-5 top-0 left-1/2 -translate-x-1/2 -translate-y-0 
            flex items-center justify-center
            ${isActive('up') 
              ? 'bg-gray-500 shadow-[0_0_4px_rgba(0,0,0,0.5)_inset] transform scale-105' 
              : 'bg-gray-300 hover:bg-gray-400'} 
            transition-all duration-100`}
          aria-label="Move up"
        >
          <ArrowUp 
            size={14} 
            className={`${isActive('up') ? 'text-white' : 'text-gray-600'} transition-colors`} 
          />
        </button>
        
        {/* Down button */}
        <button 
          onClick={() => handleClick('down')}
          type="button"
          className={`absolute w-5 h-5 bottom-0 left-1/2 -translate-x-1/2 translate-y-0 
            flex items-center justify-center
            ${isActive('down') 
              ? 'bg-gray-500 shadow-[0_0_4px_rgba(0,0,0,0.5)_inset] transform scale-105' 
              : 'bg-gray-300 hover:bg-gray-400'} 
            transition-all duration-100`}
          aria-label="Move down"
        >
          <ArrowDown 
            size={14} 
            className={`${isActive('down') ? 'text-white' : 'text-gray-600'} transition-colors`} 
          />
        </button>
        
        {/* Left button */}
        <button 
          onClick={() => handleClick('left')}
          type="button"
          className={`absolute w-5 h-5 left-0 top-1/2 -translate-y-1/2 -translate-x-0 
            flex items-center justify-center
            ${isActive('left') 
              ? 'bg-gray-500 shadow-[0_0_4px_rgba(0,0,0,0.5)_inset] transform scale-105' 
              : 'bg-gray-300 hover:bg-gray-400'} 
            transition-all duration-100`}
          aria-label="Move left"
        >
          <ArrowLeft 
            size={14} 
            className={`${isActive('left') ? 'text-white' : 'text-gray-600'} transition-colors`} 
          />
        </button>
        
        {/* Right button */}
        <button 
          onClick={() => handleClick('right')}
          type="button"
          className={`absolute w-5 h-5 right-0 top-1/2 -translate-y-1/2 translate-x-0 
            flex items-center justify-center
            ${isActive('right') 
              ? 'bg-gray-500 shadow-[0_0_4px_rgba(0,0,0,0.5)_inset] transform scale-105' 
              : 'bg-gray-300 hover:bg-gray-400'} 
            transition-all duration-100`}
          aria-label="Move right"
        >
          <ArrowRight 
            size={14} 
            className={`${isActive('right') ? 'text-white' : 'text-gray-600'} transition-colors`} 
          />
        </button>

        {/* Center circle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full shadow-inner"></div>
      </div>
      
      {/* Direction labels */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-white font-vt323">UP</div>
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white font-vt323">DOWN</div>
      <div className="absolute -left-5 top-1/2 -translate-y-1/2 text-[10px] text-white font-vt323">LEFT</div>
      <div className="absolute -right-5 top-1/2 -translate-y-1/2 text-[10px] text-white font-vt323">RIGHT</div>
    </div>
  );
};

export default DPad;
