import React from 'react';
import { 
  Bike, 
  BadgeDollarSign, 
  FileCheck2, 
  Truck, 
  CheckCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ProcessGuide: React.FC = () => {
  const buySteps = [
    {
      num: '01',
      title: 'Pilih Motor Idaman',
      desc: 'Jelajahi katalog unit baru atau bekas berkualitas kami di Pandu Motor Group.',
    },
    {
      num: '02',
      title: 'Konsultasi & Pengajuan Mudah',
      desc: 'Konsultasi DP dan syarat ringan via WhatsApp showroom kami dengan respon cepat dan ramah.',
    },
    {
      num: '03',
      title: 'Verifikasi & Cek Unit',
      desc: 'Cek fisik kondisi mesin di showroom atau tim kami siap memproses berkas cepat.',
    },
    {
      num: '04',
      title: 'Pengiriman ke Rumah',
      desc: 'Motor diantar ke alamat Anda lengkap dengan STNK, BPKB asli, dan garansi resmi.',
    },
  ];

  const danaTunaiSteps = [
    {
      num: '01',
      title: 'Siapkan Dokumen BPKB',
      desc: 'Siapkan KTP, KK, STNK & BPKB asli (Motor / Mobil) ke cabang terdekat atau online.',
    },
    {
      num: '02',
      title: 'Valuasi Maksimal',
      desc: 'Tim appraiser menilai kendaraan Anda secara transparan dengan plafon pencairan tinggi.',
    },
    {
      num: '03',
      title: 'Dana Cair 1 Hari',
      desc: 'Persetujuan cepat, dana langsung ditransfer. Kendaraan fisik tetap Anda gunakan.',
    },
  ];

  return (
    <section className="py-14 bg-slate-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <span>Panduan Mudah &amp; Transparan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Alur Transaksi di Putra Motor Group
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Langkah mudah membeli motor impian dan pengajuan dana tunai tanpa ribet.
          </p>
        </div>

        {/* 1. Alur Beli Motor */}
        <div className="mb-12">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Alur Beli Motor (Cash &amp; Kredit)</h3>
              <p className="text-xs text-slate-500">4 langkah mudah miliki motor baru / bekas berkualitas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {buySteps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:border-slate-400 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center mb-3">
                  {step.num}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Alur Dana Tunai */}
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
              <BadgeDollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Alur Pengajuan Dana Tunai Gadai BPKB</h3>
              <p className="text-xs text-slate-500">Pencairan kilat dengan jaminan BPKB motor / mobil</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {danaTunaiSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:border-slate-400 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center mb-3">
                  {step.num}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
