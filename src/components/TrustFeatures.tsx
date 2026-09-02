import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  FileCheck, 
  BadgePercent, 
  Clock, 
  Wrench, 
  Lock, 
  Award, 
  Wallet, 
  CheckCircle2
} from 'lucide-react';
import { COMPANY_INFO } from '../data/branches';
import { SiteSettings } from '../types';

interface TrustFeaturesProps {
  siteSettings?: SiteSettings;
}

export const TrustFeatures: React.FC<TrustFeaturesProps> = ({ siteSettings }) => {
  const heading = siteSettings?.trust_heading || 'Mengapa Memilih Kami Sebagai Mitra Motor Impian Anda?';
  const subtitle = siteSettings?.trust_subtitle || 'Dengan komitmen “Melayani Sepenuh Hati” untuk kenyamanan dan keamanan transaksi Anda.';

  const features = [
    {
      icon: Award,
      title: 'Kualitas Terjamin Dealer',
      subtitle: 'Inspeksi 100 Titik Ketat',
      desc: 'Setiap unit motor baru maupun bekas melalui uji kelayakan mesin, kelistrikan, dan rangka resmi. 100% bebas dari bekas tabrakan fatal & banjir.',
      tag: 'Pandu Certified',
      color: 'blue',
    },
    {
      icon: Clock,
      title: 'Proses Cepat & Mudah',
      subtitle: 'Pengajuan 1 Hari Kerja',
      desc: 'Pelayanan ramah berlandaskan “Melayani Sepenuh Hati”. Proses pengajuan cepat dengan syarat fleksibel dan respon tanggap.',
      tag: 'Approval Cepat',
      color: 'amber',
    },
    {
      icon: FileCheck,
      title: 'Surat Lengkap & Sah',
      subtitle: 'Legalitas BPKB & STNK Terverifikasi',
      desc: 'Semua unit dijamin memiliki dokumen lengkap (BPKB, STNK & Faktur Asli). Terdaftar resmi dan dijamin keamanannya.',
      tag: '100% Legal',
      color: 'emerald',
    },
    {
      icon: Wallet,
      title: 'Kredit Fleksibel & Terpercaya',
      subtitle: 'DP Rendah & Angsuran Ringan',
      desc: 'Dukungan pembiayaan resmi dengan bunga kompetitif, tenor fleksibel, dan angsuran terjangkau.',
      tag: 'Bunga Ringan',
      color: 'indigo',
    },
  ];

  return (
    <section id="tentang" className="py-14 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <span>Keunggulan Showroom Kami</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {heading}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            {subtitle}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col justify-between hover:border-slate-400 hover:shadow-md transition-all duration-300 group shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs font-semibold text-amber-600 mt-0.5 mb-2">
                    {item.subtitle}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Garansi Kepuasan Pelanggan</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mini Trust Banner with Operational Hours */}
        <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-11 h-11 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Jam Operasional Showroom &amp; Layanan Pelanggan
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                Buka setiap hari (Senin s/d Minggu) pukul <strong>08.00 WIB s/d 17.00 WIB</strong>.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-800 font-bold px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs whitespace-nowrap">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Terpercaya &amp; Bergaransi</span>
          </div>
        </div>

      </div>
    </section>
  );
};
