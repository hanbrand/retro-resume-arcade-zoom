
import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Undo, Check } from 'lucide-react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'neutral';
type Button = 'a' | 'b' | 'x' | 'y' | null;

const RetroController = () => {
  const [activeDirection, setActiveDirection] = useState<Direction>('neutral');
  const [activeButton, setActiveButton] = useState<Button>(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  
  useEffect(() => {
    // Scroll handling
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScrollPosition) {
        setActiveDirection('down');
      } else if (currentScroll < lastScrollPosition) {
        setActiveDirection('up');
      }
      setLastScrollPosition(currentScroll);

      // Reset direction after a short delay
      setTimeout(() => {
        setActiveDirection('neutral');
      }, 150);
    };

    // Tab navigation handling
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

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setActiveDirection('up');
          window.scrollBy(0, -100);
          setKeyPressed('up');
          break;
        case 'ArrowDown':
          setActiveDirection('down');
          window.scrollBy(0, 100);
          setKeyPressed('down');
          break;
        case 'ArrowLeft':
          setActiveDirection('left');
          navigateTabs('prev');
          setKeyPressed('left');
          break;
        case 'ArrowRight':
          setActiveDirection('right');
          navigateTabs('next');
          setKeyPressed('right');
          break;
        case 'a':
        case 'A':
          setActiveButton('a');
          handleSelectAction();
          break;
        case 'b':
        case 'B':
          setActiveButton('b');
          handleBackAction();
          break;
        default:
          break;
      }
    };

    const handleKeyUp = () => {
      setActiveDirection('neutral');
      setActiveButton(null);
      setKeyPressed(null);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleTabClick);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleTabClick);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [lastScrollPosition]);

  // Function to navigate between tabs
  const navigateTabs = (direction: 'next' | 'prev') => {
    const tabs = document.querySelectorAll('[role="tab"]');
    if (tabs.length === 0) return;
    
    const tabsList = Array.from(tabs);
    const currentIndex = tabsList.findIndex(tab => tab.getAttribute('data-state') === 'active');
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % tabsList.length;
    } else {
      newIndex = (currentIndex - 1 + tabsList.length) % tabsList.length;
    }
    
    (tabsList[newIndex] as HTMLElement).click();
  };

  // Function to handle the A button (select) action
  const handleSelectAction = () => {
    const activeTab = document.querySelector('[role="tab"][data-state="active"]');
    const activeTabContent = document.querySelector('[role="tabpanel"][data-state="active"]');
    
    if (activeTabContent) {
      const focusableElements = activeTabContent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
    
    setTimeout(() => setActiveButton(null), 150);
  };

  // Function to handle the B button (back/undo) action
  const handleBackAction = () => {
    // For demonstration, navigate to the previous tab
    navigateTabs('prev');
    setTimeout(() => setActiveButton(null), 150);
  };

  // Function to handle D-pad button click
  const handleDPadClick = (direction: Direction) => {
    setActiveDirection(direction);
    
    switch (direction) {
      case 'up':
        window.scrollBy(0, -150);
        break;
      case 'down':
        window.scrollBy(0, 150);
        break;
      case 'left':
        navigateTabs('prev');
        break;
      case 'right':
        navigateTabs('next');
        break;
      default:
        break;
    }
    
    // Return to neutral position after a short delay
    setTimeout(() => {
      setActiveDirection('neutral');
    }, 200);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-arcade-darkPurple/90 border-2 border-arcade-purple/50 rounded-xl p-6 backdrop-blur-lg transform perspective-1000 rotate-x-25 shadow-2xl relative overflow-visible">
        {/* Ambient light effect */}
        <div className="absolute -inset-4 bg-arcade-pink/20 rounded-full blur-xl -z-10"></div>
        <div className="absolute -inset-4 bg-arcade-cyan/20 rounded-full blur-xl -z-10 translate-x-12"></div>
        
        {/* Controller surface with metallic effect */}
        <div className="bg-gradient-to-b from-black/80 to-arcade-darkPurple/90 p-4 rounded-lg border border-white/5 relative">
          {/* Controls Panel */}
          <div className="flex items-center gap-12 md:gap-16 relative">
            {/* D-pad Area */}
            <div className="relative">
              <div className="relative w-24 h-24 bg-black border-2 border-gray-800 rounded-lg">
                {/* D-pad base */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black rounded-lg"></div>
                
                {/* D-pad buttons */}
                <button 
                  onClick={() => handleDPadClick('up')}
                  className={`absolute w-8 h-8 top-0 left-1/2 -translate-x-1/2 -translate-y-1 bg-gray-800 hover:bg-gray-700 rounded-md flex items-center justify-center ${
                    activeDirection === 'up' || keyPressed === 'up' ? 'shadow-inner bg-gray-700 shadow-arcade-cyan/30' : ''
                  } transition-colors`}
                  aria-label="Move up"
                >
                  <ArrowUp size={14} className={`${keyPressed === 'up' || activeDirection === 'up' ? 'text-arcade-cyan' : 'text-gray-400'}`} />
                </button>
                
                <button 
                  onClick={() => handleDPadClick('down')}
                  className={`absolute w-8 h-8 bottom-0 left-1/2 -translate-x-1/2 translate-y-1 bg-gray-800 hover:bg-gray-700 rounded-md flex items-center justify-center ${
                    activeDirection === 'down' || keyPressed === 'down' ? 'shadow-inner bg-gray-700 shadow-arcade-cyan/30' : ''
                  } transition-colors`}
                  aria-label="Move down"
                >
                  <ArrowDown size={14} className={`${keyPressed === 'down' || activeDirection === 'down' ? 'text-arcade-cyan' : 'text-gray-400'}`} />
                </button>
                
                <button 
                  onClick={() => handleDPadClick('left')}
                  className={`absolute w-8 h-8 left-0 top-1/2 -translate-y-1/2 -translate-x-1 bg-gray-800 hover:bg-gray-700 rounded-md flex items-center justify-center ${
                    activeDirection === 'left' || keyPressed === 'left' ? 'shadow-inner bg-gray-700 shadow-arcade-cyan/30' : ''
                  } transition-colors`}
                  aria-label="Move left"
                >
                  <ArrowLeft size={14} className={`${keyPressed === 'left' || activeDirection === 'left' ? 'text-arcade-cyan' : 'text-gray-400'}`} />
                </button>
                
                <button 
                  onClick={() => handleDPadClick('right')}
                  className={`absolute w-8 h-8 right-0 top-1/2 -translate-y-1/2 translate-x-1 bg-gray-800 hover:bg-gray-700 rounded-md flex items-center justify-center ${
                    activeDirection === 'right' || keyPressed === 'right' ? 'shadow-inner bg-gray-700 shadow-arcade-cyan/30' : ''
                  } transition-colors`}
                  aria-label="Move right"
                >
                  <ArrowRight size={14} className={`${keyPressed === 'right' || activeDirection === 'right' ? 'text-arcade-cyan' : 'text-gray-400'}`} />
                </button>
                
                {/* Center cross */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black rounded-sm border border-gray-700"></div>
              </div>
              <div className="text-center mt-1 text-xs font-press-start text-arcade-cyan/70">MOVE</div>
            </div>

            {/* Buttons Area */}
            <div className="grid grid-cols-2 gap-4 transform">
              {/* A Button - SELECT */}
              <div className="flex flex-col items-center">
                <button 
                  className={`w-12 h-12 rounded-full relative group transform hover:translate-y-0.5 active:translate-y-1 ${
                    activeButton === 'a' 
                      ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' 
                      : 'bg-red-500/80'
                  } transition-all duration-150`}
                  onClick={() => {
                    setActiveButton('a');
                    handleSelectAction();
                  }}
                  aria-label="Select button"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
                  <div className="absolute inset-0 bg-black/20 rounded-full transform translate-y-0.5"></div>
                  <Check size={18} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/60" />
                </button>
                <span className="text-xs font-press-start text-white/60 mt-1">SELECT</span>
              </div>
              
              {/* B Button - BACK */}
              <div className="flex flex-col items-center">
                <button 
                  className={`w-12 h-12 rounded-full relative group transform hover:translate-y-0.5 active:translate-y-1 ${
                    activeButton === 'b' 
                      ? 'bg-blue-500 shadow-[0_0_15px_#3b82f6]' 
                      : 'bg-blue-500/80'
                  } transition-all duration-150`}
                  onClick={() => {
                    setActiveButton('b');
                    handleBackAction();
                  }}
                  aria-label="Back button"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
                  <div className="absolute inset-0 bg-black/20 rounded-full transform translate-y-0.5"></div>
                  <Undo size={18} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/60" />
                </button>
                <span className="text-xs font-press-start text-white/60 mt-1">BACK</span>
              </div>
              
              {/* Yellow button */}
              <button 
                className="w-12 h-12 rounded-full relative group transform hover:translate-y-0.5 active:translate-y-1 bg-yellow-500/80 transition-all duration-150"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
                <div className="absolute inset-0 bg-black/20 rounded-full transform translate-y-0.5"></div>
              </button>
              
              {/* Green button */}
              <button 
                className="w-12 h-12 rounded-full relative group transform hover:translate-y-0.5 active:translate-y-1 bg-green-500/80 transition-all duration-150"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
                <div className="absolute inset-0 bg-black/20 rounded-full transform translate-y-0.5"></div>
              </button>
            </div>
          </div>
            
          {/* Instructions note */}
          <div className="mt-4 text-center text-xs font-vt323 text-arcade-cyan/60 max-w-[240px] mx-auto">
            <p>Use arrow keys or D-pad to navigate. Press A to select, B to go back.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetroController;
