import React from 'react';
import { 
  Building2,
  MapPin, 
  PhoneCall, 
  Mail, 
  Clock, 
  ShieldCheck, 
  BadgeDollarSign, 
  Calculator, 
  ArrowRight,
  Lock,
  Bike,
  Sparkles
} from 'lucide-react';
import { COMPANY_INFO, BRANCHES_DATA } from '../data/branches';
import { Branch, SiteSettings } from '../types';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  selectedBranch: Branch;
  onSelectBranch: (branch: Branch) => void;
  siteSettings?: SiteSettings;
  currentPage?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  selectedBranch,
  onSelectBranch,
  siteSettings,
  currentPage,
}) => {
  const headOffice = siteSettings?.head_office_address || 'Jl. Kartini No. 204 A-B, Kisaran barat, Asahan Sumatera Utara';
  const email = siteSettings?.official_email || 'putramotorgroup.id@gmail.com';
  const phone = siteSettings?.official_phone || '0822-7647-7628';
  const tagline = siteSettings?.tagline || COMPANY_INFO.tagline;
  const brandName = siteSettings?.brand_name || 'Pandu Motor Group';
  const operationalHours = siteSettings?.operational_hours || 'Buka Setiap Hari: 08.00 - 17.00 WIB';
  const footerAbout = siteSettings?.footer_about_text || 'Pandu Motor Group (CV. Pandu Motor, CV. Ikabina Motor & CV. Motorian Daya) adalah jaringan showroom terpercaya jual beli motor baru dan motor bekas berkualitas, fasilitas tukar tambah, dan layanan dana tunai gadai BPKB resmi.';
  const footerCtaHeading = siteSettings?.footer_cta_heading || 'Siap Memiliki Motor Impian atau Butuh Dana Tunai Cepat?';
  const footerCopyright = siteSettings?.footer_copyright_text || '© 2026 Pandu Motor Group. Hak Cipta Dilindungi Undang-Undang.';

  // Hapus section bar kecil panjang jual motor, tukar tambah, dana tunai di next page jual motor
  const showCtaBanners = currentPage !== 'jual-motor';

  return (
    <footer className="bg-slate-900 text-slate-300 text-xs">
      
      {showCtaBanners && (
        <>
          {/* ========================================================================= */}
          {/* 1. BAR 1 (TERPISAH): JUAL MOTOR (Minimalis, Ramping & Profesional)        */}
          {/* ========================================================================= */}
          <div className="bg-[#0B1528] text-white border-t border-b border-slate-800/90 py-2.5 sm:py-3 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-center sm:text-left">
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-white tracking-tight">
                  {siteSettings?.jualmotor_banner_title || (
                    <>
                      Mau menjual motor anda? <span className="text-amber-400">{brandName} Solusinya!</span>
                    </>
                  )}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 max-w-2xl">
                  {siteSettings?.jualmotor_banner_subtitle || 'Dapatkan penawaran harga terbaik, proses cepat tanpa ribet, dan transaksi aman resmi di 4 cabang showroom kami.'}
                </p>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate('jual-motor')}
                  className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-xs hover:shadow transition-all duration-200 cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <span>{siteSettings?.jualmotor_banner_cta || 'Jual Motor'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. BAR 2 (TERPISAH): TUKAR TAMBAH & DANA TUNAI (Background Putih, Teks Hitam) */}
          {/* ========================================================================= */}
          <div className="bg-white text-slate-900 border-b border-slate-200 py-3 sm:py-3.5 shadow-2xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4 text-center md:text-left">
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-950 tracking-tight">
                  {footerCtaHeading}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-600 mt-0.5">
                  {brandName} selalu berkomitmen <strong className="text-slate-900 font-bold">“{tagline}”</strong> untuk seluruh pelanggan setia di Sumatera Utara &amp; Riau.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => onNavigate('tukar-tambah')}
                  className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  Tukar Tambah Motor
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('dana-tunai')}
                  className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  Dana Tunai BPKB
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
          
          {/* Brand Info & Kantor Pusat */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <img 
                src="/images/pandu_logo.avif" 
                alt={`${brandName} Logo`} 
                className="w-9 h-9 rounded-full object-cover shadow-sm border border-slate-700 bg-white"
              />
              <div className="flex items-center text-lg font-black">
                <span className="text-[#DC2626] font-['Outfit',sans-serif]">{brandName}</span>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {footerAbout}
            </p>

            {/* Kantor Pusat & Email Resmi */}
            <div className="pt-2 pb-1 space-y-1.5 text-xs border-y border-slate-800">
              <div className="flex items-start gap-2.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Kantor Pusat:</span>
                  <div className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                    {headOffice}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <div className="text-[11px]">
                  <span className="font-bold text-white">Email:</span>{' '}
                  <a 
                    href={`mailto:${email}`} 
                    className="text-slate-300 hover:text-white underline font-mono"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px]">Surat Lengkap &amp; Garansi Mesin Resmi Dealer</span>
            </div>
          </div>

          {/* Produk & Layanan */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
              Layanan Unggulan
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('katalog')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Motor Baru 100% OTR
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('katalog')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Motor Bekas Berkualitas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('tukar-tambah')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Tukar Tambah (Trade-In)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('dana-tunai')}
                  className="hover:text-white transition cursor-pointer"
                >
                  Dana Tunai Gadai BPKB
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('jual-motor')}
                  className="hover:text-amber-300 text-amber-400 font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <span>Jual Motor Anda (Harga Terbaik)</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-300">Baru</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cabang')}
                  className="hover:text-white transition cursor-pointer"
                >
                  4 Cabang Showroom Resmi
                </button>
              </li>
            </ul>
          </div>

          {/* Merk Populer */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
              Merk Terpopuler
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><button type="button" onClick={() => onNavigate('katalog')} className="hover:text-white transition cursor-pointer">Honda Indonesia</button></li>
              <li><button type="button" onClick={() => onNavigate('katalog')} className="hover:text-white transition cursor-pointer">Yamaha Motor</button></li>
              <li><button type="button" onClick={() => onNavigate('katalog')} className="hover:text-white transition cursor-pointer">Kawasaki Racing</button></li>
              <li><button type="button" onClick={() => onNavigate('katalog')} className="hover:text-white transition cursor-pointer">Suzuki Motor</button></li>
              <li><button type="button" onClick={() => onNavigate('katalog')} className="hover:text-white transition cursor-pointer">Vespa Piaggio</button></li>
              <li><button type="button" onClick={() => onNavigate('cabang')} className="hover:text-white transition cursor-pointer">4 Showroom Cabang</button></li>
            </ul>
          </div>

          {/* 4 Cabang Showroom */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
              4 Showroom Cabang
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Kisaran, Perdagangan, Cikampak & Dumai</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{operationalHours}</span>
              </li>
              {/* Admin Login Dipindahkan Tepat di Bawah Buka Setiap Hari */}
              <li className="pt-1.5 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 font-semibold transition cursor-pointer text-xs group"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0" />
                  <span>Admin Login</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* SEO Keyword & Regional Index Links for Google Rank 1 */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-slate-500">
            <span className="font-bold text-slate-400">Pencarian Populer:</span>
            <button type="button" onClick={() => onNavigate('katalog')} className="hover:text-amber-400 transition cursor-pointer">Jual Beli Motor Sumut</button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('katalog')} className="hover:text-amber-400 transition cursor-pointer">Motor Bekas Berkualitas</button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('dana-tunai')} className="hover:text-amber-400 transition cursor-pointer">Dana Tunai BPKB Motor</button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('dana-tunai')} className="hover:text-amber-400 transition cursor-pointer">Gadai BPKB Cepat Cair</button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('tukar-tambah')} className="hover:text-amber-400 transition cursor-pointer">Tukar Tambah Motor Bekas</button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('jual-motor')} className="hover:text-amber-400 transition cursor-pointer">Jual Motor Harga Tinggi</button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('cabang')} className="hover:text-amber-400 transition cursor-pointer">Showroom Motor Kisaran Asahan</button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('cabang')} className="hover:text-amber-400 transition cursor-pointer">Motor Bekas Perdagangan Simalungun</button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('cabang')} className="hover:text-amber-400 transition cursor-pointer">Showroom Cikampak Labusel</button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('cabang')} className="hover:text-amber-400 transition cursor-pointer">Showroom Dumai Riau</button>
          </div>
        </div>

        {/* Bottom Legal & Copyright (Dipadatkan) */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 text-center text-[10px] sm:text-[11px] text-slate-500">
          {footerCopyright}
        </div>

      </div>
    </footer>
  );
};
