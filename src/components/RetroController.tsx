
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'neutral';
type Button = 'y' | 'x' | 'b' | 'a' | null;

const RetroController = () => {
  const [dpadDirection, setDpadDirection] = useState<Direction>('neutral');
  const [activeButton, setActiveButton] = useState<Button>(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScrollPosition) {
        setDpadDirection('down');
      } else if (currentScroll < lastScrollPosition) {
        setDpadDirection('up');
      }
      setLastScrollPosition(currentScroll);

      // Reset d-pad position after a short delay
      setTimeout(() => {
        setDpadDirection('neutral');
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
          setActiveButton('a');
          setTimeout(() => setActiveButton(null), 150);
        } else if (newIndex < currentIndex) {
          setActiveButton('b');
          setTimeout(() => setActiveButton(null), 150);
        }
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setDpadDirection('up');
          window.scrollBy(0, -100);
          break;
        case 'ArrowDown':
          setDpadDirection('down');
          window.scrollBy(0, 100);
          break;
        case 'ArrowLeft':
          setDpadDirection('left');
          break;
        case 'ArrowRight':
          setDpadDirection('right');
          break;
        case 'a':
          setActiveButton('a');
          break;
        case 'b':
          setActiveButton('b');
          break;
        case 'x':
          setActiveButton('x');
          break;
        case 'y':
          setActiveButton('y');
          break;
      }

      // Reset after short delay
      setTimeout(() => {
        setDpadDirection('neutral');
        setActiveButton(null);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleTabClick);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleTabClick);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [lastScrollPosition, navigate]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-[#e0e0e0] border-2 border-[#8E9196] rounded-full p-6 shadow-lg flex items-center gap-12">
        {/* D-Pad */}
        <div className="relative w-16 h-16 bg-[#222222] rounded-full">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Vertical line */}
            <div className="w-6 h-16 bg-[#222222] rounded-sm" />
            {/* Horizontal line */}
            <div className="absolute w-16 h-6 bg-[#222222] rounded-sm" />
            
            {/* D-pad buttons */}
            <button 
              onClick={() => window.scrollBy(0, -100)}
              className={`absolute top-0 w-8 h-8 flex items-center justify-center ${
                dpadDirection === 'up' ? 'text-arcade-cyan' : 'text-gray-600'
              }`}
            >
              <ArrowUp size={20} />
            </button>
            <button 
              onClick={() => window.scrollBy(0, 100)}
              className={`absolute bottom-0 w-8 h-8 flex items-center justify-center ${
                dpadDirection === 'down' ? 'text-arcade-cyan' : 'text-gray-600'
              }`}
            >
              <ArrowDown size={20} />
            </button>
            <button 
              className={`absolute left-0 w-8 h-8 flex items-center justify-center ${
                dpadDirection === 'left' ? 'text-arcade-cyan' : 'text-gray-600'
              }`}
            >
              <ArrowLeft size={20} />
            </button>
            <button 
              className={`absolute right-0 w-8 h-8 flex items-center justify-center ${
                dpadDirection === 'right' ? 'text-arcade-cyan' : 'text-gray-600'
              }`}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Center section with "START" and "SELECT" */}
        <div className="flex gap-4 -rotate-12">
          <div className="w-10 h-3 bg-[#222222] rounded-full"></div>
          <div className="w-10 h-3 bg-[#222222] rounded-full"></div>
        </div>

        {/* Action Buttons */}
        <div className="relative w-20 h-20 bg-[#666666] rounded-full p-2">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => {
                setActiveButton('y');
                setTimeout(() => setActiveButton(null), 150);
              }}
              className={`w-8 h-8 rounded-full ${
                activeButton === 'y' 
                  ? 'bg-[#0FA0CE] shadow-[0_0_15px_#0FA0CE]' 
                  : 'bg-[#0FA0CE]/70'
              } transition-all duration-150`}
            />
            <button 
              onClick={() => {
                setActiveButton('x');
                setTimeout(() => setActiveButton(null), 150);
              }}
              className={`w-8 h-8 rounded-full ${
                activeButton === 'x' 
                  ? 'bg-[#F2FCE2] shadow-[0_0_15px_#F2FCE2]' 
                  : 'bg-[#F2FCE2]/70'
              } transition-all duration-150`}
            />
            <button 
              onClick={() => {
                setActiveButton('a');
                setTimeout(() => setActiveButton(null), 150);
              }}
              className={`w-8 h-8 rounded-full ${
                activeButton === 'a' 
                  ? 'bg-[#ea384c] shadow-[0_0_15px_#ea384c]' 
                  : 'bg-[#ea384c]/70'
              } transition-all duration-150`}
            />
            <button 
              onClick={() => {
                setActiveButton('b');
                setTimeout(() => setActiveButton(null), 150);
              }}
              className={`w-8 h-8 rounded-full ${
                activeButton === 'b' 
                  ? 'bg-[#FEF7CD] shadow-[0_0_15px_#FEF7CD]' 
                  : 'bg-[#FEF7CD]/70'
              } transition-all duration-150`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetroController;
