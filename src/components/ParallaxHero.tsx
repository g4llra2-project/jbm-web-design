import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageCircle, Ruler, Sparkles } from 'lucide-react';
import { HeroData, Car } from '../types';

interface ParallaxHeroProps {
  heroData: HeroData;
  highlightCar?: Car;
  setActiveTab: (tab: string) => void;
}

export const ParallaxHero: React.FC<ParallaxHeroProps> = ({
  heroData,
  highlightCar,
  setActiveTab,
}) => {
  const [scrollY, setScrollY] = useState(0);
  
  // Track mouse coordinates for elegant micro-hover 3D perspective feedback on text/cards
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth) - 0.5;
      const y = (clientY / innerHeight) - 0.5;
      setMousePosition({ x, y });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Parallax calculations (smoothly translate bg image slower than scroll speed)
  const bgTranslateY = scrollY * 0.45;
  const contentFadeOut = Math.max(0, 1 - scrollY / 650);
  const contentTranslateY = scrollY * 0.15;
  
  // Micro translations for 3D layout feel based on mouse hover coordinates
  const hoverX = mousePosition.x * 20;
  const hoverY = mousePosition.y * 20;

  // Epic cinematic premium automotive background image (ambient studio dark lighting)
  const heroBg = heroData.backgroundImage || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=2000&q=90";

  return (
    <div className="relative w-full h-[100vh] min-h-[650px] bg-black overflow-hidden z-0 sticky top-0 font-sans select-none">
      
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 1. CINEMATIC FULL SCREEN BACKGROUND WITH PARALLAX TRANSLATION */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div 
        className="absolute inset-0 w-full h-full scale-[1.1]"
        style={{
          transform: `translateY(${bgTranslateY}px) translateZ(0)`,
          willChange: 'transform',
        }}
      >
        <img 
          referrerPolicy="no-referrer"
          src={heroBg} 
          alt="JBM Studio Premium Automotive Canvas"
          className="w-full h-full object-cover opacity-60"
        />
        
        {/* Deep architectural ambient vignette overlays for immaculate text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-black/45 to-black/35 z-1" />
        <div className="absolute inset-0 bg-black/20 z-1" />
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 2. VECTOR ARCHITECTURAL SCHEMATIC LINES */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.045] z-10" xmlns="http://www.w3.org/2000/svg">
        <line x1="12%" y1="0" x2="12%" y2="100%" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="88%" y1="0" x2="88%" y2="100%" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="12%" cy="40%" r="5" stroke="#ffffff" strokeWidth="1" fill="none" />
        <circle cx="88%" cy="75%" r="5" stroke="#ffffff" strokeWidth="1" fill="none" />
      </svg>



      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 4. MAIN INTERACTIVE FOREGROUND DESIGN */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div 
        className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-end pb-16 sm:pb-24 lg:pb-28"
        style={{
          opacity: contentFadeOut,
          transform: `translateY(${contentTranslateY}px) translateZ(0)`,
          willChange: 'transform, opacity',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          
          {/* L.H.S: BRAND ELEVATION AND TITLE SPACING */}
          <div 
            className="lg:col-span-7 space-y-6 text-left transition-transform duration-300"
            style={{
              transform: `translate3d(${hoverX * 0.4}px, ${hoverY * 0.4}px, 0)`
            }}
          >
            {/* Elegant architect capsule tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/90 border border-white/10 rounded backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
              <span className="text-gray-300 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-black">
                {heroData.badgeText || 'DEALER TERPERCAYA SURABAYA'}
              </span>
            </div>

            {/* Architectural Large typography pairing */}
            <div className="space-y-3">
              <span className="block font-mono text-[10px] tracking-[0.4em] text-gray-400 font-normal uppercase">
                / JAYA BERKAT MOBIL
              </span>
              <h1 className="font-sans font-black text-4xl sm:text-6xl lg:text-7xl text-white leading-[1.02] uppercase tracking-tight">
                {heroData.titlePrimary} <br />
                <span className="text-accent-red relative inline-block">
                  {heroData.titleSecondary}
                  <span className="absolute bottom-1 right-0 left-0 h-[2px] bg-accent-red opacity-50" />
                </span>
              </h1>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-lg font-light font-sans tracking-wide">
              {heroData.description || 'Pusat showroom jual beli mobil premium bergaransi di Surabaya Barat. Setiap unit diforward melewati inspeksi detail dari team ahli bersertifikat JBM.'}
            </p>

            {/* Custom crafted architect style outlines for action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 pointer-events-auto">
              <button
                onClick={() => setActiveTab('mobil-dijual')}
                className="flex items-center justify-center gap-3 bg-white hover:bg-neutral-900 text-black hover:text-white border border-white px-8 py-3.5 rounded text-[11px] font-mono uppercase tracking-[0.18em] font-black transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer shadow-[0_20px_45px_rgba(0,0,0,0.55)]"
              >
                <span>{heroData.ctaTextPrimary || 'LIHAT KATALOG'}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <a
                href="https://wa.me/6281330253797?text=Halo%2520Jaya%2520Berkat%2520Mobil,%2520saya%2520tertarik%2520dengan%2520katalog%2520mobil%2520premiumnya."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-black/80 hover:bg-white text-white hover:text-black border border-white/10 hover:border-white px-8 py-3.5 rounded text-[11px] font-mono uppercase tracking-[0.18em] font-black transition-all duration-300 transform hover:-translate-y-0.5 backdrop-blur-md"
              >
                <MessageCircle className="w-3.5 h-3.5 text-accent-red" />
                <span>{heroData.ctaTextSecondary || 'HUBUNGI KAMI'}</span>
              </a>
            </div>

            {/* Architectural specification footnotes */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-[10px] sm:text-[11px] font-mono text-gray-500 border-t border-white/10 max-w-lg">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-accent-red" />
                <span>100% INDEPENDENT INSPECTED</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>PREMIUM SHOWROOM SERVICE</span>
              </div>
            </div>
          </div>

          {/* R.H.S: ROTATING AND HOVERING CAD BLUEPRINT HIGHLIGHT CARD */}
          {highlightCar && (
            <div 
              className="lg:col-span-5 w-full max-w-sm ml-auto select-none hidden lg:block pointer-events-auto"
              style={{
                transform: `translate3d(${hoverX * -0.6}px, ${hoverY * -0.6}px, 0)`
              }}
            >
              <div className="bg-black/85 border border-white/10 hover:border-white/25 rounded-lg p-5 space-y-4 shadow-[0_30px_70px_rgba(0,0,0,0.95)] backdrop-blur-md relative overflow-hidden transition-all duration-300">
                
                {/* Visual CAD-themed crosshair accents */}
                <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-white/20" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-white/20" />
                
                <div className="flex justify-between items-center pb-2.5 border-b border-white/5 font-mono text-[9px] text-gray-400">
                  <span className="uppercase tracking-widest text-[8px] text-accent-red font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-ping" />
                    HOT UNIT SPOTLIGHT
                  </span>
                  <span>STOCK_ID: JBM_{highlightCar.id.toUpperCase().slice(0, 5)}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none">
                    ENGINE SPECIFICATION // {highlightCar.year}
                  </div>
                  <h3 className="font-sans font-black text-xl text-white uppercase tracking-tight">
                    {highlightCar.name}
                  </h3>
                  <div className="flex items-center gap-2 font-mono text-[9px] text-gray-400 pt-1">
                    <span className="bg-white/5 px-2 py-0.5 rounded uppercase">{highlightCar.fuelType}</span>
                    <span>•</span>
                    <span className="bg-white/5 px-2 py-0.5 rounded uppercase">{highlightCar.transmission}</span>
                    <span>•</span>
                    <span>{highlightCar.mileage.toLocaleString('id-ID')} KM</span>
                  </div>
                </div>

                {/* Micro CAD details block */}
                <div className="bg-neutral-900/50 border border-white/5 p-3 rounded font-mono text-[9px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">TRANSMISSION RATIO:</span>
                    <span className="text-gray-300 font-bold">{highlightCar.transmission === 'AT' ? 'AUTOMATIC SPEED' : 'MANUAL CLUTCH'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">POWER CYLINDERS:</span>
                    <span className="text-gray-300 font-bold">{highlightCar.engineCc || '2.0L / 4-CYL'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">JBM ACCREDITATION:</span>
                    <span className="text-emerald-500 font-bold">GRADE A+ VERIFIED</span>
                  </div>
                </div>

                {/* Price and Action inside Spotlight */}
                <div className="flex items-center justify-between pt-2.5 font-sans">
                  <div>
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Cash JBM Price</span>
                    <p className="text-lg font-black text-accent-red leading-none mt-1">
                      Rp {highlightCar.price.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/6281330253797?text=Halo%2520Jaya%2520Berkat%2520Mobil,%2520apakah%2520stok%252520highlight%252520*${encodeURIComponent(highlightCar.name)}*%2520masih%2520ready?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-neutral-900 hover:bg-accent-red text-slate-200 hover:text-white border border-white/10 hover:border-accent-red px-4 py-2 rounded text-[10px] font-mono uppercase tracking-wider font-extrabold transition-all duration-300"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-accent-red hover:text-white" />
                    <span>TANYA SALES</span>
                  </a>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
