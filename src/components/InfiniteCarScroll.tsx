import React from 'react';
import { MessageCircle, Flame, Star, BadgePercent } from 'lucide-react';
import { Car } from '../types';
import { CarIllustration } from './CarIllustration';

interface InfiniteCarScrollProps {
  cars: Car[];
}

export const InfiniteCarScroll: React.FC<InfiniteCarScrollProps> = ({ cars }) => {
  // Triple the list to ensure there is enough content to cover the width and loop seamlessly 
  const loopedCars = [...cars, ...cars, ...cars];

  return (
    <div className="relative w-full overflow-hidden py-4 select-none font-sans bg-black/10">
      
      {/* Absolute ambient lights behind the scrolling carousel */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-64 h-64 bg-accent-red/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-72 h-72 bg-[#D4A017]/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Grid Blueprint line background accent */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/[0.04] bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:30px_100%]" />
      
      {/* Continuous scrolling container */}
      <div className="relative flex w-full">
        <div 
          className="flex gap-6 py-6 px-4 animate-marquee hover:[animation-play-state:paused] active:cursor-grabbing"
          style={{
            width: 'max-content',
            willChange: 'transform',
          }}
        >
          {loopedCars.map((car, idx) => {
            // Generate a unique identifier key combining ID and duplicate index
            const uniqueKey = `${car.id}-infinite-${idx}`;
            
            return (
              <div
                key={uniqueKey}
                className="w-[280px] sm:w-[320px] flex-shrink-0 bg-neutral-900/90 border border-white/5 hover:border-accent-red/40 rounded overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.5)] transform hover:-translate-y-2 transition-all duration-300 group select-none relative"
              >
                {/* Brand / Blueprint Badge relative corner */}
                <div className="relative w-full aspect-[1.5] bg-black/40 overflow-hidden">
                  {car.isSold ? (
                    <span className="absolute top-3 left-3 z-10 bg-accent-red text-white text-[8px] font-black px-2 py-0.5 uppercase tracking-widest rounded shadow">
                      SOLD OUT
                    </span>
                  ) : car.badge !== 'NONE' ? (
                    <span className={`absolute top-3 left-3 z-10 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow flex items-center gap-1
                      ${car.badge === 'HOT' ? 'bg-accent-red text-white' : 'bg-neutral-950 text-slate-300 border border-white/10'}`}>
                      {car.badge === 'HOT' && <Flame className="w-2.5 h-2.5 text-white animate-pulse" />}
                      {car.badge === 'DISCOUNT' && <BadgePercent className="w-2.5 h-2.5 text-yellow-500" />}
                      {car.badge === 'BARU' && <Star className="w-2.5 h-2.5 text-blue-400 fill-blue-400" />}
                      {car.badge}
                    </span>
                  ) : null}

                  {/* CAD line aesthetics overlay on hover */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300 z-1" />
                  <CarIllustration type={car.image} brand={car.brand} isSold={car.isSold} />
                  
                  {/* Subtle coordinates stamp */}
                  <div className="absolute bottom-2 right-2 font-mono text-[6.5px] text-gray-500 tracking-wider bg-black/50 px-1 py-0.5 rounded">
                    JBM_LST_STK_{car.transmission}
                  </div>
                </div>

                {/* Content Details Block */}
                <div className="p-4 space-y-3 bg-[#0A0D14]/95 text-left border-t border-white/5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[8px] text-slate-400 tracking-widest uppercase">
                        {car.year} MODEL SPEC
                      </span>
                      <span className="text-[7.5px] font-mono text-gray-400 bg-white/5 px-1.5 py-0.2 rounded">
                        {car.transmission}
                      </span>
                    </div>
                    <h4 className="font-sans font-black text-xs sm:text-sm text-slate-100 group-hover:text-accent-red transition-colors duration-200 uppercase tracking-tight truncate">
                      {car.name}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400">
                      {car.fuelType} • {car.mileage.toLocaleString('id-ID')} KM
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
                    <div>
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Price Cash JBM</span>
                      <span className="font-sans font-black text-xs sm:text-sm text-accent-red">
                        Rp {car.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Action WA trigger */}
                    <a
                      href={`https://wa.me/6281330253797?text=Halo%20Jaya%20Berkat%20Mobil,%20saya%2520tertarik%2520dengan%2520unit%2520*${encodeURIComponent(car.name)}*%2520di%2520katalog%2520terbaru%2520beranda.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-neutral-900 border border-white/5 hover:border-accent-red hover:bg-accent-red text-slate-300 hover:text-white px-3 py-1.5 rounded text-[9.5px] font-mono uppercase tracking-wider font-bold transition-all duration-300"
                    >
                      <MessageCircle className="w-3 h-3 text-accent-red group-hover:text-white" />
                      <span>TANYA UNIT</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative slider edge fade vignettes which mimics high architectural lighting */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#060913] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#060913] to-transparent z-10" />
    </div>
  );
};
