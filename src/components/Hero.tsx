import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bike, 
  BadgeDollarSign, 
  ArrowLeftRight, 
  ArrowRight,
  Sparkles,
  Banknote
} from 'lucide-react';
import { Branch, HeroBanner } from '../types';
import { buildWhatsAppLink } from '../utils/formatters';
import { isVideoMedia, isYouTubeUrl, getYouTubeEmbedUrl } from '../utils/media';

const DEFAULT_SLIDES: HeroBanner[] = [
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
    isActive: true,
    imageFit: 'cover',
    imagePosition: '50% 50%',
    imagePosX: 50,
    imagePosY: 50,
    imageScale: 100,
    aspectRatio: '16:9',
    bannerHeight: 380,
    showTextOverlay: true,
    overlayOpacity: 70,
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
    isActive: true,
    imageFit: 'cover',
    imagePosition: '50% 50%',
    imagePosX: 50,
    imagePosY: 50,
    imageScale: 100,
    aspectRatio: '16:9',
    bannerHeight: 380,
    showTextOverlay: true,
    overlayOpacity: 70,
  },
];

interface HeroProps {
  selectedBranch: Branch;
  onNavigate: (sectionId: string) => void;
  onQuickFilter?: (category?: string, condition?: string) => void;
  onOpenAuth?: (tab: 'login' | 'register') => void;
  onSelectBrand?: (brand: string) => void;
  banners?: HeroBanner[];
}

