import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, ArrowRight, Phone, MessageCircle, MapPin, 
  Search, Shield, Star, Award, Users, Calendar, 
  Play, ExternalLink, Mail, UserCheck, ChevronRight, X,
  Clock, Copy, Map, Compass, Heart, RefreshCw, SlidersHorizontal, Sliders, Sparkles
} from 'lucide-react';
import { CMSData, Car } from '../types';
import { CarIllustration } from './CarIllustration';
import { HallOfFameRoom } from './HallOfFameRoom';
import { ParallaxHero } from './ParallaxHero';
import { InfiniteCarScroll } from './InfiniteCarScroll';
import { optimizeImageUrl } from '../utils/imageOptimizer';
import { CarDetailModal } from './CarDetailModal';

const GALLERY_IMAGE_MAP: Record<string, string> = {
  showroom_wiyung: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80", // Interior Luxury Showroom
  stock_range: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80", // Rows of premium family SUVS
  delivery_veloz: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80", // Handshake client
  delivery_innova: "https://images.unsplash.com/photo-1492551557933-34265f7af79e?auto=format&fit=crop&w=1200&q=80", // Deal discussion/smile
  showroom_dtc: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80", // Mall showroom
  event_jbm: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=1200&q=80" // Client consulting with advisor
};

const getGalleryImageUrl = (img: string): string => {
  if (img.startsWith('http://') || img.startsWith('https://')) {
    return img;
  }
  return GALLERY_IMAGE_MAP[img] || "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80";
};

