
import { useState, useEffect, useCallback } from 'react';
import { Direction } from '@/components/controller/DPad';
import { Button } from '@/components/controller/types';

export const useControllerNavigation = () => {
  const [activeDirection, setActiveDirection] = useState<Direction>('neutral');
  const [activeButton, setActiveButton] = useState<Button>(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  
  // Function to get all tabs
  const getAllTabs = useCallback(() => {
    return document.querySelectorAll('[role="tab"]');
  }, []);
  
  // Function to get the currently active tab
  const getActiveTab = useCallback(() => {
    return document.querySelector('[role="tab"][data-state="active"]');
  }, []);
  
  // Function to ensure tab navigation is working
  const ensureTabNavigation = useCallback(() => {
    const tabs = getAllTabs();
    if (tabs.length === 0) return;
    
    const activeTab = getActiveTab();
    if (!activeTab && tabs.length > 0) {
      // If no tab is active, activate the first one
      (tabs[0] as HTMLElement).click();
    }
  }, [getAllTabs, getActiveTab]);
  
  // Function to navigate between tabs
  const navigateTabs = useCallback((direction: 'next' | 'prev') => {
    const tabs = getAllTabs();
    if (tabs.length === 0) return;
    
    const tabsList = Array.from(tabs);
    const currentIndex = tabsList.findIndex(tab => tab.getAttribute('data-state') === 'active');
    
    let newIndex;
    if (currentIndex === -1) {
      // If no tab is active, select the first tab for 'next' or last tab for 'prev'
      newIndex = direction === 'next' ? 0 : tabsList.length - 1;
    } else {
      if (direction === 'next') {
        newIndex = (currentIndex + 1) % tabsList.length;
      } else {
        newIndex = (currentIndex - 1 + tabsList.length) % tabsList.length;
      }
    }
    
    (tabsList[newIndex] as HTMLElement).click();
  }, [getAllTabs]);
  
  // Function to navigate to a specific tab by name
  const navigateToTabByName = useCallback((tabName: string) => {
    const tabs = document.querySelectorAll('[role="tab"]');
    const tabsList = Array.from(tabs);
    
    const targetTab = tabsList.find(tab => {
      const tabValue = tab.getAttribute('value');
      return tabValue?.toLowerCase() === tabName.toLowerCase();
    });
    
    if (targetTab) {
      (targetTab as HTMLElement).click();
    }
  }, []);
  
  useEffect(() => {
    // Initialize tab navigation when component mounts
    ensureTabNavigation();
    
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
      // Ensure tabs are set up before handling navigation
      ensureTabNavigation();
      
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
          navigateToTabByName('about');
          break;
        case 'b':
        case 'B':
          setActiveButton('b');
          navigateToTabByName('contact');
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
  }, [lastScrollPosition, ensureTabNavigation, navigateTabs, navigateToTabByName]);

  // Function to handle D-pad button click
  const handleDPadClick = (direction: Direction) => {
    // Ensure tabs are set up before handling navigation
    ensureTabNavigation();
    
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
    // Ensure tabs are set up before handling actions
    ensureTabNavigation();
    
    setActiveButton(button);
    
    switch (button) {
      case 'a':
        navigateToTabByName('about');
        break;
      case 'b':
        navigateToTabByName('contact');
        break;
      case 'x':
        navigateToTabByName('skills');
        break;
      case 'y':
        navigateToTabByName('experience');
        break;
      default:
        break;
    }
    
    // Reset button after a short delay
    setTimeout(() => {
      setActiveButton(null);
    }, 150);
  };

  return {
    activeDirection,
    activeButton,
    keyPressed,
    handleDPadClick,
    handleButtonClick
  };
};
