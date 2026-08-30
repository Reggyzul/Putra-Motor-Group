import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Bike, 
  Send, 
  CheckCircle2, 
  Calculator, 
  Building2, 
  MapPin, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Branch, Vehicle } from '../types';
import { BRANCHES_DATA } from '../data/branches';
import { VEHICLES_DATA } from '../data/vehicles';
import { formatRupiah, buildWhatsAppLink } from '../utils/formatters';

interface TradeInSimulatorProps {
  selectedBranch: Branch;
  preSelectedTargetVehicle?: Vehicle | null;
}

export const TradeInSimulator: React.FC<TradeInSimulatorProps> = ({
  selectedBranch,
  preSelectedTargetVehicle = null,
}) => {
  // Step 1: Data Motor Lama Pelanggan
  const [oldBikeBrand, setOldBikeBrand] = useState('Honda');
  const [oldBikeModel, setOldBikeModel] = useState('Vario 125 ESP');
  const [oldBikeYear, setOldBikeYear] = useState('2020');
  const [oldBikeCondition, setOldBikeCondition] = useState<'sangat_baik' | 'baik' | 'cukup'>('baik');

  // Step 2: Motor Baru Impian
  const [targetVehicleId, setTargetVehicleId] = useState<string>(
    preSelectedTargetVehicle?.id || VEHICLES_DATA[0]?.id || ''
  );

  // Showroom Cabang Tujuan
  const [targetBranchId, setTargetBranchId] = useState<string>(selectedBranch.id);

  // Estimasi Valuasi Motor Lama (Hitungan Realistis & Otomatis)
  const baseEstimatedOldPrice = (() => {
    let base = 12000000;
    const model = oldBikeModel.toLowerCase();
    if (model.includes('nmax') || model.includes('pcx') || model.includes('aerox')) {
      base = 21000000;
    } else if (model.includes('vario') || model.includes('scoopy')) {
      base = 15000000;
    } else if (model.includes('beat') || model.includes('mio')) {
      base = 11000000;
    } else if (model.includes('crf') || model.includes('klx')) {
      base = 24000000;
    }

    const yearNum = parseInt(oldBikeYear, 10) || 2020;
    const yearDiff = 2026 - yearNum;
    base = base - yearDiff * 900000;

    if (oldBikeCondition === 'sangat_baik') base *= 1.08;
    if (oldBikeCondition === 'cukup') base *= 0.88;

    return Math.max(base, 4000000);
  })();

  const targetVehicle = VEHICLES_DATA.find((v) => v.id === targetVehicleId) || VEHICLES_DATA[0];
  const targetBranch = BRANCHES_DATA.find((b) => b.id === targetBranchId) || selectedBranch;

  // Hitungan Selisih Bayar Sisa
  const priceDifference = Math.max(0, targetVehicle.price - baseEstimatedOldPrice);

  const scrollToCalculator = () => {
    const el = document.getElementById('kalkulator-tukar-tambah');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyTradeIn = (e: React.FormEvent) => {
    e.preventDefault();
    const conditionLabel = 
      oldBikeCondition === 'sangat_baik' ? 'Sangat Mulus (Like New)' :
      oldBikeCondition === 'baik' ? 'Normal Terawat' : 'Lecet Pemakaian';

    const message = 
      `*FORM PENGAJUAN TUKAR TAMBAH - PANDU MOTOR GROUP*\n\n` +
      `*1. Motor Lama Pelanggan:*\n` +
      `• Merk & Tipe: ${oldBikeBrand} ${oldBikeModel}\n` +
      `• Tahun: ${oldBikeYear}\n` +
      `• Kondisi: ${conditionLabel}\n` +
      `• Estimasi Taksiran: ${formatRupiah(baseEstimatedOldPrice)}\n\n` +
      `*2. Motor Impian Yang Dipilih:*\n` +
      `• Unit: ${targetVehicle.name} (${targetVehicle.year})\n` +
      `• Harga OTR: ${formatRupiah(targetVehicle.price)}\n` +
      `• Estimasi Sisa Bayar: ${formatRupiah(priceDifference)}\n\n` +
      `*3. Cabang Showroom Dituju:*\n` +
      `• ${targetBranch.name} (${targetBranch.city})\n\n` +
      `Mohon dibantu jadwal cek fisik unit dan proses tukar tambah. Terima kasih!`;

    const waUrl = buildWhatsAppLink(targetBranch.whatsapp, message);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="w-full bg-[#F8FAFC]">
      
      {/* ========================================================================= */}
      {/* 1. HERO TOP BANNER (100% Persis momotor.id Style: Soft Blue #EBF3FE)       */}
      {/* ========================================================================= */}
      <section className="bg-[#EBF3FE] border-b border-blue-100 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Typography */}
            <div className="md:col-span-7 space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-4xl md:text-[42px] font-black text-slate-900 tracking-tight leading-tight">
                  Berencana ganti motor?<br />
                  Tukar tambah bisa jadi solusi buatmu
                </h1>
                <p className="text-slate-600 text-xs sm:text-base leading-relaxed max-w-xl">
                  Tukar tambah di Pandu Motor Group memungkinkanmu menukar motor bekas dengan motor impianmu, dengan proses yang cepat, transparan, dan pilihan unit terlengkap.
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={scrollToCalculator}
                  className="px-6 sm:px-8 py-3 sm:py-3.5 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  Tukar tambah sekarang
                </button>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="md:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-blue-200/50 bg-white/40">
                <img
                  src="/images/momotor_banner_nmax_aerox.jpg"
                  alt="Tukar Tambah Motor Pandu Motor Group"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. KALKULASI TUKAR TAMBAH EFISIEN & SIMPEL                                 */}
      {/* ========================================================================= */}
      <section id="kalkulator-tukar-tambah" className="py-10 sm:py-14 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kalkulator & Form Tukar Tambah Simpel
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Ketahui estimasi harga taksiran motor lama Anda dan hitung selisih bayar dalam 3 langkah mudah.
          </p>
        </div>

        {/* 2-Column Simpel Layout */}
        <form onSubmit={handleApplyTradeIn} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: DATA MOTOR LAMA & MOTOR BARU */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Box 1: Motor Lama */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">1</div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Data Motor Lama Anda</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Merk Motor Lama</label>
                  <select
                    value={oldBikeBrand}
                    onChange={(e) => setOldBikeBrand(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white font-medium cursor-pointer"
                  >
                    <option value="Honda">Honda</option>
                    <option value="Yamaha">Yamaha</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="Kawasaki">Kawasaki</option>
                    <option value="Lainnya">Merk Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Pembuatan</label>
                  <select
                    value={oldBikeYear}
                    onChange={(e) => setOldBikeYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white font-medium cursor-pointer"
                  >
                    {['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Model / Tipe Motor Lama</label>
                <input
                  type="text"
                  value={oldBikeModel}
                  onChange={(e) => setOldBikeModel(e.target.value)}
                  placeholder="Contoh: Vario 125 CBS, BeAT Street, NMax 155, Scoopy..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kondisi Motor Lama</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sangat_baik', label: 'Sangat Baik' },
                    { id: 'baik', label: 'Baik (Terawat)' },
                    { id: 'cukup', label: 'Cukup (Lecet)' },
                  ].map((cond) => (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => setOldBikeCondition(cond.id as any)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
                        oldBikeCondition === cond.id
                          ? 'bg-[#0B63E5] text-white shadow-2xs'
                          : 'bg-slate-50 border border-gray-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cond.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Box 2: Motor Baru Pilihan */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">2</div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Pilih Motor Pengganti di Showroom</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Unit Impian</label>
                <select
                  value={targetVehicleId}
                  onChange={(e) => setTargetVehicleId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white font-medium cursor-pointer"
                >
                  {VEHICLES_DATA.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.year}) - {formatRupiah(v.price)} [{v.condition === 'baru' ? 'Baru' : 'Bekas'}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Target Preview */}
              <div className="flex items-center gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                <img
                  src={targetVehicle.images[0]}
                  alt={targetVehicle.name}
                  className="w-14 h-11 object-cover rounded-lg border border-gray-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{targetVehicle.name}</div>
                  <div className="text-[11px] font-black text-blue-600">{formatRupiah(targetVehicle.price)}</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: RINGKASAN & ESTIMASI SISA BAYAR */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4 sticky top-24">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">3</div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Estimasi Hitungan Tukar Tambah</h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Harga Motor Impian:</span>
                  <span className="font-bold text-slate-900">{formatRupiah(targetVehicle.price)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>Estimasi Taksiran Motor Lama:</span>
                  <span className="font-bold text-emerald-600">- {formatRupiah(baseEstimatedOldPrice)}</span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-black text-slate-900 uppercase">Sisa Bayar / Tambah:</span>
                    <div className="text-[10px] text-slate-400">Bisa dibayar Tunai atau Cicilan Ringan</div>
                  </div>
                  <div className="text-base sm:text-xl font-black text-[#0B63E5]">
                    {formatRupiah(priceDifference)}
                  </div>
                </div>
              </div>

              {/* Pilih Cabang */}
              <div className="pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Cabang Showroom</label>
                  <select
                    value={targetBranchId}
                    onChange={(e) => setTargetBranchId(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white font-medium cursor-pointer"
                  >
                    {BRANCHES_DATA.map((b) => (
                      <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit to WhatsApp Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center mt-4"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>Ajukan Tukar Tambah via WhatsApp</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Inspeksi gratis di showroom / teknisi datang ke rumah</span>
              </div>

            </div>

          </div>

        </form>

      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION CABANG KAMI (Persis di bawah Tukar Tambah)                      */}
      {/* ========================================================================= */}
      <section id="cabang-tukar-tambah" className="py-10 sm:py-14 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Jaringan Showroom Resmi</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cabang Kami
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Kunjungi showroom fisik Pandu Motor Group terdekat untuk proses cek fisik unit dan transaksi tukar tambah langsung.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BRANCHES_DATA.map((branch) => {
              const waUrl = buildWhatsAppLink(
                branch.whatsapp,
                `Halo ${branch.name} (Pandu Motor Group), saya ingin tukar tambah motor di cabang showroom ini. Mohon info lokasinya.`
              );

              return (
                <div
                  key={branch.id}
                  className="bg-slate-50 border border-gray-200 rounded-2xl p-3 sm:p-4 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] bg-white rounded-xl overflow-hidden mb-3 border border-gray-200/80 p-2 flex items-center justify-center">
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">
                      {branch.code}
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                      {branch.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {branch.address}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between gap-2">
                    <a
                      href={branch.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Maps →
                    </a>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Hubungi</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
