
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
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-arcade-purple/20 to-arcade-darkPurple">
        {/* Animated neon grid lines */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(155, 135, 245, 0.5) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(155, 135, 245, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 15s linear infinite',
          }}
        />
        
        {/* Animated stars/particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`
              }}
            />
          ))}
        </div>

        {/* Sun/planet in the background */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-br from-arcade-orange to-arcade-neonPink opacity-30 blur-2xl" />
        <div className="absolute bottom-10 left-20 w-40 h-40 rounded-full bg-gradient-to-br from-arcade-cyan to-arcade-purple opacity-20 blur-xl" />
        
        {/* Floor grid with perspective */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(to right, rgba(155, 135, 245, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(155, 135, 245, 0.4) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'bottom',
            animation: 'gridPulse 5s infinite alternate',
          }} />
        </div>
        
        {/* Animated neon mountains/shapes in the distance */}
        <div className="absolute bottom-[33%] left-0 right-0 h-20 bg-arcade-darkPurple" style={{
          clipPath: 'polygon(0% 100%, 5% 80%, 10% 90%, 15% 70%, 20% 85%, 25% 75%, 30% 90%, 35% 70%, 40% 80%, 45% 65%, 50% 80%, 55% 70%, 60% 90%, 65% 80%, 70% 85%, 75% 65%, 80% 75%, 85% 90%, 90% 75%, 95% 85%, 100% 65%, 100% 100%)',
        }}>
          <div className="absolute inset-0 bg-gradient-to-t from-arcade-purple/0 to-arcade-neonPink/30" />
        </div>

        {/* Side arcade machines (decorative and more vibrant) */}
        <div className="absolute left-8 bottom-32 w-40 h-72 bg-gradient-to-b from-arcade-pink to-arcade-darkPurple rounded-t-lg border border-arcade-neonPink">
          <div className="absolute top-5 left-5 right-5 h-24 bg-black/70 border border-arcade-cyan/50"></div>
          <div className="absolute top-36 left-1/2 -translate-x-1/2 w-24 h-6 bg-arcade-darkPurple grid grid-cols-3 gap-1 p-1">
            <div className="bg-red-500 rounded-full"></div>
            <div className="bg-blue-500 rounded-full"></div>
            <div className="bg-yellow-500 rounded-full"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-arcade-darkPurple/80 border-t border-arcade-cyan/30"></div>
        </div>
        
        <div className="absolute right-8 bottom-32 w-40 h-72 bg-gradient-to-b from-arcade-cyan to-arcade-darkPurple rounded-t-lg border border-arcade-neonBlue">
          <div className="absolute top-5 left-5 right-5 h-24 bg-black/70 border border-arcade-neonPink/50"></div>
          <div className="absolute top-36 left-1/2 -translate-x-1/2 w-24 h-6 bg-arcade-darkPurple grid grid-cols-3 gap-1 p-1">
            <div className="bg-green-500 rounded-full"></div>
            <div className="bg-purple-500 rounded-full"></div>
            <div className="bg-orange-500 rounded-full"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-arcade-darkPurple/80 border-t border-arcade-pink/30"></div>
        </div>
      </div>

      {/* Main arcade machine */}
      <div 
        className={`relative ${isZooming ? 'animate-zoom-in' : 'transform transition-transform hover:scale-105 cursor-pointer'} z-10`}
        onClick={handleClick}
      >
        <div className="w-72 h-[34rem] bg-gradient-to-b from-black to-arcade-darkPurple rounded-t-lg border-2 border-arcade-purple/50 relative">
          {/* Top header with neon glow */}
          <div className="h-20 bg-black/80 rounded-t-lg border-b-2 border-arcade-pink/30 flex items-center justify-center p-2 relative overflow-hidden">
            <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-arcade-cyan to-transparent absolute top-6 animate-pulse opacity-70"></div>
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-arcade-neonPink to-transparent absolute bottom-6 animate-pulse opacity-70"></div>
            </div>
            <div className="text-center bg-gradient-to-r from-arcade-orange to-arcade-pink text-white font-press-start text-sm p-1 px-4 rounded relative z-10 shadow-[0_0_8px_rgba(244,114,182,0.6)]">
              <span className="animate-neon-pulse">BRANDON HAN</span>
            </div>
          </div>

          {/* Screen with enhanced CRT effect */}
          <div className="relative h-64 mx-4 mt-4 bg-black/80 border-2 border-arcade-neonPink/50 overflow-hidden crt rounded-md">
            <div className="scanline"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-arcade-purple/10"></div>
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

          {/* Controls with enhanced styling */}
          <div className="absolute bottom-20 left-0 right-0 h-24 flex items-center justify-center">
            <div className="flex gap-8">
              {/* Joystick */}
              <div className="w-16 h-16 relative">
                <div className="absolute w-12 h-12 bg-black rounded-full border-2 border-arcade-neonPink/50 shadow-[0_0_5px_rgba(236,72,153,0.5)]"></div>
                <div className="absolute top-2 left-2 w-8 h-8 bg-gradient-to-br from-arcade-pink to-red-600 rounded-full shadow-lg"></div>
              </div>
              
              {/* Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <div className="w-8 h-8 bg-arcade-cyan rounded-full border-2 border-white/20 shadow-[0_0_5px_rgba(34,211,238,0.5)]"></div>
                <div className="w-8 h-8 bg-arcade-neonPink rounded-full border-2 border-white/20 shadow-[0_0_5px_rgba(236,72,153,0.5)]"></div>
                <div className="w-8 h-8 bg-arcade-orange rounded-full border-2 border-white/20 shadow-[0_0_5px_rgba(249,115,22,0.5)]"></div>
                <div className="w-8 h-8 bg-arcade-purple rounded-full border-2 border-white/20 shadow-[0_0_5px_rgba(147,51,234,0.5)]"></div>
              </div>
            </div>
          </div>

          {/* Base with enhanced lighting */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-arcade-darkPurple border-t-2 border-arcade-cyan/30 rounded-b-lg">
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-arcade-cyan/30 rounded-full blur-sm"></div>
          </div>
          
          {/* Decorative coin slot */}
          <div className="absolute right-6 bottom-10 w-10 h-4 bg-slate-800 border border-slate-700 rounded-sm flex items-center justify-center">
            <div className="w-6 h-1 bg-black rounded-sm"></div>
          </div>
          <div className="absolute right-8 bottom-5 text-xs font-vt323 text-arcade-cyan/70">INSERT COIN</div>
        </div>
      </div>

      {/* Enhanced ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-arcade-pink/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-arcade-cyan/10 to-transparent pointer-events-none"></div>
      
      {/* Instructions */}
      {!isZooming && (
        <div className="absolute bottom-8 left-0 right-0 text-center text-white font-vt323 text-lg">
          <p className="animate-pulse">Click the arcade machine to begin</p>
        </div>
      )}
      
      {/* Floating particles */}
      <style jsx="true">{`
        @keyframes gridMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 50px 50px;
          }
        }
        
        @keyframes twinkle {
          0% {
            opacity: 0.3;
            transform: scale(1);
          }
          100% {
            opacity: 0.8;
            transform: scale(1.3);
          }
        }
        
        @keyframes gridPulse {
          0% {
            opacity: 0.5;
          }
          100% {
            opacity: 0.8;
          }
        }
        
        .animate-zoom-in {
          animation: zoom-in 3s forwards;
        }
        
        @keyframes zoom-in {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(50);
            opacity: 0;
          }
        }
        
        .crt:before {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(to bottom, rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 2;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
        
        .animate-crt-flicker {
          animation: crtFlicker 0.15s infinite alternate;
        }
        
        @keyframes crtFlicker {
          0% {
            opacity: 0.85;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-blink {
          animation: blink 1s infinite alternate;
        }
        
        @keyframes blink {
          0% {
            opacity: 0.4;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ArcadeMachine;
