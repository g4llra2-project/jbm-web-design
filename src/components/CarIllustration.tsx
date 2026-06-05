import React, { useState } from 'react';
import { optimizeImageUrl } from '../utils/imageOptimizer';

interface CarIllustrationProps {
  type: string;
  brand: string;
  isSold?: boolean;
}

// Highly specific, premium curated Unsplash images for popular family cars
const CAR_PRESETS: Record<string, string> = {
  innova: "https://images.unsplash.com/photo-1606016159991-dfe4f974be5c?auto=format&fit=crop&w=800&q=80", // Premium Family MPV/SUV (Sleek dark vehicle angle)
  jazz: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80", // Sporty hatchback speed
  veloz: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80", // Modern MPV/Van
  xpander: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80", // Modern family SUV profile
  fortuner: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80", // Powerful Big black SUV
  brio: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80", // Sporty compact hatchback
};

export const CarIllustration: React.FC<CarIllustrationProps> = ({ type, brand, isSold = false }) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Determine if type is a valid URL or fits our preset keys
  const isUrl = type.startsWith('http://') || type.startsWith('https://');
  const imageUrl = isUrl ? type : (CAR_PRESETS[type.toLowerCase()] || null);

  // If we have a valid image and it hasn't failed to load, render the gorgeous real photo!
  if (imageUrl && !imageFailed) {
    return (
      <div className="relative w-full h-44 bg-navy-deep flex items-center justify-center overflow-hidden group border-b border-navy-light/30">
        
        {/* Real Car Image */}
        <img
          src={optimizeImageUrl(imageUrl, 450, 70)}
          alt={`${brand} ${type}`}
          onError={() => setImageFailed(true)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isSold ? 'opacity-40 grayscale blur-[1px]' : 'opacity-90 group-hover:opacity-100'
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />

        {/* Elegant overlay shadow on bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* Subtle branded watermark */}
        <div className="absolute bottom-2 left-3 flex items-center gap-1.5 font-sans">
          <div className="w-1.5 h-1.5 bg-accent-red rounded-full animate-pulse" />
          <span className="text-[9px] text-slate-300 tracking-wider font-bold uppercase transition-colors group-hover:text-white">
            ★ CERTIFIED BY JBM ★
          </span>
        </div>

        {/* Branded watermark right side */}
        <div className="absolute bottom-2 right-3 font-sans opacity-70">
          <span className="text-[8.5px] text-slate-400 font-mono font-bold tracking-widest">
            {brand.toUpperCase()} SERIES
          </span>
        </div>

        {/* Sold layer visual */}
        {isSold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="border-2 border-red-500 text-red-500 font-black tracking-widest text-xs px-3 py-1 uppercase rounded rotate-[-12deg] shadow-lg animate-pulse">
              SOLD OUT / TERJUAL
            </span>
          </div>
        )}
      </div>
    );
  }

  // FALLBACK: The beautiful vector SVG drawings (kept so that there are never broken images, and can act as premium loader)
  return (
    <div className={`relative w-full h-44 bg-[#000814]/40 border-b border-navy-light/30 flex items-center justify-center overflow-hidden group-hover:bg-[#1A253C]/30 transition-colors duration-300`}>
      {/* Abstract light shine effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-red-600/10 to-transparent pointer-events-none" />
      
      {/* Dynamic Grid Background for technical dealer vibe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />

      <svg
        viewBox="0 0 200 100"
        className={`w-40 h-24 transform transition-transform duration-500 group-hover:scale-105 ${isSold ? 'opacity-40 grayscale' : 'opacity-85'}`}
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E74C3C" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F0C040" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Headlight beam */}
        {!isSold && (
          <path
            d="M 15 52 L -30 35 L -30 75 Z"
            fill="url(#glowGrad)"
            opacity="0.35"
          />
        )}

        {/* Wheels shadow */}
        <ellipse cx="55" cy="73" rx="18" ry="3" fill="#000" opacity="0.6" />
        <ellipse cx="145" cy="73" rx="18" ry="3" fill="#000" opacity="0.6" />

        {/* Outer Shadow */}
        <ellipse cx="100" cy="75" rx="70" ry="6" fill="#000" opacity="0.3" />

        {/* Wheels */}
        {/* Rear Wheel */}
        <circle cx="55" cy="68" r="14" fill="#000a12" stroke="#2D3748" strokeWidth="2.5" />
        <circle cx="55" cy="68" r="7" fill="#F0C040" opacity="0.8" />
        <circle cx="55" cy="68" r="3" fill="#FFF" />

        {/* Front Wheel */}
        <circle cx="145" cy="68" r="14" fill="#000a12" stroke="#2D3748" strokeWidth="2.5" />
        <circle cx="145" cy="68" r="7" fill="#F0C040" opacity="0.8" />
        <circle cx="145" cy="68" r="3" fill="#FFF" />

        {/* Car Body Silhouette depending on brand/size */}
        {type.toLowerCase() === 'jazz' || type.toLowerCase() === 'brio' ? (
          // Hatchback silhouette
          <g>
            <path
              d="M 30 68 L 30 52 C 30 45, 38 43, 44 42 L 72 38 C 76 34, 85 24, 100 24 L 140 24 C 150 24, 160 38, 168 45 L 175 52 C 180 55, 180 64, 172 68 Z"
              fill="url(#bodyGrad)"
              stroke="#FFF"
              strokeWidth="1.5"
              strokeOpacity="0.15"
            />
            {/* Windows */}
            <path
              d="M 75 39 L 98 28 L 122 28 L 132 39 Z"
              fill="#101C33"
              stroke="#F0C040"
              strokeWidth="0.8"
              opacity="0.75"
            />
            <path
              d="M 135 39 L 144 28 L 152 39 Z"
              fill="#101C33"
              stroke="#F0C040"
              strokeWidth="0.8"
              opacity="0.75"
            />
          </g>
        ) : type.toLowerCase() === 'fortuner' || type.toLowerCase() === 'innova' ? (
          // Large SUV/MPV
          <g>
            <path
              d="M 24 68 L 24 48 C 24 42, 32 38, 38 38 L 65 37 L 85 22 L 155 22 C 165 22, 172 30, 175 42 L 178 55 C 182 60, 178 68, 170 68 Z"
              fill="url(#bodyGrad)"
              stroke="#FFF"
              strokeWidth="1.5"
              strokeOpacity="0.15"
            />
            {/* Windows */}
            <path
              d="M 68 37 L 84 26 L 115 26 L 115 37 Z"
              fill="#101C33"
              stroke="#F0C040"
              strokeWidth="0.8"
              opacity="0.75"
            />
            <path
              d="M 119 37 L 119 26 L 150 26 L 155 37 Z"
              fill="#101C33"
              stroke="#F0C040"
              strokeWidth="0.8"
              opacity="0.75"
            />
          </g>
        ) : (
          // Sedan/Standard MPV (Veloz/Xpander)
          <g>
            <path
              d="M 22 68 L 22 52 C 22 48, 30 45, 36 43 L 58 41 C 68 34, 82 24, 102 24 L 148 24 C 158 24, 168 36, 172 45 L 178 52 C 182 56, 180 68, 168 68 Z"
              fill="url(#bodyGrad)"
              stroke="#FFF"
              strokeWidth="1.5"
              strokeOpacity="0.15"
            />
            {/* Windows */}
            <path
              d="M 64 42 L 80 28 L 112 28 L 114 42 Z"
              fill="#101C33"
              stroke="#F0C040"
              strokeWidth="0.8"
              opacity="0.8"
            />
            <path
              d="M 118 42 L 118 28 L 144 28 L 152 42 Z"
              fill="#101C33"
              stroke="#F0C040"
              strokeWidth="0.8"
              opacity="0.8"
            />
          </g>
        )}

        {/* Headlight Led Bulb */}
        {!isSold && (
          <circle cx="28" cy="53" r="3" fill="#FFF" filter="url(#glow)" />
        )}

        {/* Taillight Led */}
        <path d="M 174 52 Q 176 54 174 56" stroke="#E74C3C" strokeWidth="2.5" fill="none" />

        {/* Decorative Grid Specs Overlay inside badge */}
        <text
          x="100"
          y="60"
          fontFamily="monospace"
          fontSize="8"
          fill="#FFF"
          textAnchor="middle"
          opacity="0.1"
          fontWeight="bold"
        >
          {brand.toUpperCase()} ENGINE READY
        </text>

        {/* Showroom Stamp Overlay */}
        <rect x="75" y="81" width="50" height="8" rx="1" fill="#132442" opacity="0.3" stroke="#F0C040" strokeWidth="0.5" />
        <text
          x="100"
          y="87"
          fontFamily="sans-serif"
          fontSize="5"
          fill="#F0C040"
          textAnchor="middle"
          fontWeight="bold"
        >
          ★ CERTIFIED BY JBM ★
        </text>
      </svg>

      {/* SOLD badge visual indicator */}
      {isSold && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
          <span className="border-2 border-red-500 text-red-500 font-black tracking-widest text-xs px-3 py-1 uppercase rounded rotate-[-12deg] shadow-lg animate-pulse">
            SOLD OUT / TERJUAL
          </span>
        </div>
      )}
    </div>
  );
};
