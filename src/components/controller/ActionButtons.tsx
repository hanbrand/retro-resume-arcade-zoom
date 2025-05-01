
import { Button } from '@/components/controller/types';

interface ActionButtonsProps {
  activeButton: Button;
  onButtonClick: (button: Button) => void;
}

const ActionButtons = ({ activeButton, onButtonClick }: ActionButtonsProps) => {
  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center">
      <div className="relative w-20 h-20">
        {/* Y button - Top - Experience */}
        <button 
          className={`absolute w-8 h-8 rounded-full top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 
          ${activeButton === 'y' ? 'bg-arcade-cyan border-2 border-gray-800' : 'bg-arcade-cyan'}`}
          onClick={() => onButtonClick('y')}
        >
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-black">EXP</span>
        </button>
        
        {/* X button - Left - Skills */}
        <button 
          className={`absolute w-8 h-8 rounded-full top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 
          ${activeButton === 'x' ? 'bg-arcade-pink border-2 border-gray-800' : 'bg-arcade-pink'}`}
          onClick={() => onButtonClick('x')}
        >
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-black">SKL</span>
        </button>
        
        {/* B button - Right - Contact */}
        <button 
          className={`absolute w-8 h-8 rounded-full top-1/2 right-0 -translate-y-1/2 translate-x-1/4 
          ${activeButton === 'b' ? 'bg-arcade-orange border-2 border-gray-800' : 'bg-arcade-orange'}`}
          onClick={() => onButtonClick('b')}
        >
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-black">CON</span>
        </button>
        
        {/* A button - Bottom - About */}
        <button 
          className={`absolute w-8 h-8 rounded-full bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 
          ${activeButton === 'a' ? 'bg-arcade-purple border-2 border-gray-800' : 'bg-arcade-purple'}`}
          onClick={() => onButtonClick('a')}
        >
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-black">ABT</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
