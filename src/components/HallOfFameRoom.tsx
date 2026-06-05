import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import { 
  X, MessageCircle, MapPin, Star, Award, 
  ZoomIn, ZoomOut, RotateCcw, Hand, ExternalLink
} from 'lucide-react';
import { HallOfFameItem } from '../types';
import { optimizeImageUrl } from '../utils/imageOptimizer';

interface HallOfFameRoomProps {
  hallOfFameItems: HallOfFameItem[];
  setActiveTab: (tab: string) => void;
  onAddFromCms?: () => void;
}

// Helper to generate deterministic pseudo-random jitter offsets using sine hashes
const getDeterministicJitter = (index: number) => {
  const sinX = Math.sin(index * 12.9898 + 4.12) * 43758.5453;
  const sinY = Math.cos(index * 78.233 + 7.89) * 43758.5453;
  const sinR = Math.sin(index * 45.19 + 2.34) * 43758.5453;
  
  const jitterX = (sinX - Math.floor(sinX)) * 50 - 25; // ±25px offset
  const jitterY = (sinY - Math.floor(sinY)) * 40 - 20; // ±20px offset
  const jitterR = (sinR - Math.floor(sinR)) * 8 - 4;   // ±4deg rotation slant
  
  return { x: jitterX, y: jitterY, rotate: jitterR };
};

