import { Gamepad, Headphones, Disc, Clock } from 'lucide-react';
import { Button } from '@/components/controller/types';
import { useCallback, useEffect } from 'react';

interface ActionButtonsProps {
  activeButton: Button;
  onButtonClick: (button: Button) => void;
}

const ActionButtons = ({ activeButton, onButtonClick }: ActionButtonsProps) => {
  // Direct handler to pass the button to parent
  const handleClick = (button: Button) => {
    onButtonClick(button);
  };

  // Memoize click handlers with proper dependencies to prevent stale closures
  const onButtonClickMemoized = useCallback((button: Button) => {
    // Always call the original handler first for visual feedback
    handleClick(button);
    
    // If clicked a mapped button, navigate to the corresponding tab
    if (button && buttonToTabMap[button]) {
      const tabName = buttonToTabMap[button];
      setCurrentSection(tabName);
      focusTab(`${tabName}-tab`);
    }
  }, [handleClick, setCurrentSection, focusTab]);

  // Update keyboard event dependency array to include ALL needed functions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle button presses
      const buttonKey = e.key.toLowerCase();
      if (['a', 'b', 'x', 'y'].includes(buttonKey)) {
        onButtonClickMemoized(buttonKey as Button);
      }
    };
    
    const handleKeyUp = () => {
      // Reset active states
      onButtonClickMemoized(null);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onButtonClickMemoized]); // Add ALL dependencies

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center">
      <div className="relative w-20 h-20">
        {/* Y button - Top - Experience */}
        <button 
          className={`absolute w-8 h-8 rounded-full top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 
          ${activeButton === 'y' ? 'bg-arcade-cyan shadow-[0_0_6px_rgba(34,211,238,0.8)] transform scale-110' : 'bg-arcade-cyan hover:bg-arcade-cyan/80'} 
          transition-all duration-150`}
          onClick={() => handleClick('y')}
          type="button"
          aria-label="Experience"
        >
          <Clock size={16} className="absolute inset-0 m-auto text-black" />
        </button>
        
        {/* X button - Left - Skills */}
        <button 
          className={`absolute w-8 h-8 rounded-full top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 
          ${activeButton === 'x' ? 'bg-arcade-pink shadow-[0_0_6px_rgba(236,72,153,0.8)] transform scale-110' : 'bg-arcade-pink hover:bg-arcade-pink/80'} 
          transition-all duration-150`}
          onClick={() => handleClick('x')}
          type="button"
          aria-label="Skills"
        >
          <Disc size={16} className="absolute inset-0 m-auto text-black" />
        </button>
        
        {/* B button - Right - Contact */}
        <button 
          className={`absolute w-8 h-8 rounded-full top-1/2 right-0 -translate-y-1/2 translate-x-1/4 
          ${activeButton === 'b' ? 'bg-arcade-orange shadow-[0_0_6px_rgba(249,115,22,0.8)] transform scale-110' : 'bg-arcade-orange hover:bg-arcade-orange/80'} 
          transition-all duration-150`}
          onClick={() => handleClick('b')}
          type="button"
          aria-label="Contact"
        >
          <Headphones size={16} className="absolute inset-0 m-auto text-black" />
        </button>
        
        {/* A button - Bottom - About */}
        <button 
          className={`absolute w-8 h-8 rounded-full bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 
          ${activeButton === 'a' ? 'bg-arcade-purple shadow-[0_0_6px_rgba(155,135,245,0.8)] transform scale-110' : 'bg-arcade-purple hover:bg-arcade-purple/80'} 
          transition-all duration-150`}
          onClick={() => handleClick('a')}
          type="button"
          aria-label="About"
        >
          <Gamepad size={16} className="absolute inset-0 m-auto text-black" />
        </button>
        
        {/* Button labels */}
        <div className="absolute -right-14 top-0 text-[10px] text-arcade-cyan font-vt323">Y</div>
        <div className="absolute -left-14 top-1/2 -translate-y-1/2 text-[10px] text-arcade-pink font-vt323">X</div>
        <div className="absolute -right-14 top-1/2 -translate-y-1/2 text-[10px] text-arcade-orange font-vt323">B</div>
        <div className="absolute -left-14 bottom-0 text-[10px] text-arcade-purple font-vt323">A</div>
      </div>
    </div>
  );
};

export default ActionButtons;
