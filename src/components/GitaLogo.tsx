import React from 'react';

interface GitaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const GitaLogo: React.FC<GitaLogoProps> = ({
  size = 'md',
  showText = false,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 32, textTitle: 'text-base sm:text-lg', textSub: 'text-[10px]' },
    md: { icon: 40, textTitle: 'text-lg sm:text-xl', textSub: 'text-[11px]' },
    lg: { icon: 56, textTitle: 'text-2xl sm:text-3xl', textSub: 'text-xs' },
    xl: { icon: 72, textTitle: 'text-3xl sm:text-4xl', textSub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Ornate Sacred Emblem */}
      <div 
        className="relative shrink-0 flex items-center justify-center select-none"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient Definitions */}
          <defs>
            <radialGradient id="sacredBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A84318" />
              <stop offset="70%" stopColor="#82280A" />
              <stop offset="100%" stopColor="#5E1A04" />
            </radialGradient>
            
            <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F9E2AF" />
              <stop offset="35%" stopColor="#D4AF37" />
              <stop offset="70%" stopColor="#AA7D1D" />
              <stop offset="100%" stopColor="#F3D17C" />
            </linearGradient>

            <linearGradient id="omGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF9EB" />
              <stop offset="60%" stopColor="#FCE4B8" />
              <stop offset="100%" stopColor="#DFB668" />
            </linearGradient>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Sun Rays / Radiance Petals (12 points) */}
          <g opacity="0.85">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <path
                key={deg}
                d="M 50 4 Q 52 11 50 14 Q 48 11 50 4 Z"
                fill="url(#goldRim)"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
          </g>

          {/* Main Round Base */}
          <circle cx="50" cy="50" r="39" fill="url(#sacredBg)" />

          {/* Outer Golden Concentric Ring with Beaded Filigree */}
          <circle cx="50" cy="50" r="39" stroke="url(#goldRim)" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="34.5" stroke="url(#goldRim)" strokeWidth="0.8" strokeDasharray="2 2.5" opacity="0.8" />

          {/* Inner Lotus Petal Octagram (8 petals) */}
          <g opacity="0.35">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <path
                key={deg}
                d="M 50 20 C 56 30 56 40 50 47 C 44 40 44 30 50 20 Z"
                fill="#FFD27D"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
          </g>

          {/* Inner Golden Ring */}
          <circle cx="50" cy="50" r="28" stroke="url(#goldRim)" strokeWidth="0.8" opacity="0.6" />

          {/* Central Holy ॐ Glyph */}
          <text
            x="50"
            y="59"
            textAnchor="middle"
            fill="url(#omGold)"
            fontFamily="'Noto Serif Bengali', 'Tiro Devanagari Sanskrit', serif"
            fontSize="33"
            fontWeight="bold"
            filter="url(#softGlow)"
            className="select-none"
          >
            ॐ
          </text>
        </svg>
      </div>

      {/* Accompanying Title Text if requested */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold font-serif-bn text-[#2D1B0E] leading-tight tracking-tight ${currentSize.textTitle}`}>
            শ্রীমদ্ভগবদ্গীতা
          </span>
          <span className={`font-serif-bn text-[#8E531D] font-medium tracking-wider ${currentSize.textSub}`}>
            দিব্যবাণী ও শাশ্বত জ্ঞান
          </span>
        </div>
      )}
    </div>
  );
};
