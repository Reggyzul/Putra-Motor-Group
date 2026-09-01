import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  X, 
  Check, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Monitor, 
  Move, 
  ZoomIn, 
  Layers, 
  Sliders, 
  Sparkles, 
  Target,
  ArrowRight,
  Maximize2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { HeroBanner } from '../../types';
import { uploadImageFile } from '../../lib/supabase';

interface BannerManagerProps {
  banners: HeroBanner[];
  onSaveBanner: (banner: HeroBanner) => Promise<{ success: boolean; error?: string }>;
  onDeleteBanner: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const BannerManager: React.FC<BannerManagerProps> = ({
  banners,
  onSaveBanner,
  onDeleteBanner,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'visual' | 'content' | 'cta'>('visual');

  const previewBoxRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<HeroBanner>({
    id: '',
    taglineRibbon: 'PROMO SPESIAL BULAN INI',
    title: 'Penjualan Motor Impian',
    titleHighlight: 'Diskon & DP Ringan',
    offer1: {
      label: 'Potongan DP s.d.',
      currency: 'Rp',
      value: '2 Juta',
      unit: '',
    },
    offer2: {
      label: 'Bonus Langsung',
      currency: '',
      value: 'Free Helm & Jaket',
      unit: '',
    },
    period: 'Periode s.d. Akhir Bulan | Berlaku Seluruh Showroom',
    image: '/images/momotor_banner_nmax_aerox.avif',
    ctaText: 'Yuk Ajukan Sekarang',
    themeColor: '#0B63E5',
    isActive: true,
    orderIndex: 1,
    imageFit: 'cover',
    imagePosition: '50% 50%',
    imagePosX: 50,
    imagePosY: 50,
    imageScale: 100,
    aspectRatio: '16:9',
    bannerHeight: 380,
    showTextOverlay: true,
    overlayOpacity: 70,
    ctaLinkType: 'whatsapp',
    ctaCustomUrl: '',
  });

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      id: `banner-${Date.now().toString(36)}`,
      taglineRibbon: 'PROMO SPESIAL BULAN INI',
      title: 'Promo Motor Terbaru',
      titleHighlight: 'DP Ringan & Cashback',
      offer1: {
        label: 'DP Mulai',
        currency: 'Rp',
        value: '500 Ribu',
        unit: '',
      },
      offer2: {
        label: 'Cashback Langsung',
        currency: 'Rp',
        value: '300 Ribu',
        unit: '',
      },
      period: 'Berlaku Seluruh Showroom Pandu Motor Group',
      image: '/images/momotor_banner_nmax_aerox.avif',
      ctaText: 'Yuk Ajukan Sekarang',
      themeColor: '#0B63E5',
      isActive: true,
      orderIndex: banners.length + 1,
      imageFit: 'cover',
      imagePosition: '50% 50%',
      imagePosX: 50,
      imagePosY: 50,
      imageScale: 100,
      aspectRatio: '16:9',
      bannerHeight: 380,
      showTextOverlay: true,
      overlayOpacity: 70,
      ctaLinkType: 'whatsapp',
      ctaCustomUrl: '',
    });
    setActiveTab('visual');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setFormData({
      ...banner,
      imageFit: banner.imageFit || 'cover',
      imagePosition: banner.imagePosition || `${banner.imagePosX ?? 50}% ${banner.imagePosY ?? 50}%`,
      imagePosX: banner.imagePosX !== undefined ? banner.imagePosX : 50,
      imagePosY: banner.imagePosY !== undefined ? banner.imagePosY : 50,
      imageScale: banner.imageScale || 100,
      aspectRatio: banner.aspectRatio || '16:9',
      bannerHeight: banner.bannerHeight || 380,
      showTextOverlay: banner.showTextOverlay !== false,
      overlayOpacity: banner.overlayOpacity !== undefined ? banner.overlayOpacity : 70,
      ctaLinkType: banner.ctaLinkType || 'whatsapp',
      ctaCustomUrl: banner.ctaCustomUrl || '',
    });
    setActiveTab('visual');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const file = files[0];
      const uploadedUrl = await uploadImageFile(file, 'pandu-motor-images', 'banners');
      setFormData((prev) => ({ ...prev, image: uploadedUrl }));
    } catch (err: any) {
      alert('Gagal mengupload banner: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePositionPreset = (x: number, y: number) => {
    setFormData((prev) => ({
      ...prev,
      imagePosX: x,
      imagePosY: y,
      imagePosition: `${x}% ${y}%`,
    }));
  };

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewBoxRef.current) return;
    const rect = previewBoxRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    handlePositionPreset(x, y);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await onSaveBanner(formData);
    setIsSaving(false);
    if (res.success) {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (banner: HeroBanner) => {
    if (window.confirm(`Hapus banner "${banner.title} ${banner.titleHighlight}"?`)) {
      await onDeleteBanner(banner.id);
    }
  };

  const handleToggleActive = async (banner: HeroBanner) => {
    await onSaveBanner({
      ...banner,
      isActive: !banner.isActive,
    });
  };

  // Helper for 9-point grid
  const positionPresets = [
    { label: 'Kiri Atas', x: 0, y: 0 },
    { label: 'Tengah Atas', x: 50, y: 0 },
    { label: 'Kanan Atas', x: 100, y: 0 },
    { label: 'Kiri Tengah', x: 0, y: 50 },
    { label: 'Pas Tengah', x: 50, y: 50 },
    { label: 'Kanan Tengah', x: 100, y: 50 },
    { label: 'Kiri Bawah', x: 0, y: 100 },
    { label: 'Tengah Bawah', x: 50, y: 100 },
    { label: 'Kanan Bawah', x: 100, y: 100 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Kelola Hero Promo Banner
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {banners.length} Banner
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Sesuaikan ukuran foto, posisi titik fokus, rasio banner, dan tampilan teks agar informasi tidak terpotong.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Banner Baru</span>
        </button>
      </div>

      {/* Banner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {banners.map((banner, index) => {
          const posX = banner.imagePosX ?? 50;
          const posY = banner.imagePosY ?? 50;
          const fitMode = banner.imageFit || 'cover';
          const isPoster = banner.showTextOverlay === false;

          return (
            <div 
              key={banner.id} 
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                banner.isActive ? 'border-slate-200 shadow-2xs hover:shadow-md' : 'border-dashed border-gray-300 opacity-80'
              }`}
            >
              <div>
                {/* Banner Live Card Preview Header */}
                <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden group">
                  {/* Ambient Backdrop for contain mode */}
                  {fitMode === 'contain' && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-40 scale-110"
                      style={{ backgroundImage: `url(${banner.image})` }}
                    />
                  )}

                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full relative z-10 transition-all duration-300"
                    style={{
                      objectFit: fitMode === 'auto' ? 'contain' : (fitMode as any),
                      objectPosition: `${posX}% ${posY}%`,
                      transform: `scale(${(banner.imageScale || 100) / 100})`,
                    }}
                  />

                  {/* Dark gradient simulation */}
                  {banner.showTextOverlay !== false && (
                    <div 
                      className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"
                      style={{ opacity: (banner.overlayOpacity ?? 70) / 100 }}
                    />
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5">
                    <span className="bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border border-white/10 shadow-xs">
                      Slide #{banner.orderIndex || index + 1}
                    </span>
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase shadow-xs">
                      {fitMode.toUpperCase()}
                    </span>
                    {isPoster && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-1 rounded-lg uppercase shadow-xs">
                        Poster Murni
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(banner)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition shadow-xs ${
                        banner.isActive 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                          : 'bg-slate-700 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      {banner.isActive ? '● Aktif' : '○ Nonaktif'}
                    </button>
                  </div>

                  {/* Focal point indicator on hover */}
                  <div className="absolute bottom-2 right-2 z-30 bg-black/75 backdrop-blur-xs text-[10px] font-mono text-slate-300 px-2 py-0.5 rounded border border-white/10">
                    Posisi: {posX}% {posY}%
                  </div>
                </div>

                {/* Banner Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-600 uppercase">
                      {banner.taglineRibbon || 'PROMO'}
                    </span>
                    {banner.aspectRatio && (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Rasio: {banner.aspectRatio}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-slate-900">
                    {banner.title} <span className="text-[#0B63E5]">{banner.titleHighlight}</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {banner.period}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-2 bg-slate-50/50">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>CTA: {banner.ctaText}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(banner)}
                    className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-600 border border-gray-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Foto &amp; Posisi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(banner)}
                    className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-gray-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL EDITOR: ADVANCED BANNER SIZING, POSITIONING & VISUAL EDITOR         */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0B63E5] text-white flex items-center justify-center shadow-xs">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {editingBanner ? 'Edit Banner: Ukuran, Posisi & Konten' : 'Tambah Banner Promo Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Atur foto banner agar proporsional dan tidak ada informasi penting yang terpotong
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center border border-gray-200 cursor-pointer shadow-2xs transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body with Live Preview & Adjustment Panels */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* ------------------------------------------------------------- */}
              {/* 1. LIVE INTERACTIVE BANNER PREVIEW SECTION                    */}
              {/* ------------------------------------------------------------- */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#0B63E5]" />
                      <span>Live Preview Banner ({previewDevice === 'desktop' ? 'Desktop View' : 'Mobile View'})</span>
                    </label>
                    <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-full font-medium">
                      🎯 Klik langsung pada gambar untuk ubah posisi fokus
                    </span>
                  </div>

                  {/* Device Switcher */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        previewDevice === 'desktop' ? 'bg-white text-[#0B63E5] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                        previewDevice === 'mobile' ? 'bg-white text-[#0B63E5] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile</span>
                    </button>
                  </div>
                </div>

                {/* Preview Box Frame */}
                <div className="flex justify-center bg-slate-900/90 rounded-2xl p-2 sm:p-4 border border-slate-800">
                  <div 
                    className={`relative rounded-xl overflow-hidden shadow-xl border border-white/10 transition-all duration-300 select-none ${
                      previewDevice === 'mobile' ? 'w-[320px] max-w-full' : 'w-full'
                    }`}
                    style={{
                      aspectRatio: formData.aspectRatio === '21:9' ? '21/9' : 
                                   formData.aspectRatio === '16:7' ? '16/7' : 
                                   formData.aspectRatio === '3:1' ? '3/1' : 
                                   formData.aspectRatio === 'custom' ? undefined : '16/9',
                      minHeight: formData.aspectRatio === 'custom' ? `${formData.bannerHeight || 380}px` : (previewDevice === 'mobile' ? '220px' : '280px'),
                      maxHeight: previewDevice === 'mobile' ? '360px' : '420px',
                      backgroundColor: formData.themeColor || '#0f172a',
                    }}
                  >
                    {/* Ambient backdrop when contain mode */}
                    {formData.imageFit === 'contain' && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-50 scale-110"
                        style={{ backgroundImage: `url(${formData.image})` }}
                      />
                    )}

                    {/* Interactive Image Frame */}
                    <div 
                      ref={previewBoxRef}
                      onClick={handlePreviewClick}
                      className="absolute inset-0 cursor-crosshair group flex items-center justify-center overflow-hidden"
                      title="Klik di mana saja untuk menggeser posisi fokus foto"
                    >
                      <img
                        src={formData.image}
                        alt="Banner Preview"
                        className="w-full h-full pointer-events-none transition-all duration-200"
                        style={{
                          objectFit: formData.imageFit === 'auto' ? 'contain' : (formData.imageFit as any),
                          objectPosition: `${formData.imagePosX ?? 50}% ${formData.imagePosY ?? 50}%`,
                          transform: `scale(${(formData.imageScale || 100) / 100})`,
                        }}
                      />

                      {/* Visual Focal Point Crosshair Pin */}
                      <div 
                        className="absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 transition-all duration-150 flex items-center justify-center"
                        style={{
                          left: `${formData.imagePosX ?? 50}%`,
                          top: `${formData.imagePosY ?? 50}%`,
                        }}
                      >
                        <div className="w-6 h-6 rounded-full border-2 border-amber-400 bg-amber-400/30 flex items-center justify-center shadow-md animate-pulse">
                          <Target className="w-3.5 h-3.5 text-amber-300" />
                        </div>
                      </div>

                      {/* Dark Gradient Overlay */}
                      {formData.showTextOverlay && (
                        <div 
                          className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent transition-opacity"
                          style={{ opacity: (formData.overlayOpacity ?? 70) / 100 }}
                        />
                      )}
                    </div>

                    {/* Overlay Content (Simulated Landing Page) */}
                    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-3 sm:p-5 text-white">
                      
                      {/* Top Ribbon */}
                      {formData.showTextOverlay ? (
                        <div>
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-xs border border-amber-400/40 text-amber-300 font-bold text-[9px] sm:text-[11px] uppercase tracking-wider shadow-sm">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>{formData.taglineRibbon || 'PROMO SPESIAL'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-xs text-[9px] text-amber-400 font-bold self-start">
                          <span>Mode Poster Bersih</span>
                        </div>
                      )}

                      {/* Bottom Banner Content */}
                      <div className="flex items-end justify-between gap-3">
                        {formData.showTextOverlay ? (
                          <div className="max-w-[70%]">
                            <h4 className="text-sm sm:text-lg md:text-xl font-black leading-tight drop-shadow-md">
                              <span>{formData.title} </span>
                              <span className="text-amber-400 font-black">{formData.titleHighlight}</span>
                            </h4>
                            <p className="text-[9px] sm:text-xs text-slate-300 font-medium line-clamp-1 mt-0.5 drop-shadow">
                              {formData.period}
                            </p>
                          </div>
                        ) : (
                          <div />
                        )}

                        <div className="shrink-0">
                          <button
                            type="button"
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-400 text-slate-950 rounded-lg sm:rounded-xl font-extrabold text-[10px] sm:text-xs shadow-md flex items-center gap-1.5 pointer-events-none"
                          >
                            <span>{formData.ctaText || 'Yuk Ajukan'}</span>
                            <ArrowRight className="w-3 h-3 text-slate-950" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* 2. TABBED SETTINGS CONTROLLER                                 */}
              {/* ------------------------------------------------------------- */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                
                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200 bg-slate-50/80">
                  <button
                    type="button"
                    onClick={() => setActiveTab('visual')}
                    className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                      activeTab === 'visual' 
                        ? 'border-[#0B63E5] text-[#0B63E5] bg-white' 
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Move className="w-4 h-4" />
                    <span>1. Ukuran, Posisi &amp; Foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('content')}
                    className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                      activeTab === 'content' 
                        ? 'border-[#0B63E5] text-[#0B63E5] bg-white' 
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>2. Teks &amp; Overlay Promo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('cta')}
                    className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                      activeTab === 'cta' 
                        ? 'border-[#0B63E5] text-[#0B63E5] bg-white' 
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>3. Tombol CTA &amp; Status</span>
                  </button>
                </div>

                <div className="p-4 sm:p-5 space-y-5">
                  
                  {/* ========================================================= */}
                  {/* TAB 1: VISUAL & SIZING CONTROLS                           */}
                  {/* ========================================================= */}
                  {activeTab === 'visual' && (
                    <div className="space-y-5">
                      
                      {/* Image Source & Upload */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700">
                          URL Gambar Banner atau Upload File
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://... atau /images/..."
                            className="flex-1 px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                          />
                          <label className="px-3.5 py-2 bg-[#0B63E5] hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shrink-0 transition flex items-center gap-1.5 shadow-2xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingImage ? 'Mengunggah...' : 'Pilih File'}</span>
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                          </label>
                        </div>
                      </div>

                      {/* Mode Tampilan Foto (Fit Mode) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800">
                            Mode Penyesuaian Foto (Fit Mode)
                          </label>
                          <span className="text-[11px] text-slate-500">
                            Pilih bagaimana foto mengisi bingkai banner
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {/* Contain */}
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imageFit: 'contain' })}
                            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                              formData.imageFit === 'contain'
                                ? 'border-[#0B63E5] bg-blue-50/70 text-[#0B63E5] ring-2 ring-blue-500/20'
                                : 'border-gray-200 bg-white hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs">Contain (Utuh 100%)</span>
                              {formData.imageFit === 'contain' && <Check className="w-3.5 h-3.5 text-[#0B63E5]" />}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">
                              Foto tampil lengkap tanpa terpotong sama sekali. Ada efek blur serasi di latar belakang.
                            </p>
                          </button>

                          {/* Cover */}
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imageFit: 'cover' })}
                            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                              formData.imageFit === 'cover'
                                ? 'border-[#0B63E5] bg-blue-50/70 text-[#0B63E5] ring-2 ring-blue-500/20'
                                : 'border-gray-200 bg-white hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs">Cover (Penuh Box)</span>
                              {formData.imageFit === 'cover' && <Check className="w-3.5 h-3.5 text-[#0B63E5]" />}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">
                              Mengisi penuh seluruh bidang banner. Bagian tepi bisa disesuaikan dengan posisi fokus.
                            </p>
                          </button>

                          {/* Auto */}
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imageFit: 'auto', aspectRatio: 'auto' })}
                            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                              formData.imageFit === 'auto'
                                ? 'border-[#0B63E5] bg-blue-50/70 text-[#0B63E5] ring-2 ring-blue-500/20'
                                : 'border-gray-200 bg-white hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs">Auto (Rasio Asli)</span>
                              {formData.imageFit === 'auto' && <Check className="w-3.5 h-3.5 text-[#0B63E5]" />}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">
                              Rasio banner otomatis mengikuti proporsi asli berkas foto Anda.
                            </p>
                          </button>
                        </div>
                      </div>

                      {/* Rasio Aspek Bingkai Banner */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-800">
                          Rasio Aspek Bingkai Banner (Aspect Ratio)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                          {[
                            { id: '16:9', label: '16:9', desc: 'Standar' },
                            { id: '21:9', label: '21:9', desc: 'Bioskop' },
                            { id: '16:7', label: '16:7', desc: 'Hero Wide' },
                            { id: '3:1', label: '3:1', desc: 'Panorama' },
                            { id: 'auto', label: 'Auto', desc: 'Sesuai Foto' },
                            { id: 'custom', label: 'Kustom', desc: 'Tinggi Pixel' },
                          ].map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, aspectRatio: r.id as any })}
                              className={`py-2 px-2 rounded-xl border text-center transition cursor-pointer ${
                                formData.aspectRatio === r.id
                                  ? 'border-[#0B63E5] bg-blue-50 text-[#0B63E5] font-black shadow-2xs'
                                  : 'border-gray-200 bg-white hover:bg-slate-50 text-slate-700 font-bold'
                              }`}
                            >
                              <div className="text-xs">{r.label}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{r.desc}</div>
                            </button>
                          ))}
                        </div>

                        {formData.aspectRatio === 'custom' && (
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 mt-2">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span>Ketinggian Banner Kustom</span>
                              <span className="text-[#0B63E5]">{formData.bannerHeight || 380} px</span>
                            </div>
                            <input
                              type="range"
                              min="240"
                              max="550"
                              step="10"
                              value={formData.bannerHeight || 380}
                              onChange={(e) => setFormData({ ...formData, bannerHeight: Number(e.target.value) })}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B63E5]"
                            />
                          </div>
                        )}
                      </div>

                      {/* Position & Focal Point Controls */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        
                        {/* 9-Point Quick Grid Alignment */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-800">
                            Titik Fokus Cepat (9 Titik Posisi)
                          </label>
                          <div className="grid grid-cols-3 gap-1.5 max-w-[240px]">
                            {positionPresets.map((preset) => {
                              const isSelected = 
                                (formData.imagePosX ?? 50) === preset.x && 
                                (formData.imagePosY ?? 50) === preset.y;

                              return (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() => handlePositionPreset(preset.x, preset.y)}
                                  className={`py-2 px-1 rounded-lg border text-center text-[11px] font-bold transition cursor-pointer ${
                                    isSelected
                                      ? 'border-[#0B63E5] bg-[#0B63E5] text-white shadow-xs'
                                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                                  }`}
                                  title={preset.label}
                                >
                                  {preset.label.replace('Pas ', '')}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Fine Tuning Position Sliders */}
                        <div className="space-y-3">
                          <label className="block text-xs font-bold text-slate-800">
                            Presisi Posisi &amp; Skala Zoom
                          </label>

                          {/* Posisi Horizontal (X) */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                              <span>Posisi Horizontal (Kiri ↔ Kanan)</span>
                              <span className="font-mono text-[#0B63E5]">{formData.imagePosX ?? 50}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={formData.imagePosX ?? 50}
                              onChange={(e) => handlePositionPreset(Number(e.target.value), formData.imagePosY ?? 50)}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B63E5]"
                            />
                          </div>

                          {/* Posisi Vertikal (Y) */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                              <span>Posisi Vertikal (Atas ↕ Bawah)</span>
                              <span className="font-mono text-[#0B63E5]">{formData.imagePosY ?? 50}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={formData.imagePosY ?? 50}
                              onChange={(e) => handlePositionPreset(formData.imagePosX ?? 50, Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B63E5]"
                            />
                          </div>

                          {/* Zoom Scale */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                              <span>Skala / Zoom Gambar</span>
                              <span className="font-mono text-[#0B63E5]">{formData.imageScale ?? 100}%</span>
                            </div>
                            <input
                              type="range"
                              min="80"
                              max="150"
                              value={formData.imageScale ?? 100}
                              onChange={(e) => setFormData({ ...formData, imageScale: Number(e.target.value) })}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B63E5]"
                            />
                          </div>

                        </div>

                      </div>

                      {/* Overlay & Theme Color */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>Kegelapan Bayangan Gradien (Overlay)</span>
                            <span className="text-[#0B63E5]">{formData.overlayOpacity ?? 70}%</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Turunkan ke 0% jika gambar banner Anda sudah sangat jelas dan tidak ingin digelapkan.
                          </p>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.overlayOpacity ?? 70}
                            onChange={(e) => setFormData({ ...formData, overlayOpacity: Number(e.target.value) })}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B63E5]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700">
                            Warna Aksen / Latar Belakang
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={formData.themeColor || '#0B63E5'}
                              onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                              className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                            />
                            <input
                              type="text"
                              value={formData.themeColor || '#0B63E5'}
                              onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                              className="w-28 px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* TAB 2: CONTENT & TEXT OVERLAY                             */}
                  {/* ========================================================= */}
                  {activeTab === 'content' && (
                    <div className="space-y-4">
                      
                      {/* Text Overlay Mode Switcher */}
                      <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-black text-slate-900">Mode Tampilan Teks Overlay</h4>
                            <p className="text-[11px] text-slate-600">
                              Jika foto Anda sudah memiliki desain tulisan/poster promo, sembunyikan teks overlay agar gambar terlihat bersih.
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, showTextOverlay: true })}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                formData.showTextOverlay
                                  ? 'bg-[#0B63E5] text-white shadow-2xs'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              Tampilkan Teks
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, showTextOverlay: false })}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                !formData.showTextOverlay
                                  ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              Poster Bersih
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Text Fields (Conditional if text overlay is active) */}
                      <div className={`space-y-3 transition-all ${!formData.showTextOverlay ? 'opacity-50' : ''}`}>
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Tagline Pita Atas (Ribbon Badge)</label>
                          <input
                            type="text"
                            value={formData.taglineRibbon}
                            onChange={(e) => setFormData({ ...formData, taglineRibbon: e.target.value })}
                            placeholder="Contoh: PROMO SPESIAL BULAN INI"
                            className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Utama</label>
                            <input
                              type="text"
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              placeholder="Contoh: Penjualan Motor Yamaha"
                              className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Highlight Teks (Aksen Kuning/Warna)</label>
                            <input
                              type="text"
                              value={formData.titleHighlight}
                              onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
                              placeholder="Contoh: NMax & Aerox Diskon DP"
                              className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-bold text-blue-600 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Periode &amp; Syarat</label>
                          <input
                            type="text"
                            value={formData.period}
                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                            placeholder="Contoh: Periode s.d. Akhir Bulan | Berlaku Seluruh Showroom"
                            className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>

                      </div>

                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* TAB 3: CTA & STATUS                                       */}
                  {/* ========================================================= */}
                  {activeTab === 'cta' && (
                    <div className="space-y-4">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Teks Tombol Aksi (CTA)</label>
                          <input
                            type="text"
                            value={formData.ctaText}
                            onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                            placeholder="Contoh: Yuk Ajukan Sekarang"
                            className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Aksi Ketika Diklik</label>
                          <select
                            value={formData.ctaLinkType || 'whatsapp'}
                            onChange={(e) => setFormData({ ...formData, ctaLinkType: e.target.value as any })}
                            className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-500"
                          >
                            <option value="whatsapp">Chat WhatsApp Resmi Showroom</option>
                            <option value="katalog">Buka Katalog Motor</option>
                            <option value="dana-tunai">Buka Simulasi Dana Tunai</option>
                            <option value="tukar-tambah">Buka Tukar Tambah</option>
                            <option value="jual-motor">Buka Halaman Jual Motor</option>
                            <option value="custom">URL / Link Khusus</option>
                          </select>
                        </div>
                      </div>

                      {formData.ctaLinkType === 'custom' && (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Link URL Khusus</label>
                          <input
                            type="text"
                            value={formData.ctaCustomUrl || ''}
                            onChange={(e) => setFormData({ ...formData, ctaCustomUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">Status Publikasi Banner</span>
                            <span className="text-[11px] text-slate-500">Tampilkan di carousel slide utama</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.isActive !== false}
                              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0B63E5]"></div>
                          </label>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">Urutan Tampil (Order Index)</span>
                            <span className="text-[11px] text-slate-500">Slide ke berapa yang akan dimuat</span>
                          </div>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={formData.orderIndex || 1}
                            onChange={(e) => setFormData({ ...formData, orderIndex: Number(e.target.value) })}
                            className="w-16 px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-center"
                          />
                        </div>
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-slate-50/70">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer transition shadow-2xs"
              >
                Batal
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan Banner...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan Banner</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