interface DashboardProps {
  cmsData: CMSData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cmsOpen?: boolean;
  setCmsOpen?: (open: boolean) => void;
  theme?: 'dark' | 'light';
  darkVariant?: 'slate' | 'abyss' | 'obsidian';
  setDarkVariant?: (variant: 'slate' | 'abyss' | 'obsidian') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  cmsData, 
  activeTab, 
  setActiveTab,
  cmsOpen,
  setCmsOpen,
  theme = 'dark',
  darkVariant = 'slate',
  setDarkVariant
}) => {
  // Filters for Catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedTrans, setSelectedTrans] = useState('All');
  const [priceRange, setPriceRange] = useState<number>(500000000); // Max budget filter
  const [selectedBodyType, setSelectedBodyType] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'year-new' | 'mileage-low'>('default');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jbm_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (carId: string) => {
    setFavorites(prev => {
      const isAlready = prev.includes(carId);
      const updated = isAlready ? prev.filter(id => id !== carId) : [...prev, carId];
      try {
        localStorage.setItem('jbm_favorites', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Filter for Gallery
  const [galleryCategory, setGalleryCategory] = useState<string>('All');
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  // Active blog detail model
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  // Dynamic article SEO helper hook
  useEffect(() => {
    if (activeArticleId) {
      const art = cmsData.articles.find(a => a.id === activeArticleId);
      if (art) {
        const originalTitle = document.title;
        
        // Locate or build meta description tag
        let metaDescription = document.querySelector('meta[name="description"]');
        const originalDescription = metaDescription ? metaDescription.getAttribute('content') : '';

        // Prioritize article custom SEO values, with smart fallback to standard article fields
        const newTitle = art.seoTitle?.trim() || `${art.title} | JBM Surabaya Blog`;
        const newDescription = art.seoDescription?.trim() || 
          (art.content ? art.content.slice(0, 155).replace(/[#*_]/g, '') + '...' : '');

        document.title = newTitle;
        if (metaDescription) {
          metaDescription.setAttribute('content', newDescription);
        } else {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          metaDescription.setAttribute('content', newDescription);
          document.head.appendChild(metaDescription);
        }

        // Return cleanup to restore original page tags on modal dismiss
        return () => {
          document.title = originalTitle;
          if (metaDescription && originalDescription) {
            metaDescription.setAttribute('content', originalDescription);
          }
        };
      }
    }
  }, [activeArticleId, cmsData.articles]);

  // Selected car for spec detail card/modal
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Contact form submission local state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedBranch, setCopiedBranch] = useState<'wiyung' | 'dtc' | null>(null);
  const [activeMapTab, setActiveMapTab] = useState<'wiyung' | 'dtc'>('wiyung');

  // Form submission handler
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) {
      alert('Nama dan Nomor HP wajib diisi!');
      return;
    }
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      // Construct WhatsApp URL
      const text = `Halo Jaya Berkat Mobil, saya ${contactName} (${contactPhone}). Ingin menanyakan: ${contactMessage}`;
      window.open(`https://wa.me/6281330253797?text=${encodeURIComponent(text)}`, '_blank');
      // Reset
      setContactName('');
      setContactPhone('');
      setContactMessage('');
    }, 1000);
  };

  // Get dynamic unique brands loaded in stock
  const availableBrands = ['All', ...Array.from(new Set(cmsData.cars.map(c => c.brand)))];

  const getBodyType = (car: Car) => {
    const name = car.name.toLowerCase();
    if (name.includes('brio') || name.includes('ayla') || name.includes('jazz')) return 'Hatchback';
    if (name.includes('fortuner') || name.includes('pajero') || name.includes('mux') || name.includes('hrv') || name.includes('xpander')) return 'SUV';
    if (name.includes('innova') || name.includes('avanza') || name.includes('ertiga') || name.includes('hiace') || name.includes('veloz') || name.includes('vellfire')) return 'MPV/Van';
    return 'Lainnya';
  };

  // Filter stock mobilization
  const filteredCars = cmsData.cars
    .filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            car.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === 'All' || car.brand === selectedBrand;
      const matchesTrans = selectedTrans === 'All' || car.transmission === selectedTrans;
      const matchesPrice = car.price <= priceRange;
      const matchesAvailable = !onlyAvailable || !car.isSold;
      const matchesBodyType = selectedBodyType === 'All' || getBodyType(car) === selectedBodyType;
      return matchesSearch && matchesBrand && matchesTrans && matchesPrice && matchesAvailable && matchesBodyType;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'year-new') return b.year - a.year;
      if (sortBy === 'mileage-low') return a.mileage - b.mileage;
      return 0; // default
    });

  // Highlight car based on ID from CMS
  const heroHighlightCar = cmsData.cars.find(c => c.id === cmsData.hero.highlightUnitId) || cmsData.cars[0];

  return (
    <div className="bg-navy-deep text-slate-200">
      
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* SECTION: BERANDA (HOME PAGE) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'beranda' && (
        <div className="relative animate-fadeIn bg-navy-deep">
          
          {/* THE STICKY FULL SCREEN HERO */}
          <ParallaxHero 
            heroData={cmsData.hero} 
            highlightCar={heroHighlightCar} 
            setActiveTab={setActiveTab} 
          />

          {/* CURTAIN OVERLAY CONTAINER - Slides up over the sticky hero */}
          <div className="relative z-10 bg-navy-deep border-t border-white/10 shadow-[0_-30px_60px_rgba(0,0,0,0.95)] space-y-16 pb-20 pt-16">
            
            {/* QUICK TRUST STATISTICS */}
          <section className="px-4 sm:px-6 lg:px-8 border-y border-navy-light py-8 bg-navy-card/40 font-sans">
            <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
              {cmsData.stats.map((stat, i) => (
                <div key={stat.id} className="flex items-center gap-4 py-2 px-4 justify-center md:justify-start border-b md:border-b-0 md:border-r border-navy-light last:border-0">
                  <div className="w-12 h-12 bg-navy-deep border border-navy-light rounded-md flex items-center justify-center text-accent-red shadow-lg shadow-red-950/10">
                    {stat.icon === 'car' && <CheckCircle2 className="w-6 h-6" />}
                    {stat.icon === 'calendar' && <Calendar className="w-6 h-6 sm:-rotate-6" />}
                    {stat.icon === 'map-pin' && <MapPin className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className="block font-sans font-black text-3xl text-slate-100 tracking-tight leading-none uppercase">
                      {stat.value}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-sans font-bold leading-none mt-1.5 block">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* DYNAMIC CAR CATALOG PREVIEW (Stok Terbaru) */}
          <section className="px-4 sm:px-6 lg:px-8 font-sans">
            <div className="mx-auto max-w-7xl space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-mono text-accent-red uppercase tracking-[0.25em] font-bold block mb-1">
                    STOK TERBARU JBM
                  </span>
                  <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-100 uppercase tracking-tight">
                    Pilihan unit siap pakai
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('mobil-dijual')}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400 hover:text-accent-red transition-colors"
                >
                  <span>Lihat semua</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Infinite continuous ticker marquee showcasing all premium ready stocks */}
              <InfiniteCarScroll cars={cmsData.cars} />
            </div>
          </section>

          {/* EXCELLENCE POINTS (Kenapa Pilih Kami) */}
          <section className="px-4 sm:px-6 lg:px-8 font-sans">
            <div className="mx-auto max-w-7xl bg-navy-card/40 border border-navy-light rounded-lg p-8 sm:p-12 space-y-10">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-[10px] font-mono text-accent-red uppercase tracking-[0.25em] font-bold">
                  KEUNGGULAN KAMI
                </span>
                <h3 className="font-sans font-black text-2xl sm:text-3xl text-slate-100 uppercase tracking-tight">
                  Kenapa pilih Jaya Berkat Mobil?
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cmsData.dnaList.slice(0, 3).map((dna) => (
                  <div key={dna.id} className="bg-navy-deep border border-navy-light rounded p-5 space-y-3 relative overflow-hidden hover:border-accent-red/50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-navy-card border border-navy-light rounded flex items-center justify-center text-xl shadow">
                      {dna.icon}
                    </div>
                    <h4 className="font-sans font-black text-sm text-accent-red uppercase tracking-wide">
                      {dna.title}
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed font-sans">
                      {dna.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CUSTOMER TESTIMONIALS (Kata Mereka Yang Sudah Beli) */}
          <section className="px-4 sm:px-6 lg:px-8 font-sans">
            <div className="mx-auto max-w-7xl space-y-8">
              <div>
                <span className="text-[10px] font-mono text-accent-red uppercase tracking-[0.25em] font-bold block mb-1">
                  TESTIMONI PEMBELI
                </span>
                <h3 className="font-sans font-black text-2xl sm:text-3xl text-slate-100 uppercase tracking-tight">
                  Kata mereka yang sudah beli
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cmsData.testimonials.map((test) => (
                  <div key={test.id} className="bg-navy-card border border-navy-light p-5 rounded space-y-4 shadow-lg hover:border-accent-red/30 transition-colors duration-205">
                    <div className="flex gap-1">
                      {Array.from({ length: test.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-accent-red text-accent-red" />
                      ))}
                    </div>
                    <p className="text-slate-300 text-xs italic leading-relaxed font-sans">
                      &ldquo;{test.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-2 border-t border-navy-light">
                      <div className="w-8 h-8 rounded-full bg-accent-red/10 flex items-center justify-center font-bold text-xs text-accent-red border border-accent-red/20">
                        {test.name.charAt(0)}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-100 uppercase tracking-wide">{test.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{test.location} • {test.carOwned}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PUBLIC BLOG PROMO & ARTKEL */}
          <section className="px-4 sm:px-6 lg:px-8 font-sans">
            <div className="mx-auto max-w-7xl space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-mono text-accent-red uppercase tracking-[0.25em] font-bold block mb-1">
                    TERBARU
                  </span>
                  <h3 className="font-sans font-black text-2xl sm:text-3xl text-slate-100 uppercase tracking-tight">
                    Promo & kabar pilihan
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('promo-artikel')}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-400 hover:text-accent-red transition-colors"
                >
                  <span>Lihat semua</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cmsData.articles.slice(0, 2).map((art) => (
                  <div 
                    key={art.id} 
                    onClick={() => setActiveArticleId(art.id)}
                    className="bg-navy-card hover:bg-navy-card/80 border border-navy-light hover:border-accent-red/60 p-5 rounded flex items-start gap-4 cursor-pointer transition-all duration-200 group shadow-lg"
                  >
                    <div className="w-12 h-12 rounded bg-navy-deep border border-navy-light flex items-center justify-center text-xl shrink-0 group-hover:border-accent-red transition-colors">
                      {art.category === 'PROMO' ? '🏷️' : '💡'}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex gap-2 items-center">
                        <span className="bg-accent-red/10 border border-accent-red/30 px-2 py-0.5 text-[9px] font-mono text-accent-red font-semibold uppercase rounded tracking-wider">
                          {art.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{art.date}</span>
                      </div>
                      <h4 className="font-sans font-bold text-sm text-slate-100 group-hover:text-accent-red transition-colors line-clamp-1 uppercase tracking-wide">
                        {art.title}
                      </h4>
                      <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                        {art.content}
                      </p>
                      <span className="text-[9px] font-mono text-slate-500 block pt-1">
                        ⏱️ {art.readTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* SECTION: MOBIL DIJUAL (CAR CATALOG) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'mobil-dijual' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fadeIn min-h-screen font-sans">
          
          {/* Header */}
          <div className="text-left space-y-2 pb-6 border-b border-solid border-slate-100 dark:border-white/5">
            <span className="text-[11px] font-mono text-accent-red uppercase tracking-[0.2em] font-bold block">
              KATALOG KHUSUS JBM SURABAYA
            </span>
            <h1 className={`font-sans font-black text-3xl sm:text-4xl uppercase tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
              Cari Mobil Bekas Berkualitas
            </h1>
            <p className={`text-xs sm:text-sm max-w-xl ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              Sajian unit showroom dengan standardisasi ketat. Nikmati grid interaktif terinspirasi digital rental dashboard premium JBM.
            </p>
          </div>

          {/* Main Content Workspace Grid - Column Span Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDEBAR FILTERS (replicates original illustration sidebar) */}
            <div className={`lg:col-span-3 lg:sticky lg:top-24 rounded-[32px] border p-6 space-y-6 transition-all duration-300
              ${theme === 'light'
                ? 'bg-white border-slate-200/80 shadow-md shadow-slate-200/30'
                : 'bg-[#111827] border-white/5 shadow-2xl shadow-black/80'
              }`}
            >
              {/* Filter By title row */}
              <div className="flex items-center justify-between pb-3 border-b border-solid border-slate-105 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-accent-red" />
                  <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'}`}>
                    Filter by
                  </span>
                </div>
                {(searchQuery || selectedBrand !== 'All' || selectedTrans !== 'All' || priceRange !== 500000000 || selectedBodyType !== 'All' || onlyAvailable) && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBrand('All');
                      setSelectedTrans('All');
                      setPriceRange(500000000);
                      setSelectedBodyType('All');
                      setOnlyAvailable(false);
                      setSortBy('default');
                    }}
                    className="text-[10px] font-mono uppercase text-accent-red hover:underline font-bold flex items-center gap-1 cursor-pointer bg-transparent border-none p-0"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Clear All
                  </button>
                )}
              </div>

              {/* SEARCH TEXT */}
              <div className="space-y-1.5">
                <label className={`block text-[9px] font-mono uppercase tracking-widest ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Nama Mobil / Merk
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Innova, Brio, Jazz..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full rounded-2xl pl-10 pr-3.5 py-2.5 text-xs outline-none transition-all border
                      ${theme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-accent-red'
                        : 'bg-[#0f1524] border-white/5 text-slate-100 placeholder-slate-500 focus:border-accent-red'
                      }`}
                  />
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                </div>
              </div>

              {/* TOGGLE SWITCH: ONLY READY STOCKS */}
              <div className="flex items-center justify-between pt-1">
                <span className={`text-[9px] font-mono uppercase tracking-widest ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Unit Ready Stock
                </span>
                <button
                  type="button"
                  onClick={() => setOnlyAvailable(!onlyAvailable)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                    ${onlyAvailable ? 'bg-accent-red' : (theme === 'light' ? 'bg-slate-200' : 'bg-slate-800')}`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out
                      ${onlyAvailable ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              {/* PRICE HISTOGRAM BAR CHART REPRESENTATION */}
              <div className="space-y-2 pt-2 border-t border-solid border-slate-150 dark:border-white/5">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className={theme === 'light' ? 'text-slate-500' : 'text-slate-400'}>BUDGET MAKSIMAL</span>
                  <span className="text-accent-red font-black">
                    {priceRange === 500000000 ? 'TANPA BATAS' : `Rp ${(priceRange / 1000000).toFixed(0)} JUTA`}
                  </span>
                </div>

                {/* VISUAL HISTOGRAM COPIED FROM DESIGN */}
                <div className="flex items-end justify-between h-10 px-1 gap-[2.5px] pt-1 overflow-hidden">
                  {[20, 28, 45, 68, 80, 72, 58, 41, 30, 48, 62, 50, 32, 18, 10, 5].map((hVal, idx) => {
                    const priceThreshold = 100000000 + idx * 26600000;
                    const isActive = priceThreshold <= priceRange;
                    return (
                      <div
                        key={idx}
                        style={{ height: `${hVal}%` }}
                        className={`w-full rounded-t-[2px] transition-all duration-300
                          ${isActive 
                            ? 'bg-accent-red opacity-85' 
                            : (theme === 'light' ? 'bg-slate-150 opacity-60' : 'bg-white/10 opacity-30')
                          }`}
                      />
                    );
                  })}
                </div>

                <input
                  type="range"
                  min="100000000"
                  max="500000000"
                  step="10000000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-red"
                />
                <div className="flex justify-between text-[8px] font-mono text-slate-500">
                  <span>100 JUTA</span>
                  <span>500 JUTA+</span>
                </div>
              </div>

              {/* CAR BRAND PILLS */}
              <div className="space-y-2 pt-2 border-t border-solid border-slate-150 dark:border-white/5">
                <span className={`block text-[9px] font-mono uppercase tracking-widest ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Merek / Brand
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                  {availableBrands.map((brand) => {
                    const isSelected = selectedBrand === brand;
                    return (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-1.5 rounded-xl font-mono transition-all border cursor-pointer
                          ${isSelected 
                            ? 'bg-accent-red border-accent-red text-white shadow-sm shadow-red-950/25' 
                            : (theme === 'light'
                              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                              : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
                            )
                          }`}
                      >
                        {brand === 'All' ? 'Semua' : brand}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TRANSMISSION PILLS */}
              <div className="space-y-2 pt-2 border-t border-solid border-slate-150 dark:border-white/5">
                <span className={`block text-[9px] font-mono uppercase tracking-widest ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Transmisi
                </span>
                <div className={`p-1 flex rounded-2xl border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0f1524] border-white/5'}`}>
                  {[
                    { id: 'All', label: 'Semua' },
                    { id: 'AT', label: 'Otomatis' },
                    { id: 'MT', label: 'Manual' }
                  ].map((tr) => {
                    const isSelected = selectedTrans === tr.id;
                    return (
                      <button
                        key={tr.id}
                        type="button"
                        onClick={() => setSelectedTrans(tr.id)}
                        className={`flex-1 text-center py-2 text-[9px] uppercase tracking-wider font-sans font-bold rounded-xl transition-all cursor-pointer border-0
                          ${isSelected 
                            ? 'bg-accent-red text-white shadow-md' 
                            : (theme === 'light' ? 'text-slate-600 hover:text-slate-900 bg-transparent' : 'text-slate-400 hover:text-slate-200 bg-transparent')}`}
                      >
                        {tr.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BODY TYPE OPTIONS */}
              <div className="space-y-2 pt-2 border-t border-solid border-slate-150 dark:border-white/5">
                <span className={`block text-[9px] font-mono uppercase tracking-widest ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Tipe Bodi
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {['All', 'SUV', 'MPV/Van', 'Hatchback'].map((bType) => {
                    const isSelected = selectedBodyType === bType;
                    return (
                      <button
                        key={bType}
                        type="button"
                        onClick={() => setSelectedBodyType(bType)}
                        className={`text-center py-2 text-[9px] uppercase tracking-wider font-mono font-bold rounded-xl border transition-all cursor-pointer
                          ${isSelected 
                            ? 'bg-accent-red border-accent-red text-white shadow-sm' 
                            : (theme === 'light'
                              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                              : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-400'
                            )}`}
                      >
                        {bType === 'All' ? 'Semua Tipe' : bType}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT MAIN CATALOG GRID AREA */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Grid Header and Sorting */}
              <div className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-4 border-b
                ${theme === 'light' ? 'border-slate-200' : 'border-white/5'}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-sans font-black text-xl tracking-tight leading-none ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                      {filteredCars.length} Unit Mobil Tersedia
                    </span>
                    {favorites.length > 0 && (
                      <span className="bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                        ♥ {favorites.length} Favorit
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-mono mt-1 block leading-none ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Semua unit bersertifikasi & telah terbit hasil inspeksi independen
                  </span>
                </div>

                {/* Sort Option dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className={`text-[10px] font-mono leading-none ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} shrink-0`}>
                    Urutan:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`text-[10px] font-sans font-bold px-3.5 py-2 rounded-xl outline-none cursor-pointer border transition-all
                      ${theme === 'light'
                        ? 'bg-white border-slate-205 text-slate-700 shadow-sm focus:border-accent-red'
                        : 'bg-[#111827] border-white/5 text-slate-300 focus:border-accent-red'
                      }`}
                  >
                    <option value="default">Rekomendasi Terpopuler</option>
                    <option value="price-low">Harga Tertentu: Terendah ke Termahal</option>
                    <option value="price-high">Harga Tertentu: Termahal ke Terendah</option>
                    <option value="year-new">Tahun Pabrikan: Paling Baru</option>
                    <option value="mileage-low">Odometer: Kilometer Terendah</option>
                  </select>
                </div>
              </div>

              {/* Main Cards Grid */}
              {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCars.map((car) => {
                    const isFav = favorites.includes(car.id);
                    const carLocation = car.year < 2017 || car.brand === 'Suzuki' ? 'Branch DTC Wonokromo' : 'Showroom Utama Wiyung';
                    const score = (4.7 + (parseInt(car.id.slice(-1)) || 5) * 0.05).toFixed(1);
                    const starsCount = 38 + (parseInt(car.id.slice(-2)) || 21);
                    const bTypeClass = getBodyType(car);

                    return (
                      <div 
                        key={car.id}
                        onClick={() => setSelectedCar(car)}
                        className={`group border rounded-[32px] overflow-hidden transition-all duration-300 hover:-translate-y-1 block flex flex-col justify-between cursor-pointer
                          ${theme === 'light'
                            ? 'bg-white border-slate-200/80 shadow-md shadow-slate-250/30 hover:shadow-xl hover:border-accent-red'
                            : 'bg-[#111827] border-white/5 shadow-lg shadow-black/85 hover:border-accent-red/50'
                          }`}
                      >
                        {/* Card Upper Body */}
                        <div>
                          
                          {/* Metadata Bar (Replicates rating/favorite bar in picture) */}
                          <div className="px-5 pt-4 flex justify-between items-center z-10 relative">
                            <div className="flex items-center gap-1.5">
                              {/* Location */}
                              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[8.5px] font-bold font-sans uppercase tracking-wider
                                ${theme === 'light' ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-slate-400'}`}
                              >
                                <MapPin className="w-2.5 h-2.5 text-accent-red shrink-0" />
                                <span>{carLocation.replace('Branch ', '').replace('Showroom Utama ', '')}</span>
                              </div>

                              {/* Ratings */}
                              <div className={`flex items-center gap-0.5 px-2 py-1 rounded-xl text-[8.5px] font-bold font-mono
                                ${theme === 'light' ? 'bg-amber-500/15 text-amber-700' : 'bg-amber-500/10 text-amber-400'}`}
                              >
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500 dark:text-amber-400 shrink-0" />
                                <span>{score}</span>
                                <span className="opacity-60 text-[7px]">({starsCount})</span>
                              </div>
                            </div>

                            {/* Favorite Button (Replicates heart overlay) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(car.id);
                              }}
                              className={`p-2 rounded-full transition-all cursor-pointer border hover:scale-105 active:scale-95
                                ${isFav 
                                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-500' 
                                  : (theme === 'light' 
                                    ? 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600' 
                                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white')}`}
                              title={isFav ? "Hapus dari unit disukai" : "Sukai unit mobil ini"}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                          </div>

                          {/* Elegant Vehicle visual render */}
                          <div className="relative mx-5 mt-3.5 bg-gradient-to-b from-transparent to-slate-100/50 dark:to-white/2 rounded-2xl overflow-hidden aspect-[16/10] flex items-center justify-center">
                            {car.isSold ? (
                              <span className="absolute top-3 left-3 z-10 bg-accent-red text-white font-black px-2.5 py-0.5 rounded uppercase tracking-wider text-[8px] shadow-sm shadow-black/20">
                                TERJUAL
                              </span>
                            ) : car.badge !== 'NONE' ? (
                              <span className={`absolute top-3 left-3 z-10 text-[8px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider shadow-sm
                                ${car.badge === 'HOT' ? 'bg-accent-red text-white' : (theme === 'light' ? 'bg-slate-900 text-white' : 'bg-navy-deep text-slate-300 border border-navy-light')}`}>
                                {car.badge}
                              </span>
                            ) : null}

                            {/* Show actual image or flat vector */}
                            <div className="w-full h-full transform transition-transform duration-500 group-hover:scale-104">
                              <CarIllustration type={car.image} brand={car.brand} isSold={car.isSold} />
                            </div>

                            {/* Flat shadow representation at bottom of rendering */}
                            <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                          </div>

                          {/* Text labels matching the studio aesthetic */}
                          <div className="px-5 pt-4 space-y-2">
                            <div>
                              <h3 className={`font-sans font-black text-base uppercase tracking-tight leading-tight group-hover:text-accent-red transition-colors line-clamp-1
                                ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}
                              >
                                {car.name}
                              </h3>
                              {/* Spec metrics list - e.g. "Toyota • SUV • Bensin" */}
                              <p className={`text-[10px] font-semibold tracking-wider font-sans mt-1 uppercase
                                ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}
                              >
                                {car.brand} • {bTypeClass} • {car.fuelType} • {car.engineCc}L CC
                              </p>
                            </div>

                            {/* Additional metadata specs */}
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <div className={`p-2 rounded-xl flex items-center justify-between text-[9px] font-mono border
                                ${theme === 'light' ? 'bg-slate-50 border-slate-100 text-slate-700' : 'bg-white/2 border-white/2 text-slate-300'}`}
                              >
                                <span className="opacity-50">MILEAGE:</span>
                                <span className="font-extrabold">{car.mileage.toLocaleString('id-ID')} KM</span>
                              </div>
                              <div className={`p-2 rounded-xl flex items-center justify-between text-[9px] font-mono border
                                ${theme === 'light' ? 'bg-slate-50 border-slate-100 text-slate-700' : 'bg-white/2 border-white/2 text-slate-300'}`}
                              >
                                <span className="opacity-50 font-sans">TRANS:</span>
                                <span className="font-extrabold">{car.transmission === 'AT' ? 'Otomatis' : 'Manual'}</span>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Card pricing and checkout actions */}
                        <div className="px-5 pb-5 pt-4">
                          <hr className={`border-t mb-3.5 ${theme === 'light' ? 'border-slate-150' : 'border-white/5'}`} />
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <span className={`text-[8.5px] font-mono tracking-widest block uppercase leading-none mb-1.5
                                ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>
                                Harga Cash
                              </span>
                              <span className="font-sans font-black text-base sm:text-lg text-accent-red tracking-tight leading-none">
                                Rp {(car.price / 1000000).toFixed(0)} Juta
                              </span>
                              {/* Approximate Monthly Payment Sim */}
                              <span className="block text-[8px] font-bold text-slate-400 mt-1 uppercase">
                                Angsuran ~Rp {((car.price * 1.15) / 48000000).toFixed(1)} Jt/Bln
                              </span>
                            </div>

                            {/* Sleek chat click action */}
                            <a
                              href={`https://wa.me/6281330253797?text=Halo%2520Jaya%2520Berkat%2520Mobil,%2520saya%2520tertarik%2520dengan%2520unit%2520*${encodeURIComponent(car.name)}*%2520${car.year}%2520yang%2520tertulis%2520terbaru%2520di%2520katalog.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 bg-accent-red hover:bg-[#b02f20] text-white px-3.5 py-2.5 rounded-2xl transition-all duration-200 text-[10px] font-bold uppercase tracking-wider font-sans cursor-pointer shadow-md shadow-red-950/15 hover:shadow-lg hover:scale-102 active:scale-97"
                            >
                              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>Tanya Admin</span>
                            </a>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={`p-16 text-center border-2 border-dashed rounded-[32px] space-y-4
                  ${theme === 'light' 
                    ? 'bg-slate-50 border-slate-200 text-slate-500 shadow-sm' 
                    : 'bg-[#111827] border-white/5 text-slate-400'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-accent-red/10 flex items-center justify-center mx-auto text-accent-red shadow-sm shadow-red-950/5">
                    <Sliders className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className={`font-sans font-black text-base uppercase tracking-wide ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                      Unit Tidak Ditemukan
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                      Tidak ada kendaraan di JBM Surabaya yang memenuhi semua kriteria pencarian Anda saat ini. Coba ubah atau atur ulang opsi filter.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedBrand('All');
                      setSelectedTrans('All');
                      setPriceRange(500000000);
                      setSelectedBodyType('All');
                      setOnlyAvailable(false);
                      setSortBy('default');
                    }}
                    className="px-5 py-2.5 hover:bg-[#ab2f20] rounded-xl bg-accent-red text-white text-[10px] font-sans font-black uppercase tracking-wider transition-all cursor-pointer shadow-md border-transparent"
                  >
                    Reset Semua Kriteria
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* SECTION: PROFIL */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'profil' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fadeIn font-sans">
          
          {/* Hero Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-[10px] font-mono text-accent-red uppercase tracking-[0.2em] font-bold block">
                TENTANG JAYA BERKAT MOBIL
              </span>
              <h1 className="font-sans font-black text-3xl sm:text-4xl text-slate-100 uppercase tracking-tight">
                Membangun Kepercayaan Sejak 2021 di Surabaya
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
                Jaya Berkat Mobil didirikan dengan satu komitmen sederhana: menghadirkan unit mobil bekas dengan kualitas transparan dan kejujuran tanpa kompromi. Kami memahami bahwa membeli mobil bekas adalah investasi besar bagi keluarga Anda.
              </p>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans">
                Dari showroom pertama kami di Wiyung, kini kami bangga melayani ratusan pelanggan di Surabaya Barat hingga pusat lewat perwakilan showcase kami di Darmo Trade Center (DTC) Wonokromo. Semua unit kami divalidasi oleh inspektur ahli, menjamin bebas tabrakan hebat, bebas banjir, dan keaslian odometer.
              </p>
            </div>

            <div className="relative border border-navy-light bg-navy-card rounded-lg p-6 space-y-4 shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-radial from-accent-red/5 to-transparent pointer-events-none" />
              <h3 className="font-sans font-black text-sm text-accent-red uppercase tracking-wider">
                Visi & Nilai Fundamental Kami
              </h3>
              
              <ul className="space-y-3">
                {[
                  { title: 'Odometer & Dokumen Dijamin Asli', desc: 'Kami tidak pernah melakukan reset kilometer demi kemudahan penjualan. Semua dokumen absah 100% dan legal dibantu dinas.' },
                  { title: 'Garansi Bebas Bekas Tabrakan & Banjir', desc: 'Sertifikat kelayakan tertulis diberikan di setiap pembelian sebagai jaminan kepuasan jangka panjang.' },
                  { title: 'Metode Pembayaran Transparan', desc: 'Bekerja sama dengan leasing syariah & konvensional tepercaya dengan rincian biaya yang adem tanpa manipulasi.' }
                ].map((val, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <CheckCircle2 className="w-4.5 h-4.5 text-accent-red shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-sans font-bold text-xs text-slate-100 uppercase tracking-wide">{val.title}</span>
                      <span className="text-slate-400 text-[11px] font-sans leading-relaxed block mt-0.5">{val.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Timeline points */}
          <div className="space-y-8">
            <div className="text-center">
              <span className="text-[10px] font-mono text-accent-red uppercase tracking-[0.2em] font-bold">PERJALANAN BISNIS TAMBAHAN</span>
              <h2 className="font-sans font-black text-2xl text-slate-100 uppercase tracking-tight">Timeline JBM Surabaya</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { year: '2021', title: 'Awal Pendirian', desc: 'Membuka outlet mini pertama di perumahan kawasan Wiyung dengan hanya 3 mobil display keluarga.' },
                { year: '2022', title: 'Sertifikasi Unit', desc: 'Menjadi pionir kerja sama dealer mandiri dengan lembaga inspektorat terakreditasi di Surabaya.' },
                { year: '2024', title: 'Ekspansi DTC', desc: 'Meresmikan cabang kedua berlokasi strategis di DTC Wonokromo pusat kota untuk jangkauan luas.' },
                { year: '2026', title: 'Platform Digital & CMS', desc: 'Merias website dengan sistem admin back-office digital tepercaya guna pembaruan katalog realtime.' }
              ].map((time, idx) => (
                <div key={idx} className="bg-navy-card border border-navy-light rounded p-4 relative group hover:border-accent-red transition-all duration-200">
                  <span className="block font-sans font-black text-2xl text-accent-red tracking-tight leading-none mb-1 font-mono">
                    {time.year}
                  </span>
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wide text-slate-100">{time.title}</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed mt-1 font-sans">{time.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Introduce the 5 Sales Team members with customization */}
          <div className="space-y-8">
            <div className="text-center">
              <span className="text-[10px] font-mono text-accent-red uppercase tracking-[0.2em] font-bold">PERSONAL SERVICE TEAM</span>
              <h2 className="font-sans font-black text-2xl sm:text-3xl text-slate-100 uppercase tracking-tight">Hubungi 5 Sales Advisor Kami</h2>
              <p className="text-slate-400 text-xs max-w-lg mx-auto">Kami siap melayani kebutuhan konsultasi mobil bekas Anda secara personal di dua lokasi showroom kami.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {(cmsData.advisors || []).map((sale, idx) => (
                <div 
                  key={sale.id || idx} 
                  className={`border transition-all duration-350 hover:scale-[1.03] flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-2xl h-full rounded-[24px] p-2.5 pb-4 group
                    ${theme === 'light' 
                      ? 'bg-white border-slate-200/90 shadow-slate-100/70' 
                      : 'bg-gradient-to-b from-[#111827] to-[#070b14] border-white/5 shadow-black/80'
                    }`}
                  id={`advisor_${sale.name.toLowerCase().replace(/\s+/g, '_')}`}
                >
                  <div className="space-y-4">
                    {/* Media Container with portrait Aspect Ratio */}
                    <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[#0d131f] shadow-inner-md">
                      <img 
                        src={optimizeImageUrl(sale.avatar, 300, 375)} 
                        alt={sale.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Live Online Badge Overlaid */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-emerald-500/90 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 shadow-sm">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                        </span>
                        <span className="text-[7px] font-mono uppercase font-black tracking-widest leading-none">ONLINE</span>
                      </div>

                      {/* Showroom Area Identifier Tag Overlaid */}
                      <div className={`absolute bottom-2.5 left-2.5 backdrop-blur-sm font-mono text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-sm
                        ${theme === 'light'
                          ? 'bg-white/90 border-slate-200/80 text-slate-800'
                          : 'bg-black/60 border-white/10 text-[#D4A017]'
                        }`}
                      >
                        📍 {sale.area.replace('Showroom ', '')}
                      </div>
                    </div>

                    {/* Metadata details block */}
                    <div className="px-1.5 space-y-1.5 text-left">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`font-sans font-black text-[13.5px] uppercase tracking-wide leading-tight truncate ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                          {sale.name}
                        </h4>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20 shrink-0" />
                      </div>
                      
                      {/* Specialty bio of Bennett style */}
                      <p className={`text-[10px] leading-relaxed font-sans font-bold line-clamp-3 h-12 uppercase tracking-wide
                        ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}
                      >
                        Spesialis {sale.specialty} • {sale.badge} JBM terpercaya.
                      </p>
                    </div>
                  </div>

                  {/* Footing actions & metrics */}
                  <div className={`pt-3 border-t mt-4 flex items-center justify-between gap-1 px-1.5
                    ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}
                  >
                    {/* Metrics Row */}
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <div className="flex items-center gap-0.5" title={`${sale.rating} Bintang`}>
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        <span className={`font-black ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                          {sale.rating}
                        </span>
                      </div>
                      <span className={`text-[11px] ${theme === 'light' ? 'text-slate-200' : 'text-white/10'}`}>|</span>
                      <div className="flex items-center gap-0.5" title={`${sale.sold} Unit Selesai`}>
                        <Award className="w-3.5 h-3.5 text-accent-red shrink-0" />
                        <span className={`font-black ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                          {sale.sold.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Action chat link */}
                    <a
                      href={`https://wa.me/${sale.phone.replace(/[^0-9]/g, '')}?text=Halo%20${sale.name},%20saya%20tertarik%20konsultasi%20mengenai%20unit%20ready%20di%20Jaya%20Berkat%20Mobil.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-1.5 rounded-full text-[9px] font-sans font-black uppercase tracking-widest flex items-center gap-1.5 transition-all duration-200 cursor-pointer border hover:-translate-y-[1px] active:translate-y-[1px]
                        ${theme === 'light'
                          ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800 hover:text-slate-950 shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-200 hover:text-white'
                        }`}
                    >
                      <span>Tanya</span>
                      <MessageCircle className="w-3 h-3 text-accent-red fill-current shrink-0" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* SECTION: HALL OF FAME ROOM */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'hall-of-fame' && (
        <HallOfFameRoom 
          hallOfFameItems={cmsData.hallOfFame || []} 
          setActiveTab={setActiveTab}
        />
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* SECTION: GALERI */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'galeri' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fadeIn min-h-screen font-sans">
          
          {/* Header */}
          <div className="text-left space-y-2">
            <span className="text-[10px] font-mono text-accent-red uppercase tracking-[0.2em] font-bold block">DOCUMENTATION HUB</span>
            <h1 className="font-sans font-black text-3xl text-slate-100 uppercase tracking-tight">Galeri Showroom & Happy Customer</h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg">
              Setiap serah terima mobil didokumentasikan sebagai bukti kepuasan pelanggan bersertifikat kami. Pilih kategori untuk menyaring foto.
            </p>
          </div>

          {/* Filtering Category Pills */}
          <div className="flex gap-2 flex-wrap pb-2 border-b border-navy-light">
            {['All', 'Showroom', 'Unit Stok', 'Happy Customer', 'Event'].map((cat) => (
              <button
                key={cat}
                onClick={() => setGalleryCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider border transition-all duration-150
                  ${galleryCategory === cat 
                    ? 'bg-accent-red border-accent-red text-white' 
                    : 'bg-navy-card border-navy-light text-slate-300 hover:border-accent-red'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cmsData.gallery
              .filter(item => galleryCategory === 'All' || item.category === galleryCategory)
              .map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setActiveLightboxImage(item.title)}
                  className="relative group overflow-hidden border border-navy-light rounded-lg cursor-pointer bg-navy-card shadow-lg aspect-[4/3]"
                >
                  {/* Real responsive image with custom compression parameters and lazy loading */}
                  <img 
                    src={optimizeImageUrl(getGalleryImageUrl(item.imageUrl), 550, 70)} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                  />
                  
                  {/* Elegant overlay gradient on card bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-4">
                    <span className="text-[9px] font-sans font-bold text-white bg-accent-red px-2.5 py-1 self-start rounded uppercase tracking-wider">
                      {item.category}
                    </span>
                    
                    <div className="space-y-0.5">
                      <h4 className="font-sans font-bold text-xs sm:text-sm text-white leading-tight uppercase tracking-wide">
                        {item.title}
                      </h4>
                      <p className="text-[9px] text-slate-350 font-sans uppercase tracking-[0.1em] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Dokumentasi Resmi • Surabaya
                      </p>
                    </div>
                  </div>

                  {/* Dark hover layer overlay */}
                  <div className="absolute inset-0 bg-red-950/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center duration-200">
                    <span className="bg-navy-deep border border-accent-red text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded shadow-lg">
                      Klik Untuk Zoom & Tanya Sales
                    </span>
                  </div>

                </div>
              ))}
          </div>

          {/* Lightbox Modal Dialog */}
          {activeLightboxImage && (() => {
            const matchedGalleryItem = cmsData.gallery.find(item => item.title === activeLightboxImage);
            const imageUrl = matchedGalleryItem ? getGalleryImageUrl(matchedGalleryItem.imageUrl) : "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80";
            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fadeIn">
                <div className="absolute inset-0" onClick={() => setActiveLightboxImage(null)} />
                <div className="relative max-w-2xl w-full bg-navy-card border border-navy-light rounded-lg overflow-hidden p-5 space-y-4 shadow-2xl font-sans">
                  
                  <button 
                    onClick={() => setActiveLightboxImage(null)}
                    className="absolute top-4 right-4 bg-navy-deep hover:bg-accent-red border border-navy-light text-slate-300 hover:text-white p-1 rounded transition-colors z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="relative w-full h-80 bg-navy-deep border border-navy-light/45 rounded overflow-hidden">
                    <img 
                      src={optimizeImageUrl(imageUrl, 1200, 85)} 
                      alt={activeLightboxImage} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-5">
                      <span className="text-[10px] uppercase tracking-widest text-accent-red font-bold">
                        {matchedGalleryItem?.category || 'Showroom'}
                      </span>
                      <h3 className="font-sans font-black text-lg text-white uppercase tracking-wide mt-1">
                        {activeLightboxImage}
                      </h3>
                      <p className="text-[11px] text-slate-350">
                        Dokumentasi Resmi Showroom Surabaya JBM • Terverifikasi
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Dokumentasi fisik showroom dan serah terima unit tepercaya di Surabaya (Wiyung & Darmo Trade Center). Seluruh unit kami terjamin keaslian odometernya, bebas tabrakan hebat, dan bebas banjir besar.
                    </p>
                    <div className="flex flex-wrap gap-2 items-center justify-between pt-1">
                      <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                        Lokasi: JBM Surabaya
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveLightboxImage(null)}
                          className="bg-navy-deep hover:bg-navy-light border border-navy-light text-slate-300 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all"
                        >
                          Tutup
                        </button>
                        <a
                          href={`https://wa.me/6281330253797?text=Halo%20Jaya%20Berkat%20Mobil,%20saya%20tertarik%20dengan%2520dokumentasi%2520foto%20*${encodeURIComponent(activeLightboxImage)}*`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-accent-red hover:bg-[#c93b2a] text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-red-950/20"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Tanya Sales JBM (WA)</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* SECTION: ARTIKEL DETAIL MODAL & OVERALL BLOG VIEW */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'promo-artikel' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fadeIn min-h-screen font-sans">
          
          {/* Header */}
          <div className="text-left space-y-2">
            <span className="text-[10px] font-mono text-accent-red uppercase tracking-[0.2em] font-bold block">EDITORIAL CENTER</span>
            <h1 className={`font-sans font-black text-3xl uppercase tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
              Promo Spesial & Panduan Otomotif
            </h1>
            <p className={`text-xs sm:text-sm max-w-lg ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
              Temukan penawaran DP kredit spesial dan tips perawatan dari ahli inspektor kami. Dikembangkan secara mandiri lewat CMS JBM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cmsData.articles.map((art) => {
              const activeImages = art.images?.filter((img) => !!img) || [];
              const hasImage = activeImages.length > 0;
              return (
                <div 
                  key={art.id} 
                  onClick={() => setActiveArticleId(art.id)}
                  className={`border p-5 rounded-[20px] space-y-4 cursor-pointer transition-all duration-300 group shadow-lg hover:shadow-xl hover:scale-[1.01] flex flex-col justify-between
                    ${theme === 'light'
                      ? 'bg-white border-slate-200/95 hover:border-accent-red text-slate-800 shadow-slate-100/70'
                      : 'bg-[#111827] border-white/5 hover:border-accent-red/60 text-slate-100 shadow-black/80'
                    }`}
                >
                  <div className="space-y-3.5">
                    {/* Image Thumbnail Header */}
                    {hasImage && (
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black/10 border border-black/5 dark:border-white/5 shadow-inner">
                        <img 
                          src={optimizeImageUrl(activeImages[0], 400, 80)} 
                          alt={art.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="bg-accent-red/10 border border-accent-red/30 px-2.5 py-0.5 text-accent-red font-bold uppercase rounded tracking-wider leading-none">
                          {art.category}
                        </span>
                        <span className={theme === 'light' ? 'text-slate-500' : 'text-slate-400'}>{art.date}</span>
                      </div>
                      
                      <h3 className={`font-sans font-extrabold text-[15px] group-hover:text-accent-red transition-colors leading-snug line-clamp-2 uppercase tracking-wide
                        ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}>
                        {art.title}
                      </h3>

                      <p className={`text-xs line-clamp-3 leading-relaxed
                        ${theme === 'light' ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                        {art.content}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between pt-3.5 border-t text-[10px] font-mono leading-none mt-2
                    ${theme === 'light' ? 'border-slate-100 text-slate-500' : 'border-white/5 text-slate-400'}`}>
                    <span>⏱️ {art.readTime}</span>
                    <span className="text-accent-red group-hover:underline flex items-center gap-0.5 font-sans font-black uppercase tracking-wider">
                      Baca <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ARTICLE FULL IN-APP MODAL READ VIEW */}
      {activeArticleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fadeIn font-sans">
          <div className="absolute inset-0" onClick={() => setActiveArticleId(null)} />
          {(() => {
            const art = cmsData.articles.find(a => a.id === activeArticleId);
            if (!art) return null;
            return (
              <div className={`relative max-w-2xl w-full border rounded-3xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl transition-all
                ${theme === 'light'
                  ? 'bg-white border-slate-200'
                  : 'bg-[#111827] border-white/5'
                }`}
              >
                <button 
                  onClick={() => setActiveArticleId(null)}
                  className={`absolute top-4 right-4 border font-bold p-1 rounded-lg transition-colors cursor-pointer
                    ${theme === 'light'
                      ? 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                      : 'bg-[#1a2333] border-white/5 text-slate-400 hover:bg-[#E74C3C] hover:border-[#E74C3C] hover:text-white'
                    }`}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-3">
                  <span className="inline-block bg-accent-red/10 border border-accent-red/30 px-3 py-1 rounded text-[10px] font-mono text-accent-red tracking-widest font-black uppercase mb-1">
                    {art.category} | JBM NEWS
                  </span>
                  <h2 className={`font-sans font-black text-xl sm:text-2xl tracking-tight leading-snug uppercase
                    ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}`}
                  >
                    {art.title}
                  </h2>
                  <div className={`text-[10px] font-mono flex gap-4 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span>🗓️ Publikasi: {art.date}</span>
                    <span>⏱️ Estimasi: {art.readTime}</span>
                  </div>
                </div>

                {/* Images Gallery in Modal (Maximum 3 Photos) */}
                {(() => {
                  const activeImages = art.images?.filter((img) => !!img) || [];
                  if (activeImages.length === 0) return null;
                  return (
                    <div className="space-y-2 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {activeImages.slice(0, 3).map((img, i) => (
                          <div 
                            key={i} 
                            className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/10 border border-slate-200/50 dark:border-white/5 shadow-md group/gallery cursor-zoom-in"
                            onClick={() => window.open(img, '_blank')}
                            title="Klik untuk memperbesar gambar"
                          >
                            <img 
                              src={optimizeImageUrl(img, 500, 80)} 
                              alt={`Foto ${i + 1} - ${art.title}`}
                              className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-sm text-white text-[8px] font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                              Foto {i + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans border-t pt-5
                  ${theme === 'light' 
                    ? 'text-slate-750 font-medium border-slate-105' 
                    : 'text-slate-300 border-white/5'
                  }`}
                >
                  {art.content}
                </p>

                <div className={`flex gap-3 pt-5 border-t
                  ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}
                >
                  <a
                    href={`https://wa.me/6281330253797?text=Halo%20Jaya%20Berkat%20Mobil,%20saya%20tertarik%20bertanya%20mengenai%20konten%20promo/tips%20*${encodeURIComponent(art.title)}*`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-accent-red hover:bg-[#c93b2a] text-white text-center font-sans font-black uppercase text-xs py-3 rounded-xl hover:scale-[1.01] transition-transform shadow-lg shadow-red-950/20"
                  >
                    Tanya Promo/Artikel Lewat WhatsApp
                  </a>
                  <button
                    onClick={() => setActiveArticleId(null)}
                    className={`px-5 border font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer
                      ${theme === 'light'
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-300'
                      }`}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* SECTION: KONTAK */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'kontak' && (() => {
        // Calculate dynamic live operation status for Surabaya UTC+7 timezone
        const checkShowroomStatus = () => {
          try {
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const surabayaDate = new Date(utc + (3600000 * 7));
            const day = surabayaDate.getDay(); 
            const hour = surabayaDate.getHours();
            
            if (day === 0) { // Minggu
              return { open: hour >= 8 && hour < 16, hours: "08:00 - 16:00 WIB" };
            } else { // Senin - Sabtu
              return { open: hour >= 8 && hour < 17, hours: "08:00 - 17:00 WIB" };
            }
          } catch (e) {
            return { open: true, hours: "08:00 - 17:00 WIB" };
          }
        };

        const status = checkShowroomStatus();
        const mapIframeUrl = activeMapTab === 'wiyung' 
          ? "https://maps.google.com/maps?q=Jaya%20Berkat%20Mobil%20Menganti%20Babatan%20Surabaya&t=&z=15&ie=UTF8&iwloc=&output=embed"
          : "https://maps.google.com/maps?q=Bursa%20Mobil%20DTC%20Wonokromo%20Surabaya&t=&z=15&ie=UTF8&iwloc=&output=embed";

        const handleCopyAddress = (branch: 'wiyung' | 'dtc', address: string) => {
          navigator.clipboard.writeText(address);
          setCopiedBranch(branch);
          setTimeout(() => setCopiedBranch(null), 2000);
        };

        return (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn min-h-screen font-sans">
            
            {/* Header with Live Status Banner */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
              <div className="text-left space-y-2">
                <span className="text-[10px] font-mono text-accent-red uppercase tracking-[0.2em] font-black block">
                  📍 VISITING GUIDE & SERVICE ASSISTANCE
                </span>
                <h1 className="font-sans font-black text-3xl sm:text-4xl text-slate-100 uppercase tracking-tight">
                  Hubungi Jaya Berkat Mobil
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
                  Dua showroom fisik strategis di Surabaya Barat & Pusat Kota siap menyambut Anda. Konsultasikan unit impian, jadwalkan test drive, atau lakukan tukar-tambah instan hari ini.
                </p>
              </div>

              {/* Glowing Dynamic Live Status Clock */}
              <div className="bg-[#0b101c] border border-white/5 rounded-2xl p-4 flex items-center gap-4 self-start md:self-auto shadow-2xl min-w-[260px]">
                <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 relative ${status.open ? 'bg-emerald-500' : 'bg-[#D4A017]'}`}>
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${status.open ? 'bg-emerald-400' : 'bg-yellow-400'}`}></span>
                </div>
                <div className="text-left font-mono">
                  <div className="text-[9px] text-gray-400 uppercase tracking-widest font-black flex items-center gap-1">
                    <Clock className="w-3 h-3 text-red-500" /> STATUS SHOWROOM SEKARANG:
                  </div>
                  <div className="text-xs font-bold text-white uppercase mt-0.5">
                    {status.open ? (
                      <span className="text-emerald-400 font-extrabold">🟢 Buka Sekarang (S/D 17:00)</span>
                    ) : (
                      <span className="text-[#D4A017] font-extrabold">🟡 Tutup (Layanan Online Aktif)</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    WIB Surabaya (UTC+7)
                  </div>
                </div>
              </div>
            </div>

            {/* Main Interactive Contact Grid (12 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Dynamic Showrooms & Embedded Map (col-span-7) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Branch Switcher & Details */}
                <div className="bg-navy-card border border-navy-light rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                  
                  {/* Selector Tabs */}
                  <div className={`grid grid-cols-2 border-b ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-[#090f1a] border-white/5'}`}>
                    <button
                      onClick={() => setActiveMapTab('wiyung')}
                      className={`py-4 text-[10px] font-sans font-black uppercase tracking-wider text-center transition-all duration-250 cursor-pointer border-b-2
                        ${activeMapTab === 'wiyung'
                          ? theme === 'light'
                            ? 'bg-white text-slate-900 border-accent-red'
                            : 'bg-navy-card text-white border-accent-red'
                          : theme === 'light'
                            ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 border-transparent'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                        }`}
                    >
                      🏡 Cabang Wiyung (Utama)
                    </button>
                    <button
                      onClick={() => setActiveMapTab('dtc')}
                      className={`py-4 text-[10px] font-sans font-black uppercase tracking-wider text-center transition-all duration-250 cursor-pointer border-b-2
                        ${activeMapTab === 'dtc'
                          ? theme === 'light'
                            ? 'bg-white text-slate-900 border-accent-red'
                            : 'bg-navy-card text-white border-accent-red'
                          : theme === 'light'
                            ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 border-transparent'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                        }`}
                    >
                      🏢 Cabang DTC Wonokromo
                    </button>
                  </div>

                  {/* Dynamic Info Panel */}
                  <div className="p-6 space-y-4 text-left">
                    {activeMapTab === 'wiyung' ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-sans font-black text-sm text-slate-100 uppercase tracking-wide">
                              Showroom Utama JBM Wiyung
                            </h3>
                            <span className="text-[10px] text-[#D4A017] font-mono tracking-widest font-black uppercase mt-1 inline-block">
                              Pusat Display Unit Surabaya Barat
                            </span>
                          </div>
                          <span className="bg-accent-red/10 text-accent-red text-[9px] font-bold px-2 py-0.5 rounded border border-accent-red/20 uppercase font-mono shrink-0">
                            Cabang Utama
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed font-sans font-medium">
                          {cmsData.showroom.wiyungAddress || "Jl. Raya Menganti Babatan No. 700, Wiyung, Surabaya"}
                        </p>
                        
                        {/* Interactive Action Badges */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            onClick={() => handleCopyAddress('wiyung', cmsData.showroom.wiyungAddress)}
                            className={`${theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200' : 'bg-navy-deep hover:bg-navy-light text-slate-300 hover:text-white border-white/5'} text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer font-bold`}
                          >
                            <Copy className="w-3.5 h-3.5 text-accent-red" />
                            <span>{copiedBranch === 'wiyung' ? 'Disalin! ✓' : 'Salin Alamat Lengkap'}</span>
                          </button>
                          
                          <a
                            href={cmsData.showroom.wiyungMapLink || "https://maps.google.com/?q=Jaya+Berkat+Mobil+Menganti+Babatan+Surabaya"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-accent-red/10 border border-accent-red/30 hover:bg-accent-red/20 text-accent-red text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-bold"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            <span>Buka Navigasi Map</span>
                          </a>

                          <span className="text-[10px] text-gray-500 font-mono py-1.5 px-2">
                            Telpon: <span className={`${theme === 'light' ? 'text-slate-800' : 'text-white'} font-bold`}>{cmsData.showroom.wiyungPhone}</span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-sans font-black text-sm text-slate-100 uppercase tracking-wide">
                              Showroom Showcase DTC Wonokromo
                            </h3>
                            <span className="text-[10px] text-[#D4A017] font-mono tracking-widest font-black uppercase mt-1 inline-block">
                              Bursa Mobil Bekas Indoor Terlengkap Surabaya
                            </span>
                          </div>
                          <span className="bg-[#D4A017]/10 text-[#D4A017] text-[9px] font-bold px-2 py-0.5 rounded border border-[#D4A017]/20 uppercase font-mono shrink-0">
                            Mall Outlet
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed font-sans font-medium">
                          {cmsData.showroom.dtcAddress || "Bursa Mobil Bekas DTC Wonokromo, Lt. 5 Blok B 18B-19, Surabaya"}
                        </p>

                        {/* Interactive Action Badges */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            onClick={() => handleCopyAddress('dtc', cmsData.showroom.dtcAddress)}
                            className={`${theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200' : 'bg-navy-deep hover:bg-navy-light text-slate-300 hover:text-white border-white/5'} text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer font-bold`}
                          >
                            <Copy className="w-3.5 h-3.5 text-accent-red" />
                            <span>{copiedBranch === 'dtc' ? 'Disalin! ✓' : 'Salin Alamat Lengkap'}</span>
                          </button>
                          
                          <a
                            href={cmsData.showroom.dtcMapLink || "https://maps.google.com/?q=DTC+Wonokromo+Surabaya"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-accent-red/10 border border-accent-red/30 hover:bg-accent-red/20 text-accent-red text-[10px] font-mono uppercase px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-bold"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            <span>Buka Navigasi Map</span>
                          </a>

                          <span className="text-[10px] text-gray-500 font-mono py-1.5 px-2">
                            Telpon: <span className={`${theme === 'light' ? 'text-slate-800' : 'text-white'} font-bold`}>{cmsData.showroom.dtcPhone}</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Embedded Iframe Map Container with modern aspect ratio */}
                  <div className={`w-full h-80 ${theme === 'light' ? 'bg-slate-50 border-slate-250' : 'bg-[#070b13] border-white/5'} relative border-t`}>
                    <iframe
                      src={mapIframeUrl}
                      className="w-full h-full border-none grayscale"
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Google Maps Location"
                    ></iframe>
                  </div>

                </div>

                {/* Operating hours footer details */}
                <div className={`${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#0b101c] border-white/5 text-slate-400'} p-4.5 border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left font-mono text-xs shadow-md`}>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'} font-bold`}>
                      <Clock className="w-4 h-4 text-[#D4A017]" />
                      <span>JAM KERJA SHORROOM JBM:</span>
                    </div>
                    <p className="text-[11px] font-medium leading-relaxed pl-6">
                      {cmsData.showroom.operatingHours || "Senin – Sabtu (08:00 – 17:00 WIB), Minggu (08:00 – 16:00 WIB)"}
                    </p>
                  </div>
                  <div className={`sm:max-w-xs text-[10px] text-accent-red border-l sm:border-l ${theme === 'light' ? 'border-slate-200' : 'border-white/5'} pl-2 sm:pl-4`}>
                    📢 Khusus kunjungan di Hari Minggu sangat disarankan membuat janji terlebih dahulu agar didampingi sales advisor pilihan Anda.
                  </div>
                </div>

              </div>
              
              {/* Right Side: Consultant Inquiry Form (col-span-5) */}
              <div className="lg:col-span-5 bg-navy-card border border-navy-light rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
                <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-accent-red text-white text-[8px] font-mono font-black uppercase px-2.5 py-1 rounded tracking-[0.2em] shadow-lg">
                  FAST RESPONSE
                </div>

                <div className="space-y-2">
                  <h3 className="font-sans font-black text-xl text-slate-100 uppercase tracking-wider leading-tight">
                    Cari Unit Spesifik?
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Ajukan pemesanan tipe mobil tertentu yang belum ada di katalog kami. Tim pencari kami akan melacak surat & kondisi unit langsung di lapangan secara cepat.
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="bg-emerald-600/10 border border-emerald-500/20 p-8 text-center rounded-xl space-y-3 text-emerald-400">
                    <span className="text-3xl inline-block animate-bounce">💬</span>
                    <h4 className="font-sans font-black text-sm uppercase">Permohonan Terkirim!</h4>
                    <p className="text-xs text-slate-300 leading-normal">
                      Menghubungkan langsung dengan konsultan senior kami via WhatsApp untuk pemrosesan detail...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1 font-mono">
                          Nama Lengkap Anda
                        </label>
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Misal: Bapak Gunawan"
                          className="w-full bg-navy-deep border border-navy-light rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] outline-none transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1 font-mono">
                          Nomor WhatsApp Aktif
                        </label>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="Contoh: 0812345678"
                          className="w-full bg-navy-deep border border-navy-light rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] outline-none transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1 font-mono">
                          Spesifikasi Mobil yang Dicari
                        </label>
                        <textarea
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Contoh: Saya sedang mencari Toyota Fortuner VRZ Diesel AT Tahun 2019-2021, warna hitam plat L asli tgn 1. Anggaran maksimal 390jt."
                          className="w-full bg-navy-deep border border-navy-light rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-600 resize-none focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017] outline-none transition-all font-sans"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-accent-red hover:bg-[#C0392B] text-white py-3 px-4 rounded-xl text-xs font-sans font-black uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-lg shadow-red-950/20 hover:scale-[1.01] flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Kirim Permintaan Konsultasi</span>
                    </button>
                  </form>
                )}

              </div>

            </div>

            {/* Premium Visit FAQs Section for JBM Visitors (Solves making it look more interesting!) */}
            <div className="space-y-6 pt-6 text-left border-t border-white/5">
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-accent-red uppercase tracking-widest font-bold">HELPFUL FREQUENTLY ASKED QUESTIONS</span>
                <h3 className="font-sans font-black text-lg text-slate-100 uppercase tracking-tight">
                  💡 Tips & Panduan Berkunjung Ke Showroom Kami
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-[#0b101c] p-5 rounded-2xl border border-white/5 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-red-950/25 border border-red-500/10 flex items-center justify-center text-accent-red text-xs font-bold font-mono">
                    01
                  </div>
                  <h4 className="font-sans font-black text-xs text-slate-200 uppercase tracking-wide">
                    Apakah Bisa Tes Drive Unit Sebelum Deal?
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Tentu saja bisa! Seluruh mobil kami bebas dipersiapkan untuk test drive secara langsung agar Anda mantap merasakan performa mesin kemudi, transmisi, dan kaki-kaki unit. Pastikan membawa SIM A aktif guna kenyamanan pendampingan.
                  </p>
                </div>

                <div className="bg-[#0b101c] p-5 rounded-2xl border border-white/5 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/25 border border-[#D4A017]/10 flex items-center justify-center text-[#D4A017] text-xs font-bold font-mono">
                    02
                  </div>
                  <h4 className="font-sans font-black text-xs text-slate-200 uppercase tracking-wide">
                    Periksa Unit Ke Bengkel Resmi / Pihak Ketiga?
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    JBM sangat mengedepankan keterbukaan transparansi tinggi. Kami sangat mempersilakan jika Anda ingin menyewa jasa inspektor independen (seperti Otospector) atau membawa unit ke bengkel resmi terdekat untuk proses check-up sasis dan data log elektrikal.
                  </p>
                </div>

                <div className="bg-[#0b101c] p-5 rounded-2xl border border-white/5 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-950/25 border border-blue-500/10 flex items-center justify-center text-blue-400 text-xs font-bold font-mono">
                    03
                  </div>
                  <h4 className="font-sans font-black text-xs text-slate-200 uppercase tracking-wide">
                    Kelengkapan Dokumen BPKB & Pajak STNK?
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Jaminan keabsahan dokumen kami garansi penuh 100%! Semua unit memiliki BPKB, STNK, Faktur Pembelian Asli, Buku Servis, serta kunci cadangan yang tersimpan aman di brankas showroom JBM. Kami menjamin dokumen siap divalidasi ke Samsat Surabaya kapan saja.
                  </p>
                </div>

              </div>
            </div>

          </div>
        );
      })()}


      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* FOOTER */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab !== 'hall-of-fame' && (
        <footer className="bg-navy-deep border-t border-navy-light py-12 px-4 sm:px-6 lg:px-8 text-xs font-sans text-slate-500">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-accent-red text-white w-6 h-6 rounded flex items-center justify-center font-bold text-xs shadow shadow-red-950/20">
                  JB
                </div>
                <span className="font-sans font-black text-sm text-slate-100 uppercase tracking-wider">
                  {cmsData.hero.titlePrimary ? 'Jaya Berkat Mobil' : 'JBM'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Dealer terpercaya mobil bekas keluarga di Kota Surabaya. Menghadirkan unit bersertifikasi, transparan, bebas bekas kecelakaan hebat maupun banjir kotor.
              </p>
            </div>

            <div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-100 mb-3 text-left">Cabang Showroom</h4>
              <ul className="space-y-2 text-[11px] list-none p-0 m-0 text-left">
                <li className="text-slate-400">Showroom Wiyung (Utama)</li>
                <li className="text-slate-400">DTC Wonokromo Lt.5 Blok A</li>
              </ul>
            </div>

            <div>
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-100 mb-3 text-left">Layanan Kami</h4>
              <ul className="space-y-2 text-[11px] list-none p-0 m-0 text-left">
                <li>
                  <button onClick={() => setActiveTab('mobil-dijual')} className="text-slate-400 hover:text-accent-red hover:underline p-0 bg-transparent border-none cursor-pointer">
                    Katalog Unit Ready
                  </button>
                </li>
                <li>
                  <a href="#wa" onClick={(e) => { e.preventDefault(); window.open('https://wa.me/6281330253797', '_blank'); }} className="text-slate-400 hover:text-accent-red hover:underline">
                    Konsultasi Tukar Tambah
                  </a>
                </li>
                <li>
                  <button onClick={() => setActiveTab('profil')} className="text-slate-400 hover:text-accent-red hover:underline p-0 bg-transparent border-none cursor-pointer">
                    Profil Garansi Unit
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-100 text-left">Ikuti Sosial Media</h4>
              <div className="flex gap-2 flex-wrap">
                {['Instagram', 'TikTok', 'YouTube', 'Facebook'].map(plat => (
                  <span key={plat} className="px-2.5 py-1 bg-navy-card hover:bg-accent-red/20 border border-navy-light rounded text-[10px] text-slate-400 hover:text-white cursor-pointer transition-colors font-mono">
                    {plat}
                  </span>
                ))}
              </div>
            </div>

          </div>

          <div className="mx-auto max-w-7xl border-t border-navy-light mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
            <p className="text-[10px] text-slate-500 font-sans tracking-wide">
              © 2026 JAYA BERKAT MOBIL SURABAYA • HAK CIPTA DILINDUNGI
            </p>
            <div className="text-[10px] text-slate-500 font-sans flex items-center gap-2">
              <span>Sistem internal:</span>
              <button
                onClick={() => setCmsOpen && setCmsOpen(!cmsOpen)}
                className="text-slate-400 hover:text-accent-red underline bg-transparent border-none cursor-pointer font-bold transition-colors"
              >
                {cmsOpen ? 'Tutup Panel Staf (CMS)' : 'Masuk Portal Staf JBM'}
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* Spec details card dialog modal popup */}
      <CarDetailModal car={selectedCar} onClose={() => setSelectedCar(null)} />

    </div>
  );
};