export const Hero: React.FC<HeroProps> = ({
  selectedBranch,
  onNavigate,
  banners = DEFAULT_SLIDES,
}) => {
  const activeBanners = banners.filter((b: any) => b.isActive !== false);
  const slides = activeBanners.length > 0 ? activeBanners : DEFAULT_SLIDES;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Keep index within bounds if slides change
  useEffect(() => {
    if (currentSlideIndex >= slides.length) {
      setCurrentSlideIndex(0);
    }
  }, [slides.length, currentSlideIndex]);

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
    const linkType = currentSlide.ctaLinkType || 'whatsapp';

    if (linkType === 'katalog') {
      onNavigate('katalog');
      return;
    }
    if (linkType === 'dana-tunai') {
      onNavigate('dana-tunai');
      return;
    }
    if (linkType === 'tukar-tambah') {
      onNavigate('tukar-tambah');
      return;
    }
    if (linkType === 'jual-motor') {
      onNavigate('jual-motor');
      return;
    }
    if (linkType === 'custom' && currentSlide.ctaCustomUrl) {
      window.open(currentSlide.ctaCustomUrl, '_blank');
      return;
    }

    // Default: WhatsApp Link
    const waUrl = buildWhatsAppLink(
      selectedBranch.whatsapp,
      `Halo Pandu Motor Group (${selectedBranch.name}), saya tertarik dengan promo "${currentSlide.taglineRibbon}: ${currentSlide.title} ${currentSlide.titleHighlight}". Mohon info rincian dan ketersediaan unit.`
    );
    window.open(waUrl, '_blank');
  };

  // Sizing & Positioning Styles
  const fitMode = currentSlide.imageFit || 'cover';
  const posX = currentSlide.imagePosX ?? 50;
  const posY = currentSlide.imagePosY ?? 50;
  const scale = (currentSlide.imageScale || 100) / 100;
  const showText = currentSlide.showTextOverlay !== false;
  const overlayOpacity = (currentSlide.overlayOpacity ?? 70) / 100;
  const aspectRatio = currentSlide.aspectRatio || '16:9';

  const isVideo = isVideoMedia(currentSlide.mediaType, currentSlide.videoUrl || currentSlide.image);
  const videoSrc = currentSlide.videoUrl || currentSlide.image;
  const isYT = isYouTubeUrl(videoSrc);

  return (
    <div className="w-full bg-[#F8FAFC] pt-3 pb-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* 1. HERO PROMO BANNER CAROUSEL (Dinamis Foto & Video)                      */}
        {/* ========================================================================= */}
        <div 
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-sm group transition-all"
          style={{
            backgroundColor: currentSlide.themeColor || '#0f172a',
          }}
        >
          
          {/* Main Slide Container */}
          <div 
            className="relative w-full flex flex-col justify-between overflow-hidden"
            style={{
              aspectRatio: aspectRatio === '21:9' ? '21/9' : 
                           aspectRatio === '16:7' ? '16/7' : 
                           aspectRatio === '3:1' ? '3/1' : 
                           aspectRatio === 'custom' ? undefined : '16/9',
              minHeight: aspectRatio === 'custom' ? `${currentSlide.bannerHeight || 380}px` : undefined,
            }}
          >
            
            {/* Ambient Backdrop Blur for Contain Mode */}
            {fitMode === 'contain' && (
              <div 
                className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-40 scale-115 transition-all duration-700 pointer-events-none"
                style={{ backgroundImage: `url(${currentSlide.videoPoster || currentSlide.image})` }}
              />
            )}

            {/* Foreground Main Banner Media (Image or Video) */}
            <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
              {isVideo ? (
                isYT ? (
                  <iframe
                    src={getYouTubeEmbedUrl(videoSrc)}
                    title={currentSlide.title}
                    className="w-full h-full pointer-events-none scale-105"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    style={{
                      border: 'none',
                      transform: `scale(${scale})`,
                    }}
                  />
                ) : (
                  <video
                    key={videoSrc}
                    src={videoSrc}
                    poster={currentSlide.videoPoster || currentSlide.image}
                    autoPlay={currentSlide.videoAutoplay !== false}
                    loop={currentSlide.videoLoop !== false}
                    muted={currentSlide.videoMuted !== false}
                    playsInline
                    className="w-full h-full pointer-events-none transition-all duration-700"
                    style={{
                      objectFit: fitMode === 'auto' ? 'contain' : (fitMode as any),
                      objectPosition: `${posX}% ${posY}%`,
                      transform: `scale(${scale})`,
                    }}
                  />
                )
              ) : (
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full transition-all duration-700 pointer-events-none"
                  style={{
                    objectFit: fitMode === 'auto' ? 'contain' : (fitMode as any),
                    objectPosition: `${posX}% ${posY}%`,
                    transform: `scale(${scale})`,
                  }}
                />
              )}

              {/* Dynamic Dark Gradient for Text Legibility (Only if showText is active) */}
              {showText && (
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent transition-opacity duration-500 pointer-events-none"
                  style={{ opacity: overlayOpacity }}
                />
              )}
            </div>

            {/* Top Tagline Ribbon (Shown if showText is active) */}
            <div className="relative z-10 p-2 sm:p-5 md:p-6">
              {showText && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-400 font-bold text-[8px] sm:text-xs tracking-wider uppercase shadow-xs">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-400" />
                  <span>{currentSlide.taglineRibbon}</span>
                </div>
              )}
            </div>

            {/* Bottom Content Area: Title, Period & CTA Button */}
            <div className="relative z-10 p-2 sm:p-5 md:p-6 flex items-end justify-between gap-2 sm:gap-4">
              {showText ? (
                <div className="max-w-[72%] text-white min-w-0">
                  <h1 className="text-[11px] sm:text-lg md:text-2xl font-black tracking-tight leading-tight mb-0.5 drop-shadow-sm truncate">
                    <span>{currentSlide.title} </span>
                    <span className="text-amber-400">{currentSlide.titleHighlight}</span>
                  </h1>
                  <p className="text-[8px] sm:text-xs text-slate-300 font-medium truncate">
                    {currentSlide.period}
                    <span className="hidden sm:inline"> • Pandu Motor Group Resmi &amp; Bergaransi</span>
                  </p>
                </div>
              ) : (
                <div />
              )}

              {/* Action Button: Sangat kecil dan simpel tanpa tanda panah */}
              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg font-bold text-[9px] sm:text-xs shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  {currentSlide.ctaText || 'Yuk Ajukan Sekarang'}
                </button>
              </div>
            </div>

          </div>

          {/* Desktop Arrow Navigation Controls */}
          {slides.length > 1 && (
            <>
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
            </>
          )}

          {/* Dynamic Pagination Dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id || idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  aria-label={`Ke slide ${idx + 1}`}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlideIndex === idx
                      ? 'w-5 sm:w-6 bg-amber-400'
                      : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}

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
