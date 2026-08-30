import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Building2, Mail, Phone, Sparkles } from 'lucide-react';
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
          Pengaturan Umum Website & Kontak
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Ubah informasi kontak kantor pusat, email resmi, dan tagline yang tampil di navbar & footer
        </p>
      </div>

      {showSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Pengaturan website berhasil disimpan dan langsung aktif di website!</span>
        </div>
      )}

      {/* Settings Form (Full Cerah & Modern) */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-5">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
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
              Slogan / Tagline
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
              <span>Alamat Kantor Pusat</span>
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
              <span>Email Resmi (Tampil di Footer)</span>
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
              <span>Nomor Telepon & WhatsApp Layanan</span>
            </label>
            <input
              type="text"
              required
              value={formData.official_phone || ''}
              onChange={(e) => setFormData({ ...formData, official_phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
