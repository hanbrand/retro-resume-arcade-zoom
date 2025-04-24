
import { useState, useEffect } from 'react';
import { Joystick } from 'lucide-react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'neutral';
type Button = 'a' | 'b' | null;

const RetroController = () => {
  const [joystickDirection, setJoystickDirection] = useState<Direction>('neutral');
  const [activeButton, setActiveButton] = useState<Button>(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScrollPosition) {
        setJoystickDirection('down');
      } else if (currentScroll < lastScrollPosition) {
        setJoystickDirection('up');
      }
      setLastScrollPosition(currentScroll);

      // Reset joystick position after a short delay
      setTimeout(() => {
        setJoystickDirection('neutral');
      }, 150);
    };

    const handleTabClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[role="tab"]')) {
        const tabs = document.querySelectorAll('[role="tab"]');
        const tabsList = Array.from(tabs);
        const clickedTab = target.closest('[role="tab"]');
        if (!clickedTab) return;
        
        const currentIndex = tabsList.findIndex(tab => tab.getAttribute('data-state') === 'active');
        const newIndex = tabsList.indexOf(clickedTab);

        if (newIndex > currentIndex) {
          setActiveButton('b');
          setTimeout(() => setActiveButton(null), 150);
        } else if (newIndex < currentIndex) {
          setActiveButton('a');
          setTimeout(() => setActiveButton(null), 150);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleTabClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleTabClick);
    };
  }, [lastScrollPosition]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-arcade-darkPurple/90 border-2 border-arcade-purple/50 rounded-xl p-8 backdrop-blur-sm transform perspective-1000 rotate-x-25">
        {/* Controls Panel */}
        <div className="flex items-center gap-16 relative">
          {/* Joystick Area */}
          <div className="relative">
            <div className="absolute inset-0 bg-black/50 rounded-full blur-md transform -translate-y-1"></div>
            <div className="relative w-20 h-20 bg-black rounded-full border-4 border-gray-800 flex items-center justify-center overflow-visible">
              {/* Joystick Base */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black rounded-full"></div>
              {/* Joystick Stem */}
              <div className="absolute w-8 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              {/* Joystick Head */}
              <div 
                className={`absolute w-16 h-16 -translate-y-4 bg-gradient-to-br from-red-600 to-red-700 rounded-full transform transition-transform duration-150 shadow-lg ${
                  joystickDirection === 'up' ? '-translate-y-6' :
                  joystickDirection === 'down' ? '-translate-y-2' :
                  joystickDirection === 'left' ? 'translate-x-2 -translate-y-4 rotate-12' :
                  joystickDirection === 'right' ? '-translate-x-2 -translate-y-4 -rotate-12' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
                <div className="absolute inset-0 bg-black/20 rounded-full transform"></div>
                {/* Top highlight */}
                <div className="absolute w-8 h-8 rounded-full bg-white/20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>

          {/* Buttons Area */}
          <div className="grid grid-cols-2 gap-4 transform">
            {/* Row 1 */}
            <button 
              className={`w-12 h-12 rounded-full relative group transform hover:translate-y-0.5 active:translate-y-1 ${
                activeButton === 'a' 
                  ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' 
                  : 'bg-red-500/80'
              } transition-all duration-150`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
              <div className="absolute inset-0 bg-black/20 rounded-full transform translate-y-0.5"></div>
            </button>
            <button 
              className={`w-12 h-12 rounded-full relative group transform hover:translate-y-0.5 active:translate-y-1 ${
                activeButton === 'b' 
                  ? 'bg-blue-500 shadow-[0_0_15px_#3b82f6]' 
                  : 'bg-blue-500/80'
              } transition-all duration-150`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
              <div className="absolute inset-0 bg-black/20 rounded-full transform translate-y-0.5"></div>
            </button>
            {/* Row 2 */}
            <button 
              className="w-12 h-12 rounded-full relative group transform hover:translate-y-0.5 active:translate-y-1 bg-yellow-500/80 transition-all duration-150"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
              <div className="absolute inset-0 bg-black/20 rounded-full transform translate-y-0.5"></div>
            </button>
            <button 
              className="w-12 h-12 rounded-full relative group transform hover:translate-y-0.5 active:translate-y-1 bg-green-500/80 transition-all duration-150"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
              <div className="absolute inset-0 bg-black/20 rounded-full transform translate-y-0.5"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetroController;
