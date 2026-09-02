export interface SalesPost {
  name: string;
  phone: string;
  whatsapp: string;
  googleMapsUrl: string;
}

export interface Branch {
  id: string;
  name: string;
  companyName: string;
  code: string;
  city: string;
  province: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  googleMapsUrl: string;
  socialMedia: {
    facebook?: string;
    facebookUrl?: string;
    instagram?: string;
    instagramUrl?: string;
    tiktok?: string;
    tiktokUrl?: string;
    [key: string]: any;
  };
  operationalHours: string;
  image: string;
  logo?: string;
  salesPosts?: SalesPost[];
}

export type VehicleCondition = 'baru' | 'bekas';
export type VehicleCategory = 'matic' | 'bebek' | 'sport' | 'trail' | 'maxi';
export type VehicleBrand = 'Honda' | 'Yamaha' | 'Kawasaki' | 'Suzuki' | 'Vespa';

export interface Vehicle {
  id: string;
  name: string;
  brand: VehicleBrand;
  category: VehicleCategory;
  condition: VehicleCondition;
  year: number;
  price: number;
  dpMin: number;
  installmentEstimates: {
    tenor11: number;
    tenor23: number;
    tenor35: number;
    tenor47?: number;
  };
  mileage?: number; // in KM (for used bikes)
  engineCapacity: string; // e.g. "155 cc"
  transmission: 'Automatic' | 'Manual' | 'Kopling Manual';
  fuelType: string;
  color: string;
  plateNumberLocation?: string; // e.g. "BK (Asahan / Medan)", "BM (Riau)"
  taxStatus: 'Pajak Hidup Panjang' | 'Pajak Baru Dibayar' | 'Pajak Aktif' | 'Unit Baru Resmi';
  documentCompleteness: 'Lengkap (BPKB + STNK + Faktur)' | 'Lengkap (BPKB + STNK)' | 'Unit Baru Resmi Dealer';
  warranty: string;
  description: string;
  features: string[];
  images: string[];
  branchId: string;
  isFeatured?: boolean;
  isHotPromo?: boolean;
  discountPrice?: number;
  imageFit?: 'cover' | 'contain' | 'auto' | 'fill';
  imagePosition?: string;
  imagePosX?: number;
  imagePosY?: number;
  imageScale?: number;
  aspectRatio?: '4:3' | '16:9' | '1:1' | 'auto' | 'custom';
}

export interface LoanApplicationData {
  applicantName: string;
  phone: string;
  branchId: string;
  collateralType: 'motor' | 'mobil';
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  requestedAmount: number;
  tenorMonths: number;
  notes?: string;
}

export interface TradeInData {
  name: string;
  phone: string;
  currentBrand: string;
  currentModel: string;
  currentYear: number;
  currentCondition: 'sangat-mulus' | 'mulus' | 'standar' | 'perlu-servis';
  targetVehicleId: string;
  branchId: string;
}

export interface HeroBanner {
  id: string;
  taglineRibbon: string;
  title: string;
  titleHighlight: string;
  offer1: {
    label: string;
    currency: string;
    value: string;
    unit: string;
    subtext?: string;
  };
  offer2: {
    label: string;
    currency: string;
    value: string;
    unit: string;
    subtext?: string;
  };
  period: string;
  image: string;
  ctaText: string;
  themeColor: string;
  isActive?: boolean;
  orderIndex?: number;
  imageFit?: 'cover' | 'contain' | 'auto' | 'fill';
  imagePosition?: string;
  imagePosX?: number;
  imagePosY?: number;
  imageScale?: number;
  aspectRatio?: 'auto' | '21:9' | '16:9' | '16:7' | '3:1' | 'custom';
  bannerHeight?: number;
  showTextOverlay?: boolean;
  overlayOpacity?: number;
  ctaLinkType?: 'whatsapp' | 'katalog' | 'dana-tunai' | 'tukar-tambah' | 'jual-motor' | 'custom';
  ctaCustomUrl?: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  videoPoster?: string;
  videoAutoplay?: boolean;
  videoLoop?: boolean;
  videoMuted?: boolean;
}

export interface SiteSettings {
  head_office_address: string;
  official_email: string;
  official_phone: string;
  tagline: string;
  brand_name: string;
  [key: string]: string;
}

export interface AnnouncementAttachment {
  name: string;
  url: string;
  size?: string;
  type?: string;
}

export type AnnouncementCategory = 'Penting' | 'Operasional' | 'Promo Internal' | 'Agenda Kantor' | 'Umum';

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  content: string;
  author: string;
  isPinned?: boolean;
  image?: string;
  attachments?: AnnouncementAttachment[];
  createdAt: string;
  updatedAt?: string;
}



