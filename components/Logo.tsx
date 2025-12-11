import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="bananaGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCD34D" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Abstract Background Frame (16:9 ratio hint) */}
      <rect x="10" y="27.5" width="80" height="45" rx="8" fill="#1E293B" stroke="#4F46E5" strokeWidth="2" />
      
      {/* The Silhouette Figure (Black) */}
      <circle cx="40" cy="45" r="6" fill="black" />
      <path d="M40 54 C 30 54, 28 70, 28 70 H 52 C 52 70, 50 54, 40 54" fill="black" />
      
      {/* The Nano Banana (Cute & overlapping) */}
      <path 
        d="M65 35 Q 75 50 65 65 Q 55 75 45 70" 
        stroke="url(#bananaGradient)" 
        strokeWidth="8" 
        strokeLinecap="round"
        fill="none"
        filter="url(#glow)"
      />
      {/* Banana Stem */}
      <path d="M65 35 L 66 32" stroke="#A16207" strokeWidth="3" strokeLinecap="round" />

      {/* Magic Sparkles */}
      <path d="M75 30 L 77 26 M 77 26 L 79 30 M 77 26 L 81 26 M 77 26 L 73 26" stroke="#818CF8" strokeWidth="1.5" />
    </svg>
  );
};
