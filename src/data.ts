import { CMSData } from './types';

export const INITIAL_CMS_DATA: CMSData = {
  hero: {
    badgeText: "DEALER TERPERCAYA SURABAYA • CERTIFIED MOBIL BEKAS BERKUALITAS",
    titlePrimary: "Temukan Mobil Impian Anda bersama",
    titleSecondary: "Jaya Berkat Mobil",
    highlightUnitId: "toyota-innova-2.4-v-at-2016",
    description: "Pusat jual beli mobil bekas berkualitas tinggi di Surabaya dengan pelayanan transparan, bunga kredit kompetitif, garansi bebas banjir dan bebas tabrak. Hubungi sales kami sekarang untuk konsultasi gratis.",
    ctaTextPrimary: "Lihat Semua Unit",
    ctaTextSecondary: "Hubungi Sales JBM",
    backgroundImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=2000&q=90"
  },
  stats: [
    { id: "stat-1", label: "Unit Pilihan Ready", value: "30+", icon: "car" },
    { id: "stat-2", label: "Tahun di Surabaya", value: "5+", icon: "calendar" },
    { id: "stat-3", label: "Showroom Fisik", value: "2", icon: "map-pin" }
  ],
  cars: [
    {
      id: "toyota-innova-2.4-v-at-2016",
      brand: "Toyota",
      name: "TOYOTA INNOVA 2.4 V AT 2016",
      year: 2016,
      badge: "HOT",
      mileage: 82000,
      transmission: "AT",
      price: 295000000,
      image: "https://images.unsplash.com/photo-1627454820516-dc767bcb4d3e?auto=format&fit=crop&w=800&q=80",
      fuelType: "Diesel",
      isSold: false,
      engineCc: "2.4"
    },
    {
      id: "isuzu-mux-2.5-at-2015",
      brand: "Isuzu",
      name: "ISUZU MU-X 2.5 DIESEL AT 2015",
      year: 2015,
      badge: "HOT",
      mileage: 95000,
      transmission: "AT",
      price: 215000000,
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      fuelType: "Diesel",
      isSold: false,
      engineCc: "2.5"
    },
    {
      id: "toyota-hiace-commuter-2018",
      brand: "Toyota",
      name: "TOYOTA HIACE COMMUTER 2.5 2018",
      year: 2018,
      badge: "BARU MASUK",
      mileage: 120000,
      transmission: "MT",
      price: 365000000,
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      fuelType: "Diesel",
      isSold: false,
      engineCc: "2.5"
    },
    {
      id: "daihatsu-ayla-1.2-mt-2025",
      brand: "Daihatsu",
      name: "DAIHATSU AYLA 1.2 R ADS MT 2025",
      year: 2025,
      badge: "BARU MASUK",
      mileage: 5000,
      transmission: "MT",
      price: 160000000,
      image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
      fuelType: "Bensin",
      isSold: false,
      engineCc: "1.2"
    },
    {
      id: "toyota-avanza-1.3-mt-2010",
      brand: "Toyota",
      name: "TOYOTA AVANZA 1.3 G MT 2010",
      year: 2010,
      badge: "NONE",
      mileage: 145000,
      transmission: "MT",
      price: 95000000,
      image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
      fuelType: "Bensin",
      isSold: false,
      engineCc: "1.3"
    },
    {
      id: "suzuki-ertiga-1.5-hybrid-2023",
      brand: "Suzuki",
      name: "SUZUKI ERTIGA 1.5 GX HYBRID AT 2023",
      year: 2023,
      badge: "HOT",
      mileage: 12000,
      transmission: "AT",
      price: 235000000,
      image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
      fuelType: "Hybrid",
      isSold: false,
      engineCc: "1.5"
    },
    {
      id: "honda-hrv-1.5-se-2019",
      brand: "Honda",
      name: "HONDA HRV 1.5 SE CVT 2019",
      year: 2019,
      badge: "HOT",
      mileage: 48000,
      transmission: "AT",
      price: 245000000,
      image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
      fuelType: "Bensin",
      isSold: false,
      engineCc: "1.5"
    },
    {
      id: "honda-brio-1.2-e-2019",
      brand: "Honda",
      name: "HONDA BRIO 1.2 E CVT 2019",
      year: 2019,
      badge: "BARU MASUK",
      mileage: 52000,
      transmission: "AT",
      price: 135000000,
      image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
      fuelType: "Bensin",
      isSold: false,
      engineCc: "1.2"
    },
    {
      id: "mitsubishi-pajero-sports-2018",
      brand: "Mitsubishi",
      name: "MITSUBISHI PAJERO SPORT DAKAR 4X4 AT 2018",
      year: 2018,
      badge: "HOT",
      mileage: 78000,
      transmission: "AT",
      price: 395000000,
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      fuelType: "Diesel",
      isSold: false,
      engineCc: "2.4"
    }
  ],
  dnaList: [
    {
      id: "dna-1",
      icon: "🤝",
      title: "Garansi Kualitas JBM",
      description: "Seluruh unit kami dijamin bebas dari tabrakan parah, terhindar dari banjir merusak, serta terverifikasi keaslian kilometernya."
    },
    {
      id: "dna-2",
      icon: "🚗",
      title: "Showroom Fisik Jelas",
      description: "Dua cabang aktif di Surabaya memudahkan proses check fisik unit secara langsung, test drive mandiri, serta serah terima aman."
    },
    {
      id: "dna-3",
      icon: "💼",
      title: "Solusi Keuangan Fleksibel",
      description: "Pembelian via Cash keras, Kredit DP rendah hingga 15% dengan lising tepercaya, maupun layanan Tukar Tambah langsung di tempat."
    },
    {
      id: "dna-4",
      icon: "📲",
      title: "Sales Advisor Responsif",
      description: "Dukungan penuh oleh tim sales berpengalaman untuk pengurusan BPKB, STNK lokal, mutasi kendaraan, hingga pengadaan unit mobil baru."
    }
  ],
  testimonials: [
    {
      id: "test-1",
      name: "Budi Santoso",
      rating: 5,
      text: "Sangat puas beli Innova Reborn di JBM. Penjelasan sales-nya transparan, mobil dibolehkan check ke dealer resmi dulu baru deal. Surat-surat aman terkendali.",
      location: "Wiyung, Surabaya",
      carOwned: "Innova V 2016"
    },
    {
      id: "test-2",
      name: "Hendra Wijaya",
      rating: 5,
      text: "Tukar tambah mobil lama di bursa DTC Wonokromo sangat praktis. Dihargai fair-play dan kredit Ertiga Hybrid barunya dibantu proses cepat cuma 2 hari cair.",
      location: "Kertajaya, Surabaya",
      carOwned: "Ertiga Hybrid 2023"
    },
    {
      id: "test-3",
      name: "Ibu Megawati",
      rating: 5,
      text: "Beli Brio buat anak kuliah, kondisinya mulus banget seperti baru. Showroom bersih, sales-sales ramah melayani sampai pengiriman unit gratis ke rumah.",
      location: "Sidoarjo, Jawa Timur",
      carOwned: "Honda Brio 2019"
    }
  ],
  articles: [
    {
      id: "art-1",
      category: "PROMO",
      title: "Beli Mobil Baru Bisa di JBM? Ya, Ini Keuntungannya",
      date: "02 Mei 2026",
      readTime: "3 min baca",
      slug: "beli-mobil-baru-di-jbm",
      content: "Di Jaya Berkat Mobil, kami tidak hanya menyediakan unit mobil berkualitas premium siap pakai. Kami juga siap membantu Anda dalam pengadaan mobil baru secara lengkap. Baik itu kendaraan listrik (EV) masa kini, teknologi hybrid yang hemat bahan bakar, maupun mesin pembakaran internal/combustion standard. Keuntungan memesan via JBM adalah kemudahan pengurusan pembiayaan, diskon menarik mitra showroom, serta pengiriman tepat waktu langsung ke garasi Anda.",
      isFeatured: true
    },
    {
      id: "art-2",
      category: "DOKUMENTASI",
      title: "Toyota Vellfire yang Cocok untuk Mobil Kebersamaan Keluarga",
      date: "24 Apr 2026",
      readTime: "4 min baca",
      slug: "toyota-vellfire-mbg-review",
      content: "Toyota Vellfire 2.4 V Premium Sound tahun 2011 kini ditawarkan dengan harga spektakuler Rp 195 Juta di Jaya Berkat Mobil Surabaya. Kendaraan tipe MPV mewah super premium ini menawarkan kabin luas superior, kenyamanan berkendara kelas kabin diplomat, serta suspensi istimewa. Mobil ini sangat cocok sebagai sarana mobilitas keluarga besar dengan kemewahan berkelas tanpa harus mengeluarkan anggaran luar biasa.",
      isFeatured: false
    },
    {
      id: "art-3",
      category: "TIPS",
      title: "Rekomendasi Pilihan Mobil Kompak di Showroom JBM Surabaya",
      date: "15 Apr 2026",
      readTime: "5 min baca",
      slug: "rekomendasi-mobil-kecil",
      content: "Mengarungi jalanan kota Surabaya yang padat menuntut kendaraan yang lincah dan hemat bahan bakar. Keunggulan utama dari mobil compact city car adalah kemudahan manuver di jalur tikungan sempit, kemudahan mencari lokasi parkir di mall-mall besar, serta efisiensi penggunaan bahan bakar harian yang sangat tinggi. Beberapa rekomendasi unit compact terbaik kami meliputi Honda Brio E CVT, Honda Jazz RS, dan Daihatsu Ayla ADS yang kondisinya terawat seperti keluar baru dari dealer.",
      isFeatured: false
    }
  ],
  gallery: [
    { id: "gal-1", category: "Showroom", title: "Showroom Utama JBM Wiyung", imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80" },
    { id: "gal-2", category: "Unit Stok", title: "Deretan Stock Ready di Showroom DTC", imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80" },
    { id: "gal-3", category: "Happy Customer", title: "Serah Terima Avanza Veloz Baru", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80" },
    { id: "gal-4", category: "Happy Customer", title: "Pelanggan Senang dengan Innova G", imageUrl: "https://images.unsplash.com/photo-1492551557933-34265f7af79e?auto=format&fit=crop&w=1200&q=80" },
    { id: "gal-5", category: "Showroom", title: "Outlet Bursa Mobil DTC Wonokromo Lt 5", imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80" },
    { id: "gal-6", category: "Event", title: "Sesi Diskusi & Konsultasi Spesifikasi", imageUrl: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=1200&q=80" }
  ],
  videos: [
    { id: "vid-1", category: "Unit Review", title: "Toyota Innova Reborn G Diesel AT - Review Lengkap & Kondisi Sasis Aman", duration: "11:20", youtubeId: "dQw4w9WgXcQ" },
    { id: "vid-2", category: "Tips Beli", title: "Penting! Tips Mendeteksi Mobil Bekas Tabrak atau Banjir Bersama JBM", duration: "07:45", youtubeId: "dQw4w9WgXcQ" },
    { id: "vid-3", category: "Testimoni", title: "Pelayanan Kredit Kilat 24 Jam Cair - Testimoni Bpk Hendra Wijaya", duration: "05:12", youtubeId: "dQw4w9WgXcQ" }
  ],
  showroom: {
    wiyungAddress: "Jl. Raya Menganti Babatan No. 700, Wiyung, Surabaya, Jawa Timur",
    wiyungMapLink: "https://maps.google.com/?q=Jaya+Berkat+Mobil+Menganti+Babatan+Surabaya",
    wiyungPhone: "081330253797",
    dtcAddress: "Bursa Mobil Bekas DTC Wonokromo, Lt. 5 Blok B 18B-19, Surabaya, Jawa Timur",
    dtcMapLink: "https://maps.google.com/?q=DTC+Wonokromo+Surabaya",
    dtcPhone: "085785649369",
    operatingHours: "Senin – Sabtu (08:00 – 17:00 WIB), Minggu (08:00 – 16:00 WIB)"
  },
  hallOfFame: [
    {
      id: "hof-1",
      name: "Keluarga Haji Rachman & Ibu Siti",
      carName: "Toyota Innova Reborn 2.4 V AT",
      date: "14 Mei 2026",
      imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
      location: "Wiyung, Surabaya",
      quote: "Mobil impian keluarga kami akhirnya tercapai. Sasis aman, bebas tabrakan parah, bener-bener berkat JBM yang sangat teruji. Semoga berkah selalu!",
      rating: 5
    },
    {
      id: "hof-2",
      name: "Bpk. Yohanes & Ibu Maria",
      carName: "Honda Brio 1.2 E CVT 2019",
      date: "22 April 2026",
      imageUrl: "https://images.unsplash.com/photo-1492551557933-34265f7af79e?auto=format&fit=crop&w=800&q=80",
      location: "Sukomanunggal, Surabaya",
      quote: "Mobil lincah buat anter anak sekolah harian. Kredit dibantu lising terpercaya JBM dengan DP super ringan 15%. Terima kasih JBM!",
      rating: 5
    },
    {
      id: "hof-3",
      name: "Keluarga Dr. Hendry & Anak",
      carName: "Mitsubishi Pajero Sport Dakar 2018",
      date: "08 Mei 2026",
      imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      location: "Gubeng, Surabaya",
      quote: "Unit sangat gagah, servis salon JBM sangat detail sampai ke sela-sela mesin. Surat-surat asli terbit langsung ke tangan. Sangat tepercaya.",
      rating: 5
    },
    {
      id: "hof-4",
      name: "Mas Kevin Pradana",
      carName: "Honda Jazz RS AT 2018",
      date: "28 April 2026",
      imageUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=800&q=80",
      location: "DTC Wonokromo, Surabaya",
      quote: "Mobil dapet langsung gas pol ke malang. Odometer asli rendah anti-puteran. Pembelian cash dipandu prosesnya ga bertele-tele langsung kelar sejam.",
      rating: 5
    },
    {
      id: "hof-5",
      name: "Keluarga Ibu Megawati & Bpk. Agus",
      carName: "Suzuki Ertiga 1.5 GX Hybrid 2023",
      date: "02 Mei 2026",
      imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
      location: "Sidoarjo, Jawa Timur",
      quote: "Tukar tambah mobil lama di DTC Wonokromo lancar jaya. Dihargai tinggi dan Ertiga baru ini irit banget bensinnya harian. Pelayanan top bgt!",
      rating: 5
    },
    {
      id: "hof-6",
      name: "Bpk. Surya Dinata (Pengusaha)",
      carName: "Toyota Fortuner 2.4 VRZ AT 2020",
      date: "10 Mei 2026",
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
      location: "Citraland, Surabaya Barat",
      quote: "Membeli unit kedua di JBM, servis tidak pernah mengecewakan. Mobil bebas banjir terjamin mutlak. Sales sangat profesional dan sopan.",
      rating: 5
    },
    {
      id: "hof-7",
      name: "Ibu Amanda & Keluarga",
      carName: "Daihatsu Ayla 1.2 R ADS MT 2025",
      date: "18 Mei 2026",
      imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
      location: "Rungkut, Surabaya",
      quote: "Dapet Ayla tahun tinggi rasa keluar baru dari pabrik. Wangi, mesin super responsif. JBM emang jaminan kualitas dealer nomor satu di Jatim!",
      rating: 5
    },
    {
      id: "hof-8",
      name: "Bpk. Rudy & Ibu Silvi",
      carName: "Toyota Avanza 1.3 G MT 2010",
      date: "25 April 2026",
      imageUrl: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&w=800&q=80",
      location: "Gresik, Jawa Timur",
      quote: "Meskipun avanza tahun tua, tapi di JBM mesinnya super garing dan AC dingin nyes. Kredit disetujui kilat cuma modal KTP. Terima kasih JBM!",
      rating: 5
    },
    {
      id: "hof-9",
      name: "Keluarga Mas Danang & Ibu Novi",
      carName: "Toyota Hiace Commuter 2.5 2018",
      date: "05 Mei 2026",
      imageUrl: "https://images.unsplash.com/photo-1512403754473-278556139b0a?auto=format&fit=crop&w=800&q=80",
      location: "Kediri, Jawa Timur",
      quote: "Beli unit komersial buat travel keluarga. Kondisi istimewa, kaki-kaki empuk, sasis kokoh bebas karat besi. JBM juara unit siap tempurnya!",
      rating: 5
    }
  ],
  advisors: [
    { 
      id: "advisor-1",
      name: "Andik JBM", 
      phone: "6285785649369", 
      area: "Showroom DTC", 
      badge: "Sales Advisor",
      specialty: "SUV & MPV Keluarga",
      rating: "4.9",
      sold: "150+ Unit",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80"
    },
    { 
      id: "advisor-2",
      name: "Jevry JBM", 
      phone: "6281330253797", 
      area: "Showroom Wiyung", 
      badge: "Manager",
      specialty: "Konsultan Trade-In",
      rating: "5.0",
      sold: "320+ Unit",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80"
    },
    { 
      id: "advisor-3",
      name: "Yoan JBM", 
      phone: "6281808383522", 
      area: "Showroom Wiyung", 
      badge: "Senior Advisor",
      specialty: "Mobil Eropa & Hobi",
      rating: "4.9",
      sold: "120+ Unit",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80"
    },
    { 
      id: "advisor-4",
      name: "Ricky JBM", 
      phone: "6281380553331", 
      area: "Showroom DTC", 
      badge: "Sales Specialist",
      specialty: "Solusi Kredit Ringan",
      rating: "4.8",
      sold: "180+ Unit",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80"
    },
    { 
      id: "advisor-5",
      name: "Fatchul JBM", 
      phone: "6281270605758", 
      area: "Showroom Wiyung", 
      badge: "Sales Advisor",
      specialty: "City Car & Hatchback",
      rating: "4.9",
      sold: "100+ Unit",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80"
    }
  ]
};

export function getStoredCMSData(): CMSData {
  try {
    const data = localStorage.getItem('jbm_cms_data');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.hero && parsed.cars && parsed.stats) {
        if (!parsed.hallOfFame) {
          parsed.hallOfFame = INITIAL_CMS_DATA.hallOfFame;
        }
        if (!parsed.advisors) {
          parsed.advisors = INITIAL_CMS_DATA.advisors;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error fetching stored CMS data', e);
  }
  return INITIAL_CMS_DATA;
}

export function saveStoredCMSData(data: CMSData): void {
  try {
    localStorage.setItem('jbm_cms_data', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving CMS data', e);
  }
}
