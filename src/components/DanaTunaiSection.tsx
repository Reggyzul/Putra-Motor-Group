import React from 'react';
import { 
  Home, 
  GraduationCap, 
  Laptop, 
  HeartPulse, 
  Send 
} from 'lucide-react';
import { Branch, SiteSettings } from '../types';
import { buildWhatsAppLink } from '../utils/formatters';

interface DanaTunaiSectionProps {
  selectedBranch: Branch;
  siteSettings?: SiteSettings;
}

export const DanaTunaiSection: React.FC<DanaTunaiSectionProps> = ({ 
  selectedBranch,
  siteSettings,
}) => {
  const title = siteSettings?.danatunai_hero_title || 'Apa itu Dana Tunai?';
  const subtitle = siteSettings?.danatunai_hero_subtitle || 'Fasilitas Dana Tunai merupakan fasilitas pinjaman khusus bagi Anda yang membutuhkan dana cepat dan aman dengan jaminan BPKB Sepeda Motor atau Mobil untuk memenuhi berbagai macam kebutuhan (modal usaha, renovasi rumah, biaya pendidikan, kesehatan, maupun kebutuhan lainnya). Kendaraan fisik tetap dapat Anda gunakan sehari-hari.';
  const ctaText = siteSettings?.danatunai_hero_cta || 'Ajukan dana sekarang';
  
  const purpose1 = siteSettings?.danatunai_purpose_1 || 'Renovasi atau Furniture';
  const purpose2 = siteSettings?.danatunai_purpose_2 || 'Biaya Pendidikan';
  const purpose3 = siteSettings?.danatunai_purpose_3 || 'Barang Elektronik';
  const purpose4 = siteSettings?.danatunai_purpose_4 || 'Biaya Kesehatan';

  const handleApplyDanaTunai = () => {
    const waUrl = buildWhatsAppLink(
      selectedBranch.whatsapp,
      `Halo ${selectedBranch.name} (Pandu Motor Group), saya ingin mengajukan Pinjaman Dana Tunai Gadai BPKB Motor / Mobil. Mohon info persyaratan dan cara pengajuannya. Terima kasih!`
    );
    window.open(waUrl, '_blank');
  };

  return (
    <div className="w-full bg-white">
      
      {/* ========================================================================= */}
      {/* 1. APA ITU DANA TUNAI? (Dinamis dari Supabase / Admin)                     */}
      {/* ========================================================================= */}
      <section className="w-full py-12 sm:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#D32F2F] tracking-tight leading-tight">
                  {title}
                </h1>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  {subtitle}
                </p>
              </div>

              <div className="pt-2">
                {/* Button: Ajukan dana sekarang */}
                <button
                  type="button"
                  onClick={handleApplyDanaTunai}
                  className="px-8 sm:px-10 py-3.5 sm:py-4 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
                >
                  <span>{ctaText}</span>
                  <Send className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>

            {/* Right Orbital Floating Purpose Cards Graphic */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[340px] sm:min-h-[420px]">
              
              {/* Outer Dotted Orbital Circle */}
              <div className="absolute w-64 h-64 sm:w-84 sm:h-84 rounded-full border-2 border-dashed border-blue-200 pointer-events-none" />

              {/* Floating Decorative Colored Dots */}
              <div className="absolute top-2 right-12 w-3.5 h-3.5 rounded-full bg-blue-500/80 shadow-sm" />
              <div className="absolute bottom-6 left-10 w-4 h-4 rounded-full bg-blue-400/80 shadow-sm" />
              <div className="absolute top-1/2 left-2 w-2.5 h-2.5 rounded-full bg-blue-300 shadow-sm" />

              {/* 4 Floating Purpose Cards */}
              <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-4 max-w-sm w-full">
                
                {/* 1. Renovasi atau Furniture */}
                <div className="p-4 sm:p-5 bg-white border border-gray-200/90 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
                    {purpose1}
                  </span>
                </div>

                {/* 2. Biaya Pendidikan */}
                <div className="p-4 sm:p-5 bg-white border border-gray-200/90 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
                    {purpose2}
                  </span>
                </div>

                {/* 3. Barang Elektronik */}
                <div className="p-4 sm:p-5 bg-white border border-gray-200/90 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
                    {purpose3}
                  </span>
                </div>

                {/* 4. Biaya Kesehatan */}
                <div className="p-4 sm:p-5 bg-white border border-gray-200/90 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                  <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2.5">
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

    </div>
  );
};
