import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Edit3, 
  Trash2, 
  Pin, 
  PinOff, 
  Paperclip, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  X, 
  Check, 
  Calendar, 
  User, 
  FileSpreadsheet, 
  File,
  Download,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Announcement, AnnouncementCategory, AnnouncementAttachment } from '../../types';
import { uploadImageFile } from '../../lib/supabase';

interface AnnouncementManagerProps {
  announcements: Announcement[];
  onSaveAnnouncement: (announcement: Announcement) => Promise<{ success: boolean; error?: string }>;
  onDeleteAnnouncement: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const AnnouncementManager: React.FC<AnnouncementManagerProps> = ({
  announcements,
  onSaveAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<Announcement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    id: string;
    title: string;
    category: AnnouncementCategory;
    content: string;
    author: string;
    isPinned: boolean;
    image: string;
    attachments: AnnouncementAttachment[];
  }>({
    id: '',
    title: '',
    category: 'Operasional',
    content: '',
    author: 'Direksi Kantor Pusat',
    isPinned: false,
    image: '',
    attachments: [],
  });

  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [newAttachmentName, setNewAttachmentName] = useState('');

  const handleOpenAdd = () => {
    setEditingAnnouncement(null);
    setFormData({
      id: `ann-${Date.now().toString(36)}`,
      title: '',
      category: 'Penting',
      content: '',
      author: 'Direksi Kantor Pusat',
      isPinned: false,
      image: '',
      attachments: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setFormData({
      id: ann.id,
      title: ann.title,
      category: ann.category,
      content: ann.content,
      author: ann.author,
      isPinned: Boolean(ann.isPinned),
      image: ann.image || '',
      attachments: ann.attachments ? [...ann.attachments] : [],
    });
    setIsModalOpen(true);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const file = files[0];
      const uploadedUrl = await uploadImageFile(file, 'pandu-motor-images', 'announcements');
      setFormData((prev) => ({ ...prev, image: uploadedUrl }));
    } catch (err: any) {
      alert('Gagal mengupload gambar pengumuman: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUploadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingDoc(true);
    try {
      const file = files[0];
      const uploadedUrl = await uploadImageFile(file, 'pandu-motor-images', 'documents');
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      
      const newAtt: AnnouncementAttachment = {
        name: file.name,
        url: uploadedUrl,
        size: sizeStr,
        type: ext,
      };

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, newAtt],
      }));
    } catch (err: any) {
      alert('Gagal mengupload dokumen: ' + err.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleAddManualAttachment = () => {
    if (!newAttachmentName.trim() || !newAttachmentUrl.trim()) return;
    const newAtt: AnnouncementAttachment = {
      name: newAttachmentName.trim(),
      url: newAttachmentUrl.trim(),
      size: 'Link Eksternal',
      type: 'DOC',
    };
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, newAtt],
    }));
    setNewAttachmentName('');
    setNewAttachmentUrl('');
  };

  const handleRemoveAttachment = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Judul pengumuman wajib diisi.');
      return;
    }
    if (!formData.content.trim()) {
      alert('Konten pengumuman wajib diisi.');
      return;
    }

    setIsSaving(true);
    const annToSave: Announcement = {
      id: formData.id,
      title: formData.title.trim(),
      category: formData.category,
      content: formData.content.trim(),
      author: formData.author.trim() || 'Kantor Pusat',
      isPinned: formData.isPinned,
      image: formData.image || undefined,
      attachments: formData.attachments,
      createdAt: editingAnnouncement?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await onSaveAnnouncement(annToSave);
    setIsSaving(false);
    if (res.success) {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (ann: Announcement) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pengumuman "${ann.title}"?`)) {
      await onDeleteAnnouncement(ann.id);
    }
  };

  const getCategoryBadgeClass = (category: AnnouncementCategory) => {
    switch (category) {
      case 'Penting':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Operasional':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Promo Internal':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Agenda Kantor':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-[#0B63E5]" />
            <span>Papan Pengumuman & Update Kantor (Khusus Admin)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Informasi internal, SOP operasional, dan memo resmi untuk seluruh pengelola showroom Pandu Motor Group
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Pengumuman Baru</span>
        </button>
      </div>

      {/* Announcements List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {announcements.map((ann) => (
          <div 
            key={ann.id} 
            className={`bg-white rounded-3xl border overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
              ann.isPinned ? 'border-amber-300 ring-2 ring-amber-100' : 'border-gray-200'
            }`}
          >
            <div>
              {/* Optional Photo Banner Preview */}
              {ann.image && (
                <div className="relative aspect-[16/8] bg-slate-900 overflow-hidden">
                  <img src={ann.image} alt={ann.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-5 sm:p-6 space-y-3">
                
                {/* Meta Top: Category & Pin */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(ann.category)}`}>
                      {ann.category}
                    </span>
                    {ann.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Pin className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>Sematkan di Atas</span>
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(ann.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {ann.title}
                </h3>

                {/* Content Paragraph */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {ann.content}
                </p>

                {/* Attached Files List */}
                {ann.attachments && ann.attachments.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                      <Paperclip className="w-3 h-3" />
                      <span>{ann.attachments.length} Dokumen Terlampir:</span>
                    </div>
                    <div className="space-y-1">
                      {ann.attachments.map((att, i) => (
                        <a
                          key={i}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-gray-200 text-xs font-semibold text-slate-700 hover:text-blue-600 transition group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">{att.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2 group-hover:text-blue-600">
                            {att.size || 'Download'} ↓
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author footer */}
                <div className="pt-2 text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Diterbitkan oleh: {ann.author}</span>
                </div>

              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-100 bg-slate-50/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedDetail(ann)}
                className="text-xs font-bold text-[#0B63E5] hover:underline cursor-pointer"
              >
                Baca Lengkap →
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(ann)}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-600 border border-gray-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(ann)}
                  className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-gray-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Form Buat / Edit Pengumuman                                        */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-blue-100 overflow-hidden">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {editingAnnouncement ? 'Edit Pengumuman Kantor' : 'Buat Pengumuman & Berita Baru'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tulis pengumuman internal kantor, upload foto dokumentasi, dan lampirkan dokumen SOP/Excel/PDF
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center border border-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Judul & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Judul Pengumuman *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: SOP Pengecekan Fisik Unit Masuk Showroom"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as AnnouncementCategory })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:border-blue-500"
                  >
                    <option value="Penting">🔴 Penting</option>
                    <option value="Operasional">🔵 Operasional</option>
                    <option value="Promo Internal">🟣 Promo Internal</option>
                    <option value="Agenda Kantor">🟡 Agenda Kantor</option>
                    <option value="Umum">⚪ Umum</option>
                  </select>
                </div>
              </div>

              {/* Penulis & Toggle Pin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Diterbitkan Oleh (Author)
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Direksi Kantor Pusat / HRD"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-5 sm:pt-4">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-amber-50/70 border border-amber-200">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded"
                    />
                    <span className="text-xs font-bold text-amber-900">
                      Sematkan di Paling Atas (*Pinned Announcement*)
                    </span>
                  </label>
                </div>
              </div>

              {/* Isi Konten Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Pengumuman & Berita Lengkap *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tuliskan pengumuman, instruksi, SOP, atau update kantor..."
                  className="w-full p-3.5 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm leading-relaxed focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* Upload Foto Dokumentasi (Opsional) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Foto / Gambar Dokumentasi (Opsional)
                </label>

                {formData.image && (
                  <div className="relative aspect-[16/8] rounded-xl overflow-hidden bg-white border border-gray-300 max-w-sm mb-2">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="URL Gambar / Banner..."
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  />
                  <label className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-xl text-xs cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 inline mr-1" />
                    {uploadingImage ? '...' : 'Upload Foto'}
                    <input type="file" accept="image/*" onChange={handleUploadImage} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Upload Lampiran Dokumen SOP / Excel / PDF */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Lampiran Dokumen ({formData.attachments.length} Terlampir)
                  </label>
                  <label className="px-3 py-1.5 bg-[#0B63E5] hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-2xs">
                    <Paperclip className="w-3.5 h-3.5 inline mr-1" />
                    {uploadingDoc ? 'Mengupload...' : 'Upload Dokumen (PDF/Excel)'}
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" 
                      onChange={handleUploadDoc} 
                      className="hidden" 
                    />
                  </label>
                </div>

                {formData.attachments.length > 0 && (
                  <div className="space-y-1.5">
                    {formData.attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-gray-300 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">{att.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">({att.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(idx)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Or add external link */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1 border-t border-gray-200">
                  <input
                    type="text"
                    value={newAttachmentName}
                    onChange={(e) => setNewAttachmentName(e.target.value)}
                    placeholder="Nama file / link..."
                    className="sm:col-span-5 px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={newAttachmentUrl}
                    onChange={(e) => setNewAttachmentUrl(e.target.value)}
                    placeholder="URL Link dokumen (Google Drive / Cloud)..."
                    className="sm:col-span-5 px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualAttachment}
                    className="sm:col-span-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    + Link
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? 'Menyimpan...' : 'Terbitkan Pengumuman'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Lihat Detail Pengumuman Lengkap                                    */}
      {/* ========================================================================= */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-blue-100 overflow-hidden">
            
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(selectedDetail.category)}`}>
                  {selectedDetail.category}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {new Date(selectedDetail.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center border border-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {selectedDetail.title}
              </h2>

              {selectedDetail.image && (
                <div className="rounded-2xl overflow-hidden border border-gray-200 max-h-72">
                  <img src={selectedDetail.image} alt={selectedDetail.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                {selectedDetail.content}
              </div>

              {selectedDetail.attachments && selectedDetail.attachments.length > 0 && (
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4 text-blue-600" />
                    <span>Dokumen Terlampir:</span>
                  </div>
                  <div className="space-y-1.5">
                    {selectedDetail.attachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-gray-200 text-xs font-bold text-slate-800 hover:text-blue-600 transition"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="truncate">{att.name}</span>
                        </div>
                        <span className="text-[11px] text-blue-600 font-mono shrink-0 ml-2">
                          Unduh / Buka Dokumen →
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 text-xs text-slate-400 font-semibold">
                Diterbitkan oleh: <strong>{selectedDetail.author}</strong>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
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
