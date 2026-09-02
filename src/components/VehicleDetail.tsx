import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Home, 
  ChevronRight, 
  MapPin, 
  Fuel, 
  Gauge, 
  Cog, 
  Zap, 
  UserCheck, 
  ArrowLeftRight, 
  MessageSquare, 
  Phone, 
  ChevronLeft
} from 'lucide-react';
import { Vehicle, Branch } from '../types';
import { BRANCHES_DATA } from '../data/branches';
import { formatRupiah, buildWhatsAppLink } from '../utils/formatters';

interface VehicleDetailProps {
  vehicle: Vehicle;
  selectedBranch: Branch;
  onNavigate: (sectionId: string) => void;
  onSelectVehicleForTradeIn?: (vehicle: Vehicle) => void;
}

export const VehicleDetail: React.FC<VehicleDetailProps> = ({
  vehicle,
  selectedBranch,
  onNavigate,
  onSelectVehicleForTradeIn,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  const matchedBranch = BRANCHES_DATA.find((b) => b.id === vehicle.branchId) || selectedBranch;

  const conditionText = vehicle.condition === 'baru' ? 'Baru 100%' : `Bekas Berkualitas (${vehicle.year})`;
  const waUrl = buildWhatsAppLink(
    matchedBranch.whatsapp,
    `Halo ${matchedBranch.name} (Pandu Motor Group), saya tertarik dengan unit "${vehicle.name}" [Kondisi: ${conditionText}] seharga ${formatRupiah(vehicle.price)}. Mohon info ketersediaan unit dan cara pembelian. Terima kasih!`
  );

  const handleTradeInThisUnit = () => {
    if (onSelectVehicleForTradeIn) {
      onSelectVehicleForTradeIn(vehicle);
    }
    onNavigate('tukar-tambah');
  };

  return (
    <div className="w-full bg-[#F8FAFC] pb-14 animate-in fade-in duration-200">
      
      {/* 1. Breadcrumb & Back Navigation Bar */}
      <div className="bg-white border-b border-gray-200 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('katalog')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <span onClick={() => onNavigate('home')} className="hover:text-blue-600 cursor-pointer flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span 
              onClick={() => onNavigate('katalog')} 
              className="hover:text-blue-600 cursor-pointer font-semibold"
            >
              Katalog Motor
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-bold text-slate-800 truncate max-w-[200px]">
              {vehicle.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5">
        
        {/* ========================================================================= */}
        {/* 2. TOP SECTION: FOTO UNIT MOTOR GALLERY                                   */}
        {/* ========================================================================= */}
        <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xs mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Main Featured Photo */}
            {(() => {
              const activeImg = vehicle.images[activeImageIndex] || vehicle.images[0];
              const vFit = vehicle.imageFit || 'cover';
              const vPosX = vehicle.imagePosX ?? 50;
              const vPosY = vehicle.imagePosY ?? 50;
              const vScale = (vehicle.imageScale || 100) / 100;

              return (
                <div className="lg:col-span-9 relative aspect-[16/10] sm:aspect-[16/9] bg-slate-950 rounded-xl sm:rounded-2xl overflow-hidden group">
                  {vFit === 'contain' && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-50 scale-115 pointer-events-none"
                      style={{ backgroundImage: `url(${activeImg})` }}
                    />
                  )}
                  <img
                    src={activeImg}
                    alt={vehicle.name}
                    className="w-full h-full relative z-10 transition-transform duration-500"
                    style={{
                      objectFit: vFit === 'auto' ? 'contain' : (vFit as any),
                      objectPosition: `${vPosX}% ${vPosY}%`,
                      transform: `scale(${vScale})`,
                    }}
                  />

                  {/* Prev / Next Arrows */}
                  {vehicle.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveImageIndex((prev) => (prev + 1) % vehicle.images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {/* Badge Condition Overlay */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm text-white ${
                      vehicle.condition === 'baru' ? 'bg-[#0B63E5]' : 'bg-slate-900/90 backdrop-blur-md'
                    }`}>
                      {vehicle.condition === 'baru' ? 'Tersedia Unit Baru 100%' : 'Tersedia Unit Bekas Mulus'}
                    </span>
                  </div>

                  {/* Image Counter */}
                  <div className="absolute bottom-3 right-3 z-20 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    {activeImageIndex + 1} / {vehicle.images.length} Foto
                  </div>
                </div>
              );
            })()}

            {/* Thumbnail Column */}
            <div className="lg:col-span-3 flex lg:flex-col gap-2.5 overflow-x-auto no-scrollbar">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative rounded-xl overflow-hidden aspect-[4/3] flex-1 lg:flex-none border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#0B63E5] shadow-xs scale-98 ring-1 ring-[#0B63E5]'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. DETAIL CONTENT (Tanpa Tulisan Dilihat & Info Kondisi Lengkap)          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ======================================================================= */}
          {/* LEFT COLUMN: Vehicle Specs & Description Card                           */}
          {/* ======================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* CARD 1: Header Info & 5 Specs Row */}
            <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              
              <div>
                {/* Condition Tag */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider mb-2 text-white bg-[#0B63E5] shadow-2xs">
                  {vehicle.condition === 'baru' ? '✨ Tersedia Unit Baru 100% OTR' : '🛵 Tersedia Unit Bekas Berkualitas'}
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {vehicle.name} ({vehicle.year})
                </h1>
                
                <div className="text-sm font-semibold text-slate-500 mt-1">
                  Merk: <span className="text-slate-800 font-bold">{vehicle.brand}</span> • Kondisi: <span className="text-blue-600 font-bold">{vehicle.condition === 'baru' ? 'Baru Gres Pabrik' : 'Bekas Mulus Terawat'}</span>
                </div>
              </div>

              {/* Location Tag */}
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 font-medium">
                <MapPin className="w-4 h-4 text-[#0B63E5] shrink-0" />
                <span>{matchedBranch.city}, {matchedBranch.province}</span>
              </div>

              {/* 5 SPECS ROW */}
              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-2 text-center sm:text-left">
                
                {/* 1. Bahan bakar */}
                <div className="flex items-center sm:flex-col sm:items-start gap-2 sm:gap-1 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                  <Fuel className="w-4 h-4 text-slate-700 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Bahan bakar</div>
                    <div className="text-xs font-bold text-slate-800">Bensin</div>
                  </div>
                </div>

                {/* 2. Kilometer & Kondisi */}
                <div className="flex items-center sm:flex-col sm:items-start gap-2 sm:gap-1 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                  <Gauge className="w-4 h-4 text-slate-700 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Jarak Tempuh</div>
                    <div className="text-xs font-bold text-slate-800">
                      {vehicle.condition === 'baru' ? '0 KM (Baru)' : `${(vehicle.mileage || 8000).toLocaleString('id-ID')} KM`}
                    </div>
                  </div>
                </div>

                {/* 3. Transmisi */}
                <div className="flex items-center sm:flex-col sm:items-start gap-2 sm:gap-1 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                  <Cog className="w-4 h-4 text-slate-700 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Transmisi</div>
                    <div className="text-xs font-bold text-slate-800">{vehicle.transmission}</div>
                  </div>
                </div>

                {/* 4. Kapasitas mesin */}
                <div className="flex items-center sm:flex-col sm:items-start gap-2 sm:gap-1 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                  <Zap className="w-4 h-4 text-slate-700 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Kapasitas mesin</div>
                    <div className="text-xs font-bold text-slate-800">{vehicle.engineCapacity.split(' ')[0]} cc</div>
                  </div>
                </div>

                {/* 5. Penjual */}
                <div className="flex items-center sm:flex-col sm:items-start gap-2 sm:gap-1 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-xl col-span-2 sm:col-span-1">
                  <UserCheck className="w-4 h-4 text-slate-700 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Penjual</div>
                    <div className="text-xs font-bold text-slate-800">Dealer</div>
                  </div>
                </div>

              </div>

            </div>

            {/* CARD 2: Deskripsi & Checklists */}
            <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Deskripsi
              </h2>

              {/* 4 Green Checklist Icons */}
              <div className="space-y-2 text-xs sm:text-sm text-slate-800 font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">✓</span>
                  <span>{vehicle.condition === 'baru' ? 'Unit Baru 100% bergaransi resmi dealer' : 'Mesin sehat lolos inspeksi showroom'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">✓</span>
                  <span>{vehicle.condition === 'baru' ? 'Bodi gres pabrik tanpa cacat' : 'Body mulus terawat 98%'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">✓</span>
                  <span>Surat lengkap (BPKB, STNK & Faktur)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">✓</span>
                  <span>{vehicle.condition === 'baru' ? 'Faktur & STNK/BPKB langsung atas nama pembeli' : 'Pajak aman & hidup panjang'}</span>
                </div>
              </div>

              {/* Detail Paragraph Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                {vehicle.description}
              </p>

              {/* Contact Reference Code */}
              <div className="pt-3 border-t border-gray-100 text-xs font-mono text-slate-500">
                <div>{matchedBranch.phone}</div>
                <div className="uppercase">PANDU/{matchedBranch.code}/{vehicle.id.toUpperCase()}</div>
              </div>
            </div>

          </div>

          {/* ======================================================================= */}
          {/* RIGHT COLUMN: Price Card, Tukar Tambah CTA, & Penjual Dealer Info        */}
          {/* ======================================================================= */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* CARD 1: Price Box */}
            <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              
              <div>
                <div className="text-xs text-slate-400 font-medium mb-1">
                  Harga Cash / OTR:
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                  {formatRupiah(vehicle.price)}
                </div>
              </div>

              {/* Tukar Tambah Clickable Banner Box */}
              <button
                type="button"
                onClick={handleTradeInThisUnit}
                className="w-full p-3.5 rounded-xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200 transition-all flex items-center justify-between text-left group cursor-pointer active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0B63E5] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-700">
                      Tukar Tambah
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Tukar tambah motor ini dengan motor kamu
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
              </button>

            </div>

            {/* CARD 2: Penjual (Dealer Showroom Contact dengan Logo Profil Asli) */}
            <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Penjual
                </span>
              </div>

              {/* Showroom Profile Header dengan Logo Asli Dealer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Foto Profil Penjual (Logo Asli CV/Showroom) */}
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 overflow-hidden shadow-2xs flex items-center justify-center p-1 shrink-0">
                    {matchedBranch.logo ? (
                      <img
                        src={matchedBranch.logo}
                        alt={matchedBranch.name}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                        {matchedBranch.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {matchedBranch.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {matchedBranch.city}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('cabang')}
                  className="text-xs font-bold text-[#0B63E5] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Kunjungi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Button 1: Chat dengan penjual (WhatsApp Direct) */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 border-2 border-blue-600 text-blue-600 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 text-center shadow-2xs"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Chat dengan penjual</span>
              </a>

              {/* Action Button 2: Tampilkan nomor / Telepon */}
              {showPhoneNumber ? (
                <a
                  href={`tel:${matchedBranch.phone.replace(/[^0-9]/g, '')}`}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 text-center"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{matchedBranch.phone} (Klik untuk Telepon)</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPhoneNumber(true)}
                  className="w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tampilkan nomor</span>
                </button>
              )}

              {/* ID Iklan Footer */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 border-t border-gray-100">
                <span>ID Iklan</span>
                <span className="font-mono">{vehicle.id}</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
