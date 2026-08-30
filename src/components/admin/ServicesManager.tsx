import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  BadgeDollarSign, 
  Save, 
  Upload, 
  CheckCircle2, 
  Image as ImageIcon, 
  Sparkles,
  Eye
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { uploadImageFile } from '../../lib/supabase';

interface ServicesManagerProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: Partial<SiteSettings>) => Promise<{ success: boolean; error?: string }>;
}

export const ServicesManager: React.FC<ServicesManagerProps> = ({
  siteSettings,
  onSaveSiteSettings,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tradein' | 'danatunai'>('tradein');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Form State with existing settings or standard defaults
  const [formData, setFormData] = useState<{
    // Tukar Tambah
    tradein_hero_title: string;
    tradein_hero_subtitle: string;
    tradein_hero_cta: string;
    tradein_hero_image: string;
    
    // Dana Tunai
    danatunai_hero_title: string;
    danatunai_hero_subtitle: string;
    danatunai_hero_cta: string;
    danatunai_hero_image: string;
    danatunai_purpose_1: string;
    danatunai_purpose_2: string;
    danatunai_purpose_3: string;
    danatunai_purpose_4: string;
  }>({
    tradein_hero_title: siteSettings.tradein_hero_title || 'Berencana ganti motor? Tukar tambah bisa jadi solusi buatmu',
    tradein_hero_subtitle: siteSettings.tradein_hero_subtitle || 'Tukar tambah di Pandu Motor Group memungkinkanmu menukar motor bekas dengan motor impianmu, dengan proses yang cepat, transparan, dan pilihan unit terlengkap.',
    tradein_hero_cta: siteSettings.tradein_hero_cta || 'Tukar tambah sekarang',
    tradein_hero_image: siteSettings.tradein_hero_image || '/images/momotor_banner_nmax_aerox.avif',

    danatunai_hero_title: siteSettings.danatunai_hero_title || 'Apa itu Dana Tunai?',
    danatunai_hero_subtitle: siteSettings.danatunai_hero_subtitle || 'Fasilitas Dana Tunai merupakan fasilitas pinjaman khusus bagi Anda yang membutuhkan dana cepat dan aman dengan jaminan BPKB Sepeda Motor atau Mobil untuk memenuhi berbagai macam kebutuhan (modal usaha, renovasi rumah, biaya pendidikan, kesehatan, maupun kebutuhan lainnya). Kendaraan fisik tetap dapat Anda gunakan sehari-hari.',
    danatunai_hero_cta: siteSettings.danatunai_hero_cta || 'Ajukan dana sekarang',
    danatunai_hero_image: siteSettings.danatunai_hero_image || '',
    danatunai_purpose_1: siteSettings.danatunai_purpose_1 || 'Renovasi atau Furniture',
    danatunai_purpose_2: siteSettings.danatunai_purpose_2 || 'Biaya Pendidikan',
    danatunai_purpose_3: siteSettings.danatunai_purpose_3 || 'Barang Elektronik',
    danatunai_purpose_4: siteSettings.danatunai_purpose_4 || 'Biaya Kesehatan',
  });

  const handleUpload = async (key: 'tradein_hero_image' | 'danatunai_hero_image', e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const file = files[0];
      const uploadedUrl = await uploadImageFile(file, 'pandu-motor-images', 'services');
      setFormData((prev) => ({ ...prev, [key]: uploadedUrl }));
    } catch (err: any) {
      alert('Gagal mengupload gambar: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await onSaveSiteSettings(formData);
    setIsSaving(false);
    if (res.success) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Kelola Halaman Tukar Tambah & Dana Tunai
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Ubah teks judul, deskripsi, tombol aksi, serta foto/gambar pada halaman Tukar Tambah dan Dana Tunai
        </p>
      </div>

      {showToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Perubahan Tukar Tambah & Dana Tunai berhasil disimpan dan langsung aktif!</span>
        </div>
      )}

      {/* Sub Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-gray-200 rounded-2xl w-fit shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveSubTab('tradein')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeSubTab === 'tradein'
              ? 'bg-[#0B63E5] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Layanan Tukar Tambah</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('danatunai')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeSubTab === 'danatunai'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BadgeDollarSign className="w-4 h-4" />
          <span>Layanan Dana Tunai</span>
        </button>
      </div>

      {/* FORM CONTAINER */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-6">
        
        {/* ===================================================================== */}
        {/* SUBTAB 1: TUKAR TAMBAH                                                */}
        {/* ===================================================================== */}
        {activeSubTab === 'tradein' && (
          <div className="space-y-6 animate-in fade-in">
            
            <div className="flex items-center gap-2 text-sm font-black text-slate-900 border-b border-gray-100 pb-3">
              <ArrowLeftRight className="w-4 h-4 text-blue-600" />
              <span>Header & Banner Tukar Tambah</span>
            </div>

            {/* Gambar Hero Tukar Tambah Live Preview */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-gray-200">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Foto Hero Banner Tukar Tambah (Live Preview)
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-6 aspect-[4/3] rounded-2xl bg-white border border-gray-300 overflow-hidden shadow-2xs flex items-center justify-center p-1">
                  <img
                    src={formData.tradein_hero_image || '/images/momotor_banner_nmax_aerox.avif'}
                    alt="Preview Tukar Tambah"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <div className="sm:col-span-6 space-y-2">
                  <span className="text-xs text-slate-500 leading-relaxed block">
                    Unggah foto motor atau banner khusus untuk bagian hero tukar tambah.
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.tradein_hero_image}
                      onChange={(e) => setFormData({ ...formData, tradein_hero_image: e.target.value })}
                      placeholder="URL Gambar Tukar Tambah..."
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                    />
                    <label className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5 inline mr-1" />
                      {uploadingImage ? '...' : 'Upload'}
                      <input type="file" accept="image/*" onChange={(e) => handleUpload('tradein_hero_image', e)} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Judul Utama Banner Tukar Tambah
                </label>
                <textarea
                  rows={2}
                  value={formData.tradein_hero_title}
                  onChange={(e) => setFormData({ ...formData, tradein_hero_title: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Deskripsi / Paragraf Penjelasan
                </label>
                <textarea
                  rows={3}
                  value={formData.tradein_hero_subtitle}
                  onChange={(e) => setFormData({ ...formData, tradein_hero_subtitle: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Teks Tombol Aksi (CTA)
                </label>
                <input
                  type="text"
                  value={formData.tradein_hero_cta}
                  onChange={(e) => setFormData({ ...formData, tradein_hero_cta: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-blue-600 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* SUBTAB 2: DANA TUNAI                                                  */}
        {/* ===================================================================== */}
        {activeSubTab === 'danatunai' && (
          <div className="space-y-6 animate-in fade-in">
            
            <div className="flex items-center gap-2 text-sm font-black text-slate-900 border-b border-gray-100 pb-3">
              <BadgeDollarSign className="w-4 h-4 text-emerald-600" />
              <span>Header & Layanan Dana Tunai</span>
            </div>

            {/* Text Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Judul Utama Dana Tunai
                </label>
                <input
                  type="text"
                  value={formData.danatunai_hero_title}
                  onChange={(e) => setFormData({ ...formData, danatunai_hero_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-black text-[#D32F2F] focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Deskripsi / Penjelasan Layanan Pinjaman BPKB
                </label>
                <textarea
                  rows={4}
                  value={formData.danatunai_hero_subtitle}
                  onChange={(e) => setFormData({ ...formData, danatunai_hero_subtitle: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm leading-relaxed focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Teks Tombol Aksi WhatsApp (CTA)
                </label>
                <input
                  type="text"
                  value={formData.danatunai_hero_cta}
                  onChange={(e) => setFormData({ ...formData, danatunai_hero_cta: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-emerald-600 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 4 Cards Peruntukan Dana */}
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Teks 4 Kartu Peruntukan Dana
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">Kartu 1:</label>
                    <input
                      type="text"
                      value={formData.danatunai_purpose_1}
                      onChange={(e) => setFormData({ ...formData, danatunai_purpose_1: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">Kartu 2:</label>
                    <input
                      type="text"
                      value={formData.danatunai_purpose_2}
                      onChange={(e) => setFormData({ ...formData, danatunai_purpose_2: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">Kartu 3:</label>
                    <input
                      type="text"
                      value={formData.danatunai_purpose_3}
                      onChange={(e) => setFormData({ ...formData, danatunai_purpose_3: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 mb-1 block">Kartu 4:</label>
                    <input
                      type="text"
                      value={formData.danatunai_purpose_4}
                      onChange={(e) => setFormData({ ...formData, danatunai_purpose_4: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Save Button Action */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
