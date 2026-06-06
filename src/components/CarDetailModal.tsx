import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Calendar, Gauge, Fuel, ShieldCheck, 
  MessageCircle, Zap, Eye, Compass, Award, Building, FileText
} from 'lucide-react';
import { Car } from '../types';
import { optimizeImageUrl } from '../utils/imageOptimizer';

interface CarDetailModalProps {
  car: Car | null;
  onClose: () => void;
}

// Map each preset key to a curated set of 4 different angles/details (Exterior, Dashboard/Cockpit, Luxury Cabin, Rear/Engine Detail)
const GALLERY_PRESETS: Record<string, string[]> = {
  innova: [
    "https://images.unsplash.com/photo-1606016159991-dfe4f974be5c?auto=format&fit=crop&w=1200&q=80", // Exterior
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80", // Front grill
    "https://images.unsplash.com/photo-1552519155-53c84306913a?auto=format&fit=crop&w=1200&q=80", // Cockpit view
    "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80"  // Premium SUV back
  ],
  jazz: [
    "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80", // Exterior side
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80", // Dashboard cockpit
    "https://images.unsplash.com/photo-1627454823511-370188737c35?auto=format&fit=crop&w=1200&q=80", // Speedometer close-up
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"  // Dark alloy details
  ],
  veloz: [
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80", // Front high spec
    "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=1200&q=80", // Warm leather cabin
    "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80", // Executive wheel/headlight
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"  // Premium showroom profile
  ],
  xpander: [
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80", // Main silver profile
    "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80", // Dynamic layout
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80", // Abstract detail
    "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80"  // Exhaust status
  ],
  fortuner: [
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80", // Big black SUV mud profile
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80", // Dashboard steering wheel
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80", // Classic side profile
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"  // Luxury wheel center
  ],
  brio: [
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80", // Front red cockpit
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80", // Soft console
    "https://images.unsplash.com/photo-1552519155-53c84306913a?auto=format&fit=crop&w=1200&q=80", // Interior profile
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80"  // Speed side
  ]
};

// Default premium generic gallery to fallback/combine
const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80", // LED headlight detail
  "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=1200&q=80", // Premium leather interior
  "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80", // Reflection profile
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"  // Wheel details
];

