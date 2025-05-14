import { useRef, useEffect, useState } from 'react';
import ControllerBody from './controller/ControllerBody';
import { useControllerNavigation } from '@/hooks/useControllerNavigation';
import { useControllerVisibility } from '@/hooks/useControllerVisibility';
import { Direction } from './controller/DPad';
import { Button } from './controller/types';
import { useNavigation } from './ArcadeScreen'; // Import for direct tab control

const RetroController = () => {
  const controllerRef = useRef<HTMLDivElement>(null);
  const { currentSection, setCurrentSection } = useNavigation(); // Get navigation context
  const { 
    activeDirection, 
    activeButton, 
    keyPressed, 
    handleDPadClick, 
    handleButtonClick,
    navigateToTabByName
  } = useControllerNavigation();
  const { isVisible } = useControllerVisibility(controllerRef);
  const initialized = useRef(false);
  const [navigationDebug, setNavigationDebug] = useState<string>('');

  // Force select a tab programmatically (more direct than DOM click and React state updates)
  const forceSelectTab = (tabName: string) => {
    console.log(`Forcing tab selection: ${tabName}`);
    setNavigationDebug(`Attempting to select: ${tabName}`);
    
    // Try direct context update first (most reliable)
    try {
      setCurrentSection(tabName);
      setNavigationDebug(prev => `${prev}, Context updated`);
      
      // Direct DOM manipulation as backup to ensure UI syncs with state
      const tabId = `${tabName}-tab`;
      const tabElement = document.getElementById(tabId);
      
      // Also target the content element directly
      const contentId = `${tabName}-content`;
      const contentElement = document.getElementById(contentId);
      
      if (tabElement) {
        // Manually trigger click and set attributes on the tab trigger
        tabElement.click();
        tabElement.setAttribute('data-state', 'active');
        tabElement.setAttribute('aria-selected', 'true');
        setNavigationDebug(prev => `${prev}, Tab trigger activated`);
        
        // Ensure all other tabs are inactive
        document.querySelectorAll('[role="tab"]').forEach(tab => {
          if (tab !== tabElement) {
            tab.setAttribute('data-state', 'inactive');
            tab.setAttribute('aria-selected', 'false');
          }
        });
      }
      
      // Directly activate the content panel
      if (contentElement) {
        // Set the state attributes for the content panel
        contentElement.setAttribute('data-state', 'active');
        setNavigationDebug(prev => `${prev}, Content panel activated`);
        
        // Ensure all other content panels are inactive
        document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
          if (panel !== contentElement) {
            panel.setAttribute('data-state', 'inactive');
          }
        });
      } else {
        // Try alternative selectors if content element not found by ID
        const contentSelectors = [
          `[role="tabpanel"][value="${tabName}"]`,
          `[data-tab-content="${tabName}"]`,
          `[data-state][value="${tabName}"]`
        ];
        
        let contentFound = false;
        for (const selector of contentSelectors) {
          const content = document.querySelector(selector);
          if (content) {
            // Set all other content panels to inactive
            document.querySelectorAll('[role="tabpanel"], [data-state="active"][value]').forEach(panel => {
              panel.setAttribute('data-state', 'inactive');
            });
            
            // Set this content panel to active
            (content as HTMLElement).setAttribute('data-state', 'active');
            contentFound = true;
            setNavigationDebug(prev => `${prev}, Content found with selector: ${selector}`);
            break;
          }
        }
        
        if (!contentFound) {
          setNavigationDebug(prev => `${prev}, Could not find content panel directly`);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error setting section via context:", error);
      setNavigationDebug(prev => `${prev}, Context error`);
    }

    // Fallback to hook's navigation function
    try {
      const success = navigateToTabByName(tabName);
      setNavigationDebug(prev => `${prev}, DOM navigation ${success ? 'succeeded' : 'failed'}`);
      
      // Super fallback: direct DOM access with ID
      if (!success) {
        const tabId = `${tabName}-tab`;
        const tabElement = document.getElementById(tabId);
        const contentId = `${tabName}-content`;
        const contentElement = document.getElementById(contentId);
        
        if (tabElement) {
          setNavigationDebug(prev => `${prev}, Trying direct DOM access`);
          try {
            // Activate tab trigger
            tabElement.click();
            setCurrentSection(tabName);
            tabElement.setAttribute('data-state', 'active');
            tabElement.setAttribute('aria-selected', 'true');
            
            // Deactivate other tabs
            document.querySelectorAll('[role="tab"]').forEach(tab => {
              if (tab !== tabElement) {
                tab.setAttribute('data-state', 'inactive');
                tab.setAttribute('aria-selected', 'false');
              }
            });
            
            // Activate content panel if found
            if (contentElement) {
              contentElement.setAttribute('data-state', 'active');
              
              // Deactivate other content panels
              document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
                if (panel !== contentElement) {
                  panel.setAttribute('data-state', 'inactive');
                }
              });
            }
            
            setNavigationDebug(prev => `${prev}, Direct DOM manipulation succeeded`);
            return true;
          } catch (innerError) {
            console.error("Error with direct DOM manipulation:", innerError);
            setNavigationDebug(prev => `${prev}, Direct DOM error`);
          }
        }
      }
      
      return success;
    } catch (error) {
      console.error("Error navigating to tab:", error);
      setNavigationDebug(prev => `${prev}, DOM error`);
      return false;
    }
  };

  // Initialize aggressively on mount to ensure tabs are active immediately
  useEffect(() => {
    console.log("RetroController mounted, initializing navigation");
    setNavigationDebug('Controller mounted');

    // Immediate initialization attempt
    if (!initialized.current) {
      // Pre-select the about tab or current section
      const initialTab = currentSection || 'about';
      setNavigationDebug(prev => `${prev}, Initial tab: ${initialTab}`);
      
      // Try immediately
      let success = forceSelectTab(initialTab);
      
      // And also set up retries with increasing intervals
      if (!success) {
        const retryTimes = [100, 200, 300, 500, 1000, 2000];
        retryTimes.forEach((delay, index) => {
          setTimeout(() => {
            if (!initialized.current) {
              console.log(`Retry ${index + 1} for tab initialization`);
              setNavigationDebug(prev => `${prev}, Retry ${index + 1}`);
              success = forceSelectTab(initialTab);
              if (success) {
                initialized.current = true;
                setNavigationDebug(prev => `${prev}, Initialized on retry ${index + 1}`);
              }
            }
          }, delay);
        });
      } else {
        initialized.current = true;
        setNavigationDebug(prev => `${prev}, Initialized immediately`);
      }
    }
  }, [currentSection, navigateToTabByName, setCurrentSection]);

  // Direct mapping of button to tab values
  const buttonToTabMap: Record<string, string> = {
    'a': 'about',
    'b': 'contact',
    'x': 'skills',
    'y': 'experience'
  };

  // Enhanced handler for button clicks with direct tab setting
  const onButtonClick = (button: Button) => {
    console.log(`RetroController: Button clicked: ${button}`);
    setNavigationDebug(`Button clicked: ${button}`);
    
    // Ensure we're initialized on first click
    if (!initialized.current) {
      forceSelectTab('about');
      initialized.current = true;
      setNavigationDebug(prev => `${prev}, Forced initialization on button click`);
    }
    
    // If clicked a mapped button, navigate to the corresponding tab
    if (button && buttonToTabMap[button]) {
      const tabName = buttonToTabMap[button];
      
      // Update the context state
      setCurrentSection(tabName);
      
      // Directly manipulate DOM for immediate feedback
      // 1. Find and activate the tab trigger
      const tabId = `${tabName}-tab`;
      const tabElement = document.getElementById(tabId);
      if (tabElement) {
        // Activate this tab, deactivate others
        document.querySelectorAll('[role="tab"]').forEach(tab => {
          const isTargetTab = tab === tabElement;
          tab.setAttribute('data-state', isTargetTab ? 'active' : 'inactive');
          tab.setAttribute('aria-selected', isTargetTab ? 'true' : 'false');
        });
      }
      
      // 2. Find and activate the content panel
      const contentId = `${tabName}-content`;
      const contentElement = document.getElementById(contentId);
      if (contentElement) {
        // Activate this content, deactivate others
        document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
          const isTargetPanel = panel === contentElement;
          panel.setAttribute('data-state', isTargetPanel ? 'active' : 'inactive');
        });
        
        setNavigationDebug(prev => `${prev}, Directly activated ${tabName} content`);
      } else {
        // Try fallback selectors if ID doesn't work
        const fallbackContentSelectors = [
          `[role="tabpanel"][value="${tabName}"]`,
          `[data-tab-content="${tabName}"]`,
          `.TabsContent[value="${tabName}"]`
        ];
        
        let contentFound = false;
        for (const selector of fallbackContentSelectors) {
          const content = document.querySelector(selector);
          if (content) {
            // Deactivate all panels
            document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
              panel.setAttribute('data-state', 'inactive');
            });
            
            // Activate this one
            (content as HTMLElement).setAttribute('data-state', 'active');
            contentFound = true;
            setNavigationDebug(prev => `${prev}, Activated content with selector: ${selector}`);
            break;
          }
        }
        
        if (!contentFound) {
          // Last resort: try to match panel index with button index
          const buttons = ['a', 'b', 'x', 'y'];
          const buttonIndex = buttons.indexOf(button);
          const panels = document.querySelectorAll('[role="tabpanel"]');
          
          if (buttonIndex >= 0 && buttonIndex < panels.length) {
            // Deactivate all panels
            panels.forEach((panel, idx) => {
              panel.setAttribute('data-state', idx === buttonIndex ? 'active' : 'inactive');
            });
            
            setNavigationDebug(prev => `${prev}, Activated content by index match`);
          }
        }
      }
    }
    
    // Also call the original handler for state updates
    handleButtonClick(button);
  };

  // Enhanced handler for D-pad clicks with direct tab navigation
  const onDirectionClick = (direction: Direction) => {
    console.log(`RetroController: Direction clicked: ${direction}`);
    setNavigationDebug(`Direction clicked: ${direction}`);
    
    // Ensure we're initialized on first click
    if (!initialized.current) {
      forceSelectTab('about');
      initialized.current = true;
      setNavigationDebug(prev => `${prev}, Forced initialization on direction click`);
    }
    
    // Call the hook's handler directly - it already has the logic to navigate tabs
    handleDPadClick(direction);
    
    // Additional direct TabContent handling for left/right (belt and suspenders approach)
    if (direction === 'left' || direction === 'right') {
      // Get all tab values in order
      const tabValues = ['about', 'skills', 'experience', 'contact'];
      
      // Find current position or default to first tab
      let currentIndex = tabValues.indexOf(currentSection);
      if (currentIndex === -1) currentIndex = 0;
      
      // Calculate next tab index
      let newIndex;
      if (direction === 'left') {
        newIndex = (currentIndex - 1 + tabValues.length) % tabValues.length;
      } else { // right
        newIndex = (currentIndex + 1) % tabValues.length;
      }
      
      // Access tab content directly as well - activate content by ID
      const contentId = `${tabValues[newIndex]}-content`;
      const contentElement = document.getElementById(contentId);
      
      if (contentElement) {
        // Deactivate all content panels
        document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
          panel.setAttribute('data-state', 'inactive');
        });
        
        // Activate this content panel
        contentElement.setAttribute('data-state', 'active');
        setNavigationDebug(prev => `${prev}, Directly activated ${tabValues[newIndex]} content`);
      }
    }
  };

  return (
    <div 
      ref={controllerRef} 
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-20'}`}
      onMouseEnter={() => {
        // Ensure tabs are initialized when mouse hovers over controller
        if (!initialized.current) {
          forceSelectTab('about');
          initialized.current = true;
          setNavigationDebug(`Initialized on mouse enter`);
        }
      }}
    >
      {/* Add debugging info, only visible during development */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="absolute -top-24 left-0 right-0 p-2 bg-black/80 text-white text-xs max-w-xs mx-auto">
          <div>Current Section: {currentSection}</div>
          <div>Debug: {navigationDebug}</div>
        </div>
      )}
      
      <ControllerBody 
        activeDirection={activeDirection}
        activeButton={activeButton}
        keyPressed={keyPressed}
        onDirectionClick={onDirectionClick}
        onButtonClick={onButtonClick}
      />
    </div>
  );
};

export default RetroController;
