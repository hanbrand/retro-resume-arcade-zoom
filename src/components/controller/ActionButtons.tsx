
import { Button } from '@/components/controller/types';

interface ActionButtonsProps {
  activeButton: Button;
  onButtonClick: (button: Button) => void;
}

const ActionButtons = ({ activeButton, onButtonClick }: ActionButtonsProps) => {
  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center">
      <div className="relative w-20 h-20">
        {/* Y button - Top */}
        <button 
          className={`absolute w-8 h-8 rounded-full top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 
          ${activeButton === 'y' ? 'bg-green-500 border-2 border-gray-800' : 'bg-green-500'}`}
          onClick={() => onButtonClick('y')}
        ></button>
        
        {/* X button - Left */}
        <button 
          className={`absolute w-8 h-8 rounded-full top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 
          ${activeButton === 'x' ? 'bg-blue-500 border-2 border-gray-800' : 'bg-blue-500'}`}
          onClick={() => onButtonClick('x')}
        ></button>
        
        {/* B button - Right */}
        <button 
          className={`absolute w-8 h-8 rounded-full top-1/2 right-0 -translate-y-1/2 translate-x-1/4 
          ${activeButton === 'b' ? 'bg-yellow-400 border-2 border-gray-800' : 'bg-yellow-400'}`}
          onClick={() => onButtonClick('b')}
        ></button>
        
        {/* A button - Bottom */}
        <button 
          className={`absolute w-8 h-8 rounded-full bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 
          ${activeButton === 'a' ? 'bg-red-500 border-2 border-gray-800' : 'bg-red-500'}`}
          onClick={() => onButtonClick('a')}
        ></button>
      </div>
    </div>
  );
};

export default ActionButtons;