export const HallOfFameRoom: React.FC<HallOfFameRoomProps> = ({ 
  hallOfFameItems = [], 
  setActiveTab
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [is3D, setIs3D] = useState<boolean>(true); // Default to 3D perspective room for premium architectural vibe
  const [selectedItem, setSelectedItem] = useState<HallOfFameItem | null>(null);
  const [hasDragged, setHasDragged] = useState<boolean>(false);
  const [showDragHint, setShowDragHint] = useState<boolean>(true);

  // References for sizing calculations
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic container measurements to guarantee absolute centering
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 750 });
  const isInitialized = useRef<boolean>(false);

  // Dynamic canvas workspace dimensions that adapt to support up to 36, 50, or 100+ photos
  const itemsCount = hallOfFameItems.length || 1;
  const maxRadius = 260 + Math.sqrt(itemsCount) * 190;
  const CANVAS_WIDTH = Math.max(3000, maxRadius * 2 + 500);
  const CANVAS_HEIGHT = Math.max(1800, maxRadius * 2 + 500);

  // GPU-accelerated motion coordinates to achieve silky-smooth dragging without state updates
  const dragX = useMotionValue(-400);
  const dragY = useMotionValue(-200);

  const containerWidth = containerSize.width;
  const containerHeight = containerSize.height;

  // Mathematically complete bounds allowing 100% full visual coverage of every section.
  // This allows dragging the canvas edges all the way to center viewport without hitting limits.
  const dragBounds = {
    left: containerWidth / 2 - CANVAS_WIDTH,
    right: containerWidth / 2,
    top: containerHeight / 2 - CANVAS_HEIGHT,
    bottom: containerHeight / 2
  };

  // Monitor layout sizing
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Force center coordinates as soon as container gets defined layouts
  useEffect(() => {
    if (containerWidth > 0 && containerHeight > 0 && !isInitialized.current) {
      const centerX = (containerWidth - CANVAS_WIDTH) / 2;
      const centerY = (containerHeight - CANVAS_HEIGHT) / 2;
      dragX.set(centerX);
      dragY.set(centerY);
      isInitialized.current = true;
    }
  }, [containerWidth, containerHeight, CANVAS_WIDTH, CANVAS_HEIGHT]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 1.4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.65));
  
  const handleReset = () => {
    setZoom(1.0);
    if (containerWidth > 0 && containerHeight > 0) {
      const centerX = (containerWidth - CANVAS_WIDTH) / 2;
      const centerY = (containerHeight - CANVAS_HEIGHT) / 2;
      
      // Beautiful smooth spring interpolation to bring the layout back to center
      animate(dragX, centerX, { type: 'spring', stiffness: 95, damping: 18 });
      animate(dragY, centerY, { type: 'spring', stiffness: 95, damping: 18 });
    }
  };

  const handleCardClick = (item: HallOfFameItem, event: React.MouseEvent) => {
    if (hasDragged) {
      return;
    }
    setSelectedItem(item);
  };

  // Computes beautiful organic coordinates scattered outward in a modern golden spiral sunflower distribution
  const getCardCoordinates = (index: number) => {
    const cx = CANVAS_WIDTH / 2;
    const cy = CANVAS_HEIGHT / 2;
    
    // Golden spiral layout to prevent excessive overlap while creating an exquisite organic scatter
    const radiusStep = 195; // expands outward
    const goldenAngle = 2.39996; // 137.5 degrees in radians
    
    // Start with a small inner radius for index 0 and grow outward
    const r = 240 + Math.sqrt(index) * radiusStep;
    const theta = index * goldenAngle;
    
    let baseX = cx + Math.cos(theta) * r - 135;
    let baseY = cy + Math.sin(theta) * r - 162;
    
    const jitter = getDeterministicJitter(index);
    
    // Keep cards securely within safe bounds of our dynamic canvas size
    baseX = Math.max(300, Math.min(CANVAS_WIDTH - 600, baseX + jitter.x * 2.8));
    baseY = Math.max(300, Math.min(CANVAS_HEIGHT - 600, baseY + jitter.y * 2.8));
    
    return {
      x: baseX,
      y: baseY,
      rotate: jitter.rotate * 2.5, // ±10 degrees slants
      zIndex: 10 + (index % 15) // layered depth stack
    };
  };

  return (
    <div className="w-full h-[84vh] md:h-[88vh] min-h-[580px] bg-black text-white select-none relative overflow-hidden rounded-2xl border border-white/10 flex flex-col font-sans animate-fadeIn">
      
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* BACKGROUND DECORATION IN THE STYLE OF OH-ARCHITECTURE (BLACK, CAD GRID) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]" 
        style={{ 
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />


      {/* Draggable Exhibition stage starts immediately to benefit from minimalist global Navbar */}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* DRAGGABLE MAIN INTERACTIVE EXHIBITION STAGE */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div 
        ref={containerRef}
        className="w-full flex-grow relative overflow-hidden bg-black flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
        style={{
          perspective: is3D ? '1400px' : 'none',
          perspectiveOrigin: '50% 30%',
        }}
      >
        
        {/* Subtle center marker of the room */}
        <div className="absolute w-2 h-2 rounded-full bg-white/20 pointer-events-none" />

        {/* DRAGGABLE CANVAS PANEL */}
        <motion.div
          ref={canvasRef}
          drag
          dragMomentum={true}
          dragElastic={0.2}
          dragConstraints={dragBounds}
          onDragStart={() => {
            setHasDragged(true);
            setShowDragHint(false);
          }}
          onDragEnd={() => {
            // Delay clear drag state so it doesn't trigger card modal popup instantly
            setTimeout(() => setHasDragged(false), 50);
          }}
          className="absolute bg-black/40"
          style={{ 
            x: dragX,
            y: dragY,
            width: CANVAS_WIDTH, 
            height: CANVAS_HEIGHT,
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateX: is3D ? 18 : 0,
            rotateY: is3D ? -5 : 0,
            rotateZ: is3D ? 6 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 70,
            damping: 16
          }}
        >
          <div 
            className="w-full h-full relative transition-transform duration-300 origin-center"
            style={{ 
              transform: `scale(${zoom})`,
              transformStyle: 'preserve-3d'
            }}
          >
            
            {/* Embedded Luxury Architectural Vector lines linking frames (resembles CAD schematics) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.065]" xmlns="http://www.w3.org/2000/svg">
              {/* Draw connected blueprint wireframe path linking the items sequentially */}
              {hallOfFameItems.length > 1 && (
                <path 
                  d={hallOfFameItems.map((_, i) => {
                    const c = getCardCoordinates(i);
                    return `${i === 0 ? 'M' : 'L'} ${c.x + 135} ${c.y + 160}`;
                  }).join(' ')} 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="1.2" 
                  strokeDasharray="4 4" 
                />
              )}
              {hallOfFameItems.map((_, i) => {
                const c = getCardCoordinates(i);
                return (
                  <circle key={i} cx={c.x + 135} cy={c.y + 160} r="3.5" fill="#ffffff" />
                );
              })}
              
              {/* Car Side-View Outline layout vectors for CAD-theme look */}
              <g transform={`translate(${CANVAS_WIDTH - 650}, 220) scale(0.42)`} stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.35">
                {/* Generic sedan blueprint line diagram */}
                <path d="M0,80 L40,80 L80,50 L180,50 L240,80 L350,80 L370,120 L350,150 L20,150 L-30,120 Z" />
                <circle cx="60" cy="150" r="28" />
                <circle cx="280" cy="150" r="28" />
                <text x="120" y="110" fill="#ffffff" fontSize="20" fontFamily="monospace" letterSpacing="4">VERIFIED</text>
              </g>

              <g transform={`translate(220, ${CANVAS_HEIGHT - 380}) scale(0.55)`} stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.25">
                {/* Generic SUV blueprint line diagram */}
                <path d="M-50,60 L120,60 L200,10 L350,10 L420,70 L520,70 L540,140 L-50,140 Z" />
                <circle cx="50" cy="140" r="32" />
                <circle cx="400" cy="140" r="32" />
                <text x="140" y="100" fill="#ffffff" fontSize="18" fontFamily="monospace" letterSpacing="4">JBM CHASSIS TESTED</text>
              </g>
            </svg>

            {/* Scatter delivery frames visually across coordinates */}
            {hallOfFameItems.map((item, index) => {
              const coords = getCardCoordinates(index);
              
              return (
                <div
                  key={item.id}
                  className="absolute group select-none cursor-pointer pointer-events-auto"
                  style={{
                    left: coords.x,
                    top: coords.y,
                    transform: `rotate(${coords.rotate}deg)`,
                    transformStyle: 'preserve-3d',
                    zIndex: coords.zIndex,
                  }}
                  onMouseDown={(e) => e.stopPropagation()} // Avoid map dragging when pressing on card
                  onClick={(e) => handleCardClick(item, e)}
                >
                  
                  {/* ULTRA SLEEK PHYSICAL PHOTO FRAME DESIGN WITH 3D COMPATIBILITY */}
                  <motion.div 
                    className="w-[270px] bg-[#0d0d0d] border border-white/10 group-hover:border-white/40 p-3 pt-3 pb-6 shadow-[0_12px_28px_rgba(0,0,0,0.65)] relative"
                    animate={{
                      z: is3D ? 10 : 0,
                    }}
                    whileHover={{
                      z: is3D ? 45 : 15,
                      scale: 1.05,
                      boxShadow: is3D 
                        ? '0 30px 65px rgba(0,0,0,0.92)' 
                        : '0 20px 45px rgba(0,0,0,0.8)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 180,
                      damping: 18
                    }}
                  >
                    
                    {/* Tiny decorative white label label number */}
                    <div className="absolute top-4 left-4 z-10 bg-black/80 font-mono text-[7px] text-gray-500 uppercase px-1.5 py-0.5 border border-white/5 tracking-wider">
                      JBM_DELIVERY #{String(index + 1).padStart(3, '0')}
                    </div>

                    {/* Highly polished picture frame */}
                    <div className="w-full aspect-[4/3] overflow-hidden bg-[#0a0a0a] border border-white/5 relative">
                      <img 
                        src={optimizeImageUrl(item.imageUrl, 500, 70)} 
                        alt={item.name} 
                        className="w-full h-full object-cover filter brightness-[0.88] group-hover:brightness-100 transition-all duration-400"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Elegant, clean visual labels - typewriter mono text */}
                    <div className="pt-4.5 space-y-2 text-left">
                      <div className="space-y-0.5">
                        <span className="text-[7.5px] font-mono text-gray-500 uppercase tracking-widest block font-bold">CLIENT NAME</span>
                        <h3 className="font-sans font-black text-[12.5px] text-white tracking-wide uppercase truncate leading-tight">
                          {item.name}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-1 border-t border-white/5 pt-2 font-mono text-[8px] text-gray-400">
                        <div>
                          <span className="text-gray-600 block text-[6.5px] uppercase tracking-wider">UNIT DESIGNATION</span>
                          <span className="text-white font-black truncate block uppercase">{item.carName.replace('Toyota ', '').replace('Honda ', '')}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-600 block text-[6.5px] uppercase tracking-wider">LOCATIONED</span>
                          <span className="truncate block uppercase">{item.location.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                </div>
              );
            })}

          </div>
        </motion.div>

      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* FLOATING SUBTITLE FOOTER (BOTTOM LEFT): DESCRIPTION */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-6 left-6 z-40 text-left pointer-events-none hidden md:block">
        <p className="text-[10px] text-gray-500 max-w-sm leading-relaxed font-sans uppercase tracking-widest font-black text-left">
          A behind-the-scenes look at our happy client delivery moments. From rigorous chassis evaluations to official title document hands-over, this archive documents the honest smiles and ultimate confidence that characterize Jaya Berkat Mobil in Surabaya.
        </p>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* ZOOM AND MODE CONTROLS ON THE CENTER BOTTOM */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-black/90 border border-white/15 px-3.5 py-2 rounded-lg flex items-center justify-center gap-3.5 shadow-2xl backdrop-blur-md whitespace-nowrap animate-slideUp">
        
        {/* Architectural view selection */}
        <div className="flex bg-neutral-900/90 border border-white/5 p-0.5 rounded-md select-none">
          <button
            onClick={() => setIs3D(false)}
            className={`px-3 py-1 rounded text-[8.5px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${!is3D ? 'bg-white text-black' : 'text-gray-400 hover:text-white bg-transparent'}`}
          >
            2D Plan
          </button>
          <button
            onClick={() => setIs3D(true)}
            className={`px-3 py-1 rounded text-[8.5px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${is3D ? 'bg-white text-black' : 'text-gray-400 hover:text-white bg-transparent'}`}
          >
            3D Room
          </button>
        </div>

        <div className="w-[1.2px] h-4 bg-white/10" />

        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Zoom: {Math.round(zoom * 100)}%</span>
        
        <div className="w-[1.2px] h-4 bg-white/10" />

        <button 
          onClick={handleZoomOut} 
          disabled={zoom <= 0.65}
          title="Zoom Out"
          className="hover:bg-white/5 p-1 rounded text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={handleReset} 
          title="Reset View"
          className="hover:bg-white/5 p-1 rounded text-slate-300 hover:text-white cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 hover:text-red-400" />
        </button>
        <button 
          onClick={handleZoomIn} 
          disabled={zoom >= 1.4}
          title="Zoom In"
          className="hover:bg-white/5 p-1 rounded text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* REPLICATING THE OH-ARCHITECTURE DRAG INSTRUCTIONS HUB BLOCK (BOTTOM RIGHT) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-6 right-6 z-40 pointer-events-none sm:pointer-events-auto">
        <div className="bg-black/95 border border-white/20 p-2.5 rounded-lg flex flex-col items-center gap-2 max-w-[170px] shadow-2xl">
          
          {/* Animated visual tracking outline simulating mouse coordinate interactions */}
          <div className="w-32 h-16 bg-[#050505] rounded border border-white/5 relative overflow-hidden flex items-center justify-center">
            
            {/* Fine drafting wireframes in grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#151515_1px,transparent_1px),linear-gradient(to_bottom,#151515_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
            
            {/* Animated floating cursor circle hand */}
            <motion.div 
              animate={{ x: [-20, 20, -20] }} 
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute"
            >
              <Hand className="w-4 h-4 text-gray-400 opacity-60" />
            </motion.div>
          </div>

          <span className="text-[7.5px] font-mono font-black text-gray-400 tracking-wider text-center flex flex-col leading-tight uppercase select-none">
            <span>CLICK + HOLD YOUR MOUSE</span>
            <span className="text-white mt-0.5">TO DRAG AND EXPLORE</span>
          </span>

        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* LIGHTBOX POPUP DETAILS OVERLAY */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn">
          
          {/* Backdrop layer closes details */}
          <div className="absolute inset-0" onClick={() => setSelectedItem(null)} />
          
          {/* Modal box */}
          <div className="relative max-w-xl w-full bg-[#050505] border border-white/25 rounded-xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.95)] p-5 space-y-4 animate-scaleUp text-left">
            
            {/* Corner Close trigger */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 bg-black hover:bg-red-950 border border-white/10 hover:border-white/40 text-gray-400 hover:text-white p-1.5 rounded transition-all z-20 cursor-pointer shadow"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Showcase title/image */}
            <div className="w-full h-64 bg-black rounded-lg overflow-hidden relative border border-white/15">
              <img 
                src={optimizeImageUrl(selectedItem.imageUrl, 1000, 85)} 
                alt={selectedItem.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-4">
                
                <div className="flex items-center gap-0.5 mb-1 text-yellow-500">
                  {[...Array(selectedItem.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 stroke-none" />
                  ))}
                </div>

                <div className="text-[8.5px] font-mono text-gray-400 tracking-widest uppercase flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-yellow-500" /> JBM CERTIFIED PATRON
                </div>
                
                <h3 className="font-sans font-black text-lg text-white uppercase tracking-wide leading-tight mt-0.5">
                  {selectedItem.name}
                </h3>
              </div>
            </div>

            {/* Testimonial written review text blocks */}
            <div className="space-y-4">
              <div className="p-3.5 bg-neutral-900/60 border border-white/10 rounded-lg text-left relative">
                <span className="text-2xl font-serif text-white opacity-20 absolute top-1 left-2">“</span>
                <p className="text-xs text-gray-300 italic leading-relaxed pl-4 pr-2 font-sans font-medium">
                  {selectedItem.quote}
                </p>
              </div>

              {/* Technical indicators specs bar */}
              <div className="grid grid-cols-2 gap-3 pt-0.5 font-mono text-[9px]">
                <div className="bg-neutral-900/40 border border-white/5 rounded-lg p-2">
                  <span className="text-gray-500 uppercase block text-[7px]">CERTIFIED UNIT HANDOVER</span>
                  <span className="text-white font-black uppercase mt-0.5 block truncate">{selectedItem.carName}</span>
                </div>
                <div className="bg-neutral-900/40 border border-white/5 rounded-lg p-2">
                  <span className="text-gray-500 uppercase block text-[7px]">OFFICIAL REGISTRATION DATE</span>
                  <span className="text-white mt-0.5 block">{selectedItem.date}</span>
                </div>
              </div>

              {/* Buttons and WhatsApp Consultation details */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-white/10 font-mono text-[9px]">
                <span className="text-gray-500 flex items-center gap-1.5 font-black">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  PROVING GROUNDS: {selectedItem.location.toUpperCase()}
                </span>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="border border-white/10 hover:border-white/40 text-gray-400 hover:text-white px-3.5 py-1.5 rounded transition-all cursor-pointer uppercase font-bold"
                  >
                    Close
                  </button>
                  <a
                    href={`https://wa.me/6281330253797?text=Halo%20Jaya%20Berkat%20Mobil,%20saya%20tertarik%20dengan%20serah%20terima%20unit%20*${encodeURIComponent(selectedItem.name)}*%20yang%20puas%20membeli%20*${encodeURIComponent(selectedItem.carName)}*!%20Bisa%20berkonsultasi?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-white hover:bg-neutral-200 text-black px-4 py-1.5 rounded font-black transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>CONSULT SALES (WA)</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
