import { useState, useEffect } from 'react';

const HandLogoLoader = () => {
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center flex justify-center items-center min-h-[700px]">
      <div className="w-20 h-20 mx-auto mb-6 rounded-xl p-4 shadow-2xl relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute inset-0 opacity-20 blur-xl rounded-xl"></div>
        
        <svg 
          key={`main-${animationKey}`}
          xmlns="http://www.w3.org/2000/svg" 
          width="100%" 
          height="100%" 
          viewBox="0 0 40 40" 
          fill="none"
          className="relative z-10"
        >
          {/* Palm base - draws first as foundation */}
          <path 
            d="M0 40L0 32L40 32V40L0 40Z" 
            fill="white"
            className="opacity-0"
            style={{
              animation: 'slideUp 0.3s ease-out 0.1s forwards'
            }}
          />
          
          {/* Thumb - leftmost vertical bar */}
          <path 
            d="M0 0H8V40H0V0Z" 
            fill="white"
            className="opacity-0"
            style={{
              animation: 'growUp 0.4s ease-out 0.3s forwards'
            }}
          />
          
          {/* Index finger - second bar */}
          <path 
            d="M10.6667 0H18.6667V29.3333H10.6667V0Z" 
            fill="white"
            className="opacity-0"
            style={{
              animation: 'growUp 0.4s ease-out 0.5s forwards'
            }}
          />
          
          {/* Palm connection - horizontal connector */}
          <path 
            d="M21.3333 24V16H32V24H21.3333Z" 
            fill="white"
            className="opacity-0"
            style={{
              animation: 'slideRight 0.3s ease-out 0.7s forwards'
            }}
          />
          
          {/* Middle finger segments */}
          <path 
            d="M21.3333 0H29.3333V13.6667H21.3333V0Z" 
            fill="white"
            className="opacity-0"
            style={{
              animation: 'growUp 0.35s ease-out 0.9s forwards'
            }}
          />
          
          <path 
            d="M21.3333 24H29.3333V29.3333H21.3333V24Z" 
            fill="white"
            className="opacity-0"
            style={{
              animation: 'growUp 0.25s ease-out 1.1s forwards'
            }}
          />
          
          {/* Ring finger segments */}
          <path 
            d="M32 0H40V13.6667H32V0Z" 
            fill="white"
            className="opacity-0"
            style={{
              animation: 'growUp 0.35s ease-out 1.3s forwards'
            }}
          />
          
          <path 
            d="M32 16H40V32H32V16Z" 
            fill="white"
            className="opacity-0"
            style={{
              animation: 'growUp 0.3s ease-out 1.5s forwards'
            }}
          />
        </svg>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes growUp {
          from {
            opacity: 0;
            transform: scaleY(0);
            transform-origin: bottom;
          }
          to {
            opacity: 1;
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: scaleX(0);
            transform-origin: left;
          }
          to {
            opacity: 1;
            transform: scaleX(1);
            transform-origin: left;
          }
        }
      `}</style>
    </div>
  );
};

export default HandLogoLoader;