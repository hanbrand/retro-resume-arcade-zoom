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
  
  // Enhanced function to click an element - tries multiple reliable approaches
  const clickElement = (element: HTMLElement | null) => {
    if (!element) {
      console.error('Cannot click null element');
      return false;
    }
    
    console.log(`Attempting to click element: ${element.tagName} ${element.className}`);
    
    // Try a sequence of increasingly forceful click approaches
    const clickMethods = [
      // 1. Standard element.click() - most compatible
      () => {
        console.log('Trying native click()');
        element.click();
        return true;
      },
      
      // 2. Dispatch mousedown/mouseup/click events
      () => {
        console.log('Trying manual event dispatch sequence');
        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
          const event = new MouseEvent(eventType, {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: 0,
            clientY: 0
          });
          element.dispatchEvent(event);
        });
        return true;
      },
      
      // 3. Focus then click
      () => {
        console.log('Trying focus then click');
        element.focus();
        setTimeout(() => element.click(), 50);
        return true;
      },
      
      // 4. Set attribute directly (for Radix UI)
      () => {
        console.log('Trying to set data-state/aria-selected');
        // For Radix UI tabs, setting these attributes might trigger state changes
        element.setAttribute('data-state', 'active');
        element.setAttribute('aria-selected', 'true');
        
        // Try to find and activate related content
        const value = element.getAttribute('value');
        if (value) {
          // Deactivate all TabsContent elements first
          document.querySelectorAll('[data-state="active"][role="tabpanel"], [data-state="active"].Tab, .TabsContent[data-state="active"]').forEach(panel => {
            (panel as HTMLElement).setAttribute('data-state', 'inactive');
          });
          
          // Try multiple possible selectors for finding the content
          const contentSelectors = [
            `[role="tabpanel"][value="${value}"]`,
            `div[data-state][value="${value}"]`,
            `[data-radix-tab-content][value="${value}"]`,
            `[role="tabpanel"][data-value="${value}"]`,
            `[data-state][data-orientation][value="${value}"]`,
            `#${value}-content`, // Try by ID
            `[data-tab-content="${value}"]`, // Try by custom attribute
            `.TabsContent[value="${value}"]`, // Try by class and value
            `div[role="tabpanel"][tabindex="0"]`, // Try by role and tabindex
            `div[value="${value}"]` // Try by value only
          ];
          
          // Try each selector
          let contentFound = false;
          for (const selector of contentSelectors) {
            const content = document.querySelector(selector);
            if (content) {
              console.log(`Found tab content with selector: ${selector}`);
              contentFound = true;
              (content as HTMLElement).setAttribute('data-state', 'active');
              
              // Ensure element is visible
              (content as HTMLElement).style.display = 'block';
              break;
            }
          }
          
          // If still not found, look for any TabsContent element
          if (!contentFound) {
            console.log('Looking for TabsContent directly');
            const allContents = document.querySelectorAll('[role="tabpanel"], .TabsContent, [data-tab-content]');
            
            if (allContents.length > 0) {
              // Map active tab index to content index
              const tabs = document.querySelectorAll('[role="tab"]');
              const activeTabIndex = Array.from(tabs).findIndex(tab => tab === element);
              
              if (activeTabIndex >= 0 && activeTabIndex < allContents.length) {
                const targetContent = allContents[activeTabIndex] as HTMLElement;
                targetContent.setAttribute('data-state', 'active');
                console.log(`Activated content by index match`);
                contentFound = true;
              }
            }
          }
          
          console.log(contentFound ? 'Tab content activated' : 'Could not find tab content');
        }
        return true;
      }
    ];
    
    // Try each method in sequence
    for (const method of clickMethods) {
      try {
        if (method()) {
          return true;
        }
      } catch (error) {
        console.error('Click method failed:', error);
        // Continue to next method
      }
    }
    
    console.error('All click methods failed');
    return false;
  };
  
  // Function to get all tabs - searching by actual DOM attributes with more robust selection
  const getAllTabs = useCallback(() => {
    // Try multiple selectors to find tabs in various UI libraries
    const selectors = [
      '[role="tab"]',
      '[data-state][value]',
      '.tabs-trigger',
      '[data-radix-collection-item]'
    ];
    
    // Use the first selector that returns elements
    for (const selector of selectors) {
      const tabs = document.querySelectorAll(selector);
      if (tabs.length > 0) {
        console.log(`Found ${tabs.length} tabs using selector: ${selector}`);
        return tabs;
      }
    }
    
    console.log('No tabs found with any selector');
    return document.querySelectorAll('[role="tab"]'); // Fallback to standard
  }, []);
  
  // Function to get the currently active tab with enhanced detection
  const getActiveTab = useCallback(() => {
    // Try multiple selectors to find the active tab
    const selectors = [
      '[role="tab"][data-state="active"]', 
      '[role="tab"][aria-selected="true"]',
      '[data-state="active"][value]',
      '.tabs-trigger[data-active="true"]'
    ];
    
    // Use the first selector that returns an element
    for (const selector of selectors) {
      const activeTab = document.querySelector(selector);
      if (activeTab) {
        console.log(`Active tab found with selector: ${selector}`);
        return activeTab;
      }
    }
    
    console.log("No active tab found with any selector");
    return null;
  }, []);
  
  // Function to try clicking a specific tab value with enhanced methods
  const clickTabByValue = useCallback((tabValue: string) => {
    console.log(`Attempting to click tab with value: ${tabValue}`);
    
    // Try using ID selector first (most reliable now that we've added IDs)
    const idSelector = `#${tabValue}-tab`;
    const tabById = document.querySelector(idSelector) as HTMLElement;
    
    if (tabById) {
      console.log(`Found tab with ID selector: ${idSelector}`);
      return clickElement(tabById);
    }
    
    // Handle specific tab values that might have different text
    const valueMap: Record<string, string[]> = {
      'about': ['about', 'purple', 'gamepad'],
      'skills': ['skills', 'pink', 'disc'],
      'experience': ['experience', 'cyan', 'clock'],
      'contact': ['contact', 'orange', 'headphones']
    };
    
    // Try multiple potential text values for the tab
    const possibleValues = valueMap[tabValue] || [tabValue];
    
    // Try increasingly broader selectors to find the tab
    const selectorAttempts = [
      // Data attributes (added specifically for controller navigation)
      `[data-tab="${tabValue}"]`,
      
      // Exact value match
      `[role="tab"][value="${tabValue}"]`,
      `[data-section="${tabValue}"]`,
      `[data-value="${tabValue}"]`,
      
      // Data state or orientation with value
      `[data-state][value="${tabValue}"]`,
      
      // Class-based selectors
      `.${tabValue}-tab`,
      `.tab-${tabValue}`
    ];
    
    // Try each selector in sequence
    for (const selector of selectorAttempts) {
      const targetTab = document.querySelector(selector) as HTMLElement;
      if (targetTab) {
        console.log(`Found tab with selector: ${selector}`);
        return clickElement(targetTab);
      }
    }
    
    // If not found by direct selectors, try by content or class
    const allTabs = getAllTabs();
    for (const tab of Array.from(allTabs)) {
      const tabElement = tab as HTMLElement;
      const tabText = tabElement.textContent?.toLowerCase() || '';
      const tabClasses = tabElement.className || '';
      
      // Check if any of the possible values are in the text or class
      for (const val of possibleValues) {
        if (tabText.includes(val.toLowerCase()) || tabClasses.includes(val.toLowerCase())) {
          console.log(`Found tab by text/class match: ${val}`);
          return clickElement(tabElement);
        }
      }
    }
    
    console.log(`Could not find tab with value: ${tabValue}`);
    return false;
  }, [getAllTabs]);
  
  // Function to activate a tab by its value or text content
  const navigateToTabByName = useCallback((tabName: string) => {
    console.log(`Attempting to navigate to tab: ${tabName}`);
    
    // Try to click the tab with enhanced methods
    if (clickTabByValue(tabName)) {
      return true;
    }
    
    // Fallback: try clicking first tab if we couldn't find the target
    const tabs = getAllTabs();
    if (tabs.length > 0) {
      console.log("Falling back to first tab");
      return clickElement(tabs[0] as HTMLElement);
    }
    
    console.error(`Failed to navigate to tab: ${tabName}`);
    return false;
  }, [clickTabByValue, getAllTabs]);
  
  // Navigation between tabs with improved tab finding and clicking
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
    const success = clickElement(tabsList[newIndex] as HTMLElement);
    
    if (!success) {
      console.log("Click element failed, trying direct content update");
      
      // Fallback: Try direct content update
      // First deactivate all tabs except the current one
      tabsList.forEach((tab, index) => {
        const tabEl = tab as HTMLElement;
        if (index === newIndex) {
          tabEl.setAttribute('data-state', 'active');
          tabEl.setAttribute('aria-selected', 'true');
        } else {
          tabEl.setAttribute('data-state', 'inactive');
          tabEl.setAttribute('aria-selected', 'false');
        }
      });
      
      // Then find and update tab content panels
      const activeTab = tabsList[newIndex] as HTMLElement;
      const tabValue = activeTab.getAttribute('value');
      
      if (tabValue) {
        // Find all content panels
        const contentPanels = document.querySelectorAll('[role="tabpanel"], [data-state][value]');
        const contentList = Array.from(contentPanels);
        
        // Try to find the matching content panel by value
        let matchingContent = null;
        for (const panel of contentList) {
          const contentEl = panel as HTMLElement;
          if (contentEl.getAttribute('value') === tabValue) {
            matchingContent = contentEl;
            break;
          }
        }
        
        // If not found by value, try by index correlation
        if (!matchingContent && contentList.length > 0) {
          // If content count matches tab count, use the same index
          if (contentList.length === tabsList.length) {
            matchingContent = contentList[newIndex] as HTMLElement;
          }
        }
        
        // Update content panel states
        if (matchingContent) {
          contentList.forEach(panel => {
            const panelEl = panel as HTMLElement;
            if (panel === matchingContent) {
              panelEl.setAttribute('data-state', 'active');
              panelEl.style.display = 'block';
            } else {
              panelEl.setAttribute('data-state', 'inactive');
            }
          });
        }
      }
    }
  }, [getAllTabs, clickElement]);
  
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

  // Function to handle D-pad button click with improved navigation
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
        // Use the same function that keyboard navigation uses for consistency
        navigateTabs('prev');
        break;
      case 'right':
        console.log("Right direction clicked, navigating to next tab");
        // Use the same function that keyboard navigation uses for consistency
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
