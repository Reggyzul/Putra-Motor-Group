import React, { useState } from 'react';
import { 
  Bike, 
  Send, 
  MapPin, 
  X, 
  Building2, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  Banknote, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Branch, SiteSettings } from '../types';
import { BRANCHES_DATA } from '../data/branches';
import { buildWhatsAppLink, formatRupiah } from '../utils/formatters';

interface SellMotorSectionProps {
  selectedBranch: Branch;
  branches?: Branch[];
  siteSettings?: SiteSettings;
  onNavigate?: (page: string) => void;
}

export const SellMotorSection: React.FC<SellMotorSectionProps> = ({
  branches = BRANCHES_DATA,
  siteSettings,
}) => {
  // Form State
  const [ownerName, setOwnerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cityLocation, setCityLocation] = useState('');
  
  const [brand, setBrand] = useState('Honda');
  const [modelType, setModelType] = useState('');
  const [manufactureYear, setManufactureYear] = useState('2022');
  const [mileage, setMileage] = useState('');
  const [transmission, setTransmission] = useState('Matic');
  const [condition, setCondition] = useState('Mulus Terawat');
  const [documents, setDocuments] = useState('Lengkap BPKB + STNK + Faktur');
  const [taxStatus, setTaxStatus] = useState('Pajak Hidup / Aktif');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [notes, setNotes] = useState('');

  // Modal & Validation State
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const brandList = ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Vespa', 'Lainnya'];
  const years = Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() - i).toString());

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setExpectedPrice(rawVal);
  };

  const handleOpenBranchModal = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!ownerName.trim()) {
      setErrorMessage('Mohon lengkapi Nama Pemilik.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 9) {
      setErrorMessage('Mohon masukkan Nomor WhatsApp / HP yang aktif.');
      return;
    }
    if (!modelType.trim()) {
      setErrorMessage('Mohon masukkan Model / Tipe Motor Anda (contoh: Scoopy Prestige, NMax 155, Beat, Vario 160).');
      return;
    }

    setIsBranchModalOpen(true);
  };

  const handleSendToBranch = (branch: Branch) => {
    setIsBranchModalOpen(false);

    const priceText = expectedPrice 
      ? formatRupiah(parseInt(expectedPrice, 10)) 
      : 'Berdasarkan taksiran showroom';

    const message = 
`Halo ${branch.name} (Putra Motor Group), saya ingin mengajukan penawaran Jual Motor dengan rincian berikut:

DATA PENJUAL:
- Nama: ${ownerName}
- No. WhatsApp / HP: ${phoneNumber}
- Kota / Lokasi: ${cityLocation || '-'}

DETAIL KENDARAAN:
- Merk: ${brand}
- Model / Tipe: ${modelType}
- Tahun Pembuatan: ${manufactureYear}
- Transmisi: ${transmission}
- Jarak Tempuh: ${mileage ? `${mileage} KM` : '-'}
- Kondisi Fisik & Mesin: ${condition}
- Kelengkapan Surat: ${documents}
- Status Pajak: ${taxStatus}
- Ekspektasi Harga Jual: ${priceText}
- Catatan Tambahan: ${notes || '-'}

Mohon info taksiran harga terbaik dan jadwal inspeksi unit di showroom. Terima kasih!`;

    const waUrl = buildWhatsAppLink(branch.whatsapp, message);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="w-full bg-[#F8FAFC] pb-16">
      
      {/* Slim & Compact Top Hero Banner (Refined Luxury Navy) */}
      <div className="bg-slate-900 text-white py-6 sm:py-7 border-b border-slate-800 relative overflow-hidden shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] sm:text-xs font-semibold text-amber-400 mb-2">
                <span>Layanan Jual Motor Putra Motor Group</span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight text-white">
                {siteSettings?.jualmotor_hero_title || 'Jual Motor Cepat & Aman, Taksiran Harga Terbaik'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                {siteSettings?.jualmotor_hero_subtitle || 'Isi rincian motor di bawah dan pilih cabang showroom terdekat untuk konfirmasi langsung via WhatsApp.'}
              </p>
            </div>

            {/* Compact Badges Row */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Harga Transparan</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700">
                <Banknote className="w-3.5 h-3.5 text-amber-400" />
                <span>Langsung Lunas</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Resmi &amp; Bergaransi</span>
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Form (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border border-gray-100">
            
            <div className="border-b border-gray-100 pb-5 mb-6">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Bike className="w-5 h-5 text-[#0B63E5]" />
                <span>Formulir Detail Penjualan Motor</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Lengkapi rincian motor Anda agar tim showroom dapat memberikan taksiran harga yang paling akurat dan optimal.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleOpenBranchModal} className="space-y-6">
              
              {/* SECTION 1: DATA PEMILIK */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center justify-center">1</span>
                  <span>Data Pemilik / Penjual</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      No. WhatsApp / HP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kota / Wilayah Domisili
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Kisaran / Dumai / dsb"
                      value={cityLocation}
                      onChange={(e) => setCityLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: DETAIL MOTOR */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center justify-center">2</span>
                  <span>Detail Spesifikasi Sepeda Motor</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  {/* Merk */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Merk Sepeda Motor <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white transition cursor-pointer"
                    >
                      {brandList.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Model / Tipe */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Model / Tipe Motor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Vario 160 / NMAX 155 / Scoopy"
                      value={modelType}
                      onChange={(e) => setModelType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>

                  {/* Tahun Pembuatan */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Tahun Pembuatan / Perakitan
                    </label>
                    <select
                      value={manufactureYear}
                      onChange={(e) => setManufactureYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white transition cursor-pointer"
                    >
                      {years.map((yr) => (
                        <option key={yr} value={yr}>Tahun {yr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  {/* Transmisi */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Tipe Transmisi
                    </label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white transition cursor-pointer"
                    >
                      <option value="Matic">Matic (Otomatis)</option>
                      <option value="Manual Bebek">Manual Bebek</option>
                      <option value="Kopling Manual (Sport)">Kopling Manual (Sport)</option>
                    </select>
                  </div>

                  {/* Odometer / Jarak Tempuh */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Jarak Tempuh (Kilometer)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 15.000"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    />
                  </div>

                  {/* Kondisi Fisik & Mesin */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kondisi Fisik & Mesin
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white transition cursor-pointer"
                    >
                      <option value="Sangat Mulus (Seperti Baru)">Sangat Mulus (Seperti Baru)</option>
                      <option value="Mulus Terawat">Mulus Terawat</option>
                      <option value="Standar Pemakaian Normal">Standar Pemakaian Normal</option>
                      <option value="Perlu Sedikit Perbaikan / Servis">Perlu Sedikit Perbaikan / Servis</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  {/* Kelengkapan Surat */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kelengkapan Surat & Dokumen
                    </label>
                    <select
                      value={documents}
                      onChange={(e) => setDocuments(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white transition cursor-pointer"
                    >
                      <option value="Lengkap BPKB + STNK + Faktur">Lengkap BPKB + STNK + Faktur</option>
                      <option value="Lengkap BPKB + STNK">Lengkap BPKB + STNK</option>
                      <option value="BPKB Saja">BPKB Saja</option>
                      <option value="Masih Proses Kredit / Leasing Resmi">Masih Proses Kredit / Leasing</option>
                    </select>
                  </div>

                  {/* Status Pajak */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Status Pajak STNK
                    </label>
                    <select
                      value={taxStatus}
                      onChange={(e) => setTaxStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white transition cursor-pointer"
                    >
                      <option value="Pajak Hidup / Aktif Panjang">Pajak Hidup / Aktif Panjang</option>
                      <option value="Pajak Hidup / Aktif">Pajak Hidup / Aktif</option>
                      <option value="Pajak Mati < 1 Tahun">Pajak Mati &lt; 1 Tahun</option>
                      <option value="Pajak Mati > 1 Tahun">Pajak Mati &gt; 1 Tahun</option>
                    </select>
                  </div>

                  {/* Ekspektasi Harga Jual */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Perkiraan Harga yang Diinginkan
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                      <input
                        type="text"
                        placeholder="Contoh: 18.500.000"
                        value={expectedPrice ? parseInt(expectedPrice, 10).toLocaleString('id-ID') : ''}
                        onChange={handlePriceChange}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Catatan Tambahan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Catatan / Kondisi Tambahan (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Warna merah glossy, ban baru diganti tubeless, kunci cadangan dan buku servis lengkap, bodi mulus tanpa lecet."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none"
                  />
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Data Anda dijamin aman & langsung dihubungkan dengan Admin Showroom Resmi.</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Kirim &amp; Pilih Cabang Showroom</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Info & Process (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Keunggulan Card */}
            <div className="bg-white rounded-2xl p-6 shadow-2xs border border-slate-200/80">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Keunggulan Jual Motor di Showroom Kami</span>
              </h3>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">
                      {siteSettings?.jualmotor_advantage_1_title || 'Taksiran Harga Tertinggi'}
                    </strong>
                    {siteSettings?.jualmotor_advantage_1_desc || 'Penilaian adil berdasarkan kondisi riil dan tren pasar motor terkini.'}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">
                      {siteSettings?.jualmotor_advantage_2_title || 'Pembayaran Langsung Lunas'}
                    </strong>
                    {siteSettings?.jualmotor_advantage_2_desc || 'Uang langsung cair via transfer rekening atau cash saat kesepakatan tercapai.'}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">
                      {siteSettings?.jualmotor_advantage_3_title || 'Bisa Jemput Unit'}
                    </strong>
                    {siteSettings?.jualmotor_advantage_3_desc || 'Tim showroom siap membantu cek unit di lokasi Anda atau kunjungi cabang terdekat.'}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <strong className="text-slate-900 block mb-0.5">
                      {siteSettings?.jualmotor_advantage_4_title || 'Bebas Ribet & Aman'}
                    </strong>
                    {siteSettings?.jualmotor_advantage_4_desc || 'Proses administrasi serah terima surat dan kwitansi resmi dealer terpercaya.'}
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Jaringan Showroom Card */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-md">
              <h3 className="text-sm font-black text-amber-400 mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>4 Cabang Showroom Resmi</span>
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Jaringan showroom fisik kami siap melayani Anda di wilayah Sumatera Utara & Riau:
              </p>

              <div className="space-y-2 text-xs">
                {branches.map((b) => (
                  <div key={b.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{b.name}</span>
                      <span className="text-[11px] text-slate-400">{b.city}</span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Buka Tiap Hari
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL PILIH 4 CABANG (Tanpa nomor mentah, Langsung Arahkan ke WhatsApp)   */}
      {/* ========================================================================= */}
      {isBranchModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsBranchModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-[#0d346c] to-[#0B63E5] text-white p-5 sm:p-6 relative">
              <button
                type="button"
                onClick={() => setIsBranchModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-amber-300" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Pilih Cabang Showroom
                </h3>
              </div>

              <p className="text-xs text-blue-100 leading-relaxed">
                Pilih cabang terdekat untuk mengirim data <strong>{brand} {modelType}</strong> Anda langsung ke WhatsApp resmi showroom:
              </p>
            </div>

            {/* List 4 Cabang */}
            <div className="p-5 sm:p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => handleSendToBranch(branch)}
                  className="w-full text-left p-4 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 transition-all duration-200 flex items-center justify-between group shadow-2xs cursor-pointer active:scale-98"
                >
                  <div className="flex items-start gap-3 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-[#25D366]/10 text-blue-600 group-hover:text-[#25D366] flex items-center justify-center shrink-0 transition-colors">
                      <Send className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                        {branch.name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{branch.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                      Kirim via WA
                    </span>
                    <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-emerald-500 group-hover:text-white text-slate-400 flex items-center justify-center transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer Modal */}
            <div className="bg-slate-50 px-5 py-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Format pesan otomatis tersusun rapi</span>
              </span>
              <button
                type="button"
                onClick={() => setIsBranchModalOpen(false)}
                className="font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Batal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
