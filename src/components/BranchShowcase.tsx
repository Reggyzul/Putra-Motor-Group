import React, { useState } from 'react';
import { 
  MapPin, 
  PhoneCall, 
  Clock, 
  Send, 
  Building2, 
  Navigation, 
  Wrench, 
  ShieldCheck, 
  Award,
  Coffee
} from 'lucide-react';
import { Branch } from '../types';
import { BRANCHES_DATA, BRANCH_MAPS_URLS } from '../data/branches';
import { buildWhatsAppLink } from '../utils/formatters';

interface BranchShowcaseProps {
  selectedBranch: Branch;
  onSelectBranch: (branch: Branch) => void;
  branches?: Branch[];
}

export const BranchShowcase: React.FC<BranchShowcaseProps> = ({
  selectedBranch,
  onSelectBranch,
  branches = BRANCHES_DATA,
}) => {
  const [activeTabBranchId, setActiveTabBranchId] = useState<string>(selectedBranch.id);

  const activeBranch = branches.find((b) => b.id === activeTabBranchId) || selectedBranch;

  const facilities = [
    { icon: Award, label: 'Showroom Display Bersih & Lengkap' },
    { icon: ShieldCheck, label: 'Layanan Beli Motor & Dana Tunai BPKB' },
    { icon: Wrench, label: 'Bengkel Cek Fisik & Kelistrikan' },
    { icon: Coffee, label: 'Ruang Tunggu Nyaman' },
  ];

  const waBranchUrl = buildWhatsAppLink(
    activeBranch.whatsapp,
    `Halo ${activeBranch.name} (Pandu Motor Group), saya ingin datang ke showroom dan konsultasi seputar unit motor / tukar tambah / dana tunai BPKB.`
  );

  return (
    <section id="cabang" className="py-10 sm:py-14 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0B63E5] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            Jaringan Showroom Resmi
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            4 Cabang Showroom Pandu Motor Group
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Kunjungi showroom resmi terdekat kami untuk cek unit motor langsung, konsultasi tukar tambah, maupun pinjaman dana tunai BPKB.
          </p>
        </div>

        {/* Tab Buttons for Branches (2 cols on mobile, 4 cols on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-3 mb-5 sm:mb-8">
          {branches.map((branch) => {
            const isActive = activeTabBranchId === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => {
                  setActiveTabBranchId(branch.id);
                  onSelectBranch(branch);
                }}
                className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer active:scale-98 ${
                  isActive
                    ? 'bg-blue-50/80 border-blue-500 text-[#0B63E5] shadow-xs ring-1 ring-blue-400'
                    : 'bg-slate-50 border-gray-200 text-slate-700 hover:bg-slate-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                  <MapPin className={`w-3 h-3 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-[#0B63E5]' : 'text-slate-400'}`} />
                  <span className="text-[10px] sm:text-xs font-bold truncate">{branch.city.split(',')[0]}</span>
                </div>
                <div className="text-[11px] sm:text-sm font-extrabold line-clamp-1">{branch.name}</div>
              </button>
            );
          })}
        </div>

        {/* Active Branch Highlight Card with Full 100% Uncropped Photo */}
        <div className="bg-slate-50 border border-gray-200 rounded-2xl sm:rounded-3xl p-3 sm:p-8 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center">
            
            {/* Branch Image (100% Full Uncropped View) */}
            <div className="lg:col-span-6 relative rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm flex items-center justify-center p-1.5 sm:p-3">
              <img
                src={activeBranch.image}
                alt={activeBranch.name}
                className="w-full h-auto max-h-[260px] sm:max-h-[420px] object-contain rounded-lg sm:rounded-xl"
              />
              <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-slate-900/90 text-white backdrop-blur-md px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-black shadow-md">
                {activeBranch.code}
              </div>
            </div>

            {/* Branch Info & Contacts */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2.5 sm:gap-3">
                {activeBranch.logo && (
                  <img
                    src={activeBranch.logo}
                    alt={activeBranch.name}
                    className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-contain border border-gray-200 bg-white p-0.5 sm:p-1 shadow-2xs shrink-0"
                  />
                )}
                <div>
                  <span className="text-[10px] sm:text-xs font-bold text-[#0B63E5] uppercase tracking-wider">
                    {activeBranch.companyName}
                  </span>
                  <h2 className="text-base sm:text-2xl font-black text-slate-900 mt-0.5">
                    {activeBranch.name}
                  </h2>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-2 sm:gap-2.5">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium text-[11px] sm:text-sm">{activeBranch.address}</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                  <span className="font-medium text-[11px] sm:text-sm">{activeBranch.operationalHours}</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5">
                  <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                  <span className="font-bold text-slate-900 text-[11px] sm:text-sm">WhatsApp / Telp: {activeBranch.phone}</span>
                </div>
              </div>

              {/* Fasilitas Grid */}
              <div className="pt-2 sm:pt-3 border-t border-gray-200">
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2">
                  Fasilitas & Layanan Cabang:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-700 font-medium">
                  {facilities.map((fac, idx) => {
                    const Icon = fac.icon;
                    return (
                      <div key={idx} className="flex items-center gap-1.5 sm:gap-2 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border border-gray-200/80 shadow-2xs">
                        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{fac.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <a
                  href={waBranchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 sm:py-3 px-3.5 sm:px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition flex items-center justify-center gap-2 active:scale-95 text-center cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>Chat WhatsApp Cabang Ini</span>
                </a>

                <a
                  href={BRANCH_MAPS_URLS[activeBranch.id] || activeBranch.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 sm:py-3 px-3.5 sm:px-4 bg-white hover:bg-slate-100 text-slate-800 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 active:scale-95 text-center shadow-2xs cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                  <span>Petunjuk Arah (Maps)</span>
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
