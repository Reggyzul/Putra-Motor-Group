import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bike, 
  BadgeDollarSign, 
  ArrowLeftRight, 
  ShieldCheck, 
  ArrowRight,
  MapPin,
  Building2
} from 'lucide-react';
import { Branch } from '../types';
import { buildWhatsAppLink } from '../utils/formatters';

interface HeroProps {
  selectedBranch: Branch;
  onNavigate: (sectionId: string) => void;
  onQuickFilter?: (category?: string, condition?: string) => void;
  onOpenAuth?: (tab: 'login' | 'register') => void;
  onSelectBrand?: (brand: string) => void;
}

interface BannerSlide {
  id: string;
  taglineRibbon: string;
  title: string;
  titleHighlight: string;
  offer1: {
    label: string;
    currency: string;
    value: string;
    unit: string;
  };
  offer2: {
    label: string;
    currency: string;
    value: string;
    unit: string;
    subtext: string;
  };
  period: string;
  image: string;
  ctaText: string;
  themeColor: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'yamaha-nmax-aerox',
    taglineRibbon: 'AGUSTUS BERTABUR UNTUNG',
    title: 'Penjualan Motor Yamaha',
    titleHighlight: 'NMax & Aerox',
    offer1: {
      label: 'Potongan DP s.d.',
      currency: 'Rp',
      value: '2,5',
      unit: 'Juta',
    },
    offer2: {
      label: 'Cashback Saldo Elektronik',
      currency: 'Rp',
      value: '300',
      unit: 'Ribu',
      subtext: '(Pengajuan dengan DP 20%)',
    },
    period: 'Periode s.d. 31 Agustus 2026 | Berlaku Seluruh Showroom',
    image: '/images/momotor_banner_nmax_aerox.avif',
    ctaText: 'Yuk Ajukan Sekarang',
    themeColor: '#0B63E5',
  },
  {
    id: 'honda-merdeka-promo',
    taglineRibbon: 'PESTA MERDEKA DISKON',
    title: 'Promo Spesial Honda',
    titleHighlight: 'Scoopy & BeAT',
    offer1: {
      label: 'DP Ringan Mulai',
      currency: 'Rp',
      value: '500',
      unit: 'Ribu',
    },
    offer2: {
      label: 'Bonus Hadiah Langsung',
      currency: '',
      value: 'Free',
      unit: 'Hadiah',
      subtext: '(Helm & Jaket Eksklusif)',
    },
    period: 'Periode s.d. 31 Agustus 2026 | Berlaku Seluruh Showroom',
    image: '/images/momotor_banner_honda_scoopy.avif',
    ctaText: 'Yuk Ajukan Sekarang',
    themeColor: '#DC2626',
  },
];

