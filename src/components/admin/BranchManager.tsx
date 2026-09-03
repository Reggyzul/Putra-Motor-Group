import React, { useState } from 'react';
import { Edit3, MapPin, Phone, MessageSquare, Clock, Upload, X, Check, Building2, Plus, Trash2, Navigation, Store } from 'lucide-react';
import { Branch, SalesPost } from '../../types';
import { uploadImageFile } from '../../lib/supabase';

interface BranchManagerProps {
  branches: Branch[];
  onSaveBranch: (branch: Branch) => Promise<{ success: boolean; error?: string }>;
}

export const BranchManager: React.FC<BranchManagerProps> = ({
  branches,
  onSaveBranch,
}) => {
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [formData, setFormData] = useState<Branch>({
    id: '',
    name: '',
    companyName: '',
    code: '',
    city: '',
    province: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    googleMapsUrl: '',
    operationalHours: '',
    image: '',
    logo: '',
    socialMedia: {
      facebook: '',
      facebookUrl: '',
      instagram: '',
      instagramUrl: '',
      tiktok: '',
      tiktokUrl: '',
    },
  });

  const handleOpenEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      ...branch,
      socialMedia: {
        facebook: branch.socialMedia?.facebook || '',
        facebookUrl: branch.socialMedia?.facebookUrl || '',
        instagram: branch.socialMedia?.instagram || '',
        instagramUrl: branch.socialMedia?.instagramUrl || '',
        tiktok: branch.socialMedia?.tiktok || '',
        tiktokUrl: branch.socialMedia?.tiktokUrl || '',
      },
      salesPosts: (branch.salesPosts || []).map(p => ({ ...p })),
    });
  };

  // --- Sales Post Helpers ---
  const handleAddSalesPost = () => {
    const current = formData.salesPosts || [];
    setFormData({
      ...formData,
      salesPosts: [
        ...current,
        { name: '', phone: '', whatsapp: '', googleMapsUrl: '' },
      ],
    });
  };

  const handleRemoveSalesPost = (index: number) => {
    const current = [...(formData.salesPosts || [])];
    current.splice(index, 1);
    setFormData({ ...formData, salesPosts: current });
  };

  const handleUpdateSalesPost = (index: number, field: keyof SalesPost, value: string) => {
    const current = [...(formData.salesPosts || [])];
    current[index] = { ...current[index], [field]: value };
    // Keep phone synced with whatsapp for display
    if (field === 'whatsapp') {
      current[index].phone = value;
    }
    setFormData({ ...formData, salesPosts: current });
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const file = files[0];
      const uploadedUrl = await uploadImageFile(file, 'pandu-motor-images', 'branches');
      setFormData((prev) => ({ ...prev, image: uploadedUrl }));
    } catch (err: any) {
      alert('Gagal mengupload foto cabang: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingLogo(true);
    try {
      const file = files[0];
      const uploadedUrl = await uploadImageFile(file, 'pandu-motor-images', 'logos');
      setFormData((prev) => ({ ...prev, logo: uploadedUrl }));
    } catch (err: any) {
      alert('Gagal mengupload logo: ' + err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await onSaveBranch(formData);
    setIsSaving(false);
    if (res.success) {
      setEditingBranch(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Kelola 4 Cabang Showroom Resmi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Ubah foto bangunan, logo resmi dealer, kontak WhatsApp, dan alamat cabang
        </p>
      </div>

      {/* Branches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            
            <div>
              {/* Showroom Photo 100% Uncropped with contain */}
              <div className="relative aspect-[16/10] bg-slate-50 p-2 flex items-center justify-center border-b border-gray-100">
                <img
                  src={branch.image}
                  alt={branch.name}
                  className="w-full h-full object-contain rounded-xl"
                />
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
                  {branch.code}
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3">
                
                {/* Logo & Title */}
                <div className="flex items-center gap-3">
                  {branch.logo && (
                    <img
                      src={branch.logo}
                      alt={branch.name}
                      className="w-12 h-12 rounded-xl object-contain border border-gray-200 bg-white p-1 shadow-2xs shrink-0"
                    />
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">
                      {branch.companyName}
                    </span>
                    <h3 className="text-base font-black text-slate-900 leading-tight">
                      {branch.name}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800">WA: {branch.whatsapp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{branch.operationalHours}</span>
                  </div>
                </div>

                {/* Pos Penjualan Display in Admin Card */}
                {branch.salesPosts && branch.salesPosts.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1.5">
                      Pos Penjualan Resmi ({branch.salesPosts.length} Titik):
                    </span>
                    <div className="space-y-1">
                      {branch.salesPosts.map((pos, pIdx) => (
                        <div key={pIdx} className="flex items-center justify-between text-[11px] bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                          <span className="font-bold text-slate-800 truncate">{pos.name}</span>
                          <span className="text-slate-500 text-[10px] font-semibold shrink-0 ml-2">WA: {pos.phone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Edit Action Button */}
            <div className="p-4 border-t border-gray-100 bg-slate-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => handleOpenEdit(branch)}
                className="w-full sm:w-auto px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Cabang & Foto</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Edit Branch Modal */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-blue-100 overflow-hidden">
            
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Edit Showroom: {editingBranch.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update foto showroom fisik, logo dealer, dan nomor kontak WhatsApp
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingBranch(null)}
                className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center border border-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
              
              {/* Foto Showroom Live Preview */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Foto Bangunan Showroom</label>
                <div className="aspect-[16/9] rounded-2xl bg-slate-100 overflow-hidden border border-gray-200 flex items-center justify-center p-2">
                  <img src={formData.image} alt="Preview Showroom" className="w-full h-full object-contain rounded-xl" />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  />
                  <label className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 inline mr-1" />
                    {uploadingImage ? '...' : 'Upload Foto'}
                    <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Logo Showroom Live Preview */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Logo Resmi Profil Dealer</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-gray-300 p-1 flex items-center justify-center shrink-0">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Preview Logo" className="w-full h-full object-contain rounded-xl" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.logo || ''}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      placeholder="URL Logo Dealer..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                    />
                    <label className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5 inline mr-1" />
                      {uploadingLogo ? '...' : 'Upload Logo'}
                      <input type="file" accept="image/*" onChange={handleUploadLogo} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Showroom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap</label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp (Format: 628xxx)</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telepon Tampil</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Operasional</label>
                  <input
                    type="text"
                    value={formData.operationalHours}
                    onChange={(e) => setFormData({ ...formData, operationalHours: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Google Maps URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Link Petunjuk Arah (Google Maps URL)
                  </label>
                  <input
                    type="text"
                    value={formData.googleMapsUrl || ''}
                    onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-mono text-blue-600"
                  />
                </div>
              </div>

              {/* Media Sosial Resmi Cabang Editor */}
              <div className="pt-3 border-t border-gray-200 space-y-3 bg-slate-50 p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Akun &amp; Link Media Sosial Cabang
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">Bisa diklik langsung di halaman cabang</span>
                </div>

                <div className="space-y-3">
                  {/* Facebook */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                    <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      <span>Facebook</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Nama Akun FB / Pencarian</label>
                        <input
                          type="text"
                          placeholder="contoh: pandu motor kisaran"
                          value={formData.socialMedia?.facebook || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: { ...formData.socialMedia, facebook: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Link / URL Facebook Langsung</label>
                        <input
                          type="text"
                          placeholder="https://www.facebook.com/..."
                          value={formData.socialMedia?.facebookUrl || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: { ...formData.socialMedia, facebookUrl: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs font-mono text-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                    <div className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>Instagram</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Username / Handle IG</label>
                        <input
                          type="text"
                          placeholder="contoh: @pandumotorkisaran"
                          value={formData.socialMedia?.instagram || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: { ...formData.socialMedia, instagram: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Link / URL Instagram Langsung</label>
                        <input
                          type="text"
                          placeholder="https://www.instagram.com/..."
                          value={formData.socialMedia?.instagramUrl || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: { ...formData.socialMedia, instagramUrl: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs font-mono text-rose-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* TikTok */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-black"></span>
                      <span>TikTok</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Username / Handle TikTok</label>
                        <input
                          type="text"
                          placeholder="contoh: @pandumotorkisaran"
                          value={formData.socialMedia?.tiktok || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: { ...formData.socialMedia, tiktok: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Link / URL TikTok Langsung</label>
                        <input
                          type="text"
                          placeholder="https://www.tiktok.com/@..."
                          value={formData.socialMedia?.tiktokUrl || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialMedia: { ...formData.socialMedia, tiktokUrl: e.target.value }
                          })}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs font-mono text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* ============================================================= */}
              {/* POS PENJUALAN / SALES POSTS EDITOR                             */}
              {/* ============================================================= */}
              <div className="pt-3 border-t border-gray-200 space-y-3 bg-amber-50/60 p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-amber-600" />
                      Pos Penjualan Resmi Cabang
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Kelola titik pos penjualan, nomor WA, dan link Google Maps masing-masing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSalesPost}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-[11px] shadow-xs cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Pos</span>
                  </button>
                </div>

                {(!formData.salesPosts || formData.salesPosts.length === 0) && (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    Belum ada pos penjualan. Klik "Tambah Pos" untuk menambahkan titik penjualan baru.
                  </div>
                )}

                <div className="space-y-3">
                  {(formData.salesPosts || []).map((post, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-2.5 relative group"
                    >
                      {/* Header: Index + Delete */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 text-[11px] font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {post.name || `Pos Penjualan #${idx + 1}`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSalesPost(idx)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer opacity-60 group-hover:opacity-100"
                          title="Hapus pos penjualan ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Nama Pos */}
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                            Nama Pos Penjualan
                          </label>
                          <input
                            type="text"
                            value={post.name}
                            onChange={(e) => handleUpdateSalesPost(idx, 'name', e.target.value)}
                            placeholder="Contoh: PANDU MOTOR AEK KANOPAN"
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                          />
                        </div>

                        {/* No WhatsApp */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5 flex items-center gap-1">
                            <MessageSquare className="w-2.5 h-2.5 text-emerald-500" />
                            Nomor WhatsApp
                          </label>
                          <input
                            type="text"
                            value={post.whatsapp}
                            onChange={(e) => handleUpdateSalesPost(idx, 'whatsapp', e.target.value)}
                            placeholder="Contoh: 0812-7503-8495"
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs font-semibold text-emerald-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                          />
                        </div>

                        {/* No Telepon (opsional, auto-sync dari WA) */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5 flex items-center gap-1">
                            <Phone className="w-2.5 h-2.5 text-blue-500" />
                            Telepon Tampil
                          </label>
                          <input
                            type="text"
                            value={post.phone}
                            onChange={(e) => handleUpdateSalesPost(idx, 'phone', e.target.value)}
                            placeholder="Contoh: 0812-7503-8495"
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs font-semibold text-blue-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                          />
                        </div>

                        {/* Google Maps URL */}
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5 flex items-center gap-1">
                            <Navigation className="w-2.5 h-2.5 text-red-500" />
                            Link Google Maps
                          </label>
                          <input
                            type="text"
                            value={post.googleMapsUrl}
                            onChange={(e) => handleUpdateSalesPost(idx, 'googleMapsUrl', e.target.value)}
                            placeholder="https://maps.app.goo.gl/... atau https://maps.google.com/..."
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs font-mono text-blue-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Add Another Button at Bottom */}
                {formData.salesPosts && formData.salesPosts.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAddSalesPost}
                    className="w-full py-2 border-2 border-dashed border-amber-300 hover:border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Pos Penjualan Baru
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