export const CarDetailModal: React.FC<CarDetailModalProps> = ({ car, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  React.useEffect(() => {
    if (!car) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [car]);

  if (!car) return null;

  // Prepare images for the gallery
  const carKey = car.image.toLowerCase();
  let galleryImages: string[] = [];

  const customDetails = car.detailImages?.filter(img => !!img) || [];
  if (customDetails.length > 0) {
    galleryImages = [car.image, ...customDetails];
    // Pad with gorgeous default studio details if less than 4 elements are present
    let fallbackIdx = 1;
    while (galleryImages.length < 4) {
      galleryImages.push(DEFAULT_GALLERY[fallbackIdx % DEFAULT_GALLERY.length]);
      fallbackIdx++;
    }
  } else {
    const isUrl = car.image.startsWith('http://') || car.image.startsWith('https://');

    if (isUrl) {
      // If the main image is a custom URL, place it first and supplement with default studio details
      galleryImages = [car.image, ...DEFAULT_GALLERY.slice(1)];
    } else {
      // Use presets or fallback completely
      galleryImages = GALLERY_PRESETS[carKey] || [
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80", // default placeholder
        ...DEFAULT_GALLERY
      ];
    }
  }

  // Cap at 4 gallery images for beautiful, consistent grid alignment inside the modal interface
  galleryImages = galleryImages.slice(0, 4);

  const activeMainImage = galleryImages[activeImageIndex] || galleryImages[0];

  const formattedPrice = `Rp ${car.price.toLocaleString('id-ID')}`;
  
  // Custom pre-configured message text for WA link
  const waMessage = `Halo Jaya Berkat Mobil, saya tertarik dengan informasi lengkap dan jadwal test drive unit berikut:
- *Nama Unit:* ${car.name}
- *Spesifikasi Tahun:* ${car.year}
- *Harga Cash:* ${formattedPrice}
- *Tipe Bahan Bakar:* ${car.fuelType}
- *Kondisi transmisi:* ${car.transmission === 'AT' ? 'Otomatis' : 'Manual'}

Apakah unit ini masih tersedia di salah satu cabang Surabaya? Terima kasih.`;

  const waLink = `https://wa.me/6281330253797?text=${encodeURIComponent(waMessage)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/95 backdrop-blur-md">
        
        {/* Animated background overlay */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Main Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ cubicBezier: [0.16, 1, 0.3, 1], duration: 0.4 }}
          className="relative w-full max-w-5xl bg-[#0a0d14] rounded-lg border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden z-20 mx-auto my-auto"
        >
          {/* Header Bar */}
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-white/5 bg-black/40">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-mono text-accent-red font-bold uppercase tracking-[0.25em]">
                // DETIL SPESIFIKASI SPECS JBM
              </span>
              <span className="hidden sm:inline w-1 h-1 bg-white/30 rounded-full" />
              <span className="hidden sm:inline text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                ID UNIT: {car.id}
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.1em]"
            >
              <span>CLOSE</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* LEFT FRAME: Interactive Picture Gallery - 7 Columns */}
            <div className="lg:col-span-7 bg-black flex flex-col justify-between p-4 sm:p-5 space-y-4">
              
              {/* Main Expanded Window View */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-md overflow-hidden bg-neutral-950 border border-white/5">
                {car.isSold && (
                  <span className="absolute top-4 left-4 z-10 bg-accent-red text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-widest rounded shadow">
                    SOld OUT
                  </span>
                )}
                
                <img
                  src={optimizeImageUrl(activeMainImage, 900, 80)}
                  alt="Unit Expanded Angle Detail"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${car.isSold ? 'opacity-40 grayscale' : 'opacity-95'}`}
                  referrerPolicy="no-referrer"
                />

                {/* Aesthetic CAD Specs Overlays in Corner */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur border border-white/10 px-2 py-1 rounded">
                  <Eye className="w-3.5 h-3.5 text-accent-red" />
                  <span className="font-mono text-[8px] text-gray-300 tracking-wider">ANGULAR SCALE VIEW</span>
                </div>

                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded border border-white/5">
                  <p className="font-mono text-[7px] leading-none text-slate-500 uppercase tracking-widest mb-0.5">Brand Series</p>
                  <p className="font-sans font-black text-[10px] text-white uppercase tracking-tight">{car.brand} • SELECTION</p>
                </div>
              </div>

              {/* Angle Multi Thumbnails Slider Selector */}
              <div className="grid grid-cols-4 gap-2.5">
                {galleryImages.map((imgUrl, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-[4/3] rounded overflow-hidden border transition-all cursor-pointer ${
                        isActive 
                          ? 'border-accent-red shadow-lg shadow-accent-red/10 scale-[0.98]' 
                          : 'border-white/5 hover:border-white/20 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={optimizeImageUrl(imgUrl, 250, 60)}
                        alt={`Interior Close Up Angle-${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Technical tag label on thumb */}
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white/50 text-[6px] font-mono px-1 rounded">
                        ANG_{String(idx + 1).padStart(2, '0')}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Certification Highlights Badge */}
              <div className="bg-[#0e121a]/95 border border-white/5 text-left p-3.5 rounded flex items-start gap-3">
                <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded">
                  <ShieldCheck className="w-5 h-5 text-[#D4A017]" />
                </div>
                <div>
                  <h5 className="text-[10px] sm:text-xs font-sans font-bold text-[#D4A017] uppercase tracking-wide">
                    JBM CERTIFIED PRE-OWNED STANDARDS
                  </h5>
                  <p className="text-[9.5px] text-gray-400 font-sans mt-0.5 leading-relaxed">
                    Unit ini telah lulus uji kelayakan 150+ titik inspeksi menyeluruh. Dijamin 100% bebas banjir, bebas tabrak ekstrim, keaslian dokumen terjamin, dan mesin siap pakai langsung keluar showroom.
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT FRAME: Specifics Checklist Table & Meta Info - 5 Columns */}
            <div className="lg:col-span-5 bg-[#0e121a]/90 flex flex-col justify-between p-4 sm:p-5 border-t lg:border-t-0 lg:border-l border-white/10 text-left space-y-6">
              
              {/* Product Header details */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-accent-red uppercase tracking-widest font-black block">
                  READY STOCK • CABANG SURABAYA
                </span>
                <h2 className="font-sans font-black text-xl sm:text-2xl text-slate-100 leading-tight uppercase tracking-tight">
                  {car.name}
                </h2>
                
                <div className="flex items-baseline gap-2.5 pt-1.5">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                    HARGA CASH JBM:
                  </span>
                  <p className="font-sans font-black text-xl sm:text-2xl text-accent-red leading-none">
                    {formattedPrice}
                  </p>
                </div>
                
                {/* Credit simulation helper text */}
                <span className="text-[9px] text-[#D4A017] bg-[#D4A017]/10 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest">
                  ★ Melayani Tukar Tambah & Simulasi Kredit Bunga Ringan
                </span>
              </div>

              {/* Segmented Specs Specs List */}
              <div className="space-y-2">
                <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-[0.2em] font-black block">
                  // SPESIFIKASI DETIL (TECHNICAL OVERVIEW)
                </span>
                
                <div className="grid grid-cols-2 gap-2.5">
                  
                  {/* Spec Item */}
                  <div className="bg-black/40 border border-white/5 p-3 rounded flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-accent-red flex-shrink-0" />
                    <div>
                      <span className="text-[7.5px] font-mono text-slate-500 uppercase block tracking-wider">TAHUN PEMBUATAN</span>
                      <span className="text-xs font-sans font-black text-white">{car.year} SPEC</span>
                    </div>
                  </div>

                  {/* Spec Item */}
                  <div className="bg-black/40 border border-white/5 p-3 rounded flex items-center gap-2.5">
                    <Gauge className="w-4 h-4 text-[#D4A017] flex-shrink-0" />
                    <div>
                      <span className="text-[7.5px] font-mono text-slate-500 uppercase block tracking-wider">JARAK TEMPUH (KM)</span>
                      <span className="text-xs font-sans font-black text-white">{car.mileage.toLocaleString('id-ID')} KM</span>
                    </div>
                  </div>

                  {/* Spec Item */}
                  <div className="bg-black/40 border border-white/5 p-3 rounded flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div>
                      <span className="text-[7.5px] font-mono text-slate-500 uppercase block tracking-wider">KAPASITAS MESIN</span>
                      <span className="text-xs font-sans font-black text-white">{car.engineCc} CC</span>
                    </div>
                  </div>

                  {/* Spec Item */}
                  <div className="bg-black/40 border border-white/5 p-3 rounded flex items-center gap-2.5">
                    <Fuel className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div>
                      <span className="text-[7.5px] font-mono text-slate-500 uppercase block tracking-wider font-bold">BAHAN BAKAR</span>
                      <span className="text-xs font-sans font-black text-white uppercase">{car.fuelType}</span>
                    </div>
                  </div>

                </div>

                {/* Additional Spec Table lines for extra visual accuracy */}
                <div className="bg-black/30 border border-white/5 rounded-md p-3.5 space-y-2 font-mono text-[10px]">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-500 flex items-center gap-1 uppercase"><Compass className="w-3.5 h-3.5 text-gray-400" /> Transmisi Pilihan</span>
                    <span className="text-slate-200 font-bold uppercase">{car.transmission === 'AT' ? 'Otomatis (Automatic)' : 'Manual (Manual Space)'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-slate-500 flex items-center gap-1 uppercase"><Award className="w-3.5 h-3.5 text-gray-400" /> Sertifikasi Kelayakan</span>
                    <span className="text-emerald-500 font-bold uppercase flex items-center gap-0.5">★ TERVERIFIKASI JBM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-1 uppercase"><Building className="w-3.5 h-3.5 text-gray-400" /> Lokasi Unit Showroom</span>
                    <span className="text-[#D4A017] font-bold uppercase">CABANG SURABAYA</span>
                  </div>
                </div>

              </div>

              {/* CTA Action Buttons and Chat/Wa prompts */}
              <div className="pt-2.5 space-y-3 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-400 font-sans flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-gray-500" /> Dokumen Lengkap (STNK, BPKB, Faktur)
                  </span>
                  <span className="text-emerald-500 font-mono font-bold uppercase">ASLI & LENGKAP</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-sans font-black text-xs px-4 py-3 rounded uppercase tracking-wider transition-all duration-300 shadow shadow-emerald-900/20 hover:scale-[1.01]"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>TANYA DETAIL via WA</span>
                  </a>
                  
                  <button
                    onClick={() => {
                      window.open('tel:081330253797');
                    }}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-neutral-900 border border-white/10 hover:border-accent-red text-slate-300 hover:text-white font-mono text-[10px] px-4 py-3 rounded uppercase tracking-widest font-black transition-all"
                  >
                    <span>TELPON UTAMA JBM</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
