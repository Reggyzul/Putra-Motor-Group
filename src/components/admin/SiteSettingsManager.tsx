import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  Building2, 
  Mail, 
  Phone, 
  Sparkles,
  Megaphone,
  Layers,
  Award,
  Clock,
  MessageCircle,
  FileText
} from 'lucide-react';
import { SiteSettings } from '../../types';

interface SiteSettingsManagerProps {
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: Partial<SiteSettings>) => Promise<{ success: boolean; error?: string }>;
}

export const SiteSettingsManager: React.FC<SiteSettingsManagerProps> = ({
  siteSettings,
  onSaveSiteSettings,
}) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...siteSettings });
  const [activeTab, setActiveTab] = useState<'branding' | 'header' | 'footer' | 'trust'>('branding');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await onSaveSiteSettings(formData);
    setIsSaving(false);
    if (res.success) {
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Pengaturan Umum Website &amp; Konten Global
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Kelola 100% teks website, branding, kontak resmi, pengumuman header, dan footer yang langsung aktif secara Realtime.
        </p>
      </div>

      {showSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Pengaturan website berhasil disimpan dan langsung tersinkron di semua perangkat secara Realtime!</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-3 pt-2 gap-2 shadow-2xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'branding'
              ? 'border-[#0B63E5] text-[#0B63E5] bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. Identitas &amp; Kontak</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('header')}
          className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'header'
              ? 'border-[#0B63E5] text-[#0B63E5] bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>2. Teks Top Bar &amp; WA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'footer'
              ? 'border-[#0B63E5] text-[#0B63E5] bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Footer &amp; Copyright</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trust')}
          className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer shrink-0 ${
            activeTab === 'trust'
              ? 'border-[#0B63E5] text-[#0B63E5] bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. Keunggulan Showroom</span>
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-b-3xl border border-t-0 border-gray-200 shadow-2xs space-y-6">
        
        {/* TAB 1: BRANDING & KONTAK */}
        {activeTab === 'branding' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-in fade-in">
            {/* Brand Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Nama Brand Perusahaan</span>
              </label>
              <input
                type="text"
                required
                value={formData.brand_name || ''}
                onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Slogan / Tagline Brand
              </label>
              <input
                type="text"
                required
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-blue-600 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Kantor Pusat */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Alamat Kantor Pusat Showroom</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.head_office_address || ''}
                onChange={(e) => setFormData({ ...formData, head_office_address: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Email Resmi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Email Resmi (Tampil di Footer &amp; Kontak)</span>
              </label>
              <input
                type="email"
                required
                value={formData.official_email || ''}
                onChange={(e) => setFormData({ ...formData, official_email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Telepon Resmi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Nomor Telepon &amp; WhatsApp Layanan Resmi</span>
              </label>
              <input
                type="text"
                required
                value={formData.official_phone || ''}
                onChange={(e) => setFormData({ ...formData, official_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Jam Operasional */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Jam Operasional Showroom Umum</span>
              </label>
              <input
                type="text"
                value={formData.operational_hours || 'Setiap Hari: 08.00 - 17.00 WIB'}
                onChange={(e) => setFormData({ ...formData, operational_hours: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* TAB 2: HEADER RIBBON & WHATSAPP */}
        {activeTab === 'header' && (
          <div className="space-y-5 animate-in fade-in">
            {/* Teks Pengumuman Top Bar */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-purple-600" />
                <span>Teks Promo / Pengumuman Top Bar Header</span>
              </label>
              <input
                type="text"
                value={formData.header_promo_text || '🔥 PROMO SPESIAL: DP Ringan Mulai 500 Ribu & Potongan Angsuran s.d 2 Juta! Berlaku di Seluruh Cabang'}
                onChange={(e) => setFormData({ ...formData, header_promo_text: e.target.value })}
                placeholder="Teks pengumuman di bagian paling atas website..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-purple-700 focus:bg-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Pesan WhatsApp Cepat Konsultasi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Pesan Template Default Chat WhatsApp Pengunjung</span>
              </label>
              <textarea
                rows={2}
                value={formData.wa_default_template || 'Halo Pandu Motor Group, saya ingin konsultasi motor baru / bekas dan info promo angsuran terbaru. Terima kasih!'}
                onChange={(e) => setFormData({ ...formData, wa_default_template: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* TAB 3: FOOTER & COPYRIGHT */}
        {activeTab === 'footer' && (
          <div className="space-y-5 animate-in fade-in">
            {/* Teks Copyright */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Teks Hak Cipta Footer (Copyright)</span>
              </label>
              <input
                type="text"
                value={formData.footer_copyright_text || '© 2026 Pandu Motor Group. Hak Cipta Dilindungi Undang-Undang.'}
                onChange={(e) => setFormData({ ...formData, footer_copyright_text: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Deskripsi Tentang di Footer */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Deskripsi Singkat Perusahaan di Footer
              </label>
              <textarea
                rows={3}
                value={formData.footer_about_text || 'Pandu Motor Group adalah jaringan dealer motor baru & showroom motor bekas terpercaya dengan 4 cabang di Sumatera Utara & Riau. Melayani penjualan tunai, kredit syariah, tukar tambah, dan fasilitas dana tunai BPKB resmi.'}
                onChange={(e) => setFormData({ ...formData, footer_about_text: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Teks Bar CTA Footer */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Judul Section CTA Bar Footer
              </label>
              <input
                type="text"
                value={formData.footer_cta_heading || 'Siap Memiliki Motor Impian atau Butuh Dana Tunai Cepat?'}
                onChange={(e) => setFormData({ ...formData, footer_cta_heading: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* TAB 4: KEUNGGULAN SHOWROOM */}
        {activeTab === 'trust' && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Judul Utama Section Keunggulan Showroom
              </label>
              <input
                type="text"
                value={formData.trust_heading || 'Mengapa Memilih Kami Sebagai Mitra Motor Impian Anda?'}
                onChange={(e) => setFormData({ ...formData, trust_heading: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Subtitle Section Keunggulan Showroom
              </label>
              <textarea
                rows={2}
                value={formData.trust_subtitle || 'Dengan komitmen “Melayani Sepenuh Hati” untuk kenyamanan dan keamanan transaksi motor Anda di Sumatera Utara & Riau.'}
                onChange={(e) => setFormData({ ...formData, trust_subtitle: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Submit Action */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

