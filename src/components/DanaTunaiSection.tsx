import React, { useState } from 'react';
import { 
  Home, 
  GraduationCap, 
  Laptop, 
  HeartPulse, 
  Send,
  MapPin,
  X,
  Building2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Branch, SiteSettings } from '../types';
import { BRANCHES_DATA } from '../data/branches';
import { buildWhatsAppLink } from '../utils/formatters';

interface DanaTunaiSectionProps {
  selectedBranch: Branch;
  branches?: Branch[];
  siteSettings?: SiteSettings;
}

export const DanaTunaiSection: React.FC<DanaTunaiSectionProps> = ({ 
  selectedBranch,
  branches = BRANCHES_DATA,
  siteSettings,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const title = siteSettings?.danatunai_hero_title || 'Apa itu Dana Tunai?';
  const subtitle = siteSettings?.danatunai_hero_subtitle || 'Fasilitas Dana Tunai merupakan fasilitas pinjaman khusus bagi Anda yang membutuhkan dana cepat dan aman dengan jaminan BPKB Sepeda Motor atau Mobil untuk memenuhi berbagai macam kebutuhan (modal usaha, renovasi rumah, biaya pendidikan, kesehatan, maupun kebutuhan lainnya). Kendaraan fisik tetap dapat Anda gunakan sehari-hari.';
  const ctaText = siteSettings?.danatunai_hero_cta || 'Ajukan dana sekarang';
  
  const purpose1 = siteSettings?.danatunai_purpose_1 || 'Renovasi atau Furniture';
  const purpose2 = siteSettings?.danatunai_purpose_2 || 'Biaya Pendidikan';
  const purpose3 = siteSettings?.danatunai_purpose_3 || 'Barang Elektronik';
  const purpose4 = siteSettings?.danatunai_purpose_4 || 'Biaya Kesehatan';

  const handleSelectBranchAndApply = (branch: Branch) => {
    setIsModalOpen(false);
    const waUrl = buildWhatsAppLink(
      branch.whatsapp,
      `Halo ${branch.name} (Pandu Motor Group), saya ingin mengajukan Pinjaman Dana Tunai Gadai BPKB Motor / Mobil. Mohon info persyaratan dan cara pengajuannya. Terima kasih!`
    );
    window.open(waUrl, '_blank');
  };

  return (
    <div className="w-full bg-white">
      
      {/* ========================================================================= */}
      {/* 1. APA ITU DANA TUNAI? (Dinamis dari Supabase / Admin)                     */}
      {/* ========================================================================= */}
      <section className="w-full py-12 sm:py-20 overflow-hidden bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <span>Layanan Finansial Resmi</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {title}
                </h1>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {subtitle}
                </p>
              </div>

              <div className="pt-2">
                {/* Button: Ajukan dana sekarang -> Buka Modal Pilihan 4 Cabang */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 sm:px-10 py-3.5 sm:py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
                >
                  <span>{ctaText}</span>
                  <Send className="w-4 h-4 text-amber-400 shrink-0" />
                </button>
              </div>
            </div>

            {/* Right Purpose Cards Graphic (Refined Minimalist) */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[340px] sm:min-h-[380px]">
              
              {/* 4 Purpose Cards */}
              <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-4 max-w-sm w-full">
                
                {/* 1. Renovasi atau Furniture */}
                <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-sm transition-all flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2.5">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                    {purpose1}
                  </span>
                </div>

                {/* 2. Biaya Pendidikan */}
                <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-sm transition-all flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2.5">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                    {purpose2}
                  </span>
                </div>

                {/* 3. Barang Elektronik */}
                <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-sm transition-all flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2.5">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                    {purpose3}
                  </span>
                </div>

                {/* 4. Biaya Kesehatan */}
                <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs hover:shadow-sm transition-all flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2.5">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
                    {purpose4}
                  </span>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MODAL PILIH CABANG (Tanpa Menampilkan Nomor, Langsung ke WhatsApp)     */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-gray-100 relative text-left my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Pilih Cabang Showroom
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pilih cabang terdekat untuk pengajuan Dana Tunai via WhatsApp
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Tutup"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List 4 Cabang (Hanya Nama Cabang & Kota, Tanpa Nomor HP) */}
            <div className="space-y-2.5 mb-4">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => handleSelectBranchAndApply(branch)}
                  className="w-full p-3 sm:p-3.5 rounded-2xl border border-gray-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/60 transition-all flex items-center justify-between group cursor-pointer active:scale-98 text-left shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                      <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                        {branch.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {branch.city}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-[#25D366] bg-emerald-50 group-hover:bg-[#25D366] group-hover:text-white px-3 py-1.5 rounded-xl border border-emerald-200 transition-all shrink-0 ml-2">
                    <span>Chat WA</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>

            {/* Security Guarantee Note */}
            <div className="bg-slate-50 rounded-xl p-2.5 border border-gray-200/80 flex items-center gap-2 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Jaminan BPKB 100% Aman • Bunga Ringan • Proses Cepat 1 Hari Kerja</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
