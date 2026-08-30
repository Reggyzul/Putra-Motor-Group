import React from 'react';
import { 
  X, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Send, 
  Calculator, 
  Sparkles, 
  Bike,
  Gauge,
  Calendar,
  Layers,
  FileCheck
} from 'lucide-react';
import { Vehicle, Branch } from '../types';
import { BRANCHES_DATA } from '../data/branches';
import { formatRupiah, buildWhatsAppLink } from '../utils/formatters';

interface VehicleCompareModalProps {
  vehicles: Vehicle[];
  onRemoveVehicle?: (id: string) => void;
  onClose: () => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenCreditCalc?: (vehicle: Vehicle) => void;
  selectedBranch: Branch;
}

export const VehicleCompareModal: React.FC<VehicleCompareModalProps> = ({
  vehicles,
  onRemoveVehicle,
  onClose,
  onSelectVehicle,
  onOpenCreditCalc,
  selectedBranch,
}) => {
  if (vehicles.length === 0) return null;

  const compareWaMessage = `Halo ${selectedBranch.name} (Pandu Motor Group), saya sedang membandingkan unit motor berikut:\n\n` +
    vehicles.map((v, i) => `${i + 1}. ${v.name} (${v.condition.toUpperCase()} ${v.year}) - OTR ${formatRupiah(v.price)}`).join('\n') +
    `\n\nMohon info stok fisik unit dan rekomendasi cicilan terbaik. Terima kasih!`;

  const compareWaUrl = buildWhatsAppLink(selectedBranch.whatsapp, compareWaMessage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0B63E5] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Bandingkan Motor ({vehicles.length} Unit)
              </h3>
              <p className="text-xs text-slate-400">Perbandingan harga OTR, DP, dan cicilan bulanan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-x-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-[600px]">
            {vehicles.map((v) => (
              <div key={v.id} className="bg-slate-50 border border-gray-200 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <img src={v.images[0]} alt={v.name} className="w-full h-32 rounded-xl object-cover mb-2" />
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{v.brand} • {v.year}</div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{v.name}</h4>
                  <div className="text-base font-extrabold text-slate-900 mt-1">{formatRupiah(v.price)}</div>
                  
                  <div className="mt-2 text-xs space-y-1 text-slate-600">
                    <div>DP mulai: <strong>{formatRupiah(v.dpMin)}</strong></div>
                    <div>Cicilan: <strong className="text-[#0B63E5]">{formatRupiah(v.installmentEstimates.tenor35)}/bln</strong></div>
                    <div>Mesin: <span>{v.engineCapacity}</span></div>
                    <div>Transmisi: <span>{v.transmission}</span></div>
                    <div>Garansi: <span>{v.warranty}</span></div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectVehicle(v)}
                  className="w-full py-2 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Pilih Unit Ini
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <a
              href={compareWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Konsultasi Perbandingan via WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
