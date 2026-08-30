import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  X 
} from 'lucide-react';
import { VEHICLES_DATA } from '../data/vehicles';
import { Branch, Vehicle } from '../types';
import { formatRupiah } from '../utils/formatters';

interface NavbarProps {
  selectedBranch: Branch;
  onSelectBranch: (branch: Branch) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  onSelectVehicle?: (vehicle: Vehicle) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectVehicle,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Live filtered suggestions from stock
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return VEHICLES_DATA.filter((v) => {
      return (
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
      );
    }).slice(0, 5);
  }, [searchQuery]);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    onSearchSubmit(searchQuery);
  };

  const handleSelectSuggestion = (vehicle: Vehicle) => {
    setIsSearchFocused(false);
    if (onSelectVehicle) {
      onSelectVehicle(vehicle);
    } else {
      onSearchSubmit(vehicle.name);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#C5DCFA] border-b border-[#A4CBF9] shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Row: Logo Sejajar, Desktop Search, & Cabang Kami */}
        <div className="flex items-center justify-between h-14 sm:h-18 gap-2 sm:gap-4 lg:gap-6">
          
          {/* 1. Pandu Motor Group Logo (Sejajar, Teks Merah, Tagline Melayani Sepenuh Hati, Geser Sedikit ke Kanan di HP) */}
          <div 
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer shrink-0 select-none group min-w-0 pl-1.5 sm:pl-0"
          >
            <img 
              src="/images/pandu_logo.png" 
              alt="Pandu Motor Group Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full object-cover shadow-2xs group-hover:scale-105 transition-all duration-200 shrink-0 border border-emerald-500/40 bg-white"
            />

            <div className="flex flex-col min-w-0">
              {/* Nama Logo Sejajar dalam 1 Baris */}
              <div className="flex items-center text-xs sm:text-base md:text-lg font-black tracking-tight leading-tight whitespace-nowrap">
                <span className="text-[#DC2626] font-['Outfit',sans-serif]">Pandu</span>
                <span className="text-[#DC2626] font-['Outfit',sans-serif] ml-1">Motor</span>
                <span className="text-[#DC2626] font-['Outfit',sans-serif] ml-1">Group</span>
              </div>
              {/* Tagline: Melayani Sepenuh Hati */}
              <div className="text-[8px] sm:text-[10px] md:text-[11px] font-bold text-slate-600 tracking-tight mt-0.5 leading-none">
                Melayani Sepenuh Hati
              </div>
            </div>
          </div>

          {/* 2. Desktop Search Bar with Live Stock Sync */}
          <div ref={searchBoxRef} className="flex-1 max-w-md lg:max-w-lg hidden md:block mx-2 relative">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Cari motor impian (NMax, BeAT, PCX, Vario, Scoopy)..."
                className="w-full pl-4 pr-10 py-2 text-xs sm:text-sm bg-white hover:bg-white focus:bg-white border border-blue-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-2xs"
              />
              <button
                type="submit"
                aria-label="Cari Motor"
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in duration-150">
                <div className="p-2 border-b border-gray-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Hasil Stok Motor Tersedia:
                </div>
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {searchSuggestions.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(v)}
                      className="w-full p-2.5 hover:bg-blue-50/70 transition flex items-center gap-3 text-left cursor-pointer group"
                    >
                      <img
                        src={v.images[0]}
                        alt={v.name}
                        className="w-12 h-9 object-cover rounded-lg border border-gray-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                          {v.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {v.brand} • {v.year}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-[#0B63E5]">
                          {formatRupiah(v.price)}
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                          {v.condition}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-[#0B63E5] font-bold text-xs text-center border-t border-gray-100 cursor-pointer"
                >
                  Lihat Semua Hasil di Katalog ({searchSuggestions.length}+ Unit) →
                </button>
              </div>
            )}
          </div>

          {/* 3. Action Button (Cabang Kami) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('cabang')}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-slate-800 hover:text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-300 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
              <span>Cabang Kami</span>
            </button>
          </div>

        </div>

        {/* Mobile Search Bar Row (Presisi di HP) */}
        <div className="pb-2.5 md:hidden">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari motor (NMax, BeAT, PCX, Vario, Scoopy)..."
              className="w-full pl-3.5 pr-9 py-2 text-xs bg-white hover:bg-white focus:bg-white border border-blue-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
            />
            <button
              type="submit"
              aria-label="Cari Motor"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-600"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </header>
  );
};
