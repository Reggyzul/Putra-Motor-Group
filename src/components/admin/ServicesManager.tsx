import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  BadgeDollarSign, 
  Bike,
  Save, 
  Upload, 
  CheckCircle2, 
  Image as ImageIcon, 
  Sparkles,
  Eye,
  ShieldCheck,
  Banknote,
  Clock
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
  const [activeSubTab, setActiveSubTab] = useState<'jualmotor' | 'tradein' | 'danatunai'>('jualmotor');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Form State with existing settings or standard defaults
  const [formData, setFormData] = useState<{
    // Jual Motor
    jualmotor_banner_title: string;
    jualmotor_banner_subtitle: string;
    jualmotor_banner_cta: string;
    jualmotor_hero_title: string;
    jualmotor_hero_subtitle: string;
    jualmotor_advantage_1_title: string;
    jualmotor_advantage_1_desc: string;
    jualmotor_advantage_2_title: string;
    jualmotor_advantage_2_desc: string;
    jualmotor_advantage_3_title: string;
    jualmotor_advantage_3_desc: string;
    jualmotor_advantage_4_title: string;
    jualmotor_advantage_4_desc: string;

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
    // Jual Motor Defaults
    jualmotor_banner_title: siteSettings.jualmotor_banner_title || 'Mau menjual motor anda? Putra Motor Group Solusinya!',
    jualmotor_banner_subtitle: siteSettings.jualmotor_banner_subtitle || 'Taksiran harga terbaik & pembayaran langsung lunas di 4 cabang showroom resmi kami.',
    jualmotor_banner_cta: siteSettings.jualmotor_banner_cta || 'Jual Motor',
    jualmotor_hero_title: siteSettings.jualmotor_hero_title || 'Jual Motor Cepat & Aman, Taksiran Harga Terbaik',
    jualmotor_hero_subtitle: siteSettings.jualmotor_hero_subtitle || 'Isi rincian motor di bawah dan pilih cabang showroom terdekat untuk konfirmasi langsung via WhatsApp.',
    jualmotor_advantage_1_title: siteSettings.jualmotor_advantage_1_title || 'Taksiran Harga Tertinggi',
    jualmotor_advantage_1_desc: siteSettings.jualmotor_advantage_1_desc || 'Penilaian adil berdasarkan kondisi riil dan tren pasar motor terkini.',
    jualmotor_advantage_2_title: siteSettings.jualmotor_advantage_2_title || 'Pembayaran Langsung Lunas',
    jualmotor_advantage_2_desc: siteSettings.jualmotor_advantage_2_desc || 'Uang langsung cair via transfer rekening atau cash saat kesepakatan tercapai.',
    jualmotor_advantage_3_title: siteSettings.jualmotor_advantage_3_title || 'Bisa Jemput Unit',
    jualmotor_advantage_3_desc: siteSettings.jualmotor_advantage_3_desc || 'Tim showroom siap membantu cek unit di lokasi Anda atau kunjungi cabang terdekat.',
    jualmotor_advantage_4_title: siteSettings.jualmotor_advantage_4_title || 'Bebas Ribet & Aman',
    jualmotor_advantage_4_desc: siteSettings.jualmotor_advantage_4_desc || 'Proses administrasi serah terima surat dan kwitansi resmi dealer terpercaya.',

    // Tukar Tambah Defaults
    tradein_hero_title: siteSettings.tradein_hero_title || 'Berencana ganti motor? Tukar tambah bisa jadi solusi buatmu',
    tradein_hero_subtitle: siteSettings.tradein_hero_subtitle || 'Tukar tambah di Pandu Motor Group memungkinkanmu menukar motor bekas dengan motor impianmu, dengan proses yang cepat, transparan, dan pilihan unit terlengkap.',
    tradein_hero_cta: siteSettings.tradein_hero_cta || 'Tukar tambah sekarang',
    tradein_hero_image: siteSettings.tradein_hero_image || '/images/momotor_banner_nmax_aerox.avif',

    // Dana Tunai Defaults
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
          Kelola 3 Layanan Utama (Jual Motor, Tukar Tambah &amp; Dana Tunai)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Ubah teks judul, deskripsi, tombol aksi, dan keunggulan pada halaman Jual Motor, Tukar Tambah, dan Dana Tunai
        </p>
      </div>

      {showToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Perubahan data layanan berhasil disimpan dan langsung aktif di semua halaman!</span>
        </div>
      )}

      {/* Sub Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-gray-200 rounded-2xl w-fit shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveSubTab('jualmotor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeSubTab === 'jualmotor'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Layanan Jual Motor (Baru)</span>
        </button>

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
              ? 'bg-amber-500 text-slate-950 shadow-xs'
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
        {/* SUBTAB 0: JUAL MOTOR                                                  */}
        {/* ===================================================================== */}
        {activeSubTab === 'jualmotor' && (
          <div className="space-y-6 animate-in fade-in">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                <Bike className="w-4 h-4 text-emerald-600" />
                <span>Pengaturan Banner &amp; Halaman Jual Motor</span>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Aktif di Landing Page &amp; Next Page
              </span>
            </div>

            {/* 1. Banner Footer Landing Page */}
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Banner Jual Motor di Atas Footer (Landing Page)</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Banner di Atas Footer
                </label>
                <input
                  type="text"
                  value={formData.jualmotor_banner_title}
                  onChange={(e) => setFormData({ ...formData, jualmotor_banner_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subjudul Deskripsi Singkat
                </label>
                <input
                  type="text"
                  value={formData.jualmotor_banner_subtitle}
                  onChange={(e) => setFormData({ ...formData, jualmotor_banner_subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teks Tombol Banner (CTA)
                </label>
                <input
                  type="text"
                  value={formData.jualmotor_banner_cta}
                  onChange={(e) => setFormData({ ...formData, jualmotor_banner_cta: e.target.value })}
                  className="w-full sm:w-1/2 px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-emerald-700 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 2. Hero Section Halaman Jual Motor */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Hero Banner Halaman Jual Motor (Next Page)</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Utama Hero Halaman Jual Motor
                </label>
                <input
                  type="text"
                  value={formData.jualmotor_hero_title}
                  onChange={(e) => setFormData({ ...formData, jualmotor_hero_title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-black text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subjudul Deskripsi Hero
                </label>
                <textarea
                  rows={2}
                  value={formData.jualmotor_hero_subtitle}
                  onChange={(e) => setFormData({ ...formData, jualmotor_hero_subtitle: e.target.value })}
                  className="w-full p-3 bg-white border border-gray-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            {/* 3. 4 Kartu Keunggulan Jual Motor */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                4 Poin Keunggulan Jual Motor di Showroom
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Poin 1 */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center">1</span>
                    <span>Keunggulan 1</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Judul Keunggulan 1"
                    value={formData.jualmotor_advantage_1_title}
                    onChange={(e) => setFormData({ ...formData, jualmotor_advantage_1_title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                  />
                  <textarea
                    rows={2}
                    placeholder="Deskripsi Keunggulan 1"
                    value={formData.jualmotor_advantage_1_desc}
                    onChange={(e) => setFormData({ ...formData, jualmotor_advantage_1_desc: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl text-[11px] resize-none"
                  />
                </div>

                {/* Poin 2 */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">2</span>
                    <span>Keunggulan 2</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Judul Keunggulan 2"
                    value={formData.jualmotor_advantage_2_title}
                    onChange={(e) => setFormData({ ...formData, jualmotor_advantage_2_title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                  />
                  <textarea
                    rows={2}
                    placeholder="Deskripsi Keunggulan 2"
                    value={formData.jualmotor_advantage_2_desc}
                    onChange={(e) => setFormData({ ...formData, jualmotor_advantage_2_desc: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl text-[11px] resize-none"
                  />
                </div>

                {/* Poin 3 */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center">3</span>
                    <span>Keunggulan 3</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Judul Keunggulan 3"
                    value={formData.jualmotor_advantage_3_title}
                    onChange={(e) => setFormData({ ...formData, jualmotor_advantage_3_title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                  />
                  <textarea
                    rows={2}
                    placeholder="Deskripsi Keunggulan 3"
                    value={formData.jualmotor_advantage_3_desc}
                    onChange={(e) => setFormData({ ...formData, jualmotor_advantage_3_desc: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl text-[11px] resize-none"
                  />
                </div>

                {/* Poin 4 */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center">4</span>
                    <span>Keunggulan 4</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Judul Keunggulan 4"
                    value={formData.jualmotor_advantage_4_title}
                    onChange={(e) => setFormData({ ...formData, jualmotor_advantage_4_title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                  />
                  <textarea
                    rows={2}
                    placeholder="Deskripsi Keunggulan 4"
                    value={formData.jualmotor_advantage_4_desc}
                    onChange={(e) => setFormData({ ...formData, jualmotor_advantage_4_desc: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl text-[11px] resize-none"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* SUBTAB 1: TUKAR TAMBAH                                                */}
        {/* ===================================================================== */}
        {activeSubTab === 'tradein' && (
          <div className="space-y-6 animate-in fade-in">
            
            <div className="flex items-center gap-2 text-sm font-black text-slate-900 border-b border-gray-100 pb-3">
              <ArrowLeftRight className="w-4 h-4 text-blue-600" />
              <span>Header &amp; Banner Tukar Tambah</span>
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
