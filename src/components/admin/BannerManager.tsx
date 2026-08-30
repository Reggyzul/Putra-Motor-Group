import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Image as ImageIcon, Upload, X, Check, Eye } from 'lucide-react';
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
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setFormData({ ...banner });
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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Kelola Hero Promo Banner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Slide promosi utama yang tampil di bagian atas website (Landing Page)
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
        {banners.map((banner, index) => (
          <div key={banner.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            
            <div>
              {/* Banner Live Preview Header */}
              <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
                  Slide #{index + 1}
                </div>
                {banner.isActive && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Aktif
                  </div>
                )}
              </div>

              {/* Banner Details */}
              <div className="p-4 space-y-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-600 uppercase">
                  {banner.taglineRibbon}
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {banner.title} <span className="text-[#0B63E5]">{banner.titleHighlight}</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {banner.period}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-2 bg-slate-50/50">
              <button
                type="button"
                onClick={() => handleOpenEdit(banner)}
                className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-600 border border-gray-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Banner</span>
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
        ))}
      </div>

      {/* Modal Form Banner */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-blue-100 overflow-hidden">
            
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {editingBanner ? 'Edit Banner Promo' : 'Tambah Banner Promo Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center border border-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
              
              {/* Image Preview & Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Foto Banner (Live Preview)</label>
                <div className="aspect-[16/9] rounded-2xl bg-slate-100 overflow-hidden border border-gray-200 relative">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="URL Gambar Banner..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  />
                  <label className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 inline mr-1" />
                    {uploadingImage ? '...' : 'Upload File'}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tagline Pita Atas</label>
                  <input
                    type="text"
                    value={formData.taglineRibbon}
                    onChange={(e) => setFormData({ ...formData, taglineRibbon: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Utama</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Highlight Teks (Warna)</label>
                  <input
                    type="text"
                    value={formData.titleHighlight}
                    onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold text-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Periode & Keterangan</label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Banner'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
