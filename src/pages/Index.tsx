
import { useState } from 'react';
import ArcadeMachine from '@/components/ArcadeMachine';
import ArcadeScreen from '@/components/ArcadeScreen';

const Index = () => {
  const [showResume, setShowResume] = useState(false);

  const handleZoomComplete = () => {
    setShowResume(true);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-arcade-darkPurple">
      {!showResume ? (
        <ArcadeMachine onZoomComplete={handleZoomComplete} />
      ) : (
        <ArcadeScreen />
      )}
    </div>
  );
};

export default Index;
