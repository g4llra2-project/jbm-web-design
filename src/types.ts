export type CarBadge = 'BARU MASUK' | 'HOT' | 'SOLD' | 'NONE';

export interface Car {
  id: string;
  brand: string;
  name: string;
  year: number;
  mileage: number; // in km, e.g. 32000
  transmission: 'AT' | 'MT' | 'Manual' | 'Otomatis';
  price: number; // in rupiah, e.g. 195000000
  badge: CarBadge;
  image: string; // custom SVG placeholder or path
  fuelType: 'Bensin' | 'Diesel' | 'Hybrid';
  isSold: boolean;
  engineCc: string;
}

export interface HeroData {
  badgeText: string;
  titlePrimary: string;
  titleSecondary: string;
  highlightUnitId: string;
  description: string;
  ctaTextPrimary: string;
  ctaTextSecondary: string;
  backgroundImage?: string;
}

export interface TrustStat {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface BrandDNA {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  location: string;
  carOwned: string;
}

export interface BlogArticle {
  id: string;
  category: 'PROMO' | 'TIPS' | 'DOKUMENTASI';
  title: string;
  date: string;
  readTime: string;
  slug: string;
  content: string;
  isFeatured?: boolean;
}

export interface GalleryItem {
  id: string;
  category: 'Showroom' | 'Unit Stok' | 'Event' | 'Happy Customer';
  title: string;
  imageUrl: string;
}

export interface HallOfFameItem {
  id: string;
  name: string;
  carName: string;
  date: string;
  imageUrl: string;
  location: string;
  quote: string;
  rating: number;
}

export interface VideoItem {
  id: string;
  category: 'Unit Review' | 'Test Drive' | 'Tips Beli' | 'Testimoni';
  title: string;
  duration: string;
  youtubeId: string;
}

export interface ShowroomConfig {
  wiyungAddress: string;
  wiyungMapLink: string;
  wiyungPhone: string;
  dtcAddress: string;
  dtcMapLink: string;
  dtcPhone: string;
  operatingHours: string;
}

export interface CMSData {
  hero: HeroData;
  stats: TrustStat[];
  cars: Car[];
  dnaList: BrandDNA[];
  testimonials: Testimonial[];
  articles: BlogArticle[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  showroom: ShowroomConfig;
  hallOfFame?: HallOfFameItem[];
}
