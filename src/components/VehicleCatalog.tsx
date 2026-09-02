import React, { useState, useMemo, useEffect } from 'react';
import { 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Bike
} from 'lucide-react';
import { Vehicle, Branch } from '../types';
import { VEHICLES_DATA } from '../data/vehicles';
import { BRANCHES_DATA } from '../data/branches';
import { formatRupiah, buildWhatsAppLink } from '../utils/formatters';

interface VehicleCatalogProps {
  selectedBranch: Branch;
  onNavigate: (sectionId: string) => void;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  initialCondition?: 'all' | 'baru' | 'bekas';
  isLandingPage?: boolean;
  pageTitle?: string;
  pageSubtitle?: string;
  vehicles?: Vehicle[];
  branches?: Branch[];
}

export const VehicleCatalog: React.FC<VehicleCatalogProps> = ({
  selectedBranch,
  onNavigate,
  onSelectVehicle,
  searchQuery: externalSearchQuery,
  onSearchChange: externalOnSearchChange,
  initialCondition = 'all',
  isLandingPage = false,
  pageTitle,
  pageSubtitle,
  vehicles = VEHICLES_DATA,
  branches = BRANCHES_DATA,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>(initialCondition);
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    setSelectedCondition(initialCondition);
  }, [initialCondition]);

  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = externalOnSearchChange !== undefined ? externalOnSearchChange : setInternalSearchQuery;

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNextImage = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.stopPropagation();
    const total = vehicle.images.length;
    if (total <= 1) return;
    setActiveImageIndexes((prev) => ({
      ...prev,
      [vehicle.id]: ((prev[vehicle.id] || 0) + 1) % total,
    }));
  };

  const handlePrevImage = (e: React.MouseEvent, vehicle: Vehicle) => {
    e.stopPropagation();
    const total = vehicle.images.length;
    if (total <= 1) return;
    setActiveImageIndexes((prev) => ({
      ...prev,
      [vehicle.id]: ((prev[vehicle.id] || 0) - 1 + total) % total,
    }));
  };

  // Filter logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // Brand filter
      if (selectedBrand !== 'all' && v.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      // Condition filter
      if (selectedCondition !== 'all' && v.condition !== selectedCondition) {
        return false;
      }
      // Search query (sync with actual available stock)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = v.name.toLowerCase().includes(q);
        const matchBrand = v.brand.toLowerCase().includes(q);
        const matchDesc = v.description.toLowerCase().includes(q);
        if (!matchName && !matchBrand && !matchDesc) return false;
      }
      return true;
    });
  }, [selectedBrand, selectedCondition, searchQuery]);

  // If landing page, limit to 12 items
  const displayedVehicles = isLandingPage
    ? filteredVehicles.slice(0, 12)
    : filteredVehicles;

  const handleCardClick = (vehicle: Vehicle) => {
    if (onSelectVehicle) {
      onSelectVehicle(vehicle);
    } else {
      const matchedBranch = BRANCHES_DATA.find((b) => b.id === vehicle.branchId) || selectedBranch;
      const conditionText = vehicle.condition === 'baru' ? 'Baru 100%' : 'Bekas Berkualitas';
      const waUrl = buildWhatsAppLink(
        matchedBranch.whatsapp,
        `Halo ${matchedBranch.name} (Pandu Motor Group), saya tertarik dengan unit "${vehicle.name}" [${conditionText}] seharga ${formatRupiah(vehicle.price)}. Mohon info ketersediaan unit dan cara pembelian. Terima kasih!`
      );
      window.open(waUrl, '_blank');
    }
  };

  return (
    <section id="katalog-motor" className="py-6 sm:py-10 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Full Catalog Page Header with Search & Filter Tabs */}
        {!isLandingPage && (
          <div className="mb-6 space-y-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {pageTitle || (
                  selectedCondition === 'baru'
                    ? 'Katalog Motor Baru 100% Resmi Dealer'
                    : selectedCondition === 'bekas'
                    ? 'Katalog Motor Bekas Berkualitas & Bergaransi'
                    : 'Katalog Lengkap Motor Pandu Motor Group'
                )}
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                {pageSubtitle || (
                  selectedCondition === 'baru'
                    ? 'Pilihan unit motor baru gres 100% bergaransi resmi pabrikan dengan harga OTR terbaik se-Sumut & Riau.'
                    : selectedCondition === 'bekas'
                    ? 'Pilihan motor bekas lolos inspeksi standar showroom resmi, surat lengkap (STNK & BPKB asli) dan mesin sehat.'
                    : 'Pilihan motor baru dan motor bekas berkualitas bergaransi resmi, siap kirim ke seluruh wilayah Sumut & Riau.'
                )}
              </p>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3">
              <div className="sm:col-span-6 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari motor (Contoh: Vario, BeAT, Scoopy, NMAX, Aerox, PCX, CRF)..."
                  className="w-full pl-3.5 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Condition Filter */}
              <div className="sm:col-span-3 flex gap-1">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'baru', label: 'Unit Baru' },
                  { id: 'bekas', label: 'Unit Bekas' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCondition(c.id)}
                    className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                      selectedCondition === c.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Brand Filter */}
              <div className="sm:col-span-3 flex gap-1">
                {[
                  { id: 'all', label: 'Semua Merk' },
                  { id: 'honda', label: 'Honda' },
                  { id: 'yamaha', label: 'Yamaha' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBrand(b.id)}
                    className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                      selectedBrand === b.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active search filter badge info */}
            {searchQuery.trim() && (
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                <span>Menampilkan hasil pencarian untuk: <strong>"{searchQuery}"</strong> ({filteredVehicles.length} motor ditemukan)</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 font-bold hover:underline ml-auto cursor-pointer"
                >
                  Reset Pencarian
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VEHICLE GRID (Keterangan Tersedia Baru / Bekas Jelas)                     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
          {displayedVehicles.map((vehicle) => {
            const matchedBranch = BRANCHES_DATA.find((b) => b.id === vehicle.branchId) || selectedBranch;
            const currentImgIndex = activeImageIndexes[vehicle.id] || 0;
            const isFav = favorites[vehicle.id];
            const currentImg = vehicle.images[currentImgIndex] || vehicle.images[0];
            const vFit = vehicle.imageFit || 'cover';
            const vPosX = vehicle.imagePosX ?? 50;
            const vPosY = vehicle.imagePosY ?? 50;
            const vScale = (vehicle.imageScale || 100) / 100;

            return (
              <div
                key={vehicle.id}
                onClick={() => handleCardClick(vehicle)}
                className="bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:border-slate-400"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                  {vFit === 'contain' && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-40 scale-110 pointer-events-none"
                      style={{ backgroundImage: `url(${currentImg})` }}
                    />
                  )}
                  <img
                    src={currentImg}
                    alt={vehicle.name}
                    className="w-full h-full relative z-10 transition-transform duration-300 group-hover:scale-103"
                    style={{
                      objectFit: vFit === 'auto' ? 'contain' : (vFit as any),
                      objectPosition: `${vPosX}% ${vPosY}%`,
                      transform: `scale(${vScale})`,
                    }}
                    loading="lazy"
                  />

                  {/* Left & Right Mini Arrow Controls */}
                  {vehicle.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Foto Sebelumnya"
                        onClick={(e) => handlePrevImage(e, vehicle)}
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Foto Selanjutnya"
                        onClick={(e) => handleNextImage(e, vehicle)}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Top Right Heart Favorite Icon */}
                  <button
                    type="button"
                    aria-label="Simpan Favorit"
                    onClick={(e) => toggleFavorite(e, vehicle.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-red-500 flex items-center justify-center shadow-xs transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Price: Rp 20.600.000 */}
                    <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                      {formatRupiah(vehicle.price)}
                    </div>

                    {/* Title: VARIO 125 ESP CBS */}
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-800 uppercase tracking-tight line-clamp-1 mt-2 group-hover:text-blue-600 transition-colors">
                      {vehicle.name}
                    </h3>

                    {/* Keterangan Tersedia Baru / Bekas */}
                    <div className="text-[10px] sm:text-[11px] font-medium mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {vehicle.condition === 'baru' ? 'Unit Baru' : 'Unit Bekas'}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{vehicle.year}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">
                        {vehicle.condition === 'baru' ? '0 km' : `${(vehicle.mileage || 5000).toLocaleString('id-ID')} km`}
                      </span>
                    </div>
                  </div>

                  {/* Location & Timestamp Footer: Kota Kisaran • Hari ini */}
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 pt-2.5 mt-2.5 border-t border-gray-100">
                    <span className="truncate">Kota {matchedBranch.city.split(',')[0]}</span>
                    <span className="shrink-0 text-slate-400">Hari ini</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {displayedVehicles.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Bike className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-700">Tidak ada motor yang cocok</div>
            <p className="text-xs text-slate-400 mt-0.5">Silakan gunakan filter lain atau hubungi CS kami.</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* "LIHAT LAINNYA" BUTTON (Shown on Landing Page when items >= 12)           */}
        {/* ========================================================================= */}
        {isLandingPage && (
          <div className="mt-8 sm:mt-10 text-center">
            <button
              type="button"
              onClick={() => onNavigate('katalog')}
              className="px-8 sm:px-10 py-3 sm:py-3.5 bg-white hover:bg-slate-50 text-slate-900 border border-gray-300 rounded-full font-extrabold text-xs sm:text-sm shadow-xs hover:shadow transition-all duration-200 active:scale-95 cursor-pointer"
            >
              Lihat lainnya
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
