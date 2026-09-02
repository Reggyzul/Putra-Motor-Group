import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Gauge, 
  Zap, 
  FileCheck2, 
  CheckCircle, 
  PhoneCall, 
  Send, 
  Calculator,
  ArrowRight,
  Flame,
  Award,
  Check,
  Fuel,
  Maximize2,
  FileText
} from 'lucide-react';
import { Vehicle, Branch } from '../types';
import { BRANCHES_DATA } from '../data/branches';
import { formatRupiah, formatNumber, buildWhatsAppLink, generateVehicleInquiryMessage } from '../utils/formatters';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onOpenCreditCalc: (vehicle: Vehicle) => void;
  selectedBranch: Branch;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onOpenCreditCalc,
  selectedBranch,
}) => {
  if (!vehicle) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'specs' | 'inspection' | 'credit'>('specs');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const vehicleBranch = BRANCHES_DATA.find((b) => b.id === vehicle.branchId) || selectedBranch;

  const whatsappInquiryUrl = buildWhatsAppLink(
    vehicleBranch.whatsapp,
    generateVehicleInquiryMessage(vehicle, vehicleBranch.name)
  );

  const inspectionChecklist = [
    { title: 'Kompresi Mesin & Transmisi', status: 'Lolos Uji Standar Dealer Pabrik', passed: true },
    { title: 'Rangka & Suspensi Depan/Belakang', status: 'Bebas Kerusakan & Tidak Bengkok', passed: true },
    { title: 'Kelistrikan, Sensor & Lampu LED', status: '100% Berfungsi Normal & Presisi', passed: true },
    { title: 'Sistem Pengereman (ABS / CBS)', status: 'Kampas Tebal & Piringan Rata', passed: true },
    { title: 'Keabsahan BPKB, STNK & Faktur', status: 'Terverifikasi Samsat 100% Sah', passed: true },
    { title: 'Riwayat Pemakaian', status: 'Bukan Bekas Banjir / Tabrakan Fatal', passed: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200 relative text-left my-auto">
        
        {/* Header Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex items-center justify-between z-20">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {vehicle.brand} • {vehicle.category.toUpperCase()} • TAHUN {vehicle.year}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1">
              {vehicle.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Top Gallery & Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Gallery */}
            <div className="md:col-span-7 space-y-3">
              {(() => {
                const activeImg = vehicle.images[activeImageIdx] || vehicle.images[0];
                const vFit = vehicle.imageFit || 'cover';
                const vPosX = vehicle.imagePosX ?? 50;
                const vPosY = vehicle.imagePosY ?? 50;
                const vScale = (vehicle.imageScale || 100) / 100;

                return (
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-gray-200">
                    {vFit === 'contain' && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-50 scale-115 pointer-events-none"
                        style={{ backgroundImage: `url(${activeImg})` }}
                      />
                    )}
                    <img
                      src={activeImg}
                      alt={vehicle.name}
                      className="w-full h-full relative z-10"
                      style={{
                        objectFit: vFit === 'auto' ? 'contain' : (vFit as any),
                        objectPosition: `${vPosX}% ${vPosY}%`,
                        transform: `scale(${vScale})`,
                      }}
                    />
                    <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-xs border border-gray-200">
                      {vehicle.condition === 'baru' ? '✨ Unit Baru 100% OTR' : '🔍 Bekas Mulus'}
                    </div>
                  </div>
                );
              })()}

              {/* Thumbnails */}
              {vehicle.images.length > 1 && (
                <div className="flex gap-2">
                  {vehicle.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-16 h-12 rounded-xl overflow-hidden border-2 transition ${
                        activeImageIdx === idx ? 'border-[#0B63E5]' : 'border-gray-200 opacity-60'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Location Box */}
            <div className="md:col-span-5 bg-slate-50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="text-xs text-slate-500 font-medium">Harga Tunai OTR:</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">
                  {formatRupiah(vehicle.price)}
                </div>

                <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="text-xs text-slate-600">
                    DP mulai: <strong className="text-slate-900">{formatRupiah(vehicle.dpMin)}</strong>
                  </div>
                  <div className="text-sm font-bold text-[#0B63E5] mt-0.5">
                    Cicilan: {formatRupiah(vehicle.installmentEstimates.tenor35)} / bln
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Lokasi: <strong>{vehicleBranch.name}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Garansi: <strong>{vehicle.warranty}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Dokumen: <strong>{vehicle.documentCompleteness}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Chat Sales / Booking Unit</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCreditCalc(vehicle);
                  }}
                  className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-gray-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span>Hitung Simulasi Kredit Angsuran</span>
                </button>
              </div>
            </div>

          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex gap-6">
              {[
                { id: 'specs', label: 'Spesifikasi Lengkap' },
                { id: 'inspection', label: 'Laporan Inspeksi 100 Titik' },
                { id: 'credit', label: 'Tabel Angsuran' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#0B63E5] text-[#0B63E5]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {vehicle.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Kapasitas Mesin</span>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{vehicle.engineCapacity}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Transmisi</span>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{vehicle.transmission}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Bahan Bakar</span>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{vehicle.fuelType}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Warna Unit</span>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{vehicle.color}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Status Pajak</span>
                  <div className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5">{vehicle.taxStatus}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Jarak Tempuh</span>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{vehicle.mileage ? `${formatNumber(vehicle.mileage)} KM` : '0 KM (Unit Baru)'}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inspection' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {inspectionChecklist.map((item, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-gray-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500">{item.status}</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'credit' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { tenor: '11 Bulan', amount: vehicle.installmentEstimates.tenor11 },
                  { tenor: '23 Bulan', amount: vehicle.installmentEstimates.tenor23 },
                  { tenor: '35 Bulan', amount: vehicle.installmentEstimates.tenor35 },
                  { tenor: '47 Bulan', amount: vehicle.installmentEstimates.tenor47 },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-gray-200 rounded-2xl text-center">
                    <div className="text-xs font-bold text-slate-500">{item.tenor}</div>
                    <div className="text-base font-extrabold text-[#0B63E5] mt-1">{formatRupiah(item.amount)}</div>
                    <div className="text-[10px] text-slate-400">/ bulan</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
