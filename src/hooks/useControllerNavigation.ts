import { useState, useEffect, useCallback } from 'react';
import { Direction } from '@/components/controller/DPad';
import { Button } from '@/components/controller/types';

export const useControllerNavigation = () => {
  const [activeDirection, setActiveDirection] = useState<Direction>('neutral');
  const [activeButton, setActiveButton] = useState<Button>(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  
  // Function to get all tabs - searching by actual DOM attributes
  const getAllTabs = useCallback(() => {
    console.log("Getting all tabs");
    const tabs = document.querySelectorAll('[role="tab"]');
    console.log(`Found ${tabs.length} tabs`);
    return tabs;
  }, []);
  
  // Function to get the currently active tab
  const getActiveTab = useCallback(() => {
    console.log("Getting active tab");
    const activeTab = document.querySelector('[role="tab"][data-state="active"]');
    if (activeTab) {
      console.log(`Active tab: ${activeTab.textContent}`);
    } else {
      console.log("No active tab found");
    }
    return activeTab;
  }, []);
  
  // Function to activate a tab by its value attribute
  const navigateToTabByName = useCallback((tabName: string) => {
    console.log(`Attempting to navigate to tab: ${tabName}`);
    
    // First try to find the tab based on the tab content's text content
    const tabs = document.querySelectorAll('[role="tab"]');
    
    // Try to find a tab with text content containing our tab name
    let targetTab: Element | null = null;
    tabs.forEach((tab) => {
      const tabText = tab.textContent?.toLowerCase() || '';
      if (tabText.includes(tabName.toLowerCase())) {
        targetTab = tab;
        console.log(`Found tab by text content: ${tabText}`);
      }
    });
    
    // If we found a tab, click it
    if (targetTab) {
      console.log(`Clicking tab: ${targetTab.textContent}`);
      (targetTab as HTMLElement).click();
      return true;
    } else {
      console.log(`Could not find tab with name: ${tabName}`);
      // If we can't find the tab, try to click the first tab
      if (tabs.length > 0) {
        console.log("Falling back to first tab");
        (tabs[0] as HTMLElement).click();
        return true;
      }
    }
    
    return false;
  }, []);
  
  // Function to navigate between tabs
  const navigateTabs = useCallback((direction: 'next' | 'prev') => {
    console.log(`Navigating tabs: ${direction}`);
    const tabs = getAllTabs();
    if (tabs.length === 0) {
      console.log("No tabs found");
      return;
    }
    
    const tabsList = Array.from(tabs);
    const currentIndex = tabsList.findIndex(tab => tab.getAttribute('data-state') === 'active');
    console.log(`Current tab index: ${currentIndex}`);
    
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
    
    console.log(`New tab index: ${newIndex}`);
    // Ensure we're properly clicking the DOM element
    try {
      (tabsList[newIndex] as HTMLElement).click();
    } catch (error) {
      console.error("Error clicking tab:", error);
    }
  }, [getAllTabs]);
  
  // Initialize tabs immediately when component mounts
  useEffect(() => {
    console.log("Initializing controller navigation immediately");
    
    // Force initial tab selection right away
    const initializeNavigation = () => {
      // Early exit if already initialized or document is not ready
      if (initialized || !document.body) return;
      
      const tabs = getAllTabs();
      if (tabs.length > 0) {
        // First check if any tab is already active
        const activeTab = getActiveTab();
        if (!activeTab) {
          // No active tab, so click on the first one to initialize
          console.log("No active tab found, clicking first tab");
          try {
            (tabs[0] as HTMLElement).click();
          } catch (error) {
            console.error("Error clicking initial tab:", error);
          }
        }
        setInitialized(true);
      } else {
        console.log("No tabs found during initialization");
      }
    };
    
    // Try to initialize immediately
    initializeNavigation();
    
    // And also set a backup timer for initialization
    const initTimer = setTimeout(() => {
      if (!initialized) {
        console.log("Delayed initialization running");
        initializeNavigation();
        
        // If still not initialized, try "about" tab specifically 
        if (!initialized) {
          const success = navigateToTabByName('about');
          console.log(`Delayed initial navigation success: ${success}`);
          if (success) {
            setInitialized(true);
          }
        }
      }
    }, 300);
    
    return () => clearTimeout(initTimer);
  }, [getAllTabs, getActiveTab, navigateToTabByName, initialized]);
  
  // Set up event listeners for navigation
  useEffect(() => {
    // Scroll handling for up/down directions
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

    // Global event handler for keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(`Key pressed: ${e.key}`);
      
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

    // Add all event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [lastScrollPosition, navigateTabs, navigateToTabByName]);

  // Function to handle D-pad button click
  const handleDPadClick = (direction: Direction) => {
    console.log(`D-pad clicked: ${direction}`);
    setActiveDirection(direction);
    
    switch (direction) {
      case 'up':
        window.scrollBy(0, -150);
        break;
      case 'down':
        window.scrollBy(0, 150);
        break;
      case 'left':
        console.log("Left direction clicked, navigating to previous tab");
        navigateTabs('prev');
        break;
      case 'right':
        console.log("Right direction clicked, navigating to next tab");
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

  // Function to handle action button click - directly navigate to specific tabs
  const handleButtonClick = (button: Button) => {
    console.log(`Button clicked: ${button}`);
    setActiveButton(button);
    
    // Direct navigation to specific tabs based on button
    switch (button) {
      case 'a':
        console.log("A button clicked, navigating to about tab");
        navigateToTabByName('about');
        break;
      case 'b':
        console.log("B button clicked, navigating to contact tab");
        navigateToTabByName('contact');
        break;
      case 'x':
        console.log("X button clicked, navigating to skills tab");
        navigateToTabByName('skills');
        break;
      case 'y':
        console.log("Y button clicked, navigating to experience tab");
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
    handleButtonClick,
    navigateToTabByName
  };
};
