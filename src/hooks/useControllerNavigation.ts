
import { useState, useEffect } from 'react';
import { Direction } from '@/components/controller/DPad';
import { Button } from '@/components/controller/types';

export const useControllerNavigation = () => {
  const [activeDirection, setActiveDirection] = useState<Direction>('neutral');
  const [activeButton, setActiveButton] = useState<Button>(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  
  useEffect(() => {
    // Initialize by activating first tab if none is active
    const initializeTabs = () => {
      const tabs = document.querySelectorAll('[role="tab"]');
      if (tabs.length > 0) {
        const activeTab = document.querySelector('[role="tab"][data-state="active"]');
        if (!activeTab) {
          (tabs[0] as HTMLElement).click();
        }
      }
    };
    
    // Call once on mount
    initializeTabs();
    
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
          navigateToTabByName('skills');
          break;
        case 'y':
        case 'Y':
          setActiveButton('y');
          navigateToTabByName('experience');
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
    
    // If no tab is currently active, activate the first one
    let newIndex;
    if (currentIndex === -1) {
      newIndex = direction === 'next' ? 0 : tabsList.length - 1;
    } else {
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % tabsList.length;
      } else {
        newIndex = (currentIndex - 1 + tabsList.length) % tabsList.length;
      }
    }
    
    (tabsList[newIndex] as HTMLElement).click();
  };
  
  // Function to navigate to a specific tab by name
  const navigateToTabByName = (tabName: string) => {
    const tabs = document.querySelectorAll('[role="tab"]');
    const tabsList = Array.from(tabs);
    
    const targetTab = tabsList.find(tab => {
      const tabValue = tab.getAttribute('value');
      return tabValue?.toLowerCase() === tabName.toLowerCase();
    });
    
    if (targetTab) {
      (targetTab as HTMLElement).click();
    }
  };

  // Function to handle the A button (select) action
  const handleSelectAction = () => {
    // Navigate to "about" tab
    navigateToTabByName('about');
    
    const activeTab = document.querySelector('[role="tab"][data-state="active"]');
    const activeTabContent = document.querySelector('[role="tabpanel"][data-state="active"]');
    
    if (activeTabContent) {
      const focusableElements = activeTabContent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    } else {
      // If no tab is active, select the first one
      const firstTab = document.querySelector('[role="tab"]') as HTMLElement;
      if (firstTab) {
        firstTab.click();
      }
    }
    
    setTimeout(() => setActiveButton(null), 150);
  };

  // Function to handle the B button (back/undo) action
  const handleBackAction = () => {
    // Navigate to "contact" tab
    navigateToTabByName('contact');
    setTimeout(() => setActiveButton(null), 150);
  };
  
  // Function to handle X button (Skills)
  const handleXButtonAction = () => {
    navigateToTabByName('skills');
    setTimeout(() => setActiveButton(null), 150);
  };
  
  // Function to handle Y button (Experience)
  const handleYButtonAction = () => {
    navigateToTabByName('experience');
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

  // Function to handle action button click
  const handleButtonClick = (button: Button) => {
    setActiveButton(button);
    
    switch (button) {
      case 'a':
        handleSelectAction();
        break;
      case 'b':
        handleBackAction();
        break;
      case 'x':
        handleXButtonAction();
        break;
      case 'y':
        handleYButtonAction();
        break;
      default:
        break;
    }
  };

  return {
    activeDirection,
    activeButton,
    keyPressed,
    handleDPadClick,
    handleButtonClick
  };
};