export const Hero: React.FC<HeroProps> = ({
  selectedBranch,
  onNavigate,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  };

  const currentSlide = BANNER_SLIDES[currentSlideIndex];

  const handleApplyPromo = () => {
    const waUrl = buildWhatsAppLink(
      selectedBranch.whatsapp,
      `Halo Pandu Motor Group (${selectedBranch.name}), saya tertarik dengan promo "${currentSlide.taglineRibbon}: ${currentSlide.title} ${currentSlide.titleHighlight}". Mohon info rincian dan ketersediaan unit.`
    );
    window.open(waUrl, '_blank');
  };

  return (
    <div className="w-full bg-[#F8FAFC] pt-3 pb-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* 1. HERO PROMO BANNER (100% momotor.id Style)                               */}
        {/* ========================================================================= */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm">
          
          {/* Slide Background Image */}
          <div className="relative min-h-[360px] sm:min-h-[390px] md:min-h-[420px] flex items-center">
            
            <div className="absolute inset-0 z-0">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover object-right transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/40 sm:to-transparent sm:w-3/4 md:w-3/5" />
            </div>

            {/* Banner Left Content */}
            <div className="relative z-10 w-full sm:max-w-xl md:max-w-2xl p-4 sm:p-8 md:p-10 flex flex-col justify-between">
              
              <div>
                <div className="inline-block mb-2 sm:mb-3">
                  <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white font-black text-[10px] sm:text-xs px-3 py-1 rounded-md shadow-xs tracking-wider uppercase inline-flex items-center">
                    <span>{currentSlide.taglineRibbon}</span>
                  </div>
                </div>

                <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3 sm:mb-4">
                  <span>{currentSlide.title} </span>
                  <span className="text-[#0B63E5] font-black">{currentSlide.titleHighlight}</span>
                </h1>

                {/* Two Promo Deal Boxes */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-5 max-w-md">
                  
                  {/* Box 1 */}
                  <div className="bg-[#103463] text-white rounded-xl p-2.5 sm:p-3 shadow-2xs flex flex-col justify-center">
                    <span className="text-[9px] sm:text-[11px] font-medium text-slate-200 mb-0.5">
                      {currentSlide.offer1.label}
                    </span>
                    <div className="flex items-baseline gap-0.5 sm:gap-1 flex-wrap">
                      <span className="text-[10px] sm:text-xs text-slate-300 font-bold">{currentSlide.offer1.currency}</span>
                      <span className="text-base sm:text-2xl font-black text-white tracking-tight">
                        {currentSlide.offer1.value}
                      </span>
                      <span className="bg-[#FFC709] text-slate-950 font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded">
                        {currentSlide.offer1.unit}
                      </span>
                    </div>
                  </div>

                  {/* Box 2 */}
                  <div className="bg-sky-50 border border-sky-300 rounded-xl p-2.5 sm:p-3 shadow-2xs flex flex-col justify-center">
                    <span className="text-[9px] sm:text-[11px] font-bold text-sky-950 mb-0.5 truncate">
                      {currentSlide.offer2.label}
                    </span>
                    <div className="flex items-baseline gap-0.5 sm:gap-1 flex-wrap">
                      <span className="text-[10px] sm:text-xs text-sky-800 font-bold">{currentSlide.offer2.currency}</span>
                      <span className="text-base sm:text-2xl font-black text-[#0B63E5] tracking-tight">
                        {currentSlide.offer2.value}
                      </span>
                      <span className="bg-[#FFC709] text-slate-950 font-black text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded">
                        {currentSlide.offer2.unit}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Info: Period & CTA */}
              <div className="pt-1">
                <div className="text-[10px] sm:text-xs font-bold text-slate-800 mb-0.5">
                  {currentSlide.period}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 mb-3">
                  Pandu Motor Group • Showroom Resmi Terpercaya & Bergaransi
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="w-full sm:w-auto justify-center px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-900 border border-gray-300 rounded-full font-bold text-xs sm:text-sm shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <span>{currentSlide.ctaText}</span>
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </button>

                  <div className="hidden sm:flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="text-[10px] font-bold text-slate-800">
                      Garansi 100% Mesin & Dokumen
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Desktop Arrow Controls */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Slide Sebelumnya"
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-gray-200 items-center justify-center transition-all z-20 cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Slide Selanjutnya"
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-gray-200 items-center justify-center transition-all z-20 cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {BANNER_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Ke slide ${idx + 1}`}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  currentSlideIndex === idx
                    ? 'w-5 sm:w-6 bg-[#0B63E5]'
                    : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. SECTION: CARI MOTOR IMPIAN & CABANG KAMI                                */}
        {/* ========================================================================= */}
        <div className="mt-5 sm:mt-8">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-3">
            Cari motor impian
          </h2>

          {/* 3 Main Action Cards (Beli Motor, Dana Tunai, Tukar Tambah) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
            
            {/* 1. Beli Motor */}
            <button
              type="button"
              onClick={() => onNavigate('katalog')}
              className="flex items-center justify-center gap-2.5 sm:gap-3 p-3.5 sm:p-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl hover:border-blue-500 hover:shadow-xs transition-all duration-200 cursor-pointer text-center group active:scale-98"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Bike className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <div className="text-left">
                <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Beli Motor
                </span>
                <span className="block text-[10px] text-slate-400">
                  Pilihan Motor Baru & Bekas
                </span>
              </div>
            </button>

            {/* 2. Dana Tunai */}
            <button
              type="button"
              onClick={() => onNavigate('dana-tunai')}
              className="flex items-center justify-center gap-2.5 sm:gap-3 p-3.5 sm:p-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl hover:border-emerald-500 hover:shadow-xs transition-all duration-200 cursor-pointer text-center group active:scale-98"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <BadgeDollarSign className="w-4.5 h-4.5 text-emerald-600" />
              </div>
              <div className="text-left">
                <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Dana Tunai
                </span>
                <span className="block text-[10px] text-slate-400">
                  Gadai BPKB Motor / Mobil
                </span>
              </div>
            </button>

            {/* 3. Tukar Tambah */}
            <button
              type="button"
              onClick={() => onNavigate('tukar-tambah')}
              className="flex items-center justify-center gap-2.5 sm:gap-3 p-3.5 sm:p-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl hover:border-sky-500 hover:shadow-xs transition-all duration-200 cursor-pointer text-center group active:scale-98"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <ArrowLeftRight className="w-4.5 h-4.5 text-sky-600" />
              </div>
              <div className="text-left">
                <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  Tukar Tambah
                </span>
                <span className="block text-[10px] text-slate-400">
                  Ganti Motor Lama Anda
                </span>
              </div>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
