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

  // Hapus section bar kecil panjang jual motor, tukar tambah, dana tunai di next page jual motor
  const showCtaBanners = currentPage !== 'jual-motor';

  return (
    <footer className="bg-slate-900 text-slate-300 text-xs">
      
      {showCtaBanners && (
        <>
          {/* 1. TOP BANNER: Jual Motor, Tukar Tambah, & Dana Tunai (Harmonized Luxury Style) */}
          <div className="bg-slate-950 text-white border-t border-b border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-left">
                
                {/* Left Side: Jual Motor Highlight */}
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-semibold text-amber-400 mb-1.5">
                    <span>Layanan Resmi Showroom</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {siteSettings?.jualmotor_banner_title || 'Mau menjual motor anda? Putra Motor Group Solusinya!'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {siteSettings?.jualmotor_banner_subtitle || 'Taksiran harga terbaik & pembayaran langsung lunas di 4 cabang showroom resmi kami.'}
                  </p>
                </div>

                {/* Right Side: Quick Action Buttons (Harmonized) */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate('jual-motor')}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>{siteSettings?.jualmotor_banner_cta || 'Jual Motor'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('tukar-tambah')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs shadow-2xs transition-all cursor-pointer active:scale-95"
                  >
                    Tukar Tambah
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('dana-tunai')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-xs shadow-2xs transition-all cursor-pointer active:scale-95"
                  >
                    Dana Tunai BPKB
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info & Kantor Pusat */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <img 
                src="/images/pandu_logo.avif" 
                alt="Pandu Motor Group Logo" 
                className="w-10 h-10 rounded-full object-cover shadow-sm border border-emerald-500/40 bg-white"
              />
              <div className="flex items-center text-xl font-black">
                <span className="text-[#DC2626] font-['Outfit',sans-serif]">Pandu</span>
                <span className="text-[#DC2626] font-['Outfit',sans-serif] ml-1">Motor</span>
                <span className="text-[#DC2626] font-['Outfit',sans-serif] ml-1">Group</span>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Pandu Motor Group (CV. Pandu Motor, CV. Ikabina Motor & CV. Motorian Daya) adalah jaringan showroom terpercaya jual beli motor baru dan motor bekas berkualitas, fasilitas tukar tambah, dan layanan dana tunai gadai BPKB resmi.
            </p>

            {/* Kantor Pusat & Email Resmi */}
            <div className="pt-2 pb-1 space-y-2 text-xs border-y border-slate-800">
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Kantor Pusat:</span>
                  <div className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                    {headOffice}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-[11px]">
                  <span className="font-bold text-white">Email:</span>{' '}
                  <a 
                    href={`mailto:${email}`} 
                    className="text-blue-400 hover:text-blue-300 underline font-mono"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px]">Surat Lengkap & Garansi Mesin Resmi Dealer</span>
            </div>
          </div>

          {/* Produk & Layanan */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Layanan Unggulan
            </h4>
            <ul className="space-y-2 text-xs">
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
                  className="hover:text-white text-emerald-400 font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <span>Jual Motor Anda (Harga Terbaik)</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300">Baru</span>
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
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Merk Terpopuler
            </h4>
            <ul className="space-y-2 text-xs">
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
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              4 Showroom Cabang
            </h4>
            <ul className="space-y-2.5 text-slate-400 text-xs">
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
                <span>Buka Setiap Hari: 08.00 - 17.00 WIB</span>
              </li>
              {/* Admin Login Dipindahkan Tepat di Bawah Buka Setiap Hari */}
              <li className="pt-2 border-t border-slate-800/80">
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

        {/* Bottom Legal & Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500">
          © 2026 Pandu Motor Group. Hak Cipta Dilindungi Undang-Undang.
        </div>

      </div>
    </footer>
  );
};
