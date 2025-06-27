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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="text-center">
        {/* Enhanced container with better styling */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Animated background rings */}
          <div
            className="absolute inset-0 rounded-full border-2 border-white/10 animate-spin"
            style={{ animation: "rotate 3s linear infinite" }}
          ></div>
          <div
            className="absolute inset-2 rounded-full border border-white/5 animate-spin"
            style={{ animation: "rotate 4s linear infinite reverse" }}
          ></div>

          {/* Main logo container */}
          <div className="absolute inset-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 flex items-center justify-center overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-30"></div>

            {/* Enhanced SVG with better proportions */}
            <svg
              key={`main-${animationKey}`}
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 40 40"
              fill="none"
              className="relative z-10 drop-shadow-lg"
            >
              {/* Palm base - draws first as foundation */}
              <path
                d="M0 40L0 32L40 32V40L0 40Z"
                fill="white"
                className="opacity-0 drop-shadow-sm"
                style={{
                  animation: "slideUp 0.15s ease-out 0.05s forwards",
                }}
              />

              {/* Thumb - leftmost vertical bar */}
              <path
                d="M0 0H8V40H0V0Z"
                fill="white"
                className="opacity-0 drop-shadow-sm"
                style={{
                  animation: "growUp 0.2s ease-out 0.15s forwards",
                }}
              />

              {/* Index finger - second bar */}
              <path
                d="M10.6667 0H18.6667V29.3333H10.6667V0Z"
                fill="white"
                className="opacity-0 drop-shadow-sm"
                style={{
                  animation: "growUp 0.2s ease-out 0.25s forwards",
                }}
              />

              {/* Palm connection - horizontal connector */}
              <path
                d="M21.3333 24V16H32V24H21.3333Z"
                fill="white"
                className="opacity-0 drop-shadow-sm"
                style={{
                  animation: "slideRight 0.15s ease-out 0.35s forwards",
                }}
              />

              {/* Middle finger segments */}
              <path
                d="M21.3333 0H29.3333V13.6667H21.3333V0Z"
                fill="white"
                className="opacity-0 drop-shadow-sm"
                style={{
                  animation: "growUp 0.18s ease-out 0.45s forwards",
                }}
              />

              <path
                d="M21.3333 24H29.3333V29.3333H21.3333V24Z"
                fill="white"
                className="opacity-0 drop-shadow-sm"
                style={{
                  animation: "growUp 0.12s ease-out 0.55s forwards",
                }}
              />

              {/* Ring finger segments */}
              <path
                d="M32 0H40V13.6667H32V0Z"
                fill="white"
                className="opacity-0 drop-shadow-sm"
                style={{
                  animation: "growUp 0.18s ease-out 0.65s forwards",
                }}
              />

              <path
                d="M32 16H40V32H32V16Z"
                fill="white"
                className="opacity-0 drop-shadow-sm"
                style={{
                  animation: "growUp 0.15s ease-out 0.75s forwards",
                }}
              />
            </svg>
          </div>
        </div>

        {/* Loading text with pulse animation */}
        <div className="space-y-3">
          <div className="flex justify-center space-x-1">
            <div
              className="w-2 h-2 bg-white rounded-full animate-pulse"
              style={{ animationDelay: "0ms", animationDuration: "1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-pulse"
              style={{ animationDelay: "200ms", animationDuration: "1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-pulse"
              style={{ animationDelay: "400ms", animationDuration: "1s" }}
            ></div>
          </div>
          <p className="text-white/80 text-sm font-medium tracking-wide">
            Loading...
          </p>
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

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default HandLogoLoader;
