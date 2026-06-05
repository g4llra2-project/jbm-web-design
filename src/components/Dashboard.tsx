import React, { useState } from 'react';
import { 
  CheckCircle2, ArrowRight, Phone, MessageCircle, MapPin, 
  Search, Shield, Star, Award, Users, Calendar, 
  Play, ExternalLink, Mail, UserCheck, ChevronRight, X
} from 'lucide-react';
import { CMSData, Car } from '../types';
import { CarIllustration } from './CarIllustration';
import { HallOfFameRoom } from './HallOfFameRoom';
import { ParallaxHero } from './ParallaxHero';
import { InfiniteCarScroll } from './InfiniteCarScroll';

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
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  cmsData, 
  activeTab, 
  setActiveTab,
  cmsOpen,
  setCmsOpen
}) => {
  // Filters for Catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedTrans, setSelectedTrans] = useState('All');
  const [priceRange, setPriceRange] = useState<number>(500000000); // Max budget filter

  // Filter for Gallery
  const [galleryCategory, setGalleryCategory] = useState<string>('All');
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  // Active blog detail model
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  // Contact form submission local state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  // Filter stock mobilization
  const filteredCars = cmsData.cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          car.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || car.brand === selectedBrand;
    const matchesTrans = selectedTrans === 'All' || car.transmission === selectedTrans;
    const matchesPrice = car.price <= priceRange;
    return matchesSearch && matchesBrand && matchesTrans && matchesPrice;
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fadeIn min-h-screen font-sans">
          
          {/* Header */}
          <div className="text-left space-y-2">
            <span className="text-[11px] font-mono text-accent-red uppercase tracking-[0.2em] font-bold block">
              KATALOG KHUSUS JBM SURABAYA
            </span>
            <h1 className="font-sans font-black text-3xl sm:text-4xl text-slate-100 uppercase tracking-tight">
              Cari Mobil Bekas Berkualitas
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Gunakan filter merek, harga, dan transmisi untuk mempermudah pencarian mobil impian keluarga Anda. Semua unit telah bersertifikasi.
            </p>
          </div>

          {/* Filtering Widgets Panel */}
          <div className="bg-navy-card border border-navy-light rounded-lg p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Search input - 3 col */}
            <div className="lg:col-span-4 relative">
              <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-mono mb-1">Cari Nama Mobil</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contoh: Innova, Avanza, Toyota..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-navy-deep border border-navy-light rounded pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-accent-red outline-none transition-colors"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Brand Category Filter Pills - 3 col */}
            <div className="lg:col-span-3">
              <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-mono mb-1">Merk Mobil</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-navy-deep border border-navy-light rounded px-3 py-2 text-xs text-slate-100 focus:border-accent-red outline-none select-none transition-colors"
              >
                {availableBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand === 'All' ? 'Semua Merk' : brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Transmission filter - 2 col */}
            <div className="lg:col-span-2">
              <label className="block text-[9px] uppercase tracking-wider text-slate-400 font-mono mb-1">Transmisi</label>
              <select
                value={selectedTrans}
                onChange={(e) => setSelectedTrans(e.target.value)}
                className="w-full bg-navy-deep border border-navy-light rounded px-3 py-2 text-xs text-slate-100 focus:border-accent-red outline-none select-none transition-colors"
              >
                <option value="All">Semua Transmisi</option>
                <option value="AT">AT (Matic)</option>
                <option value="MT">MT (Manual)</option>
              </select>
            </div>

            {/* Price slider range - 3 col */}
            <div className="lg:col-span-3">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                <span>MAX BUDGET</span>
                <span className="text-accent-red font-bold">
                  {priceRange === 500000000 ? 'No Limit' : `Rp ${(priceRange / 1000000).toFixed(0)} Juta`}
                </span>
              </div>
              <input
                type="range"
                min="100000000"
                max="500000000"
                step="10000000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1 bg-navy-deep rounded-lg appearance-none cursor-pointer accent-accent-red"
              />
            </div>

          </div>

          {/* Results Block */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <div 
                  key={car.id}
                  className="bg-navy-card border border-navy-light hover:border-accent-red rounded overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="relative">
                    {car.isSold ? (
                      <span className="absolute top-3 left-3 z-10 bg-accent-red text-white font-bold px-2 py-0.5 rounded uppercase tracking-widest text-[8px] shadow shadow-red-950/40">
                        TERJUAL
                      </span>
                    ) : car.badge !== 'NONE' ? (
                      <span className={`absolute top-3 left-3 z-10 text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow
                        ${car.badge === 'HOT' ? 'bg-accent-red text-white' : 'bg-navy-deep text-slate-300 border border-navy-light'}`}>
                        {car.badge}
                      </span>
                    ) : null}

                    {/* SVG Illustration of car structure */}
                    <CarIllustration type={car.image} brand={car.brand} isSold={car.isSold} />
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-sans font-bold text-slate-100 group-hover:text-accent-red transition-colors leading-tight uppercase tracking-wide">
                        {car.name}
                      </h3>
                      <div className="flex gap-2 text-[10px] font-mono text-slate-500 mt-1.5 uppercase tracking-wide">
                        <span>🗓️ {car.year}</span>
                        <span>⛽ {car.fuelType}</span>
                        <span>⚡ {car.engineCc} CC</span>
                      </div>
                    </div>

                    <div className="bg-navy-deep p-2.5 rounded font-mono text-[11px] text-slate-400 flex justify-between border border-navy-light/10">
                      <span>Transmisi:</span>
                      <span className="text-slate-100 font-bold">{car.transmission === 'AT' ? 'Otomatis' : 'Manual'}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-navy-light">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest block leading-none">HARGA CASH</span>
                        <span className="font-sans font-black text-base text-accent-red">
                          Rp {car.price.toLocaleString('id-ID')}
                        </span>
                      </div>

                      {/* WA Link with customizable unit details */}
                      <a
                        href={`https://wa.me/6281330253797?text=Halo%20Jaya%20Berkat%20Mobil,%20apakah%20mobil%20*${encodeURIComponent(car.name)}* ${car.year} masih%20ada?`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-navy-deep hover:bg-accent-red text-slate-300 hover:text-white px-3.5 py-1.5 rounded border border-navy-light hover:border-accent-red transition-all duration-200 text-xs font-bold uppercase tracking-wider"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-accent-red group-hover:text-white" />
                        <span>Tanya WA</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-navy-card text-center p-12 border border-navy-light rounded-lg space-y-3 shadow-lg">
              <p className="text-slate-400 text-sm">Tidak ada dekorasi unit mobil yang sesuai dengan kriteria filter Anda.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBrand('All');
                  setSelectedTrans('All');
                  setPriceRange(500000000);
                }}
                className="text-xs font-bold text-accent-red uppercase hover:underline font-mono"
              >
                Reset Semua Filter
              </button>
            </div>
          )}

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
              <span className="text-[10px] font-mono text-accent-red uppercase tracking-[0.2em] font-bold">PERSONAL SERVICE</span>
              <h2 className="font-sans font-black text-2xl text-slate-100 uppercase tracking-tight">Hubungi 5 Sales Advisor Kami</h2>
              <p className="text-slate-400 text-xs max-w-lg mx-auto">Kami siap melayani kebutuhan konsultasi mobil bekas Anda secara personal di dua lokasi showroom kami.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'Andik JBM', phone: '6285785649369', area: 'Showroom DTC', badge: 'Sales Advisor' },
                { name: 'Jevry JBM', phone: '6281330253797', area: 'Showroom Wiyung', badge: 'Manager' },
                { name: 'Yoan JBM', phone: '6281808383522', area: 'Showroom Wiyung', badge: 'Senior Advisor' },
                { name: 'Ricky JBM', phone: '6281380553331', area: 'Showroom DTC', badge: 'Sales Specialist' },
                { name: 'Fatchul JBM', phone: '6281270605758', area: 'Showroom Wiyung', badge: 'Sales Advisor' }
              ].map((sale, idx) => (
                <div key={idx} className="bg-navy-card border border-navy-light rounded p-4 text-center space-y-3 relative overflow-hidden group shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-navy-deep border border-navy-light text-accent-red font-black text-base flex items-center justify-center mx-auto group-hover:border-accent-red transition-colors duration-200">
                    {sale.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-sans font-black text-xs text-slate-100 leading-none block uppercase tracking-wide">{sale.name}</h4>
                    <span className="text-[9px] text-accent-red uppercase tracking-wider block mt-1 font-mono font-bold">{sale.badge}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 bg-navy-deep border border-navy-light/10 p-1.5 rounded">
                    {sale.area}
                  </div>
                  <a
                    href={`https://wa.me/${sale.phone.replace(/[^0-9]/g, '')}?text=Halo%20${sale.name},%20saya%20ingin%20konsultasi%20mengenai%20unit%20di%20JBM.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-navy-deep hover:bg-accent-red border border-navy-light hover:border-accent-red text-slate-300 hover:text-white py-1.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-accent-red group-hover:text-white" />
                    <span>WhatsApp</span>
                  </a>
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
                  {/* Real responsive image */}
                  <img 
                    src={getGalleryImageUrl(item.imageUrl)} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
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
                      src={imageUrl} 
                      alt={activeLightboxImage} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
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
            <h1 className="font-sans font-black text-3xl text-slate-100 uppercase tracking-tight">Promo Spesial & Panduan Otomotif</h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg">
              Temukan penawaran DP kredit spesial dan tips perawatan dari ahli inspektor kami. Dikembangkan secara mandiri lewat CMS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cmsData.articles.map((art) => (
              <div 
                key={art.id} 
                onClick={() => setActiveArticleId(art.id)}
                className="bg-navy-card hover:bg-navy-card/80 border border-navy-light hover:border-accent-red/60 p-5 rounded space-y-4 cursor-pointer transition-all duration-200 group shadow-lg"
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span className="bg-accent-red/10 border border-accent-red/30 px-2.5 py-0.5 text-accent-red font-semibold uppercase rounded tracking-wider">
                    {art.category}
                  </span>
                  <span>{art.date}</span>
                </div>
                
                <h3 className="font-sans font-bold text-base text-slate-100 group-hover:text-accent-red transition-colors leading-tight line-clamp-2 uppercase tracking-wide">
                  {art.title}
                </h3>

                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                  {art.content}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-navy-light text-[10px] font-mono text-slate-500 leading-none">
                  <span>⏱️ {art.readTime}</span>
                  <span className="text-accent-red group-hover:underline flex items-center gap-0.5 font-sans font-bold">
                    Baca Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
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
              <div className="relative max-w-2xl w-full bg-navy-card border border-navy-light rounded-lg overflow-hidden p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl">
                <button 
                  onClick={() => setActiveArticleId(null)}
                  className="absolute top-4 right-4 bg-navy-deep border border-navy-light hover:bg-[#E74C3C] hover:border-[#E74C3C] text-slate-400 hover:text-white font-bold p-1 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-2">
                  <span className="inline-block bg-accent-red/10 border border-accent-red/30 px-3 py-0.5 rounded text-[10px] font-mono text-accent-red tracking-widest font-bold uppercase mb-1">
                    {art.category} | JBM NEWS
                  </span>
                  <h2 className="font-sans font-black text-xl sm:text-2xl text-slate-100 tracking-tight leading-tight uppercase">
                    {art.title}
                  </h2>
                  <div className="text-[10px] text-slate-500 font-mono flex gap-4">
                    <span>Publikasi: {art.date}</span>
                    <span>Estimasi: {art.readTime}</span>
                  </div>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans border-t border-navy-light pt-4">
                  {art.content}
                </p>

                <div className="flex gap-2 pt-4 border-t border-navy-light">
                  <a
                    href="https://wa.me/6281330253797?text=Halo%20Jaya%20Berkat%20Mobil,%20saya%20tertarik%20dengan%20promo%20yang%20baru%20saya%20baca."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-accent-red hover:bg-accent-red-hover text-white text-center font-sans font-black uppercase text-xs py-2.5 rounded hover:scale-[1.01] transition-transform shadow-lg shadow-red-950/20"
                  >
                    Tanya Promo/Artikel Lewat WhatsApp
                  </a>
                  <button
                    onClick={() => setActiveArticleId(null)}
                    className="px-5 bg-navy-deep hover:bg-navy-light border border-navy-light text-white rounded text-xs transition-colors"
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
      {activeTab === 'kontak' && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn min-h-screen font-sans">
          
          <div className="text-left space-y-2">
            <span className="text-[10px] font-mono text-accent-red uppercase tracking-[0.2em] font-bold block">SHOWROOM LOCATIONS</span>
            <h1 className="font-sans font-black text-3xl text-slate-100 uppercase tracking-tight">Hubungi Jaya Berkat Mobil</h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Showroom kami tersebar di cabang Surabaya Barat (Wiyung) dan pusat kota (Darmo Trade Center Wonokromo). Silakan kunjungi unit fisik atau hubungi sales online.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Showroom Cards - 5 columns */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Cabang Wiyung */}
              <div className="bg-navy-card border border-navy-light rounded-lg p-5 space-y-3 shadow-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-sans font-black text-sm text-accent-red uppercase tracking-wide">
                    📍 Cabang Wiyung (Showroom Utama)
                  </h3>
                  <span className="bg-accent-red/10 text-accent-red text-[9px] font-bold px-2 py-0.5 rounded border border-accent-red/20 animate-pulse">
                    Ada Display Unit
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-sans">
                  {cmsData.showroom.wiyungAddress}
                </p>
                <div className="flex gap-2 text-xs pt-1">
                  <a
                    href="https://maps.google.com/?q=Wiyung+Surabaya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-accent-red hover:underline uppercase tracking-widest text-[9.5px] font-bold"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-navy-light">|</span>
                  <span className="text-slate-400 font-mono">Telp: {cmsData.showroom.wiyungPhone}</span>
                </div>
              </div>

              {/* Cabang DTC */}
              <div className="bg-navy-card border border-navy-light rounded-lg p-5 space-y-3 shadow-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-sans font-black text-sm text-accent-red uppercase tracking-wide">
                    📍 Cabang DTC Wonokromo (Showcase Pusat)
                  </h3>
                  <span className="bg-accent-red/10 text-accent-red text-[9px] font-bold px-2 py-0.5 rounded border border-accent-red/20">
                    Mall Showroom
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-sans">
                  {cmsData.showroom.dtcAddress}
                </p>
                <div className="flex gap-2 text-xs pt-1">
                  <a
                    href="https://maps.google.com/?q=DTC+Wonokromo+Surabaya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-accent-red hover:underline uppercase tracking-widest text-[9.5px] font-bold"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-navy-light">|</span>
                  <span className="text-slate-400 font-mono">Telp: {cmsData.showroom.dtcPhone}</span>
                </div>
              </div>

              {/* Operating status */}
              <div className="bg-navy-deep p-4 border border-navy-light rounded font-mono text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between items-center">
                  <span>JAM OPERASIONAL SHORROOM:</span>
                  <span className="text-slate-100 font-bold">{cmsData.showroom.operatingHours}</span>
                </div>
                <div className="text-[10px] text-accent-red font-bold">
                  ★ Khusus Hari Minggu silakan buat janji melalui sales advisor kami terlebih dahulu.
                </div>
              </div>

            </div>

            {/* Inquire submission contact form - 7 columns */}
            <div className="lg:col-span-7 bg-navy-card border border-navy-light rounded-lg p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="font-sans font-black text-base text-slate-100 uppercase tracking-wider">
                Ingin Konsultasi atau Cari Unit Spesifik?
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Silakan isi formulir di bawah ini. Tim Sales Specialist kami akan langsung menghubungi Anda di WhatsApp dalam kurun waktu kurang dari 10 menit!
              </p>

              {formSubmitted ? (
                <div className="bg-emerald-600/10 border border-emerald-500/20 p-8 text-center rounded space-y-2 text-emerald-400">
                  <span className="text-xl">✅</span>
                  <h4 className="font-sans font-bold text-sm">Pesan Terkirim!</h4>
                  <p className="text-xs text-slate-300">Menghubungkan langsung dengan Customer Care via WhatsApp...</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                        Nama Lengkap Anda
                      </label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Contoh: Bapak Wijaya"
                        className="w-full bg-navy-deep border border-navy-light rounded px-3 py-2 text-xs text-slate-100 focus:border-accent-red outline-none transition-colors placeholder-slate-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                        Nomor WhatsApp Serta HP
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Contoh: 0812XXXXXXXX"
                        className="w-full bg-navy-deep border border-navy-light rounded px-3 py-2 text-xs text-slate-100 focus:border-accent-red outline-none transition-colors placeholder-slate-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                      Pesan atau Mobil yang Diminati (Opsional)
                    </label>
                    <textarea
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Contoh: Saya sedang mencari Toyota Innova diesel 2021 bertransmisi matic, kisaran budget berapa ya?"
                      className="w-full bg-navy-deep border border-navy-light rounded px-3 py-2 text-xs text-slate-100 resize-none focus:border-accent-red outline-none transition-colors placeholder-slate-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent-red hover:bg-[#C0392B] text-white py-3 rounded text-xs font-sans font-black uppercase tracking-widest transition-colors duration-205 cursor-pointer shadow-lg shadow-red-950/20"
                  >
                    Kirim Form via WhatsApp
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>
      )}

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

    </div>
  );
};
