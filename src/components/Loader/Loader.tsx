import { useState, useEffect } from "react";

const HandLogoLoader = () => {
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-xl p-4 shadow-2xl relative overflow-hidden">
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
                animation: "slideUp 0.15s ease-out 0.05s forwards",
              }}
            />

            {/* Thumb - leftmost vertical bar */}
            <path
              d="M0 0H8V40H0V0Z"
              fill="white"
              className="opacity-0"
              style={{
                animation: "growUp 0.2s ease-out 0.15s forwards",
              }}
            />

            {/* Index finger - second bar */}
            <path
              d="M10.6667 0H18.6667V29.3333H10.6667V0Z"
              fill="white"
              className="opacity-0"
              style={{
                animation: "growUp 0.2s ease-out 0.25s forwards",
              }}
            />

            {/* Palm connection - horizontal connector */}
            <path
              d="M21.3333 24V16H32V24H21.3333Z"
              fill="white"
              className="opacity-0"
              style={{
                animation: "slideRight 0.15s ease-out 0.35s forwards",
              }}
            />

            {/* Middle finger segments */}
            <path
              d="M21.3333 0H29.3333V13.6667H21.3333V0Z"
              fill="white"
              className="opacity-0"
              style={{
                animation: "growUp 0.18s ease-out 0.45s forwards",
              }}
            />

            <path
              d="M21.3333 24H29.3333V29.3333H21.3333V24Z"
              fill="white"
              className="opacity-0"
              style={{
                animation: "growUp 0.12s ease-out 0.55s forwards",
              }}
            />

            {/* Ring finger segments */}
            <path
              d="M32 0H40V13.6667H32V0Z"
              fill="white"
              className="opacity-0"
              style={{
                animation: "growUp 0.18s ease-out 0.65s forwards",
              }}
            />

            <path
              d="M32 16H40V32H32V16Z"
              fill="white"
              className="opacity-0"
              style={{
                animation: "growUp 0.15s ease-out 0.75s forwards",
              }}
            />
          </svg>
        </div>
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
