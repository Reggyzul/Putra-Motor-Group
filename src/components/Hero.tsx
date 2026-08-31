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
  Building2,
  Banknote,
  Sparkles
} from 'lucide-react';
import { Branch } from '../types';
import { buildWhatsAppLink } from '../utils/formatters';

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

interface HeroProps {
  selectedBranch: Branch;
  onNavigate: (sectionId: string) => void;
  onQuickFilter?: (category?: string, condition?: string) => void;
  onOpenAuth?: (tab: 'login' | 'register') => void;
  onSelectBrand?: (brand: string) => void;
  banners?: BannerSlide[];
}

export const Hero: React.FC<HeroProps> = ({
  selectedBranch,
  onNavigate,
  banners = BANNER_SLIDES,
}) => {
  const activeBanners = banners.filter((b: any) => b.isActive !== false);
  const slides = activeBanners.length > 0 ? activeBanners : BANNER_SLIDES;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentSlideIndex] || slides[0];

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
        {/* 1. HERO PROMO BANNER (100% Full Visible Image with Bottom Overlay)         */}
        {/* ========================================================================= */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-sm group">
          
          {/* Slide Background Image (100% Unobstructed Full View) */}
          <div className="relative min-h-[300px] sm:min-h-[360px] md:min-h-[420px] flex flex-col justify-between">
            
            {/* 100% Visible Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover object-center transition-all duration-700"
              />
              {/* Soft subtle bottom gradient for text readability without obscuring the vehicle */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            </div>

            {/* Top Tagline Ribbon */}
            <div className="relative z-10 p-3.5 sm:p-6 md:p-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-400 font-bold text-[10px] sm:text-xs tracking-wider uppercase shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentSlide.taglineRibbon}</span>
              </div>
            </div>

            {/* Bottom Content: Title, Period & CTA Button */}
            <div className="relative z-10 p-3.5 sm:p-6 md:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3.5 sm:gap-6">
              <div className="max-w-2xl text-white">
                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-1 sm:mb-1.5 drop-shadow-sm">
                  <span>{currentSlide.title} </span>
                  <span className="text-amber-400 font-black">{currentSlide.titleHighlight}</span>
                </h1>
                <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 font-medium">
                  {currentSlide.period} • Pandu Motor Group Resmi &amp; Bergaransi
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>

          </div>

          {/* Desktop Arrow Controls */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Slide Sebelumnya"
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white shadow-md border border-white/20 items-center justify-center transition-all z-20 cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Slide Selanjutnya"
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white shadow-md border border-white/20 items-center justify-center transition-all z-20 cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {BANNER_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Ke slide ${idx + 1}`}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  currentSlideIndex === idx
                    ? 'w-5 sm:w-6 bg-amber-400'
                    : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
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

          {/* 4 Main Action Cards (Beli Motor, Dana Tunai, Tukar Tambah, Jual Motor) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            
            {/* 1. Beli Motor */}
            <button
              type="button"
              onClick={() => onNavigate('katalog')}
              className="flex items-center justify-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl hover:border-slate-400 hover:shadow-xs transition-all duration-200 cursor-pointer text-center group active:scale-98"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                <Bike className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  Beli Motor
                </span>
                <span className="block text-[10px] text-slate-500 truncate">
                  Unit Baru &amp; Bekas
                </span>
              </div>
            </button>

            {/* 2. Dana Tunai */}
            <button
              type="button"
              onClick={() => onNavigate('dana-tunai')}
              className="flex items-center justify-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl hover:border-slate-400 hover:shadow-xs transition-all duration-200 cursor-pointer text-center group active:scale-98"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                <BadgeDollarSign className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  Dana Tunai
                </span>
                <span className="block text-[10px] text-slate-500 truncate">
                  Gadai BPKB Resmi
                </span>
              </div>
            </button>

            {/* 3. Tukar Tambah */}
            <button
              type="button"
              onClick={() => onNavigate('tukar-tambah')}
              className="flex items-center justify-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl hover:border-slate-400 hover:shadow-xs transition-all duration-200 cursor-pointer text-center group active:scale-98"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  Tukar Tambah
                </span>
                <span className="block text-[10px] text-slate-500 truncate">
                  Ganti Motor Lama
                </span>
              </div>
            </button>

            {/* 4. Jual Motor */}
            <button
              type="button"
              onClick={() => onNavigate('jual-motor')}
              className="flex items-center justify-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl hover:border-slate-400 hover:shadow-xs transition-all duration-200 cursor-pointer text-center group active:scale-98"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                <Banknote className="w-4 h-4" />
              </div>
              <div className="text-left min-w-0">
                <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  Jual Motor
                </span>
                <span className="block text-[10px] text-slate-500 truncate">
                  Harga Tinggi &amp; Lunas
                </span>
              </div>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
