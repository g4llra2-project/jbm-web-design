import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, MessageCircle, Sun, Moon, X, Sparkles, Sliders } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cmsOpen: boolean;
  setCmsOpen: (open: boolean) => void;
  brandTitle: string;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cmsOpen,
  setCmsOpen,
  brandTitle,
  theme,
  setTheme,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('16:00');

  const forceMinimal = isScrolled || activeTab === 'hall-of-fame';

  useEffect(() => {
    // Scroll Detection
    const handleScroll = () => {
      if (window.scrollY > 75) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial safe check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Dynamic Clock
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'beranda', label: 'Beranda', tag: 'Selamat Datang', desc: 'Halaman utama, sorotan unit, & promo eksklusif' },
    { id: 'mobil-dijual', label: 'Mobil Dijual', tag: 'Katalog Aktif', desc: 'Pilihan mobil premium kondisinya bergaransi' },
    { id: 'profil', label: 'Profil JBM', tag: 'Tentang Kami', desc: 'Sejarah, visi-misi, & jaminan mutu showroom' },
    { id: 'hall-of-fame', label: 'Hall of Fame', tag: '3D Blueprint', desc: 'Pameran interaktif unit legendaris terkirim' },
    { id: 'promo-artikel', label: 'Promo & Artikel', tag: 'Informasi JBM', desc: 'Sajian lengkap promo terbaru, panduan & edukasi otomotif' },
    { id: 'kontak', label: 'Kontak', tag: 'Hubungi Sales', desc: 'Alamat kantor cabang, nomor telepon, & map lokasi' },
  ];

  const handleMenuClick = (id: string) => {
    setActiveTab(id);
    setMenuOpen(false);
    // Smooth scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 1. DEFAULT HEADER (Only visible at Top / scrollTop < 75) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <motion.header
        className="w-full bg-navy-card/90 border-b border-navy-light backdrop-blur-md relative z-40 transition-shadow duration-300"
        animate={{
          y: forceMinimal ? -140 : 0,
          opacity: forceMinimal ? 0 : 1,
        }}
        transition={{
          duration: 0.35,
          ease: 'easeInOut'
        }}
        style={{
          height: forceMinimal ? 0 : 'auto',
          overflow: forceMinimal ? 'hidden' : 'visible',
          pointerEvents: forceMinimal ? 'none' : 'auto',
        }}
      >
        {/* Top Announcement Bar */}
        <div className="bg-navy-deep py-1.5 px-4 text-center text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.12em] text-slate-300 flex items-center justify-between mx-auto max-w-7xl border-b border-navy-light/10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-200 font-bold">Showroom Buka Hari Ini</span>
            <span className="text-slate-400 font-normal hidden sm:inline">• Surabaya (Wiyung & DTC Mall)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-accent-red" />
              <span>08:00 - 17:00 WIB • {currentTime} SURABAYA</span>
            </div>
          </div>
        </div>

        {/* Brand Bar */}
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between font-sans">
            
            {/* Logo Brand */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleMenuClick('beranda')}>
              <div className="bg-accent-red text-white w-9 h-9 rounded flex items-center justify-center font-black text-sm tracking-wide shadow-md shadow-accent-red/20 transition-transform duration-300 hover:rotate-3">
                JB
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-black text-sm text-slate-100 tracking-wide leading-none">
                  {brandTitle || 'Jaya Berkat'} <span className="text-accent-red">Mobil</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest leading-none mt-1">
                  Dealer Terpercaya Surabaya
                </span>
              </div>
            </div>

            {/* Navigation Links inside default view */}
            <div className="hidden md:flex space-x-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`relative px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all duration-200 outline-none cursor-pointer
                      ${isActive 
                        ? 'text-slate-100' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-navy-light/30'
                      }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span 
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent-red rounded-full" 
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Actions for default view */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center justify-center p-2 rounded bg-navy-card/85 hover:bg-navy-light/60 border border-navy-light text-slate-300 hover:text-white transition-all duration-200 shadow-sm cursor-pointer"
                title={theme === 'dark' ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-accent-red" />
                )}
              </button>

              {/* Contact Button */}
              <a
                href="https://wa.me/6281330253797?text=Halo%2520Jaya%2520Berkat%2520Mobil,%2520saya%2520ingin%252520tanya%252520stok%252520terbaru%252520mobilnya."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-accent-red hover:bg-accent-red-hover text-white px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-red-950/20"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Hubungi Sales (WA)</span>
              </a>

              {/* Simple Admin toggler inside bar */}
              <button
                onClick={() => setCmsOpen(!cmsOpen)}
                className={`p-2 rounded border transition-colors cursor-pointer ${cmsOpen ? 'bg-accent-red/20 border-accent-red/40 text-accent-red' : 'bg-navy-card border-navy-light text-slate-400 hover:text-white'}`}
                title="Toggle Panel CMS"
              >
                <Sliders className="w-4 h-4" />
              </button>

              {/* Mobile trigger for default view */}
              <button
                onClick={() => setMenuOpen(true)}
                className="inline-flex md:hidden items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/5 outline-none cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 2. PREMIUM RESIZABLE MINIST DESIGNER NAVBAR (Visible when scrolled) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {forceMinimal && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none flex justify-between items-center"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          >
            {/* Elegant architect-dot Left Header Capsule */}
            <motion.div
              onClick={() => handleMenuClick('beranda')}
              className="pointer-events-auto bg-black border border-white/10 hover:border-white/30 px-4 py-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.85)] hover:bg-[#080808] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-accent-red animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-white font-bold">
                {brandTitle || 'JAYA BERKAT'} <span className="text-gray-400 font-medium">.MOBIL</span>
              </span>
            </motion.div>

            {/* The 2 Iconic Luxury Architecture Buttons on the Right */}
            <div className="flex items-center gap-2.5 sm:gap-3 pointer-events-auto">
              
              {/* Button A: HUBUNGI KAMI */}
              <motion.a
                href="https://wa.me/6281330253797?text=Halo%20Jaya%20Berkat%20Mobil,%20saya%20ingin%20tanya%20unit%20mobil%20premium."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/95 hover:bg-white text-white hover:text-black border border-white/10 hover:border-white px-5 py-2.5 rounded-lg text-[10px] font-mono tracking-[0.18em] uppercase font-bold transition-all duration-300 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.85)] flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="hidden xs:inline">Hubungi Kami</span>
                <span className="xs:hidden">Chat</span>
              </motion.a>

              {/* Button B: MENU */}
              <motion.button
                onClick={() => setMenuOpen(true)}
                className="bg-black/95 hover:bg-white text-white hover:text-black border border-white/10 hover:border-white px-5 py-2.5 rounded-lg text-[10px] font-mono tracking-[0.2em] uppercase font-bold transition-all duration-300 backdrop-blur-md shadow-[0_15px_35px_rgba(0,0,0,0.85)] cursor-pointer flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent-red" />
                <span>Menu</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* 3. FULLSCREEN DETAILED LUXURY BLUEPRINT COVER OVERLAY MENU */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#040404]/98 md:bg-[#020202]/98 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 md:p-12 text-white overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            {/* Blueprint Grid Vector Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,#ffffff_0%,transparent_100%)]" />

            {/* OVERLAY HEADER LINE */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-accent-red text-white w-8 h-8 rounded flex items-center justify-center font-black text-xs tracking-wide">
                  JB
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">OFFICIAL ARCHIVE</span>
                  <span className="font-sans font-black text-xs text-white tracking-wide uppercase leading-none">
                    Jaya Berkat <span className="text-accent-red">Mobil</span>
                  </span>
                </div>
              </div>

              {/* Close Button styled like architectural specs */}
              <button
                onClick={() => setMenuOpen(false)}
                className="bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 px-3 py-1.5 rounded text-[8px] sm:text-[9px] font-mono tracking-[0.2em] uppercase font-bold transition-all duration-250 cursor-pointer flex items-center gap-1.5"
              >
                <span>CLOSE</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CORE BODY NAVIGATION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 my-auto py-4 relative z-10 w-full">
              
              {/* PRIMARY CONTENT (RIGHT SIDE IN LARGER VIEWS): Giant Vertical Index Menu - PLACED FIRST ON MOBILE */}
              <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col justify-center text-left">
                <nav className="space-y-4 md:space-y-5">
                  {menuItems.map((item, index) => {
                    const isActive = activeTab === item.id;
                    const numString = String(index + 1).padStart(2, '0');
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="group relative"
                      >
                        <button
                          onClick={() => handleMenuClick(item.id)}
                          className="w-full text-left flex flex-row items-baseline justify-between py-1.5 border-b border-white/5 hover:border-white/15 transition-all outline-none cursor-pointer"
                        >
                          <div className="flex items-baseline gap-3">
                            <span className="font-mono text-[10px] text-accent-red font-bold tracking-widest">
                              {numString} //
                            </span>
                            
                            <span className={`font-sans font-black text-lg xs:text-xl sm:text-2xl md:text-3xl uppercase tracking-tight transition-colors duration-200 group-hover:text-accent-red ${isActive ? 'text-white' : 'text-gray-400'}`}>
                              {item.label}
                            </span>
                          </div>

                          <span className="font-mono text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-[0.15em] opacity-80 group-hover:opacity-100 transition-opacity">
                            {item.tag}
                          </span>
                        </button>
                        
                        {/* Sub description is statically positioned to avoid annoying layout jumping */}
                        <div className="mt-1">
                          <p className="text-[10px] sm:text-[11px] font-sans text-gray-500 group-hover:text-gray-400 transition-colors font-normal pl-6 sm:pl-8 truncate max-w-xl">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* SECONDARY INFO (LEFT SIDE): Architectural Details & Telemetry Coordinates */}
              <div className="lg:col-span-4 order-2 lg:order-1 flex flex-col justify-between space-y-6 lg:space-y-8 font-sans text-left border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 pl-0 lg:pl-6">
                <div className="space-y-3">
                  <h4 className="text-[9px] font-mono uppercase tracking-[0.25em] text-accent-red font-black">
                     // LOKASI & REGISTRASI
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    Showroom kami di Surabaya selalu mengutamakan integritas dengan armada unit lengkap bersertifikat bebas banjir & tabrak.
                  </p>
                  
                  {/* Visual CAD-styled blueprint schema info */}
                  <div className="bg-[#0b0b0b] border border-white/5 p-2.5 rounded space-y-1.5 font-mono">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-500">CABANG 1:</span>
                      <span className="text-gray-300 font-bold">WIYUNG, SURABAYA BARAT</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-500">CABANG 2:</span>
                      <span className="text-gray-300 font-bold">DTC WONOKROMO MALL</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-500">WIB ZONE:</span>
                      <span className="text-gray-300 font-bold">{currentTime} (SURABAYA)</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-500">OPERATIONAL:</span>
                      <span className="text-emerald-500 font-bold">OPEN 08:00 - 17:00</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-[9px] font-mono uppercase tracking-[0.25em] text-gray-500 font-black">
                     // TEMA KANVAS
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex-1 flex items-center justify-center gap-1.5 border py-2 rounded text-[8px] sm:text-[9px] font-mono uppercase tracking-widest font-black cursor-pointer transition-all ${theme === 'dark' ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/10 hover:text-white'}`}
                    >
                      <Moon className="w-3 h-3" />
                      Slate Dark
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex-1 flex items-center justify-center gap-1.5 border py-2 rounded text-[8px] sm:text-[9px] font-mono uppercase tracking-widest font-black cursor-pointer transition-all ${theme === 'light' ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-white/10 hover:text-white'}`}
                    >
                      <Sun className="w-3 h-3" />
                      Studio Light
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* OVERLAY FOOTER COORDS */}
            <div className="flex flex-col sm:flex-row justify-between items-center border-t border-white/5 pt-4 text-[9px] font-mono text-gray-500 relative z-10 gap-3">
              <div>
                <span>© {new Date().getFullYear()} JAYA BERKAT MOBIL SURABAYA</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline">COORD: S 7.2575° / E 112.7521°</span>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer" onClick={() => setCmsOpen(!cmsOpen)}>
                  [ {cmsOpen ? 'MATIKAN' : 'AKTIFKAN'} OFFICE ADMIN MODE ]
                </span>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors text-slate-350"
                >
                  INSTAGRAM //
                </a>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
