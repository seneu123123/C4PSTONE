import React from 'react';

interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

// 1. 3D GLOSSY SUN (Claymorphic Sphere with floating capsule rays & glossy specular reflection)
export const ThreeDSun: React.FC<IconProps> = ({ size = 'md' }) => {
  const scaleMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    hero: 'w-32 h-32 sm:w-40 sm:h-40'
  };

  return (
    <div className={`relative flex items-center justify-center ${scaleMap[size]} transition-transform duration-700 hover:scale-110`}>
      {/* Ambient Pulsing Glow Aura */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 blur-xl opacity-60 animate-pulse" />

      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_15px_25px_rgba(245,158,11,0.45)]">
        <defs>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF176" />
            <stop offset="35%" stopColor="#FFA726" />
            <stop offset="100%" stopColor="#F57C00" />
          </linearGradient>
          <radialGradient id="sunSpecular" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#FFF9C4" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#FF9800" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#FB8C00" />
          </linearGradient>
          <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="6" stdDeviation="4" floodColor="#B45309" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 3D Radiating Rays */}
        <g className="animate-spin-slow origin-center" style={{ animationDuration: '24s' }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <rect
              key={idx}
              x="92"
              y="12"
              width="16"
              height="30"
              rx="8"
              fill="url(#rayGrad)"
              transform={`rotate(${angle} 100 100)`}
              filter="url(#shadow3d)"
            />
          ))}
        </g>

        {/* 3D Sun Sphere Body */}
        <circle cx="100" cy="100" r="54" fill="url(#sunGrad)" />
        {/* Glossy Specular Highlight Bubble */}
        <circle cx="100" cy="100" r="54" fill="url(#sunSpecular)" />
        <ellipse cx="82" cy="74" rx="16" ry="10" fill="#FFFFFF" opacity="0.65" transform="rotate(-25 82 74)" />
      </svg>
    </div>
  );
};

// 2. 3D PUFFY CLOUD (Fluffy White Volumetric Claymorphic Cloud)
export const ThreeDCloud: React.FC<IconProps> = ({ size = 'md' }) => {
  const scaleMap = {
    sm: 'w-12 h-10',
    md: 'w-20 h-16',
    lg: 'w-28 h-20',
    hero: 'w-40 h-28 sm:w-48 sm:h-36'
  };

  return (
    <div className={`relative flex items-center justify-center ${scaleMap[size]} transition-transform duration-700 hover:scale-105 animate-bounce-subtle`}>
      <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl opacity-40" />

      <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-[0_20px_30px_rgba(15,23,42,0.5)]">
        <defs>
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <radialGradient id="cloudLight" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="50%" stopColor="#E2E8F0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {/* Volumetric Puffs Group */}
        <g filter="drop-shadow(0 8px 12px rgba(100,116,139,0.35))">
          {/* Bottom base pill */}
          <rect x="40" y="90" width="160" height="60" rx="30" fill="url(#cloudGrad)" />
          {/* Main Top Center Dome */}
          <circle cx="120" cy="85" r="48" fill="url(#cloudGrad)" />
          {/* Left Puffy Dome */}
          <circle cx="75" cy="105" r="38" fill="url(#cloudGrad)" />
          {/* Right Puffy Dome */}
          <circle cx="165" cy="105" r="35" fill="url(#cloudGrad)" />
        </g>

        {/* Glossy High-Intensity Light Reflections */}
        <circle cx="112" cy="65" r="18" fill="#FFFFFF" opacity="0.8" />
        <ellipse cx="68" cy="90" rx="14" ry="8" fill="#FFFFFF" opacity="0.75" transform="rotate(-15 68 90)" />
        <ellipse cx="160" cy="92" rx="12" ry="7" fill="#FFFFFF" opacity="0.6" transform="rotate(15 160 92)" />
      </svg>
    </div>
  );
};

