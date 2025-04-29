
import { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'neutral';
type Button = 'a' | 'b' | 'x' | 'y' | null;

const RetroController = () => {
  const [activeDirection, setActiveDirection] = useState<Direction>('neutral');
  const [activeButton, setActiveButton] = useState<Button>(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const controllerRef = useRef<HTMLDivElement>(null);
  const mouseTimeoutRef = useRef<number | null>(null);
  
  // Visibility control based on mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const controllerElement = controllerRef.current;
      if (!controllerElement) return;
      
      const controllerRect = controllerElement.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      
      // Check if mouse is near the controller (within 200px)
      const isNearController = 
        mouseY > controllerRect.top - 200 &&
        mouseY < controllerRect.bottom + 100;
      
      // Show controller if mouse is near
      if (isNearController) {
        setIsVisible(true);
        
        // Clear any existing timeout
        if (mouseTimeoutRef.current) {
          window.clearTimeout(mouseTimeoutRef.current);
        }
      } else {
        // Set a timeout to hide the controller after 2 seconds
        if (mouseTimeoutRef.current) {
          window.clearTimeout(mouseTimeoutRef.current);
        }
        
        mouseTimeoutRef.current = window.setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }
    };
    
    // Initial visibility control - show for a few seconds then fade
    setIsVisible(true);
    mouseTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 4000);
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimeoutRef.current) {
        window.clearTimeout(mouseTimeoutRef.current);
      }
    };
  }, []);

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
        const newIndex = tabsList.indexOf(clickedTab as Element);

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
        case 'x':
        case 'X':
          setActiveButton('x');
          handleExtraAction();
          break;
        case 'y':
        case 'Y':
          setActiveButton('y');
          handleExtraAction();
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
    navigateTabs('prev');
    setTimeout(() => setActiveButton(null), 150);
  };
  
  // Function to handle X/Y button actions
  const handleExtraAction = () => {
    // For demonstration purposes, simply resets to neutral state
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
    <div 
      ref={controllerRef} 
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-20'}`}
    >
      {/* SNES Controller Design */}
      <div className="relative w-80 h-40 bg-gray-200 rounded-full px-4 shadow-2xl">
        {/* Controller Body with rounded edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-300 rounded-[40px] shadow-inner border border-gray-400"></div>

        {/* Left circular area for D-pad */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center">
          {/* D-pad cross */}
          <div className="relative w-16 h-16 bg-gray-300 rounded-sm">
            {/* D-pad border outline */}
            <div className="absolute inset-0 border-2 border-black rounded-sm"></div>
            
            {/* Up button */}
            <button 
              onClick={() => handleDPadClick('up')}
              className={`absolute w-5 h-5 top-0 left-1/2 -translate-x-1/2 -translate-y-0 flex items-center justify-center ${
                activeDirection === 'up' || keyPressed === 'up' ? 'text-arcade-cyan' : 'text-gray-600'
              }`}
              aria-label="Move up"
            >
              <ArrowUp size={14} className={`${keyPressed === 'up' || activeDirection === 'up' ? 'text-black' : 'text-gray-600'}`} />
            </button>
            
            {/* Down button */}
            <button 
              onClick={() => handleDPadClick('down')}
              className={`absolute w-5 h-5 bottom-0 left-1/2 -translate-x-1/2 translate-y-0 flex items-center justify-center ${
                activeDirection === 'down' || keyPressed === 'down' ? 'text-arcade-cyan' : 'text-gray-600'
              }`}
              aria-label="Move down"
            >
              <ArrowDown size={14} className={`${keyPressed === 'down' || activeDirection === 'down' ? 'text-black' : 'text-gray-600'}`} />
            </button>
            
            {/* Left button */}
            <button 
              onClick={() => handleDPadClick('left')}
              className={`absolute w-5 h-5 left-0 top-1/2 -translate-y-1/2 -translate-x-0 flex items-center justify-center ${
                activeDirection === 'left' || keyPressed === 'left' ? 'text-arcade-cyan' : 'text-gray-600'
              }`}
              aria-label="Move left"
            >
              <ArrowLeft size={14} className={`${keyPressed === 'left' || activeDirection === 'left' ? 'text-black' : 'text-gray-600'}`} />
            </button>
            
            {/* Right button */}
            <button 
              onClick={() => handleDPadClick('right')}
              className={`absolute w-5 h-5 right-0 top-1/2 -translate-y-1/2 translate-x-0 flex items-center justify-center ${
                activeDirection === 'right' || keyPressed === 'right' ? 'text-arcade-cyan' : 'text-gray-600'
              }`}
              aria-label="Move right"
            >
              <ArrowRight size={14} className={`${keyPressed === 'right' || activeDirection === 'right' ? 'text-black' : 'text-gray-600'}`} />
            </button>

            {/* Center circle */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-400 rounded-full"></div>
          </div>
        </div>
        
        {/* Center area with select/start buttons */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-24 h-8 flex justify-between items-center transform rotate-[-20deg]">
            <div className="w-10 h-3 bg-gray-600 rounded-md"></div>
            <div className="w-10 h-3 bg-gray-600 rounded-md"></div>
          </div>
          <div className="mt-8 flex justify-center space-x-2">
            <div className="text-[8px] text-arcade-pink font-press-start">SELECT</div>
            <div className="text-[8px] text-arcade-pink font-press-start">START</div>
          </div>
        </div>

        {/* Right circular area for action buttons */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center">
          <div className="relative w-20 h-20">
            {/* Y button - Top */}
            <button 
              className={`absolute w-8 h-8 rounded-full top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 
              ${activeButton === 'y' ? 'bg-green-500 border-2 border-gray-800' : 'bg-green-500'}`}
              onClick={() => { setActiveButton('y'); handleExtraAction(); }}
            ></button>
            
            {/* X button - Left */}
            <button 
              className={`absolute w-8 h-8 rounded-full top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 
              ${activeButton === 'x' ? 'bg-blue-500 border-2 border-gray-800' : 'bg-blue-500'}`}
              onClick={() => { setActiveButton('x'); handleExtraAction(); }}
            ></button>
            
            {/* B button - Right */}
            <button 
              className={`absolute w-8 h-8 rounded-full top-1/2 right-0 -translate-y-1/2 translate-x-1/4 
              ${activeButton === 'b' ? 'bg-yellow-400 border-2 border-gray-800' : 'bg-yellow-400'}`}
              onClick={() => { setActiveButton('b'); handleBackAction(); }}
            ></button>
            
            {/* A button - Bottom */}
            <button 
              className={`absolute w-8 h-8 rounded-full bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 
              ${activeButton === 'a' ? 'bg-red-500 border-2 border-gray-800' : 'bg-red-500'}`}
              onClick={() => { setActiveButton('a'); handleSelectAction(); }}
            ></button>
          </div>
        </div>

        {/* Subtle instruction label at bottom */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-arcade-pink/80 font-vt323 whitespace-nowrap">
          Use arrows to navigate | A to select | B to go back
        </div>
      </div>
    </div>
  );
};

export default RetroController;
