import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bike, 
  BadgeDollarSign, 
  ArrowLeftRight, 
  ArrowRight,
  Sparkles,
  Banknote,
  MapPin,
  Phone,
  Send,
  X,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { Branch, HeroBanner, SiteSettings } from '../types';
import { BRANCHES_DATA } from '../data/branches';
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
  branches?: Branch[];
  onSelectBranch?: (branch: Branch) => void;
  siteSettings?: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({
  selectedBranch,
  onNavigate,
  banners = DEFAULT_SLIDES,
  branches = BRANCHES_DATA,
  onSelectBranch,
  siteSettings,
}) => {
  const activeBanners = banners.filter((b: any) => b.isActive !== false);
  const slides = activeBanners.length > 0 ? activeBanners : DEFAULT_SLIDES;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

  const allBranches = branches && branches.length > 0 ? branches : BRANCHES_DATA;

  // Keep index within bounds if slides change
  useEffect(() => {
    if (currentSlideIndex >= slides.length) {
      setCurrentSlideIndex(0);
    }
  }, [slides.length, currentSlideIndex]);

  // Auto slide (pause when modal open)
  useEffect(() => {
    if (slides.length <= 1 || isBranchModalOpen) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isBranchModalOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isBranchModalOpen) {
        setIsBranchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBranchModalOpen]);

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

    // Default WhatsApp Action: Buka modal pilihan 4 nomor WA cabang showroom
    setIsBranchModalOpen(true);
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

            {/* Top Tagline Ribbon (Shown if showText is active and non-empty) */}
            <div className="relative z-10 p-2 sm:p-5 md:p-6">
              {showText && currentSlide.taglineRibbon && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-amber-400 font-bold text-[8px] sm:text-xs tracking-wider uppercase shadow-xs">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-400" />
                  <span>{currentSlide.taglineRibbon}</span>
                </div>
              )}
            </div>

            {/* Bottom Content Area: Title, Period & CTA Button */}
            <div className="relative z-10 p-2 sm:p-5 md:p-6 flex items-end justify-between gap-2 sm:gap-4">
              {showText && (currentSlide.title || currentSlide.titleHighlight || currentSlide.period) ? (
                <div className="max-w-[72%] text-white min-w-0">
                  {(currentSlide.title || currentSlide.titleHighlight) && (
                    <h1 className="text-[11px] sm:text-lg md:text-2xl font-black tracking-tight leading-tight mb-0.5 drop-shadow-sm truncate">
                      <span>{currentSlide.title} </span>
                      <span className="text-amber-400">{currentSlide.titleHighlight}</span>
                    </h1>
                  )}
                  {currentSlide.period && (
                    <p className="text-[8px] sm:text-xs text-slate-300 font-medium truncate">
                      {currentSlide.period}
                      <span className="hidden sm:inline"> • Pandu Motor Group Resmi &amp; Bergaransi</span>
                    </p>
                  )}
                </div>
              ) : (
                <div />
              )}

              {/* Action Button: dengan Logo WhatsApp & Teks */}
              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-[10px] sm:text-xs shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap group/btn"
                  title="Klik untuk memilih nomor WhatsApp cabang"
                >
                  <svg 
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white shrink-0 group-hover/btn:scale-110 transition-transform" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.181-.176.2-.352.226-.653.075-.301-.15-1.272-.469-2.423-1.497-.896-.8-1.501-1.788-1.677-2.089-.176-.301-.019-.464.132-.614.136-.135.301-.352.452-.528.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.635-.929-2.239-.245-.589-.494-.509-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.055 1.03-1.055 2.512 1.08 2.914 1.23 3.115c.15.2 2.125 3.245 5.148 4.552.719.311 1.281.497 1.719.636.723.23 1.381.197 1.901.12.579-.087 1.78-.728 2.03-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351zM12.042 21.808h-.008a9.78 9.78 0 0 1-4.99-1.365l-.358-.213-3.71.973.99-3.616-.233-.371A9.773 9.773 0 0 1 2.25 12.042C2.25 6.634 6.643 2.25 12.052 2.25c2.617 0 5.076 1.02 6.927 2.871a9.743 9.743 0 0 1 2.871 6.921c0 5.409-4.4 9.766-9.808 9.766zm7.808-17.618A11.026 11.026 0 0 0 12.052 1C5.952 1 1 5.952 1 12.042c0 1.948.508 3.85 1.474 5.524L1 23l5.603-1.47a11.023 11.023 0 0 0 5.44 1.428h.009c6.1 0 11.052-4.952 11.052-11.042 0-2.951-1.15-5.725-3.254-7.726z" />
                  </svg>
                  <span>{currentSlide.ctaText || 'Yuk Ajukan Sekarang'}</span>
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

      {/* ========================================================================= */}
      {/* 3. MODAL: 4 PILIHAN NOMOR WHATSAPP CABANG SHOWROOM                        */}
      {/* ========================================================================= */}
      {isBranchModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsBranchModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with WhatsApp Gradient */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 sm:p-5 relative">
              <button
                type="button"
                onClick={() => setIsBranchModalOpen(false)}
                className="absolute right-3 top-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-md shrink-0">
                  <svg className="w-6 h-6 fill-[#25D366]" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.181-.176.2-.352.226-.653.075-.301-.15-1.272-.469-2.423-1.497-.896-.8-1.501-1.788-1.677-2.089-.176-.301-.019-.464.132-.614.136-.135.301-.352.452-.528.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.635-.929-2.239-.245-.589-.494-.509-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.055 1.03-1.055 2.512 1.08 2.914 1.23 3.115c.15.2 2.125 3.245 5.148 4.552.719.311 1.281.497 1.719.636.723.23 1.381.197 1.901.12.579-.087 1.78-.728 2.03-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351zM12.042 21.808h-.008a9.78 9.78 0 0 1-4.99-1.365l-.358-.213-3.71.973.99-3.616-.233-.371A9.773 9.773 0 0 1 2.25 12.042C2.25 6.634 6.643 2.25 12.052 2.25c2.617 0 5.076 1.02 6.927 2.871a9.743 9.743 0 0 1 2.871 6.921c0 5.409-4.4 9.766-9.808 9.766zm7.808-17.618A11.026 11.026 0 0 0 12.052 1C5.952 1 1 5.952 1 12.042c0 1.948.508 3.85 1.474 5.524L1 23l5.603-1.47a11.023 11.023 0 0 0 5.44 1.428h.009c6.1 0 11.052-4.952 11.052-11.042 0-2.951-1.15-5.725-3.254-7.726z" />
                  </svg>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-300/30 text-[10px] font-bold tracking-wide uppercase text-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    Pilih Cabang Showroom
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight mt-0.5">
                    Ajukan Promo via WhatsApp
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Pilih 1 dari 4 cabang showroom resmi Pandu Motor Group terdekat
                  </p>
                </div>
              </div>

              {/* Promo Banner Preview Box */}
              <div className="mt-3 bg-black/20 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/10 text-xs flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">
                    {currentSlide.taglineRibbon || 'Promo Pilihan'}
                  </div>
                  <div className="font-bold text-white truncate text-xs sm:text-sm">
                    {currentSlide.title} {currentSlide.titleHighlight}
                  </div>
                  {currentSlide.period && (
                    <div className="text-[10px] text-emerald-100/80 truncate">
                      {currentSlide.period}
                    </div>
                  )}
                </div>
                <div className="px-2 py-1 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black shrink-0">
                  Aktif
                </div>
              </div>
            </div>

            {/* Branch Choices List */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 max-h-[50vh]">
              <div className="text-xs font-bold text-slate-600 flex items-center justify-between">
                <span>Daftar 4 Nomor WhatsApp Cabang Showroom:</span>
                <span className="text-[11px] text-slate-400 font-medium">Klik untuk chat langsung</span>
              </div>

              {allBranches.map((branch, index) => {
                const promoName = [currentSlide.taglineRibbon, currentSlide.title, currentSlide.titleHighlight].filter(Boolean).join(' - ');
                const message = `Halo ${branch.name} (${branch.companyName}), saya ingin mengajukan promo "${promoName}" di Pandu Motor Group. Mohon info rincian DP/cicilan, persyaratan, dan ketersediaan unit. Terima kasih!`;
                const waUrl = buildWhatsAppLink(branch.whatsapp, message);

                return (
                  <a
                    key={branch.id || index}
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (onSelectBranch) onSelectBranch(branch);
                      setIsBranchModalOpen(false);
                    }}
                    className={`w-full p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all flex items-center justify-between gap-3 group active:scale-[0.99] cursor-pointer ${
                      selectedBranch?.id === branch.id
                        ? 'bg-emerald-50/70 border-emerald-400 shadow-xs'
                        : 'bg-slate-50/70 hover:bg-emerald-50/40 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shadow-2xs">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-700 transition-colors">
                            {branch.name}
                          </span>
                          {selectedBranch?.id === branch.id && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold">
                              Pilihan Anda
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium truncate">
                          {branch.city} • {branch.companyName}
                        </div>
                        <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{branch.phone || branch.whatsapp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[11px] sm:text-xs shadow-xs group-hover:shadow-md group-hover:scale-105 transition-all">
                        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.181-.176.2-.352.226-.653.075-.301-.15-1.272-.469-2.423-1.497-.896-.8-1.501-1.788-1.677-2.089-.176-.301-.019-.464.132-.614.136-.135.301-.352.452-.528.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.635-.929-2.239-.245-.589-.494-.509-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.055 1.03-1.055 2.512 1.08 2.914 1.23 3.115c.15.2 2.125 3.245 5.148 4.552.719.311 1.281.497 1.719.636.723.23 1.381.197 1.901.12.579-.087 1.78-.728 2.03-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351zM12.042 21.808h-.008a9.78 9.78 0 0 1-4.99-1.365l-.358-.213-3.71.973.99-3.616-.233-.371A9.773 9.773 0 0 1 2.25 12.042C2.25 6.634 6.643 2.25 12.052 2.25c2.617 0 5.076 1.02 6.927 2.871a9.743 9.743 0 0 1 2.871 6.921c0 5.409-4.4 9.766-9.808 9.766zm7.808-17.618A11.026 11.026 0 0 0 12.052 1C5.952 1 1 5.952 1 12.042c0 1.948.508 3.85 1.474 5.524L1 23l5.603-1.47a11.023 11.023 0 0 0 5.44 1.428h.009c6.1 0 11.052-4.952 11.052-11.042 0-2.951-1.15-5.725-3.254-7.726z" />
                        </svg>
                        <span>Chat WA</span>
                        <Send className="w-3 h-3" />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>CS Showroom Online Setiap Hari (08.00 - 17.00 WIB)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsBranchModalOpen(false)}
                className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