// 3. 3D SUN BEHIND CLOUD (Partly Cloudy / Tropical Signature)
export const ThreeDSunCloud: React.FC<IconProps> = ({ size = 'md' }) => {
  const scaleMap = {
    sm: 'w-14 h-12',
    md: 'w-24 h-20',
    lg: 'w-32 h-28',
    hero: 'w-44 h-36 sm:w-56 sm:h-44'
  };

  return (
    <div className={`relative flex items-center justify-center ${scaleMap[size]} transition-transform duration-700 hover:scale-105`}>
      {/* Glowing Sun Positioned Behind */}
      <div className="absolute top-0 right-1 sm:right-3 transform -translate-y-1 scale-90">
        <ThreeDSun size={size === 'hero' ? 'lg' : size === 'lg' ? 'md' : 'sm'} />
      </div>
      {/* 3D Cloud Floating Foreground */}
      <div className="relative z-10 top-2 left-0">
        <ThreeDCloud size={size === 'hero' ? 'lg' : size === 'lg' ? 'md' : 'sm'} />
      </div>
    </div>
  );
};

// 4. 3D RAIN (Puffy Dark/Blue Cloud with 3D Glossy Liquid Teardrops)
export const ThreeDRain: React.FC<IconProps> = ({ size = 'md' }) => {
  const scaleMap = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    hero: 'w-44 h-44 sm:w-52 sm:h-52'
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${scaleMap[size]}`}>
      {/* Darker Storm Cloud Top */}
      <div className="relative z-10 transform -translate-y-2">
        <svg viewBox="0 0 240 160" className="w-full h-auto drop-shadow-[0_15px_25px_rgba(30,58,138,0.5)]">
          <defs>
            <linearGradient id="rainCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="40%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <rect x="40" y="80" width="160" height="55" rx="27.5" fill="url(#rainCloudGrad)" />
          <circle cx="120" cy="70" r="45" fill="url(#rainCloudGrad)" />
          <circle cx="75" cy="90" r="35" fill="url(#rainCloudGrad)" />
          <circle cx="165" cy="90" r="32" fill="url(#rainCloudGrad)" />
          <circle cx="112" cy="52" r="14" fill="#FFFFFF" opacity="0.6" />
        </svg>
      </div>

      {/* 3D Hanging Glossy Rain Drops with Staggered Bobbing Animation */}
      <div className="flex justify-center gap-3 sm:gap-4 relative z-0 -mt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="animate-bounce"
            style={{ animationDelay: `${i * 200}ms`, animationDuration: '1.2s' }}
          >
            <svg viewBox="0 0 40 60" className="w-4 h-6 sm:w-5 sm:h-8 drop-shadow-[0_4px_8px_rgba(56,189,248,0.6)]">
              <defs>
                <linearGradient id={`dropGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7DD3FC" />
                  <stop offset="50%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#0369A1" />
                </linearGradient>
              </defs>
              <path
                d="M 20 5 C 20 5 5 30 5 42 C 5 51 11.7 57 20 57 C 28.3 57 35 51 35 42 C 35 30 20 5 20 5 Z"
                fill={`url(#dropGrad-${i})`}
              />
              <ellipse cx="15" cy="40" rx="4" ry="8" fill="#FFFFFF" opacity="0.7" transform="rotate(-20 15 40)" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. 3D THUNDERSTORM (Storm Cloud + Golden 3D Lightning Bolt)
export const ThreeDThunder: React.FC<IconProps> = ({ size = 'md' }) => {
  const scaleMap = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    hero: 'w-44 h-44 sm:w-52 sm:h-52'
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${scaleMap[size]}`}>
      {/* Deep Indigo Storm Cloud */}
      <div className="relative z-10 transform -translate-y-2">
        <svg viewBox="0 0 240 160" className="w-full h-auto drop-shadow-[0_15px_30px_rgba(67,56,202,0.6)]">
          <defs>
            <linearGradient id="stormGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
          </defs>
          <rect x="40" y="80" width="160" height="55" rx="27.5" fill="url(#stormGrad)" />
          <circle cx="120" cy="70" r="45" fill="url(#stormGrad)" />
          <circle cx="75" cy="90" r="35" fill="url(#stormGrad)" />
          <circle cx="165" cy="90" r="32" fill="url(#stormGrad)" />
        </svg>
      </div>

      {/* 3D Glowing Jagged Lightning Bolt */}
      <div className="absolute -bottom-1 z-20 animate-pulse">
        <svg viewBox="0 0 100 120" className="w-8 h-12 sm:w-12 sm:h-16 drop-shadow-[0_0_20px_rgba(250,204,21,0.9)]">
          <defs>
            <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
          </defs>
          <polygon
            points="55,5 20,60 50,60 40,115 85,50 55,50"
            fill="url(#boltGrad)"
            stroke="#CA8A04"
            strokeWidth="3"
          />
          <polygon points="50,15 30,55 52,55 45,95 75,52 52,52" fill="#FFFFFF" opacity="0.65" />
        </svg>
      </div>
    </div>
  );
};

// 6. 3D SNOW / ALPINE (White Cloud + 3D Fluffy Snow Spheres & Crystal Flakes)
export const ThreeDSnow: React.FC<IconProps> = ({ size = 'md' }) => {
  const scaleMap = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    hero: 'w-44 h-44 sm:w-52 sm:h-52'
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${scaleMap[size]}`}>
      <div className="relative z-10 transform -translate-y-2">
        <ThreeDCloud size={size === 'hero' ? 'lg' : size === 'lg' ? 'md' : 'sm'} />
      </div>

      {/* 3D Floating Snow Spheres */}
      <div className="flex justify-center gap-3 sm:gap-4 relative z-0 -mt-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-white via-cyan-100 to-blue-200 shadow-[0_4px_10px_rgba(255,255,255,0.7)] animate-bounce"
            style={{ animationDelay: `${i * 250}ms`, animationDuration: '1.6s' }}
          />
        ))}
      </div>
    </div>
  );
};

