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
  ArrowRight
} from 'lucide-react';
import { COMPANY_INFO, BRANCHES_DATA } from '../data/branches';
import { Branch, SiteSettings } from '../types';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  selectedBranch: Branch;
  onSelectBranch: (branch: Branch) => void;
  siteSettings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  selectedBranch,
  onSelectBranch,
  siteSettings,
}) => {
  const headOffice = siteSettings?.head_office_address || 'Jl. Kartini No. 204 A-B, Kisaran barat, Asahan Sumatera Utara';
  const email = siteSettings?.official_email || 'putramotorgroup.id@gmail.com';
  const phone = siteSettings?.official_phone || '0822-7647-7628';
  const tagline = siteSettings?.tagline || COMPANY_INFO.tagline;
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs">
      
      {/* Top Banner Call to Action */}
      <div className="bg-gradient-to-r from-[#0B63E5] to-blue-800 text-white py-8 border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="text-lg sm:text-xl font-bold">
              Siap Memiliki Motor Impian atau Butuh Dana Tunai Cepat?
            </div>
            <div className="text-xs text-blue-100 mt-0.5">
              Pandu Motor Group selalu berkomitmen <strong>“{COMPANY_INFO.tagline}”</strong> untuk seluruh pelanggan setia di Sumatera Utara & Riau.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('tukar-tambah')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs shadow-md transition cursor-pointer"
            >
              Tukar Tambah Motor
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dana-tunai')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
            >
              Dana Tunai BPKB
            </button>
          </div>
        </div>
      </div>

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
                <span className="text-white font-['Outfit',sans-serif]">Pandu</span>
                <span className="text-blue-400 font-['Outfit',sans-serif] ml-1">Motor</span>
                <span className="text-[10px] font-black text-amber-400 uppercase ml-1.5 tracking-wider">GROUP</span>
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
                <span>0822-7647-7628</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Buka Setiap Hari: 08.00 - 17.00 WIB</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Pandu Motor Group. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="hover:text-slate-400 cursor-pointer">Syarat & Ketentuan</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Kebijakan Privasi</span>
            <span>•</span>
            <span onClick={() => onNavigate('cabang')} className="hover:text-slate-400 cursor-pointer">4 Cabang Showroom</span>
            <span>•</span>
            <span onClick={() => onNavigate('admin')} className="hover:text-amber-400 text-slate-400 font-semibold cursor-pointer">Admin Login</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
