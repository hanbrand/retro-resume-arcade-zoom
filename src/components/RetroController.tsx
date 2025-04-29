
import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Undo, Check } from 'lucide-react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'neutral';
type Button = 'a' | 'b' | 'x' | 'y' | null;

const RetroController = () => {
  const [joystickDirection, setJoystickDirection] = useState<Direction>('neutral');
  const [activeButton, setActiveButton] = useState<Button>(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  useEffect(() => {
    // Scroll handling
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
          setJoystickDirection('up');
          window.scrollBy(0, -100);
          setKeyPressed('up');
          break;
        case 'ArrowDown':
          setJoystickDirection('down');
          window.scrollBy(0, 100);
          setKeyPressed('down');
          break;
        case 'ArrowLeft':
          setJoystickDirection('left');
          navigateTabs('prev');
          setKeyPressed('left');
          break;
        case 'ArrowRight':
          setJoystickDirection('right');
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
      setJoystickDirection('neutral');
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
    // For demonstration, let's make it navigate to the previous tab
    navigateTabs('prev');
    setTimeout(() => setActiveButton(null), 150);
  };

  // Enhanced joystick interaction with mouse/touch support
  const handleJoystickMouseDown = (e: React.MouseEvent) => {
    setDragActive(true);
    handleJoystickMove(e.clientX, e.clientY);
  };

  const handleJoystickMouseMove = (e: React.MouseEvent) => {
    if (dragActive) {
      handleJoystickMove(e.clientX, e.clientY);
    }
  };

  const handleJoystickMouseUp = () => {
    setDragActive(false);
    setJoystickDirection('neutral');
  };

  const handleJoystickMove = (clientX: number, clientY: number) => {
    const joystickElement = document.getElementById('joystick-head');
    if (!joystickElement) return;

    const joystickRect = joystickElement.getBoundingClientRect();
    const centerX = joystickRect.left + joystickRect.width / 2;
    const centerY = joystickRect.top + joystickRect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    // Determine direction based on larger delta
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 10) {
        setJoystickDirection('right');
        navigateTabs('next');
      } else if (deltaX < -10) {
        setJoystickDirection('left');
        navigateTabs('prev');
      }
    } else {
      if (deltaY > 10) {
        setJoystickDirection('down');
        window.scrollBy(0, 50);
      } else if (deltaY < -10) {
        setJoystickDirection('up');
        window.scrollBy(0, -50);
      }
    }
  };

  // Handle joystick click in different directions
  const handleJoystickClick = (direction: Direction) => {
    setJoystickDirection(direction);
    
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
      setJoystickDirection('neutral');
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
            {/* Joystick Area with D-pad indicators */}
            <div className="relative">
              <div className="absolute inset-0 bg-black/50 rounded-full blur-md transform -translate-y-1"></div>
              <div className="relative w-20 h-20 bg-black rounded-full border-4 border-gray-800 flex items-center justify-center overflow-visible group">
                {/* Joystick Base */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black rounded-full"></div>
                
                {/* D-pad indicators */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-5 text-arcade-cyan opacity-70">
                  <ArrowUp size={12} className={`${keyPressed === 'up' ? 'text-arcade-cyan' : 'text-white/50'}`} />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-5 text-arcade-cyan opacity-70">
                  <ArrowDown size={12} className={`${keyPressed === 'down' ? 'text-arcade-cyan' : 'text-white/50'}`} />
                </div>
                <div className="absolute left-0 top-1/2 -translate-x-5 -translate-y-1/2 text-arcade-cyan opacity-70">
                  <ArrowLeft size={12} className={`${keyPressed === 'left' ? 'text-arcade-cyan' : 'text-white/50'}`} />
                </div>
                <div className="absolute right-0 top-1/2 translate-x-5 -translate-y-1/2 text-arcade-cyan opacity-70">
                  <ArrowRight size={12} className={`${keyPressed === 'right' ? 'text-arcade-cyan' : 'text-white/50'}`} />
                </div>
                
                {/* Joystick Stem */}
                <div className="absolute w-8 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Interactive Joystick Head */}
                <div 
                  id="joystick-head"
                  className={`absolute w-16 h-16 -translate-y-4 bg-gradient-to-br from-red-600 to-red-700 rounded-full transform transition-transform duration-150 shadow-lg cursor-grab ${dragActive ? 'cursor-grabbing' : ''} ${
                    joystickDirection === 'up' ? '-translate-y-6' :
                    joystickDirection === 'down' ? '-translate-y-2' :
                    joystickDirection === 'left' ? 'translate-x-2 -translate-y-4 rotate-12' :
                    joystickDirection === 'right' ? '-translate-x-2 -translate-y-4 -rotate-12' : ''
                  }`}
                  onMouseDown={handleJoystickMouseDown}
                  onMouseMove={handleJoystickMouseMove}
                  onMouseUp={handleJoystickMouseUp}
                  onMouseLeave={handleJoystickMouseUp}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
                  <div className="absolute inset-0 bg-black/20 rounded-full transform"></div>
                  {/* Top highlight */}
                  <div className="absolute w-8 h-8 rounded-full bg-white/20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                  
                  {/* Clickable joystick direction controls */}
                  <button 
                    onClick={() => handleJoystickClick('up')} 
                    className="absolute w-full h-1/2 top-0 left-0 cursor-pointer z-10"
                    aria-label="Move up"
                  />
                  <button 
                    onClick={() => handleJoystickClick('down')} 
                    className="absolute w-full h-1/2 bottom-0 left-0 cursor-pointer z-10"
                    aria-label="Move down"
                  />
                  <button 
                    onClick={() => handleJoystickClick('left')} 
                    className="absolute w-1/2 h-full top-0 left-0 cursor-pointer z-10"
                    aria-label="Move left"
                  />
                  <button 
                    onClick={() => handleJoystickClick('right')} 
                    className="absolute w-1/2 h-full top-0 right-0 cursor-pointer z-10"
                    aria-label="Move right"
                  />
                </div>
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
            <p>Use arrow keys or joystick to navigate. Press A to select, B to go back.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetroController;
