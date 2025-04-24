
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
      <div className="bg-arcade-darkPurple border-2 border-arcade-purple/50 rounded-xl p-4 backdrop-blur-sm flex items-center gap-8">
        {/* Joystick */}
        <div className="relative">
          <div className={`transform transition-transform duration-150 ${
            joystickDirection === 'up' ? '-translate-y-2' :
            joystickDirection === 'down' ? 'translate-y-2' :
            joystickDirection === 'left' ? '-translate-x-2' :
            joystickDirection === 'right' ? 'translate-x-2' : ''
          }`}>
            <Joystick size={32} className="text-arcade-cyan" />
          </div>
        </div>

        {/* A/B Buttons */}
        <div className="flex gap-4">
          <button 
            className={`w-8 h-8 rounded-full ${
              activeButton === 'a' 
                ? 'bg-arcade-pink shadow-[0_0_15px_#ff00ff]' 
                : 'bg-arcade-pink/50'
            } transition-all duration-150`}
          >
            A
          </button>
          <button 
            className={`w-8 h-8 rounded-full ${
              activeButton === 'b' 
                ? 'bg-arcade-cyan shadow-[0_0_15px_#00ffff]' 
                : 'bg-arcade-cyan/50'
            } transition-all duration-150`}
          >
            B
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetroController;
