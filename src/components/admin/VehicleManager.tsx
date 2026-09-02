import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  X, 
  Check, 
  Eye, 
  Filter, 
  Sparkles,
  AlertCircle,
  Target,
  Move,
  Sliders,
  ZoomIn,
  Star
} from 'lucide-react';
import { Vehicle, VehicleBrand, VehicleCategory, VehicleCondition, Branch } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { uploadImageFile } from '../../lib/supabase';

interface VehicleManagerProps {
  vehicles: Vehicle[];
  branches: Branch[];
  onSaveVehicle: (vehicle: Vehicle) => Promise<{ success: boolean; error?: string }>;
  onDeleteVehicle: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export const VehicleManager: React.FC<VehicleManagerProps> = ({
  vehicles,
  branches,
  onSaveVehicle,
  onDeleteVehicle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('all');
  const [selectedConditionFilter, setSelectedConditionFilter] = useState('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  const previewBoxRef = useRef<HTMLDivElement>(null);

  // Form fields
  const [formData, setFormData] = useState<Vehicle>({
    id: '',
    name: '',
    brand: 'Honda',
    category: 'matic',
    condition: 'bekas',
    year: new Date().getFullYear(),
    price: 18500000,
    dpMin: 1000000,
    mileage: 8000,
    transmission: 'Automatic',
    engineCapacity: '125 cc',
    fuelType: 'Bensin',
    color: 'Hitam Glossy',
    plateNumberLocation: 'BK (Asahan / Medan)',
    taxStatus: 'Pajak Hidup Panjang',
    documentCompleteness: 'Lengkap (BPKB + STNK + Faktur)',
    warranty: 'Garansi Mesin Showroom 1 Tahun',
    description: 'Kondisi 98% mulus terawat, mesin halus standar dealer, servis rutin, ban tebal siap pakai.',
    features: ['Mesin Sehat', 'Body Mulus', 'Surat Lengkap', 'Pajak Aman'],
    images: ['/images/momotor_banner_nmax_aerox.avif'],
    branchId: 'kisaran',
    installmentEstimates: { tenor11: 0, tenor23: 0, tenor35: 0 },
    imageFit: 'cover',
    imagePosition: '50% 50%',
    imagePosX: 50,
    imagePosY: 50,
    imageScale: 100,
    aspectRatio: '4:3',
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  // Filtered vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = selectedBranchFilter === 'all' || v.branchId === selectedBranchFilter;
    const matchesCondition = selectedConditionFilter === 'all' || v.condition === selectedConditionFilter;
    return matchesSearch && matchesBranch && matchesCondition;
  });

  const handleOpenAddModal = () => {
    const newId = `pm-${Date.now().toString(36)}`;
    setEditingVehicle(null);
    setActivePhotoIdx(0);
    setFormData({
      id: newId,
      name: '',
      brand: 'Honda',
      category: 'matic',
      condition: 'bekas',
      year: new Date().getFullYear(),
      price: 18500000,
      dpMin: 1000000,
      mileage: 8000,
      transmission: 'Automatic',
      engineCapacity: '125 cc',
      fuelType: 'Bensin',
      color: 'Hitam Glossy',
      plateNumberLocation: 'BK (Asahan / Medan)',
      taxStatus: 'Pajak Hidup Panjang',
      documentCompleteness: 'Lengkap (BPKB + STNK + Faktur)',
      warranty: 'Garansi Mesin Showroom 1 Tahun',
      description: 'Kondisi 98% mulus terawat, mesin halus standar dealer, servis rutin, ban tebal siap pakai.',
      features: ['Mesin Sehat', 'Body Mulus', 'Surat Lengkap', 'Pajak Aman'],
      images: ['/images/momotor_banner_nmax_aerox.avif'],
      branchId: branches[0]?.id || 'kisaran',
      installmentEstimates: { tenor11: 0, tenor23: 0, tenor35: 0 },
      imageFit: 'cover',
      imagePosition: '50% 50%',
      imagePosX: 50,
      imagePosY: 50,
      imageScale: 100,
      aspectRatio: '4:3',
    });
    setSaveError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setActivePhotoIdx(0);
    setFormData({
      id: vehicle.id,
      name: vehicle.name,
      brand: vehicle.brand,
      category: vehicle.category,
      condition: vehicle.condition,
      year: vehicle.year,
      price: vehicle.price,
      dpMin: vehicle.dpMin,
      mileage: vehicle.mileage || 0,
      transmission: vehicle.transmission,
      engineCapacity: vehicle.engineCapacity,
      fuelType: vehicle.fuelType,
      color: vehicle.color,
      plateNumberLocation: vehicle.plateNumberLocation || 'BK (Asahan / Medan)',
      taxStatus: vehicle.taxStatus,
      documentCompleteness: vehicle.documentCompleteness,
      warranty: vehicle.warranty,
      description: vehicle.description,
      features: vehicle.features,
      images: [...vehicle.images],
      branchId: vehicle.branchId,
      installmentEstimates: vehicle.installmentEstimates || { tenor11: 0, tenor23: 0, tenor35: 0 },
      imageFit: vehicle.imageFit || 'cover',
      imagePosition: vehicle.imagePosition || `${vehicle.imagePosX ?? 50}% ${vehicle.imagePosY ?? 50}%`,
      imagePosX: vehicle.imagePosX !== undefined ? vehicle.imagePosX : 50,
      imagePosY: vehicle.imagePosY !== undefined ? vehicle.imagePosY : 50,
      imageScale: vehicle.imageScale || 100,
      aspectRatio: vehicle.aspectRatio || '4:3',
    });
    setSaveError(null);
    setIsModalOpen(true);
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

  const handleSetCoverPhoto = (idx: number) => {
    if (idx === 0) return;
    const chosen = formData.images[idx];
    const rest = formData.images.filter((_, i) => i !== idx);
    setFormData((prev) => ({
      ...prev,
      images: [chosen, ...rest],
    }));
    setActivePhotoIdx(0);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const file = files[0];
      const uploadedUrl = await uploadImageFile(file, 'pandu-motor-images', 'vehicles');
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, uploadedUrl],
      }));
    } catch (err: any) {
      alert('Gagal mengupload foto: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()],
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setSaveError('Nama motor wajib diisi.');
      return;
    }
    if (formData.images.length === 0) {
      setSaveError('Minimal upload 1 foto motor.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const vehicleToSave: Vehicle = {
      id: formData.id,
      name: formData.name.trim(),
      brand: formData.brand,
      category: formData.category,
      condition: formData.condition,
      year: Number(formData.year),
      price: Number(formData.price),
      dpMin: Number(formData.dpMin),
      mileage: Number(formData.mileage),
      transmission: formData.transmission,
      engineCapacity: formData.engineCapacity,
      fuelType: formData.fuelType,
      color: formData.color,
      plateNumberLocation: formData.plateNumberLocation,
      taxStatus: formData.taxStatus,
      documentCompleteness: formData.documentCompleteness,
    warranty: formData.warranty,
      description: formData.description.trim(),
      features: formData.features,
      images: formData.images,
      branchId: formData.branchId,
      imageFit: formData.imageFit || 'cover',
      imagePosition: formData.imagePosition || `${formData.imagePosX ?? 50}% ${formData.imagePosY ?? 50}%`,
      imagePosX: formData.imagePosX ?? 50,
      imagePosY: formData.imagePosY ?? 50,
      imageScale: formData.imageScale ?? 100,
      aspectRatio: formData.aspectRatio || '4:3',
      installmentEstimates: editingVehicle?.installmentEstimates || {
        tenor11: Math.round((formData.price * 0.9) / 11),
        tenor23: Math.round((formData.price * 0.9) / 23),
        tenor35: Math.round((formData.price * 0.9) / 35),
      },
    };

    const res = await onSaveVehicle(vehicleToSave);
    setIsSaving(false);

    if (res.success) {
      setIsModalOpen(false);
    } else {
      setSaveError(res.error || 'Gagal menyimpan data.');
    }
  };

  const handleDelete = async (vehicle: Vehicle) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus motor "${vehicle.name}"?`)) {
      await onDeleteVehicle(vehicle.id);
    }
  };

  // Helper 9-point grid
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

  const activePhoto = formData.images[activePhotoIdx] || formData.images[0] || '/images/momotor_banner_nmax_aerox.avif';

  return (
    <div className="space-y-6">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Kelola Stok Motor Showroom
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tambah, edit foto, atur posisi/ukuran gambar, dan kelola unit motor di 4 cabang showroom
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Motor Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama motor, merk, atau ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Branch Filter */}
          <select
            value={selectedBranchFilter}
            onChange={(e) => setSelectedBranchFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Semua Cabang ({vehicles.length})</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          {/* Condition Filter */}
          <select
            value={selectedConditionFilter}
            onChange={(e) => setSelectedConditionFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Semua Kondisi</option>
            <option value="baru">✨ Unit Baru 100%</option>
            <option value="bekas">🛵 Unit Bekas Pilihan</option>
          </select>
        </div>

      </div>

      {/* Vehicles Table / Cards Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12 px-4">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Tidak ada motor ditemukan</h3>
            <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci pencarian atau tambah motor baru.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredVehicles.map((vehicle) => {
              const branch = branches.find((b) => b.id === vehicle.branchId);
              const vFit = vehicle.imageFit || 'cover';
              const vPosX = vehicle.imagePosX ?? 50;
              const vPosY = vehicle.imagePosY ?? 50;
              const vScale = (vehicle.imageScale || 100) / 100;

              return (
                <div key={vehicle.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition">
                  
                  {/* Photo Preview & Info */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-xl bg-slate-900 border border-gray-200 overflow-hidden shrink-0 relative group">
                      {vFit === 'contain' && (
                        <div 
                          className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-40 scale-110 pointer-events-none"
                          style={{ backgroundImage: `url(${vehicle.images[0] || '/images/momotor_banner_nmax_aerox.avif'})` }}
                        />
                      )}
                      <img
                        src={vehicle.images[0] || '/images/momotor_banner_nmax_aerox.avif'}
                        alt={vehicle.name}
                        className="w-full h-full relative z-10 transition-transform"
                        style={{
                          objectFit: vFit === 'auto' ? 'contain' : (vFit as any),
                          objectPosition: `${vPosX}% ${vPosY}%`,
                          transform: `scale(${vScale})`,
                        }}
                      />
                      {vehicle.images.length > 1 && (
                        <div className="absolute bottom-1 right-1 z-20 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {vehicle.images.length} Foto
                        </div>
                      )}
                      <div className="absolute top-1 left-1 z-20 bg-blue-600/90 text-white text-[8px] font-bold px-1 py-0.2 rounded uppercase">
                        {vFit}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          vehicle.condition === 'baru' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {vehicle.condition === 'baru' ? 'Baru 100%' : 'Bekas Mulus'}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {vehicle.brand} • {vehicle.year}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          Fokus: {vPosX}% {vPosY}%
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate mt-0.5">
                        {vehicle.name}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="font-bold text-[#0B63E5] text-sm">
                          {formatRupiah(vehicle.price)}
                        </span>
                        <span>•</span>
                        <span className="truncate">{branch?.name || vehicle.branchId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(vehicle)}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit &amp; Atur Foto</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(vehicle)}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL TAMBAH / EDIT MOTOR (LENGKAP DENGAN LIVE PHOTO POSITIONING)         */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-blue-100 overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {editingVehicle ? 'Edit Data Motor & Posisi Foto' : 'Tambah Unit Motor Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Sesuaikan foto motor, mode fit, dan titik fokus agar tidak terpotong di katalog
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer border border-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
              
              {saveError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {/* 1. FOTO MOTOR & LIVE INTERACTIVE POSITIONING */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Live Preview Foto Katalog Motor</span>
                    </label>
                    <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                      🎯 Klik pada gambar untuk ubah titik fokus
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-600 font-semibold">
                    {formData.images.length} Foto Terunggah
                  </span>
                </div>

                {/* Main Interactive Card Preview */}
                <div className="flex justify-center bg-slate-900/90 rounded-2xl p-3 border border-slate-800">
                  <div 
                    className="relative w-full max-w-[360px] aspect-[4/3] rounded-xl overflow-hidden shadow-xl border border-white/10 select-none bg-slate-950"
                  >
                    {/* Ambient backdrop for contain mode */}
                    {formData.imageFit === 'contain' && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-50 scale-115 pointer-events-none"
                        style={{ backgroundImage: `url(${activePhoto})` }}
                      />
                    )}

                    {/* Interactive Click Frame */}
                    <div 
                      ref={previewBoxRef}
                      onClick={handlePreviewClick}
                      className="absolute inset-0 cursor-crosshair group flex items-center justify-center overflow-hidden"
                      title="Klik di mana saja untuk menggeser posisi fokus foto"
                    >
                      <img
                        src={activePhoto}
                        alt="Vehicle Preview"
                        className="w-full h-full pointer-events-none transition-all duration-200"
                        style={{
                          objectFit: formData.imageFit === 'auto' ? 'contain' : (formData.imageFit as any),
                          objectPosition: `${formData.imagePosX ?? 50}% ${formData.imagePosY ?? 50}%`,
                          transform: `scale(${(formData.imageScale || 100) / 100})`,
                        }}
                      />

                      {/* Visual Focal Point Pin */}
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
                    </div>
                  </div>
                </div>

                {/* Fit Mode Selector */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Mode Penyesuaian Foto (Fit Mode)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageFit: 'contain' })}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        formData.imageFit === 'contain'
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-500/20'
                          : 'border-gray-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span>Contain (Utuh 100%)</span>
                        {formData.imageFit === 'contain' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                        Motor tampil utuh (ban, spion &amp; body bebas terpotong).
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageFit: 'cover' })}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        formData.imageFit === 'cover'
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-500/20'
                          : 'border-gray-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span>Cover (Penuh Box)</span>
                        {formData.imageFit === 'cover' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                        Mengisi penuh frame kartu katalog motor.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageFit: 'auto' })}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        formData.imageFit === 'auto'
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold ring-2 ring-blue-500/20'
                          : 'border-gray-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span>Auto (Rasio Asli)</span>
                        {formData.imageFit === 'auto' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                        Mengikuti aspek rasio asli gambar berkas.
                      </p>
                    </button>
                  </div>
                </div>

                {/* 9-Point Grid & Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  
                  {/* 9-Point Grid */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Titik Fokus Cepat (9 Titik)
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
                            className={`py-1.5 px-1 rounded-lg border text-center text-[11px] font-bold transition cursor-pointer ${
                              isSelected
                                ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            {preset.label.replace('Pas ', '')}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sliders */}
                  <div className="space-y-2.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Presisi Posisi &amp; Skala Zoom
                    </label>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                        <span>Posisi Horizontal (X)</span>
                        <span className="font-mono text-blue-600">{formData.imagePosX ?? 50}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.imagePosX ?? 50}
                        onChange={(e) => handlePositionPreset(Number(e.target.value), formData.imagePosY ?? 50)}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                        <span>Posisi Vertikal (Y)</span>
                        <span className="font-mono text-blue-600">{formData.imagePosY ?? 50}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.imagePosY ?? 50}
                        onChange={(e) => handlePositionPreset(formData.imagePosX ?? 50, Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                        <span>Skala / Zoom Gambar</span>
                        <span className="font-mono text-blue-600">{formData.imageScale ?? 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="80"
                        max="150"
                        value={formData.imageScale ?? 100}
                        onChange={(e) => setFormData({ ...formData, imageScale: Number(e.target.value) })}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                  </div>

                </div>

                {/* Thumbnails Gallery Management */}
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Daftar Foto Unit ({formData.images.length} Foto)
                  </label>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {formData.images.map((img, idx) => {
                      const isActive = activePhotoIdx === idx;
                      return (
                        <div 
                          key={idx} 
                          onClick={() => setActivePhotoIdx(idx)}
                          className={`relative aspect-[4/3] rounded-xl overflow-hidden bg-white border cursor-pointer transition shadow-2xs group ${
                            isActive ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-gray-200 hover:border-slate-400'
                          }`}
                        >
                          <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                          
                          {/* Delete */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700 transition cursor-pointer"
                            title="Hapus foto ini"
                          >
                            <X className="w-3 h-3" />
                          </button>

                          {/* Set as cover */}
                          {idx !== 0 ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetCoverPhoto(idx);
                              }}
                              className="absolute bottom-1 left-1 bg-slate-900/80 hover:bg-blue-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded transition flex items-center gap-0.5 cursor-pointer"
                              title="Jadikan foto utama (cover)"
                            >
                              <Star className="w-2.5 h-2.5 text-amber-400" />
                              <span>Cover</span>
                            </button>
                          ) : (
                            <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded">
                              Utama
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Upload Box */}
                    <label className="aspect-[4/3] rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer transition p-2 text-center">
                      <Upload className="w-4 h-4 text-blue-600 mb-1" />
                      <span className="text-[10px] font-bold text-blue-600">
                        {uploadingImage ? '...' : 'Upload'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Or add via URL */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Atau tempel link gambar (URL)..."
                      className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Tambah URL
                    </button>
                  </div>
                </div>

              </div>

              {/* 2. INFORMASI UTAMA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Nama Motor */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Motor Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Yamaha NMax 155 Connected ABS"
                    className="w-full px-3.5 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-gray-300 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Merk */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Merk</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value as VehicleBrand })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
                  >
                    <option value="Honda">Honda</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="Kawasaki">Kawasaki</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="Vespa">Vespa</option>
                  </select>
                </div>

                {/* Kondisi (Baru / Bekas) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kondisi Unit</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as VehicleCondition })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-blue-600 focus:outline-none focus:border-blue-500"
                  >
                    <option value="baru">✨ Unit Baru 100% OTR</option>
                    <option value="bekas">🛵 Unit Bekas Berkualitas</option>
                  </select>
                </div>

                {/* Tahun */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Perakitan</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Cabang Showroom */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Showroom</label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Harga Cash / OTR */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Harga Cash (Rp)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-[#0B63E5] focus:outline-none focus:border-blue-500"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    Format: {formatRupiah(formData.price || 0)}
                  </div>
                </div>

                {/* DP Minimum */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">DP Minimum (Rp)</label>
                  <input
                    type="number"
                    value={formData.dpMin}
                    onChange={(e) => setFormData({ ...formData, dpMin: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Jarak Tempuh KM */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jarak Tempuh (KM)</label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Kapasitas Mesin */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kapasitas Mesin (cc)</label>
                  <input
                    type="text"
                    value={formData.engineCapacity}
                    onChange={(e) => setFormData({ ...formData, engineCapacity: e.target.value })}
                    placeholder="125 cc / 155 cc"
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

              </div>

              {/* 3. DESKRIPSI UNIT */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi & Keterangan Motor
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Kondisi 98% mulus terawat, mesin halus, ban tebal siap pakai..."
                  className="w-full p-3 bg-slate-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Motor'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
