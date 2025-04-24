
import { useState, useEffect } from 'react';

type ArcadeMachineProps = {
  onZoomComplete: () => void;
};

const ArcadeMachine = ({ onZoomComplete }: ArcadeMachineProps) => {
  const [isZooming, setIsZooming] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Set a small timeout to ensure the component has rendered
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (!isZooming) {
      setIsZooming(true);
      // Call onZoomComplete after animation finishes
      setTimeout(() => {
        onZoomComplete();
      }, 3000); // Same duration as our zoom animation
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background arcade room */}
      <div className="absolute inset-0 bg-arcade-darkPurple">
        {/* Floor grid */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(to right, rgba(155, 135, 245, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(155, 135, 245, 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'bottom'
          }} />
        </div>

        {/* Side arcade machines (decorative) */}
        <div className="absolute left-4 bottom-32 w-32 h-64 bg-gradient-to-b from-arcade-purple to-arcade-darkPurple rounded-t-lg border border-arcade-neonPink/30"></div>
        <div className="absolute right-4 bottom-32 w-32 h-64 bg-gradient-to-b from-arcade-cyan to-arcade-darkPurple rounded-t-lg border border-arcade-neonBlue/30"></div>
      </div>

      {/* Main arcade machine */}
      <div 
        className={`relative ${isZooming ? 'animate-zoom-in' : 'transform transition-transform hover:scale-105 cursor-pointer'} z-10`}
        onClick={handleClick}
      >
        <div className="w-72 h-[34rem] bg-gradient-to-b from-black to-arcade-darkPurple rounded-t-lg border-2 border-arcade-purple/50 relative">
          {/* Top header */}
          <div className="h-20 bg-black/80 rounded-t-lg border-b-2 border-arcade-pink/30 flex items-center justify-center p-2">
            <div className="text-center bg-gradient-to-r from-arcade-orange to-arcade-pink text-white font-press-start text-sm p-1 px-4 rounded">
              <span className="animate-neon-pulse">RESUME ARCADE</span>
            </div>
          </div>

          {/* Screen */}
          <div className="relative h-64 mx-4 mt-4 bg-black/80 border-2 border-arcade-neonPink/50 overflow-hidden crt rounded-md">
            <div className="scanline"></div>
            <div className="h-full flex flex-col items-center justify-center text-white font-press-start p-4">
              {hasLoaded && !isZooming && (
                <>
                  <p className="text-center text-arcade-cyan text-xs mb-4 animate-pulse">PRESS START</p>
                  <div className="text-sm text-center">
                    <p className="neon-text">RESUME</p>
                    <p className="neon-blue my-2">ARCADE</p>
                    <p className="text-xs mt-4 text-white/80">CLICK TO PLAY</p>
                  </div>
                </>
              )}

              {isZooming && (
                <div className="animate-crt-flicker h-full w-full flex items-center justify-center">
                  <p className="text-center text-white text-sm animate-blink">LOADING...</p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-20 left-0 right-0 h-24 flex items-center justify-center">
            <div className="flex gap-8">
              {/* Joystick */}
              <div className="w-16 h-16 relative">
                <div className="absolute w-12 h-12 bg-black rounded-full border-2 border-arcade-neonPink/50"></div>
                <div className="absolute top-2 left-2 w-8 h-8 bg-arcade-pink rounded-full"></div>
              </div>
              
              {/* Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <div className="w-8 h-8 bg-arcade-cyan rounded-full border-2 border-white/20"></div>
                <div className="w-8 h-8 bg-arcade-neonPink rounded-full border-2 border-white/20"></div>
                <div className="w-8 h-8 bg-arcade-orange rounded-full border-2 border-white/20"></div>
                <div className="w-8 h-8 bg-arcade-purple rounded-full border-2 border-white/20"></div>
              </div>
            </div>
          </div>

          {/* Base */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-arcade-darkPurple border-t-2 border-arcade-cyan/30 rounded-b-lg"></div>
        </div>
      </div>

      {/* Ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-arcade-pink/5 to-transparent pointer-events-none"></div>
      
      {/* Instructions */}
      {!isZooming && (
        <div className="absolute bottom-8 left-0 right-0 text-center text-white font-vt323 text-lg">
          <p className="animate-pulse">Click the arcade machine to begin</p>
        </div>
      )}
    </div>
  );
};

export default ArcadeMachine;