// 7. 3D RAINBOW (3D Vibrant Arc with Fluffy Cloud Bases)
export const ThreeDRainbow: React.FC<IconProps> = ({ size = 'md' }) => {
  const scaleMap = {
    sm: 'w-16 h-12',
    md: 'w-24 h-18',
    lg: 'w-36 h-28',
    hero: 'w-48 h-36 sm:w-60 sm:h-44'
  };

  return (
    <div className={`relative flex items-center justify-center ${scaleMap[size]} transition-transform duration-700 hover:scale-105`}>
      <svg viewBox="0 0 240 160" className="w-full h-full drop-shadow-[0_15px_30px_rgba(244,63,94,0.35)]">
        <defs>
          <filter id="rainbowGlow">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#FB7185" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* 3D Rainbow Curved Arches */}
        <g filter="url(#rainbowGlow)">
          {/* Red Arc */}
          <path d="M 30 140 A 90 90 0 0 1 210 140" fill="none" stroke="#F43F5E" strokeWidth="14" strokeLinecap="round" />
          {/* Orange Arc */}
          <path d="M 44 140 A 76 76 0 0 1 196 140" fill="none" stroke="#FB923C" strokeWidth="14" strokeLinecap="round" />
          {/* Yellow Arc */}
          <path d="M 58 140 A 62 62 0 0 1 182 140" fill="none" stroke="#FACC15" strokeWidth="14" strokeLinecap="round" />
          {/* Green Arc */}
          <path d="M 72 140 A 48 48 0 0 1 168 140" fill="none" stroke="#4ADE80" strokeWidth="14" strokeLinecap="round" />
          {/* Blue Arc */}
          <path d="M 86 140 A 34 34 0 0 1 154 140" fill="none" stroke="#38BDF8" strokeWidth="14" strokeLinecap="round" />
        </g>

        {/* Left Cloud Footing */}
        <g transform="translate(10, 100) scale(0.35)">
          <rect x="40" y="80" width="160" height="60" rx="30" fill="#FFFFFF" />
          <circle cx="120" cy="75" r="48" fill="#FFFFFF" />
          <circle cx="75" cy="95" r="38" fill="#FFFFFF" />
          <circle cx="165" cy="95" r="35" fill="#FFFFFF" />
        </g>

        {/* Right Cloud Footing */}
        <g transform="translate(150, 100) scale(0.35)">
          <rect x="40" y="80" width="160" height="60" rx="30" fill="#FFFFFF" />
          <circle cx="120" cy="75" r="48" fill="#FFFFFF" />
          <circle cx="75" cy="95" r="38" fill="#FFFFFF" />
          <circle cx="165" cy="95" r="35" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};

// 8. 3D CRESCENT MOON & STARS (Night Atmosphere)
export const ThreeDMoon: React.FC<IconProps> = ({ size = 'md' }) => {
  const scaleMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    hero: 'w-36 h-36 sm:w-44 sm:h-44'
  };

  return (
    <div className={`relative flex items-center justify-center ${scaleMap[size]} transition-transform duration-700 hover:scale-105`}>
      <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl opacity-60 animate-pulse" />

      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_15px_30px_rgba(251,191,36,0.5)]">
        <defs>
          <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* 3D Moon Crescent */}
        <path
          d="M 140 30 C 70 30 30 80 30 140 C 30 170 50 185 60 180 C 15 130 55 55 140 45 C 150 43 150 30 140 30 Z"
          fill="url(#moonGrad)"
        />
        {/* Specular Highlight */}
        <path
          d="M 125 42 C 75 45 48 85 45 135 C 44 110 65 65 125 42 Z"
          fill="#FFFFFF"
          opacity="0.6"
        />

        {/* 3D Floating Clay Stars */}
        <g transform="translate(130, 80) scale(0.9)" className="animate-spin-slow origin-center" style={{ animationDuration: '30s' }}>
          <polygon points="25,5 31,18 45,18 34,27 38,40 25,32 12,40 16,27 5,18 19,18" fill="#FDE047" filter="drop-shadow(0 4px 6px rgba(234,179,8,0.6))" />
        </g>
        <g transform="translate(150, 130) scale(0.65)">
          <polygon points="25,5 31,18 45,18 34,27 38,40 25,32 12,40 16,27 5,18 19,18" fill="#FDE047" filter="drop-shadow(0 4px 6px rgba(234,179,8,0.6))" />
        </g>
      </svg>
    </div>
  );
};

// 9. 3D WIND / BREEZE (Cyan Aerodynamic Whirl Trails)
export const ThreeDWind: React.FC<IconProps> = ({ size = 'md' }) => {
  const scaleMap = {
    sm: 'w-14 h-10',
    md: 'w-24 h-16',
    lg: 'w-32 h-20',
    hero: 'w-44 h-28 sm:w-52 sm:h-36'
  };

  return (
    <div className={`relative flex items-center justify-center ${scaleMap[size]} transition-transform duration-700 hover:scale-105`}>
      <svg viewBox="0 0 240 140" className="w-full h-full drop-shadow-[0_10px_20px_rgba(56,189,248,0.4)]">
        <defs>
          <linearGradient id="windGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* Top Trail Swirl */}
        <path
          d="M 20 40 L 160 40 C 190 40 190 10 160 10 C 140 10 140 30 155 30"
          fill="none"
          stroke="url(#windGrad)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Middle Trail Swirl */}
        <path
          d="M 50 75 L 180 75 C 210 75 210 105 180 105 C 160 105 160 85 175 85"
          fill="none"
          stroke="url(#windGrad)"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Bottom Fast Streamline */}
        <path
          d="M 30 115 L 130 115"
          fill="none"
          stroke="url(#windGrad)"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
