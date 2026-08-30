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
    instagram?: string;
    tiktok?: string;
  };
  operationalHours: string;
  image: string;
  logo?: string;
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
