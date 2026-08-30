import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Bike, 
  CheckCircle, 
  Send, 
  ShieldCheck, 
  MapPin, 
  HelpCircle, 
  Percent,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Vehicle, Branch } from '../types';
import { VEHICLES_DATA } from '../data/vehicles';
import { BRANCHES_DATA } from '../data/branches';
import { formatRupiah, buildWhatsAppLink, generateCreditApplicationMessage } from '../utils/formatters';

interface CreditCalculatorProps {
  preselectedVehicle: Vehicle | null;
  selectedBranch: Branch;
}

export const CreditCalculator: React.FC<CreditCalculatorProps> = ({
  preselectedVehicle,
  selectedBranch,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    preselectedVehicle?.id || VEHICLES_DATA[0].id
  );
  const [customPrice, setCustomPrice] = useState<number>(
    preselectedVehicle?.price || VEHICLES_DATA[0].price
  );
  const [dpPercent, setDpPercent] = useState<number>(20); // 20%
  const [tenorMonths, setTenorMonths] = useState<number>(35);
  const [applicantName, setApplicantName] = useState<string>('');
  const [targetBranchId, setTargetBranchId] = useState<string>(selectedBranch.id);

  // Sync if preselected changes from external modal
  useEffect(() => {
    if (preselectedVehicle) {
      setSelectedVehicleId(preselectedVehicle.id);
      setCustomPrice(preselectedVehicle.price);
      setTargetBranchId(preselectedVehicle.branchId);
    }
  }, [preselectedVehicle]);

  const currentVehicle = VEHICLES_DATA.find((v) => v.id === selectedVehicleId) || VEHICLES_DATA[0];

  const handleVehicleChange = (id: string) => {
    setSelectedVehicleId(id);
    const v = VEHICLES_DATA.find((item) => item.id === id);
    if (v) {
      setCustomPrice(v.price);
      setTargetBranchId(v.branchId);
    }
  };

  // Calculation formulas
  const calculations = useMemo(() => {
    const price = customPrice;
    const dpAmount = Math.round((price * dpPercent) / 100);
    const principalLoan = price - dpAmount;
    
    // Flat annual interest ~16% to 18% standard multi-finance leasing
    const annualInterestRate = 0.17;
    const interestTotal = principalLoan * (annualInterestRate * (tenorMonths / 12));
    const totalLoanWithInterest = principalLoan + interestTotal;
    const monthlyInstallment = Math.round(totalLoanWithInterest / tenorMonths);

    return {
      price,
      dpAmount,
      principalLoan,
      monthlyInstallment,
      totalLoanWithInterest,
    };
  }, [customPrice, dpPercent, tenorMonths]);

  const targetBranch = BRANCHES_DATA.find((b) => b.id === targetBranchId) || selectedBranch;

  const handleSubmitCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      alert('Silakan masukkan nama lengkap Anda.');
      return;
    }

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    const waLink = buildWhatsAppLink(
      targetBranch.whatsapp,
      generateCreditApplicationMessage(
        currentVehicle,
        applicantName,
        calculations.dpAmount,
        tenorMonths,
        calculations.monthlyInstallment,
        targetBranch.name
      )
    );

    window.open(waLink, '_blank');
  };

  return (
    <section id="kalkulator-kredit" className="py-14 bg-slate-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0B63E5] text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            Simulasi Kredit Motor
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Kalkulator Angsuran & DP Fleksibel
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Hitung perkiraan DP dan cicilan bulanan motor impian Anda dengan suku bunga transparan dan kompetitif.
          </p>
        </div>

        {/* Two-Column Interactive Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* 1. Pilih Unit Motor */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">
                1. Pilih Unit Motor Pilihan:
              </label>
              <select
                value={selectedVehicleId}
                onChange={(e) => handleVehicleChange(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 border border-gray-300 rounded-xl p-3 text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
              >
                {VEHICLES_DATA.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.year}) - {formatRupiah(v.price)} [{v.condition === 'baru' ? 'BARU' : 'BEKAS'}]
                  </option>
                ))}
              </select>
            </div>

            {/* 2. DP Percentage Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-800">2. Uang Muka (DP):</span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-[#0B63E5] font-black text-xs">
                    {dpPercent}%
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {formatRupiah(calculations.dpAmount)}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={dpPercent}
                onChange={(e) => setDpPercent(Number(e.target.value))}
                className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B63E5]"
              />

              <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-medium">
                <span>DP Min: 10% ({formatRupiah(Math.round(customPrice * 0.1))})</span>
                <span>DP Standar: 20%</span>
                <span>DP Max: 50%</span>
              </div>
            </div>

            {/* 3. Pilihan Tenor Angsuran */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">
                3. Pilihan Tenor Angsuran (Bulan):
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[11, 23, 35, 47].map((tenor) => {
                  const isSelected = tenorMonths === tenor;
                  return (
                    <button
                      key={tenor}
                      type="button"
                      onClick={() => setTenorMonths(tenor)}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-[#0B63E5] font-black shadow-xs'
                          : 'bg-slate-50 border-gray-200 text-slate-700 hover:bg-slate-100 font-semibold'
                      }`}
                    >
                      <div className="text-sm sm:text-base font-extrabold">{tenor} Bulan</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {tenor === 11 ? '1 Tahun' : tenor === 23 ? '2 Tahun' : tenor === 35 ? '3 Tahun' : '4 Tahun'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Lokasi Cabang & Nama Pemohon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Nama Lengkap Pemohon:
                </label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-slate-50 text-slate-800 border border-gray-300 rounded-xl p-2.5 text-xs sm:text-sm font-medium outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Pilih Cabang Showroom:
                </label>
                <select
                  value={targetBranchId}
                  onChange={(e) => setTargetBranchId(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 border border-gray-300 rounded-xl p-2.5 text-xs sm:text-sm font-semibold outline-none focus:border-blue-500 cursor-pointer"
                >
                  {BRANCHES_DATA.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Right Column: Hasil Simulasi Card */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6">
            
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Rincian Simulasi
                </span>
                <span className="text-xs font-bold text-[#0B63E5] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Kredit Cepat & Terpercaya
                </span>
              </div>

              {/* Selected Unit Mini Preview */}
              <div className="flex items-center gap-3.5 bg-slate-50 p-3 rounded-2xl border border-gray-100 mb-5">
                <img
                  src={currentVehicle.images[0]}
                  alt={currentVehicle.name}
                  className="w-16 h-12 rounded-xl object-cover"
                />
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    {currentVehicle.brand} • {currentVehicle.year}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                    {currentVehicle.name}
                  </div>
                  <div className="text-xs font-extrabold text-slate-800">
                    {formatRupiah(currentVehicle.price)}
                  </div>
                </div>
              </div>

              {/* Price Details Breakdown */}
              <div className="space-y-3 text-xs text-slate-600 border-b border-gray-100 pb-4 mb-4">
                <div className="flex justify-between">
                  <span>Harga Kendaraan (OTR):</span>
                  <span className="font-bold text-slate-900">{formatRupiah(customPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uang Muka ({dpPercent}%):</span>
                  <span className="font-bold text-emerald-600">{formatRupiah(calculations.dpAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pokok Pembiayaan:</span>
                  <span className="font-bold text-slate-900">{formatRupiah(calculations.principalLoan)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tenor Pembiayaan:</span>
                  <span className="font-bold text-slate-900">{tenorMonths} Bulan</span>
                </div>
              </div>

              {/* Huge Monthly Installment Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
                <div className="text-[11px] font-semibold text-slate-600 mb-0.5">
                  Estimasi Angsuran Bulanan:
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#0B63E5] tracking-tight">
                  {formatRupiah(calculations.monthlyInstallment)}
                  <span className="text-xs font-semibold text-slate-500 ml-1">/bulan</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  *Perhitungan merupakan estimasi simulasi kredit standar.
                </div>
              </div>

            </div>

            {/* Submit to WhatsApp */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSubmitCredit}
                className="w-full py-3.5 px-4 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Ajukan Kredit Langsung via WhatsApp</span>
              </button>

              <p className="text-[10px] text-slate-400 text-center">
                Persyaratan mudah: KTP, KK, & Slip Gaji / Rekening Koran.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
