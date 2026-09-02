import React, { useState } from 'react';
import { 
  MapPin, 
  PhoneCall, 
  Clock, 
  Send, 
  Building2, 
  Navigation, 
  Wrench, 
  ShieldCheck, 
  Award,
  Coffee
} from 'lucide-react';
import { Branch } from '../types';
import { BRANCHES_DATA, BRANCH_MAPS_URLS, BRANCH_SOCIAL_LINKS } from '../data/branches';
import { buildWhatsAppLink } from '../utils/formatters';

interface BranchShowcaseProps {
  selectedBranch: Branch;
  onSelectBranch: (branch: Branch) => void;
  branches?: Branch[];
}

export const BranchShowcase: React.FC<BranchShowcaseProps> = ({
  selectedBranch,
  onSelectBranch,
  branches = BRANCHES_DATA,
}) => {
  const [activeTabBranchId, setActiveTabBranchId] = useState<string>(selectedBranch.id);

  const activeBranch = branches.find((b) => b.id === activeTabBranchId) || selectedBranch;

  const facilities = [
    { icon: Award, label: 'Showroom Display Bersih & Lengkap' },
    { icon: ShieldCheck, label: 'Layanan Beli Motor & Dana Tunai BPKB' },
    { icon: Wrench, label: 'Bengkel Cek Fisik & Kelistrikan' },
    { icon: Coffee, label: 'Ruang Tunggu Nyaman' },
  ];

  const waBranchUrl = buildWhatsAppLink(
    activeBranch.whatsapp,
    `Halo ${activeBranch.name} (Pandu Motor Group), saya ingin datang ke showroom dan konsultasi seputar unit motor / tukar tambah / dana tunai BPKB.`
  );

  return (
    <section id="cabang" className="py-10 sm:py-14 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0B63E5] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            Jaringan Showroom Resmi
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            4 Cabang Showroom Pandu Motor Group
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Kunjungi showroom resmi terdekat kami untuk cek unit motor langsung, konsultasi tukar tambah, maupun pinjaman dana tunai BPKB.
          </p>
        </div>

        {/* Tab Buttons for Branches (2 cols on mobile, 4 cols on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-3 mb-5 sm:mb-8">
          {branches.map((branch) => {
            const isActive = activeTabBranchId === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => {
                  setActiveTabBranchId(branch.id);
                  onSelectBranch(branch);
                }}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all cursor-pointer active:scale-98 ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="text-[10px] sm:text-xs font-bold truncate">{branch.city.split(',')[0]}</span>
                </div>
                <div className="text-xs sm:text-sm font-extrabold line-clamp-1">{branch.name}</div>
              </button>
            );
          })}
        </div>

        {/* Active Branch Highlight Card with Full 100% Uncropped Photo */}
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
            
            {/* Branch Image (100% Full Uncropped View) */}
            <div className="lg:col-span-6 relative rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-2 sm:p-4">
              <img
                src={activeBranch.image}
                alt={activeBranch.name}
                className="w-full h-auto max-h-[260px] sm:max-h-[420px] object-contain rounded-lg sm:rounded-xl"
              />
              <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black shadow-md border border-slate-800">
                {activeBranch.code}
              </div>
            </div>

            {/* Branch Info & Contacts */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                {activeBranch.logo && (
                  <img
                    src={activeBranch.logo}
                    alt={activeBranch.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain border border-slate-200 bg-white p-1 shadow-2xs shrink-0"
                  />
                )}
                <div>
                  <span className="text-[10px] sm:text-xs font-bold text-amber-600 uppercase tracking-wider">
                    {activeBranch.companyName}
                  </span>
                  <h2 className="text-base sm:text-2xl font-black text-slate-900 mt-0.5">
                    {activeBranch.name}
                  </h2>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium text-xs sm:text-sm">{activeBranch.address}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-xs sm:text-sm">{activeBranch.operationalHours}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-bold text-slate-900 text-xs sm:text-sm">WhatsApp / Telp: {activeBranch.phone}</span>
                </div>
              </div>

              {/* Fasilitas Grid */}
              <div className="pt-2 sm:pt-3 border-t border-slate-100">
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase mb-2">
                  Fasilitas &amp; Layanan Cabang:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                  {facilities.map((fac, idx) => {
                    const Icon = fac.icon;
                    return (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80 shadow-2xs">
                        <Icon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span className="truncate">{fac.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Media Sosial Resmi Cabang */}
              {(() => {
                const defaultSocial = BRANCH_SOCIAL_LINKS[activeBranch.id] || {};
                const sm = activeBranch.socialMedia || {};

                const fbHandle = sm.facebook || defaultSocial.facebook?.handle;
                const fbUrl = sm.facebookUrl || (sm.facebook && sm.facebook.startsWith('http') ? sm.facebook : (sm.facebook ? `https://www.facebook.com/search/top?q=${encodeURIComponent(sm.facebook)}` : defaultSocial.facebook?.url));

                const igHandle = sm.instagram || defaultSocial.instagram?.handle;
                const igUrl = sm.instagramUrl || (sm.instagram && sm.instagram.startsWith('http') ? sm.instagram : (sm.instagram ? `https://www.instagram.com/${sm.instagram.replace(/^@/, '')}` : defaultSocial.instagram?.url));

                const ttHandle = sm.tiktok || defaultSocial.tiktok?.handle;
                const ttUrl = sm.tiktokUrl || (sm.tiktok && sm.tiktok.startsWith('http') ? sm.tiktok : (sm.tiktok ? `https://www.tiktok.com/@${sm.tiktok.replace(/^@/, '')}` : defaultSocial.tiktok?.url));

                const hasSocials = (fbHandle && fbUrl) || (igHandle && igUrl) || (ttHandle && ttUrl);
                if (!hasSocials) return null;

                return (
                  <div className="pt-2 sm:pt-3 border-t border-slate-100">
                    <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase mb-2 flex items-center justify-between">
                      <span>Media Sosial Resmi Cabang:</span>
                      <span className="text-[10px] font-semibold text-slate-500">Kunjungi Profil</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Facebook */}
                      {fbHandle && fbUrl && (
                        <a
                          href={fbUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 text-xs font-semibold transition-all shadow-2xs group active:scale-95 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 fill-current text-blue-600 group-hover:text-white shrink-0" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          <span>{fbHandle}</span>
                        </a>
                      )}

                      {/* Instagram */}
                      {igHandle && igUrl && (
                        <a
                          href={igUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 text-xs font-semibold transition-all shadow-2xs group active:scale-95 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 fill-current text-rose-500 group-hover:text-white shrink-0" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          <span>{igHandle}</span>
                        </a>
                      )}

                      {/* TikTok */}
                      {ttHandle && ttUrl && (
                        <a
                          href={ttUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 text-xs font-semibold transition-all shadow-2xs group active:scale-95 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 fill-current text-slate-900 group-hover:text-white shrink-0" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                          </svg>
                          <span>{ttHandle}</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <a
                  href={waBranchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 sm:py-3 px-3.5 sm:px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition flex items-center justify-center gap-2 active:scale-95 text-center cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                  <span>Chat WhatsApp Cabang</span>
                </a>

                <a
                  href={BRANCH_MAPS_URLS[activeBranch.id] || activeBranch.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 sm:py-3 px-3.5 sm:px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 active:scale-95 text-center shadow-2xs cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                  <span>Petunjuk Arah (Maps)</span>
                </a>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* Pos Penjualan & Titik Layanan Resmi Cabang (Format: Nama Pos, WA, Maps)  */}
          {/* ========================================================================= */}
          {activeBranch.salesPosts && activeBranch.salesPosts.length > 0 && (
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-4 sm:mb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>Jaringan Pos Penjualan Resmi</span>
                  </div>
                  <h3 className="text-sm sm:text-lg font-black text-slate-900 mt-0.5">
                    Pos Penjualan &amp; Titik Layanan {activeBranch.name}
                  </h3>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500">
                  Konsultasi motor, tukar tambah &amp; dana tunai BPKB di pos terdekat
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {activeBranch.salesPosts.map((pos, idx) => {
                  const waUrl = buildWhatsAppLink(
                    pos.whatsapp || pos.phone,
                    `Halo ${pos.name} (${activeBranch.name} - Pandu Motor Group), saya ingin konsultasi seputar unit motor / tukar tambah / dana tunai BPKB.`
                  );

                  return (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-slate-300 transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between gap-3 group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Pos Resmi PMG
                            </span>
                          </div>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                            {activeBranch.code}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                          {pos.name}
                        </h4>

                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mt-1">
                          <PhoneCall className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>HP/WA: {pos.phone}</span>
                        </div>
                      </div>

                      {/* Action Links: WhatsApp & Google Maps */}
                      <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-200/80">
                        {/* Logo WA yang direct langsung ke nomor WhatsApp */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer text-center"
                          title={`Hubungi WhatsApp ${pos.name}`}
                        >
                          {/* Official WhatsApp SVG Logo */}
                          <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                          </svg>
                          <span>WhatsApp</span>
                        </a>

                        {/* Logo Maps yang diarahkan ke Google Map */}
                        <a
                          href={pos.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer text-center"
                          title={`Buka Google Maps ${pos.name}`}
                        >
                          {/* Google Maps Pin Icon */}
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>Google Maps</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
