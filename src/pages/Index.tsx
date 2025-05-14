import { useState, useEffect } from 'react';
import ArcadeMachine from '@/components/ArcadeMachine';
import ArcadeScreen from '@/components/ArcadeScreen';
import RetroController from '@/components/RetroController';

const Index = () => {
  const [showResume, setShowResume] = useState(false);

  const handleZoomComplete = () => {
    setShowResume(true);
  };

  // Ensure focus is properly set when resume is shown
  useEffect(() => {
    if (showResume) {
      // After showing the resume, set focus to the tabs element
      setTimeout(() => {
        const tabsList = document.querySelector('[role="tablist"]');
        if (tabsList) {
          (tabsList as HTMLElement).focus();
          
          // Also click the about tab to initialize it
          const aboutTab = document.getElementById('about-tab');
          if (aboutTab) {
            aboutTab.click();
            aboutTab.focus();
          }
        }
      }, 500);
    }
  }, [showResume]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-arcade-darkPurple">
      {!showResume ? (
        <ArcadeMachine onZoomComplete={handleZoomComplete} />
      ) : (
        <>
          <ArcadeScreen />
          <RetroController />
        </>
      )}
    </div>
  );
};

export default Index;
