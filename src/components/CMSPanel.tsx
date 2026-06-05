import React, { useState } from 'react';
import { 
  Save, Car, Plus, Trash2, Edit, Check, Settings, 
  MessageSquare, FileText, Info, CheckSquare, X 
} from 'lucide-react';
import { CMSData, Car as CarType, Testimonial, BlogArticle, HallOfFameItem } from '../types';
import { ImageUploader } from './ImageUploader';

interface CMSPanelProps {
  cmsData: CMSData;
  onChange: (newData: CMSData) => void;
  onClose: () => void;
}

export const CMSPanel: React.FC<CMSPanelProps> = ({ cmsData, onChange, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'stok' | 'testimoni' | 'artikel' | 'kontak' | 'sales' | 'hof'>('hero');
  const [editingCarId, setEditingCarId] = useState<string | null>(null);

  // Car Form Local States
  const [carName, setCarName] = useState('');
  const [carBrand, setCarBrand] = useState('Toyota');
  const [carYear, setCarYear] = useState(2022);
  const [carPrice, setCarPrice] = useState(200000000);
  const [carMileage, setCarMileage] = useState(30000);
  const [carTransmission, setCarTransmission] = useState<'AT' | 'MT' | 'Manual' | 'Otomatis'>('AT');
  const [carFuel, setCarFuel] = useState<'Bensin' | 'Diesel' | 'Hybrid'>('Bensin');
  const [carCc, setCarCc] = useState('1.5');
  const [carBadge, setCarBadge] = useState<'BARU MASUK' | 'HOT' | 'SOLD' | 'NONE'>('BARU MASUK');
  const [carIsSold, setCarIsSold] = useState(false);
  const [carImage, setCarImage] = useState('sedan');
  const [carDetailImages, setCarDetailImages] = useState<string[]>(['', '', '', '']);

  // Hall of Fame Form Local States
  const [editingHofId, setEditingHofId] = useState<string | null>(null);
  const [hofName, setHofName] = useState('');
  const [hofCarName, setHofCarName] = useState('');
  const [hofDate, setHofDate] = useState('Mei 2026');
  const [hofImageUrl, setHofImageUrl] = useState('');
  const [hofLocation, setHofLocation] = useState('Surabaya');
  const [hofQuote, setHofQuote] = useState('');
  const [hofRating, setHofRating] = useState(5);

  // Notification Banner
  const [notif, setNotif] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  const updateHero = (key: keyof CMSData['hero'], value: string) => {
    const updated = {
      ...cmsData,
      hero: {
        ...cmsData.hero,
        [key]: value
      }
    };
    onChange(updated);
  };

  const updateShowroom = (key: keyof CMSData['showroom'], value: string) => {
    const updated = {
      ...cmsData,
      showroom: {
        ...cmsData.showroom,
        [key]: value
      }
    };
    onChange(updated);
  };

  const handleSaveCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carName.trim()) {
      alert('Nama Unit wajib diisi!');
      return;
    }

    // Filter out any completely empty details
    const cleanDetailImages = carDetailImages.filter(url => url.trim() !== '');

    if (editingCarId) {
      // Modify existing
      const updatedCars = cmsData.cars.map(c => {
        if (c.id === editingCarId) {
          return {
            ...c,
            name: carName,
            brand: carBrand,
            year: Number(carYear),
            price: Number(carPrice),
            mileage: Number(carMileage),
            transmission: carTransmission,
            fuelType: carFuel,
            engineCc: carCc,
            badge: carBadge,
            isSold: carIsSold,
            image: carImage || 'sedan',
            detailImages: cleanDetailImages
          };
        }
        return c;
      });
      onChange({ ...cmsData, cars: updatedCars });
      setEditingCarId(null);
      showNotification('Unit berhasil diperbarui!');
    } else {
      // Add new
      const newCar: CarType = {
        id: `car-${Date.now()}`,
        brand: carBrand,
        name: carName,
        year: Number(carYear),
        mileage: Number(carMileage),
        transmission: carTransmission,
        price: Number(carPrice),
        badge: carBadge,
        image: carImage || 'sedan',
        fuelType: carFuel,
        isSold: carIsSold,
        engineCc: carCc,
        detailImages: cleanDetailImages
      };
      onChange({ ...cmsData, cars: [newCar, ...cmsData.cars] });
      showNotification('Unit baru berhasil ditambahkan!');
    }

    // Reset Form
    resetCarForm();
  };

  const startEditCar = (car: CarType) => {
    setEditingCarId(car.id);
    setCarName(car.name);
    setCarBrand(car.brand);
    setCarYear(car.year);
    setCarPrice(car.price);
    setCarMileage(car.mileage);
    setCarTransmission(car.transmission);
    setCarFuel(car.fuelType);
    setCarCc(car.engineCc);
    setCarBadge(car.badge);
    setCarIsSold(car.isSold);
    setCarImage(car.image || 'sedan');
    
    // Format up to 4 detailed images
    const existingDetails = car.detailImages || [];
    const paddedDetails = [...existingDetails];
    while (paddedDetails.length < 4) {
      paddedDetails.push('');
    }
    setCarDetailImages(paddedDetails);
  };

  const handleDeleteCar = (carId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus unit mobil ini?')) {
      const filtered = cmsData.cars.filter(c => c.id !== carId);
      onChange({ ...cmsData, cars: filtered });
      showNotification('Unit berhasil dihapus!');
    }
  };

  const resetCarForm = () => {
    setEditingCarId(null);
    setCarName('');
    setCarBrand('Toyota');
    setCarYear(2022);
    setCarPrice(200000000);
    setCarMileage(30000);
    setCarTransmission('AT');
    setCarFuel('Bensin');
    setCarCc('1.5');
    setCarBadge('BARU MASUK');
    setCarIsSold(false);
    setCarImage('sedan');
    setCarDetailImages(['', '', '', '']);
  };

  const handleSaveHof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hofName.trim() || !hofCarName.trim() || !hofImageUrl.trim()) {
      alert('Nama Pelanggan, Nama Unit, dan URL Gambar wajib diisi!');
      return;
    }

    const currentHofList = cmsData.hallOfFame || [];

    if (editingHofId) {
      const updated = currentHofList.map(item => {
        if (item.id === editingHofId) {
          return {
            ...item,
            name: hofName,
            carName: hofCarName,
            date: hofDate,
            imageUrl: hofImageUrl,
            location: hofLocation,
            quote: hofQuote,
            rating: Number(hofRating)
          };
        }
        return item;
      });
      onChange({ ...cmsData, hallOfFame: updated });
      setEditingHofId(null);
      showNotification('Hall of Fame berhasil diperbarui!');
    } else {
      const newItem: HallOfFameItem = {
        id: `hof-${Date.now()}`,
        name: hofName,
        carName: hofCarName,
        date: hofDate,
        imageUrl: hofImageUrl,
        location: hofLocation,
        quote: hofQuote,
        rating: Number(hofRating)
      };
      onChange({ ...cmsData, hallOfFame: [newItem, ...currentHofList] });
      showNotification('Testimoni foto serah terima berhasil ditambahkan!');
    }

    resetHofForm();
  };

  const startEditHof = (item: HallOfFameItem) => {
    setEditingHofId(item.id);
    setHofName(item.name);
    setHofCarName(item.carName);
    setHofDate(item.date);
    setHofImageUrl(item.imageUrl);
    setHofLocation(item.location);
    setHofQuote(item.quote);
    setHofRating(item.rating);
  };

  const handleDeleteHof = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus testimonial foto serah terima ini dari Hall of Fame?')) {
      const currentHofList = cmsData.hallOfFame || [];
      const filtered = currentHofList.filter(item => item.id !== id);
      onChange({ ...cmsData, hallOfFame: filtered });
      showNotification('Item Hall of Fame berhasil dihapus!');
    }
  };

  const resetHofForm = () => {
    setEditingHofId(null);
    setHofName('');
    setHofCarName('');
    setHofDate('Mei 2026');
    setHofImageUrl('');
    setHofLocation('Surabaya');
    setHofQuote('');
    setHofRating(5);
  };

  const updateTestimonial = (id: string, text: string) => {
    const updated = cmsData.testimonials.map(t => {
      if (t.id === id) return { ...t, text };
      return t;
    });
    onChange({ ...cmsData, testimonials: updated });
  };

  const updateArticle = (id: string, key: keyof BlogArticle, value: string) => {
    const updated = cmsData.articles.map(art => {
      if (art.id === id) return { ...art, [key]: value };
      return art;
    });
    onChange({ ...cmsData, articles: updated });
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f1d] border-l border-white/5 text-gray-200">
      {/* Header Panel */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#101c33]">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#D4A017] animate-spin" />
          <h2 className="font-serif font-black uppercase text-sm tracking-widest text-[#F0C040]">
            CMS Control Center
          </h2>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Save Notification Toast */}
      {notif && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-mono flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{notif}</span>
        </div>
      )}

      {/* Sub Tabs Menu - 4-Column Grid to ensure all 7 tabs + 1 placeholder are fully visible */}
      <div className="grid grid-cols-4 gap-[1px] bg-white/5 border-b border-white/5 shrink-0">
        {[
          { id: 'hero', label: '🚀 General' },
          { id: 'stok', label: '🚘 Stok Mobil' },
          { id: 'testimoni', label: '⭐ Testimoni' },
          { id: 'hof', label: '🏆 Hall of Fame' },
          { id: 'artikel', label: '📰 Artikel' },
          { id: 'sales', label: '👤 Sales Team' },
          { id: 'kontak', label: '📍 Alamat' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`py-3 text-[8px] sm:text-[9px] font-sans font-black uppercase tracking-wider text-center outline-none transition-all duration-150 flex flex-col items-center justify-center gap-1
              ${activeSubTab === tab.id 
                ? 'bg-[#152342] text-[#F0C040] font-sans border-b-2 border-[#D4A017]' 
                : 'bg-[#0e172a] text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
        {/* Empty placeholder to complete the 8-cell layout (4x2) */}
        <div className="bg-[#0e172a] border-b border-transparent" />
      </div>

      {/* CMS content block - scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* ── SUB TAB: HERO ── */}
        {activeSubTab === 'hero' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#D4A017] border-b border-white/5 pb-2">
              Edit Halaman Utama Hero
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Tagline Pengumuman (Header Badge)
                </label>
                <input
                  type="text"
                  value={cmsData.hero.badgeText}
                  onChange={(e) => updateHero('badgeText', e.target.value)}
                  className="w-full bg-[#101c33] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#D4A017] outline-none"
                />
              </div>

              <div>
                <ImageUploader
                  label="Gambar Latar Belakang Hero (Background Canvas)"
                  currentValue={cmsData.hero.backgroundImage || ''}
                  onChange={(val) => updateHero('backgroundImage', val)}
                  presetOptions={[
                    { label: 'Porsche Headlight (Default)', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=2000&q=90' },
                    { label: 'Classic Sportscar Abstract', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=90' },
                    { label: 'Sleek Premium BMW Reflection', url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=2000&q=90' },
                    { label: 'Elegant Showroom Interior', url: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=2000&q=90' }
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                    Headline 1 (Navy/White)
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero.titlePrimary}
                    onChange={(e) => updateHero('titlePrimary', e.target.value)}
                    className="w-full bg-[#101c33] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#D4A017] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                    Headline 2 (Gold Accent)
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero.titleSecondary}
                    onChange={(e) => updateHero('titleSecondary', e.target.value)}
                    className="w-full bg-[#101c33] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#D4A017] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Deskripsi Penjualan Showroom
                </label>
                <textarea
                  rows={3}
                  value={cmsData.hero.description}
                  onChange={(e) => updateHero('description', e.target.value)}
                  className="w-full bg-[#101c33] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#D4A017] outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                    Nama Tombol Utama
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero.ctaTextPrimary}
                    onChange={(e) => updateHero('ctaTextPrimary', e.target.value)}
                    className="w-full bg-[#101c33] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#D4A017] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                    Nama Tombol Kedua
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero.ctaTextSecondary}
                    onChange={(e) => updateHero('ctaTextSecondary', e.target.value)}
                    className="w-full bg-[#101c33] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#D4A017] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded text-[11px] text-blue-300">
              <span className="font-bold">Info:</span> Semua perubahan teks di atas langsung diperbarui secara dinamis di halaman muka. Anda bisa melihat perubahannya secara instan.
            </div>
          </div>
        )}

        {/* ── SUB TAB: STOK MOBIL ── */}
        {activeSubTab === 'stok' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#D4A017] border-b border-white/5 pb-2 mb-3">
                {editingCarId ? '✏️ Edit Unit Mobil' : '➕ Tambah Unit Mobil ke Katalog'}
              </h3>

              <form onSubmit={handleSaveCar} className="space-y-3 bg-[#111a30] p-3 rounded border border-white/5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Merk Mobil</label>
                    <select
                      value={carBrand}
                      onChange={(e) => setCarBrand(e.target.value)}
                      className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-[#D4A017] select-none"
                    >
                      <option value="Toyota">Toyota</option>
                      <option value="Honda">Honda</option>
                      <option value="Mitsubishi">Mitsubishi</option>
                      <option value="Suzuki">Suzuki</option>
                      <option value="Daihatsu">Daihatsu</option>
                      <option value="Mazda">Mazda</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Tahun Unit</label>
                    <input
                      type="number"
                      value={carYear}
                      onChange={(e) => setCarYear(Number(e.target.value))}
                      className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-[#D4A017]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Nama Unit Lengkap (contoh: "Honda Jazz RS")</label>
                  <input
                    type="text"
                    value={carName}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setCarName(newName);
                      // Auto-select type on typing if we haven't modified carImage from sedan model
                      if (!editingCarId && carImage === 'sedan') {
                        if (newName.toLowerCase().includes('jazz')) setCarImage('jazz');
                        else if (newName.toLowerCase().includes('innova')) setCarImage('innova');
                        else if (newName.toLowerCase().includes('veloz') || newName.toLowerCase().includes('avanza')) setCarImage('veloz');
                        else if (newName.toLowerCase().includes('xpander')) setCarImage('xpander');
                        else if (newName.toLowerCase().includes('fortuner')) setCarImage('fortuner');
                        else if (newName.toLowerCase().includes('brio')) setCarImage('brio');
                      }
                    }}
                    placeholder="Contoh: Toyota Avanza Veloz"
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-[#D4A017]"
                  />
                </div>

                {/* Picture Settings Input Field with Beautiful Live Preview */}
                <ImageUploader
                  label="Gambar / Foto Unit Utama (Thumbnail)"
                  currentValue={carImage}
                  onChange={(val) => setCarImage(val)}
                  presetOptions={[
                    { label: 'Sleek Vector Sedan', url: 'sedan' },
                    { label: 'Toyota Innova', url: 'https://images.unsplash.com/photo-1606016159991-dfe4f974be5c?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Honda Jazz', url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Toyota Veloz', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Mitsubishi Xpander', url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Toyota Fortuner', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Honda Brio', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80' }
                  ]}
                />

                {/* 4 Detail Images Multi-Uploader Section */}
                <div className="bg-[#050914] border border-white/5 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-1">
                    <span className="text-[10px] font-mono text-[#D4A017] uppercase tracking-[0.1em] font-black">
                      ★ 4 GAMBAR ANGLE DETAIL (GALERI)
                    </span>
                    <span className="text-[8px] text-gray-500 font-mono">
                      SLIDER MODEL POPUP
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-normal">
                    Unggah atau tempel URL untuk 4 sudut / detail interior mobil agar pembeli dapat melihat spesifikasi lengkap di menu detail.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {carDetailImages.map((imgUrl, idx) => (
                      <div key={idx} className="bg-[#0b101c]/90 p-2 rounded border border-white/5">
                        <ImageUploader
                          label={`Gambar Detail #${idx + 1}`}
                          currentValue={imgUrl}
                          onChange={(val) => {
                            const updated = [...carDetailImages];
                            updated[idx] = val;
                            setCarDetailImages(updated);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Harga Unit (Rupiah)</label>
                    <input
                      type="number"
                      value={carPrice}
                      onChange={(e) => setCarPrice(Number(e.target.value))}
                      className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-[#D4A017]"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Odometer (KM)</label>
                    <input
                      type="number"
                      value={carMileage}
                      onChange={(e) => setCarMileage(Number(e.target.value))}
                      className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-[#D4A017]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Transmisi</label>
                    <select
                      value={carTransmission}
                      onChange={(e) => setCarTransmission(e.target.value as any)}
                      className="w-full bg-[#0a0f1d] border border-white/10 rounded px-1.5 py-1.5 text-[11px] text-white focus:border-[#D4A017]"
                    >
                      <option value="AT">AT (Matic)</option>
                      <option value="MT">MT (Manual)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Bahan Bakar</label>
                    <select
                      value={carFuel}
                      onChange={(e) => setCarFuel(e.target.value as any)}
                      className="w-full bg-[#0a0f1d] border border-white/10 rounded px-1.5 py-1.5 text-[11px] text-white focus:border-[#D4A017]"
                    >
                      <option value="Bensin">Bensin</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Engine CC</label>
                    <input
                      type="text"
                      value={carCc}
                      onChange={(e) => setCarCc(e.target.value)}
                      placeholder="1.5 / 2.4"
                      className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-[#D4A017]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Badge Promo</label>
                    <select
                      value={carBadge}
                      onChange={(e) => setCarBadge(e.target.value as any)}
                      className="w-full bg-[#0a0f1d] border border-white/10 rounded px-1.5 py-1.5 text-[11px] text-white focus:border-[#D4A017]"
                    >
                      <option value="BARU MASUK">BARU MASUK</option>
                      <option value="HOT">HOT UNIT</option>
                      <option value="SOLD">SOLD</option>
                      <option value="NONE">NO BADGE</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pl-2">
                    <input
                      type="checkbox"
                      id="car_sold"
                      checked={carIsSold}
                      onChange={(e) => setCarIsSold(e.target.checked)}
                      className="w-4 h-4 text-[#D4A017] rounded border-white/10 accent-[#E74C3C]"
                    />
                    <label htmlFor="car_sold" className="text-[11px] font-sans font-bold uppercase tracking-wider text-red-400 cursor-pointer">
                      Selesai Dijual (SOLD)
                    </label>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#D4A017] hover:bg-[#F0C040] text-[#0A1128] font-serif font-black uppercase text-xs py-2 rounded transition-colors duration-200"
                  >
                    {editingCarId ? 'Perbarui Unit' : 'Tambahkan Unit'}
                  </button>
                  {editingCarId && (
                    <button
                      type="button"
                      onClick={resetCarForm}
                      className="px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 border-b border-white/5 pb-2 mb-2">
                Daftar Stok Unit Aktif ({cmsData.cars.length} Mobil)
              </h3>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {cmsData.cars.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-2 bg-[#0d162a] border border-white/5 rounded">
                    <div>
                      <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                        <span>{c.name}</span>
                        {c.isSold && <span className="bg-red-600/30 text-red-500 px-1 text-[8px] rounded uppercase font-black tracking-widest border border-red-500/30">SOLD</span>}
                        {c.badge !== 'NONE' && !c.isSold && <span className="bg-amber-500/20 text-[#D4A017] px-1 text-[8px] rounded uppercase font-serif font-semibold">{c.badge}</span>}
                      </div>
                      <div className="text-[9px] text-gray-400 font-mono mt-0.5">
                        {c.year} • {c.transmission} • Rp {c.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => startEditCar(c)}
                        className="p-1.5 bg-blue-900/30 text-blue-400 border border-blue-500/20 rounded hover:bg-blue-800/40"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCar(c.id)}
                        className="p-1.5 bg-red-950/40 text-red-400 border border-red-500/10 rounded hover:bg-red-900/60"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SUB TAB: TESTIMONI ── */}
        {activeSubTab === 'testimoni' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Section 1: Standard text testimonials */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#D4A017] border-b border-white/5 pb-2">
                ⭐⭐ Review Google Showroom JBM
              </h3>
              <p className="text-[10px] text-gray-400 mt-1 leading-normal text-left">
                Manajemen review google bintang 5 yang diambil dari Google Maps Showroom Surabaya Wiyung dan DTC Mall Wonokromo.
              </p>

              {cmsData.testimonials.map((t, index) => (
                <div key={t.id} className="bg-[#111a30] p-3 rounded border border-white/5 space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white uppercase">{t.name} • <span className="text-[#D4A017]">{t.carOwned}</span></span>
                    <span className="text-[9px] text-[#D4A017] font-bold">★ {t.rating} / 5</span>
                  </div>
                  <label className="block text-[8px] uppercase tracking-wider text-gray-400">Isi Review Singkat</label>
                  <textarea
                    rows={2}
                    value={t.text}
                    onChange={(e) => updateTestimonial(t.id, e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none resize-none font-sans"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SUB TAB: HALL OF FAME ── */}
        {activeSubTab === 'hof' && (
          <div className="space-y-6 animate-fadeIn text-left pb-6">
            <div className="border-b border-white/5 pb-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#D4A017]">
                🏆 Sahabat JBM (Hall of Fame)
              </h3>
              <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                Di sini Anda bisa mengelola daftar pembeli bahagia JBM yang tampil di halaman "Hall Of Fame". Anda dapat menambahkan foto serah terima/delivery, ulasan langsung, dan bintang kepuasan pelanggan secara live!
              </p>
              {editingHofId && (
                <button 
                  onClick={resetHofForm}
                  className="mt-2 text-[9px] font-bold text-red-400 hover:underline uppercase tracking-wide cursor-pointer flex items-center gap-1"
                >
                  Batal Edit (ID: {editingHofId})
                </button>
              )}
            </div>

            {/* Form to insert/modify HOF unit delivery details */}
            <form onSubmit={handleSaveHof} className="bg-[#101c33]/70 border border-white/10 rounded-lg p-3 space-y-3">
              <div className="text-[10px] font-sans font-bold text-gray-300 uppercase tracking-widest pb-1 border-b border-white/5 flex items-center justify-between border-b border-white/5 pb-1">
                <span>{editingHofId ? '✍️ Edit Sahabat JBM' : '➕ Tambah Sahabat JBM baru'}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Nama Pelanggan / Keluarga</label>
                  <input
                    type="text"
                    value={hofName}
                    onChange={(e) => setHofName(e.target.value)}
                    placeholder="Misal: Bpk. Rudi Wijaya"
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Unit Mobil Dibeli</label>
                  <input
                    type="text"
                    value={hofCarName}
                    onChange={(e) => setHofCarName(e.target.value)}
                    placeholder="Misal: Innova Reborn Diesel AT"
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Alamat Kotak (Gresik/Surabaya)</label>
                  <input
                    type="text"
                    value={hofLocation}
                    onChange={(e) => setHofLocation(e.target.value)}
                    placeholder="Misal: Wiyung, Surabaya"
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Bintang Rating</label>
                  <select
                    value={hofRating}
                    onChange={(e) => setHofRating(Number(e.target.value))}
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none select-none"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                    <option value="4">⭐⭐⭐⭐ (4)</option>
                    <option value="3">⭐⭐⭐ (3)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Bulan Tahun Pembelian</label>
                  <input
                    type="text"
                    value={hofDate}
                    onChange={(e) => setHofDate(e.target.value)}
                    placeholder="Misal: Mei 2026"
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none"
                  />
                </div>

                <ImageUploader
                  label="Foto Serah Terima Unit (Delivery)"
                  currentValue={hofImageUrl}
                  onChange={(val) => setHofImageUrl(val)}
                  presetOptions={[
                    { label: 'Happy Couple', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Big Indonesian Family', url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Business Professional', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Happy Single Buyer', url: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Indonesian Handshake', url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Testimonial Quote Singkat</label>
                <textarea
                  rows={3}
                  value={hofQuote}
                  onChange={(e) => setHofQuote(e.target.value)}
                  placeholder="Contoh: Sangat puas beli mobil di JBM, pengerjaan salon rapi, unit bebas karat, surat-surat super lengkap dilayani baik."
                  className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none resize-none font-sans"
                />
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-grow bg-[#D4A017] hover:bg-[#b08412] text-navy-deep font-bold px-3 py-2 rounded text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingHofId ? 'Perbarui Sahabat' : 'Posting Sahabat JBM'}</span>
                </button>
                {editingHofId && (
                  <button 
                    type="button"
                    onClick={resetHofForm}
                    className="bg-navy-deep hover:bg-white/5 border border-white/10 text-gray-300 px-3 py-2 rounded text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>

            {/* LIST OF EXISTING HOF ITEMS */}
            <div className="space-y-2 pt-2">
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest text-left">
                Daftar Pameran Terpasang (Count: { (cmsData.hallOfFame || []).length })
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {(cmsData.hallOfFame || []).map((item) => (
                  <div key={item.id} className="bg-[#111a30] p-2.5 rounded border border-white/5 flex items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-12 h-9 rounded bg-[#0a0f1d] overflow-hidden flex-shrink-0 border border-white/10">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-white truncate leading-tight uppercase">{item.name}</p>
                        <p className="text-[9px] font-mono text-accent-red font-bold truncate leading-tight mt-0.5">{item.carName}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => startEditHof(item)}
                        className="p-1 px-1.5 bg-blue-900/30 text-blue-400 border border-blue-500/20 rounded hover:bg-blue-800/40 cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteHof(item.id)}
                        className="p-1 px-1.5 bg-red-950/40 text-red-500 border border-red-500/10 rounded hover:bg-red-900/60 cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SUB TAB: ARTIKEL ── */}
        {activeSubTab === 'artikel' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#D4A017] border-b border-white/5 pb-2">
              Daftar Promo & Artikel (Bisa Diedit)
            </h3>

            {cmsData.articles.map((art) => (
              <div key={art.id} className="bg-[#111a30] p-3 rounded border border-white/5 space-y-3">
                <div className="flex justify-between items-center bg-[#0a0f1d] p-1 px-2 rounded">
                  <span className="text-[10px] font-mono text-amber-500 font-bold">{art.category}</span>
                  <span className="text-[9px] text-gray-400 font-serif">{art.date}</span>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Judul Artikel / Promo</label>
                  <input
                    type="text"
                    value={art.title}
                    onChange={(e) => updateArticle(art.id, 'title', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-[#D4A017]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Isi Konten Utama</label>
                  <textarea
                    rows={4}
                    value={art.content}
                    onChange={(e) => updateArticle(art.id, 'content', e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-[#D4A017] resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SUB TAB: KONTAK ── */}
        {activeSubTab === 'kontak' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#D4A017] border-b border-white/5 pb-2">
              Alamat Showroom & Jam Operasional
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Alamat Cabang Wiyung
                </label>
                <textarea
                  rows={2}
                  value={cmsData.showroom.wiyungAddress}
                  onChange={(e) => updateShowroom('wiyungAddress', e.target.value)}
                  className="w-full bg-[#101c33] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#D4A017] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                  WhatsApp / Telepon Wiyung
                </label>
                <input
                  type="text"
                  value={cmsData.showroom.wiyungPhone}
                  onChange={(e) => updateShowroom('wiyungPhone', e.target.value)}
                  className="w-full bg-[#101c33] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#D4A017]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Alamat Cabang DTC Wonokromo
                </label>
                <textarea
                  rows={2}
                  value={cmsData.showroom.dtcAddress}
                  onChange={(e) => updateShowroom('dtcAddress', e.target.value)}
                  className="w-full bg-[#101c33] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#D4A017] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                  WhatsApp / Telepon DTC
                </label>
                <input
                  type="text"
                  value={cmsData.showroom.dtcPhone}
                  onChange={(e) => updateShowroom('dtcPhone', e.target.value)}
                  className="w-full bg-[#101c33] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#D4A017]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Jam Operasional Showroom
                </label>
                <input
                  type="text"
                  value={cmsData.showroom.operatingHours}
                  onChange={(e) => updateShowroom('operatingHours', e.target.value)}
                  className="w-full bg-[#101c33] border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#D4A017]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── SUB TAB: SALES ADVISOR ── */}
        {activeSubTab === 'sales' && (
          <div className="space-y-6 animate-fadeIn text-left pb-6">
            <div className="border-b border-white/5 pb-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#D4A017]">
                👤 Manajemen Sales Advisor & Team
              </h3>
              <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                Berikut adalah 5 Advisor JBM yang tampil di halaman Profil. Anda bisa memperbarui foto, nama, spesialisasi, dan performa mereka di sini secara live.
              </p>
            </div>

            <div className="space-y-6">
              {(cmsData.advisors || []).map((advisor, index) => (
                <div key={advisor.id} className="bg-[#111a30] p-4 rounded-xl border border-white/5 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center bg-[#0a0f1d] px-2 py-1.5 rounded">
                    <span className="text-[10px] font-mono text-[#D4A017] font-black uppercase tracking-wider">
                      Sales #{index + 1}: {advisor.name || 'Tanpa Nama'}
                    </span>
                    <span className="text-[8px] text-gray-400 font-mono tracking-widest bg-white/5 px-2 py-0.5 rounded">
                      ID: {advisor.id}
                    </span>
                  </div>

                  {/* Avatar upload using ImageUploader */}
                  <ImageUploader
                    label="Foto Profil Sales Advisor"
                    currentValue={advisor.avatar}
                    onChange={(val) => {
                      const updated = (cmsData.advisors || []).map(a => 
                        a.id === advisor.id ? { ...a, avatar: val } : a
                      );
                      onChange({ ...cmsData, advisors: updated });
                    }}
                    presetOptions={[
                      { label: 'Male Portrait 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80' },
                      { label: 'Male Portrait 2', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80' },
                      { label: 'Female Portrait 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80' },
                      { label: 'Male Portrait 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80' },
                      { label: 'Male Portrait 4', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80' }
                    ]}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Nama Advisor</label>
                      <input
                        type="text"
                        value={advisor.name}
                        onChange={(e) => {
                          const updated = (cmsData.advisors || []).map(a => 
                            a.id === advisor.id ? { ...a, name: e.target.value } : a
                          );
                          onChange({ ...cmsData, advisors: updated });
                        }}
                        className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Jabatan (Badge)</label>
                      <input
                        type="text"
                        value={advisor.badge}
                        onChange={(e) => {
                          const updated = (cmsData.advisors || []).map(a => 
                            a.id === advisor.id ? { ...a, badge: e.target.value } : a
                          );
                          onChange({ ...cmsData, advisors: updated });
                        }}
                        className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">No WhatsApp (62xxx - Tanpa Spasi/Plus)</label>
                      <input
                        type="text"
                        value={advisor.phone}
                        onChange={(e) => {
                          const updated = (cmsData.advisors || []).map(a => 
                            a.id === advisor.id ? { ...a, phone: e.target.value.replace(/[^0-9]/g, '') } : a
                          );
                          onChange({ ...cmsData, advisors: updated });
                        }}
                        className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Penempatan Showroom</label>
                      <select
                        value={advisor.area}
                        onChange={(e) => {
                          const updated = (cmsData.advisors || []).map(a => 
                            a.id === advisor.id ? { ...a, area: e.target.value } : a
                          );
                          onChange({ ...cmsData, advisors: updated });
                        }}
                        className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none select-none"
                      >
                        <option value="Showroom Wiyung">Showroom Wiyung</option>
                        <option value="Showroom DTC">Showroom DTC</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Rating</label>
                      <input
                        type="text"
                        value={advisor.rating}
                        onChange={(e) => {
                          const updated = (cmsData.advisors || []).map(a => 
                            a.id === advisor.id ? { ...a, rating: e.target.value } : a
                          );
                          onChange({ ...cmsData, advisors: updated });
                        }}
                        className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Total Terjual</label>
                      <input
                        type="text"
                        value={advisor.sold}
                        onChange={(e) => {
                          const updated = (cmsData.advisors || []).map(a => 
                            a.id === advisor.id ? { ...a, sold: e.target.value } : a
                          );
                          onChange({ ...cmsData, advisors: updated });
                        }}
                        className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 mb-0.5">Niche Spesialis</label>
                      <input
                        type="text"
                        value={advisor.specialty}
                        onChange={(e) => {
                          const updated = (cmsData.advisors || []).map(a => 
                            a.id === advisor.id ? { ...a, specialty: e.target.value } : a
                          );
                          onChange({ ...cmsData, advisors: updated });
                        }}
                        className="w-full bg-[#0a0f1d] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-[#D4A017] outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer controls inside panel */}
      <div className="p-4 bg-[#0d162a] border-t border-white/5 text-[10px] font-mono text-gray-400 text-center uppercase tracking-wider">
        Jaya Berkat Mobil CMS v1.5
      </div>
    </div>
  );
};
