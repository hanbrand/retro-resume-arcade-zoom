import { useState, useEffect, useCallback, useRef } from 'react';
import { Direction } from '@/components/controller/DPad';
import { Button } from '@/components/controller/types';

export const useControllerNavigation = () => {
  const [activeDirection, setActiveDirection] = useState<Direction>('neutral');
  const [activeButton, setActiveButton] = useState<Button>(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const initAttempts = useRef(0);
  const tabsPollingInterval = useRef<number | null>(null);
  
  // Function to click a button on an element
  const clickElement = (element: HTMLElement | null) => {
    if (!element) return false;
    
    try {
      // Try using the native click method
      element.click();
      return true;
    } catch (e) {
      try {
        // Fallback: create and dispatch a click event
        const event = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        element.dispatchEvent(event);
        return true;
      } catch (e2) {
        console.error('Failed to click element', e2);
        return false;
      }
    }
  };
  
  // Function to get all tabs - searching by actual DOM attributes
  const getAllTabs = useCallback(() => {
    const tabs = document.querySelectorAll('[role="tab"]');
    console.log(`Found ${tabs.length} tabs`);
    return tabs;
  }, []);
  
  // Function to get the currently active tab
  const getActiveTab = useCallback(() => {
    const activeTab = document.querySelector('[role="tab"][data-state="active"], [role="tab"][aria-selected="true"]');
    if (activeTab) {
      console.log(`Active tab: ${activeTab.textContent}`);
    } else {
      console.log("No active tab found");
    }
    return activeTab;
  }, []);
  
  // Function to try clicking a specific tab value
  const clickTabByValue = useCallback((tabValue: string) => {
    // Handle specific tab values that might have different text
    const valueMap: Record<string, string[]> = {
      'about': ['about', 'purple', 'gamepad'],
      'skills': ['skills', 'pink', 'disc'],
      'experience': ['experience', 'cyan', 'clock'],
      'contact': ['contact', 'orange', 'headphones']
    };
    
    // Try multiple potential text values for the tab
    const possibleValues = valueMap[tabValue] || [tabValue];
    
    // Try to find the tab with the attribute value first (most reliable)
    let targetTab = document.querySelector(`[role="tab"][value="${tabValue}"]`) as HTMLElement;
    
    // If not found by attribute, try by other attributes
    if (!targetTab) {
      targetTab = document.querySelector(`[role="tab"][data-section="${tabValue}"]`) as HTMLElement;
    }
    
    // If still not found, try by text content or class
    if (!targetTab) {
      const allTabs = document.querySelectorAll('[role="tab"]');
      
      allTabs.forEach((tab) => {
        const tabText = tab.textContent?.toLowerCase() || '';
        const tabClasses = (tab as HTMLElement).className || '';
        
        // Check if any of the possible values are in the text or class
        for (const val of possibleValues) {
          if (tabText.includes(val.toLowerCase()) || tabClasses.includes(val.toLowerCase())) {
            targetTab = tab as HTMLElement;
            break;
          }
        }
      });
    }
    
    // If we found a tab, click it
    if (targetTab) {
      console.log(`Clicking tab with text: ${targetTab.textContent}`);
      return clickElement(targetTab);
    }
    
    return false;
  }, []);
  
  // Function to activate a tab by its value attribute or text content
  const navigateToTabByName = useCallback((tabName: string) => {
    console.log(`Attempting to navigate to tab: ${tabName}`);
    
    // Try to click the tab by different strategies
    if (clickTabByValue(tabName)) {
      return true;
    }
    
    // Fallback approach: try clicking first tab if we couldn't find the target
    const tabs = getAllTabs();
    if (tabs.length > 0) {
      console.log("Falling back to first tab");
      return clickElement(tabs[0] as HTMLElement);
    }
    
    return false;
  }, [clickTabByValue, getAllTabs]);
  
  // Function to navigate between tabs
  const navigateTabs = useCallback((direction: 'next' | 'prev') => {
    console.log(`Navigating tabs: ${direction}`);
    const tabs = getAllTabs();
    if (tabs.length === 0) {
      console.log("No tabs found for navigation");
      return;
    }
    
    const tabsList = Array.from(tabs);
    const currentIndex = tabsList.findIndex(tab => 
      tab.getAttribute('data-state') === 'active' || 
      tab.getAttribute('aria-selected') === 'true'
    );
    
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
    clickElement(tabsList[newIndex] as HTMLElement);
  }, [getAllTabs]);
  
  // Function to ensure tabs are initialized as soon as they're available
  const ensureTabsInitialized = useCallback(() => {
    if (isInitialized) return true;
    
    const tabs = getAllTabs();
    if (tabs.length === 0) {
      console.log("No tabs found during initialization check");
      return false;
    }
    
    // Check if any tab is already active
    const activeTab = getActiveTab();
    if (!activeTab) {
      // No active tab, click on the first tab or about tab
      console.log("No active tab found during initialization, selecting first tab");
      const aboutSuccess = navigateToTabByName('about');
      
      if (!aboutSuccess) {
        // Just try the first tab as a fallback
        if (!clickElement(tabs[0] as HTMLElement)) {
          console.error("Error clicking first tab");
          return false;
        }
      }
    }
    
    console.log("Tab initialization successful");
    setIsInitialized(true);
    return true;
  }, [getAllTabs, getActiveTab, navigateToTabByName, isInitialized]);
  
  // Set up polling to ensure controller is initialized as soon as tabs are available
  useEffect(() => {
    // Stop if already initialized
    if (isInitialized) {
      if (tabsPollingInterval.current) {
        clearInterval(tabsPollingInterval.current);
        tabsPollingInterval.current = null;
      }
      return;
    }
    
    // Try to initialize immediately
    const immediateSuccess = ensureTabsInitialized();
    
    // Set up polling to keep trying if immediate init failed
    if (!immediateSuccess) {
      // First try quick retries
      const quickRetries = [100, 200, 300, 500];
      quickRetries.forEach((delay, index) => {
        setTimeout(() => {
          if (!isInitialized) {
            console.log(`Quick retry ${index + 1} for tab initialization`);
            ensureTabsInitialized();
          }
        }, delay);
      });
      
      // Then set up a slower polling interval for persistent attempts
      tabsPollingInterval.current = window.setInterval(() => {
        initAttempts.current += 1;
        console.log(`Polling initialization attempt #${initAttempts.current}`);
        
        const success = ensureTabsInitialized();
        
        // If successful or we've tried too many times, stop polling
        if (success || initAttempts.current >= 20) {
          clearInterval(tabsPollingInterval.current!);
          tabsPollingInterval.current = null;
          
          // Force initialization after max attempts
          if (!isInitialized && initAttempts.current >= 20) {
            console.log("Forcing initialization after max attempts");
            setIsInitialized(true);
          }
        }
      }, 1000);
    }
    
    return () => {
      if (tabsPollingInterval.current) {
        clearInterval(tabsPollingInterval.current);
        tabsPollingInterval.current = null;
      }
    };
  }, [ensureTabsInitialized, isInitialized]);
  
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
      
      // Ensure tabs are initialized when any key is pressed
      if (!isInitialized) {
        ensureTabsInitialized();
      }
      
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
  }, [lastScrollPosition, navigateTabs, navigateToTabByName, isInitialized, ensureTabsInitialized]);

  // Function to handle D-pad button click
  const handleDPadClick = (direction: Direction) => {
    console.log(`D-pad clicked: ${direction}`);
    setActiveDirection(direction);
    
    // Ensure tabs are initialized when a button is clicked
    if (!isInitialized) {
      ensureTabsInitialized();
    }
    
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
    
    // Ensure tabs are initialized when a button is clicked
    if (!isInitialized) {
      ensureTabsInitialized();
    }
    
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
