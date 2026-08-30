import React, { useState } from 'react';
import { Send, MapPin, X } from 'lucide-react';
import { Branch } from '../types';
import { BRANCHES_DATA } from '../data/branches';
import { buildWhatsAppLink } from '../utils/formatters';

interface FloatingWhatsAppProps {
  selectedBranch: Branch;
  onSelectBranch: (branch: Branch) => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  selectedBranch,
  onSelectBranch,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Branch Selector Popup */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 text-left animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                Chat CS Pandu Motor Group
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 mb-3">
            Pilih cabang showroom terdekat untuk respon cepat via WhatsApp:
          </p>

          <div className="space-y-2">
            {BRANCHES_DATA.map((branch) => {
              const waUrl = buildWhatsAppLink(
                branch.whatsapp,
                `Halo ${branch.name} (Pandu Motor Group), saya ingin konsultasi seputar unit motor / tukar tambah / dana tunai BPKB. Terima kasih!`
              );

              return (
                <a
                  key={branch.id}
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onSelectBranch(branch)}
                  className={`w-full p-2.5 rounded-xl border transition flex items-center justify-between group active:scale-98 ${
                    selectedBranch.id === branch.id
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#0B63E5]" />
                      <span>{branch.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {branch.phone} • {branch.city.split(',')[0]}
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#25D366] text-white group-hover:scale-110 transition shadow-2xs">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-3 pt-2 text-[10px] text-slate-400 text-center border-t border-gray-100">
            Pandu Motor Group • “Melayani Sepenuh Hati”
          </div>
        </div>
      )}

      {/* Main WhatsApp Circular Green Button */}
      <button
        id="floating-wa-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat WhatsApp"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer relative group border-2 border-white"
      >
        {/* WhatsApp SVG Icon */}
        <svg 
          className="w-6 h-6 sm:w-7 sm:h-7 fill-white" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.301-.778.98-.954 1.181-.176.2-.352.226-.653.075-.301-.15-1.272-.469-2.423-1.497-.896-.8-1.501-1.788-1.677-2.089-.176-.301-.019-.464.132-.614.136-.135.301-.352.452-.528.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.635-.929-2.239-.245-.589-.494-.509-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.055 1.03-1.055 2.512 1.08 2.914 1.23 3.115c.15.2 2.125 3.245 5.148 4.552.719.311 1.281.497 1.719.636.723.23 1.381.197 1.901.12.579-.087 1.78-.728 2.03-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351zM12.042 21.808h-.008a9.78 9.78 0 0 1-4.99-1.365l-.358-.213-3.71.973.99-3.616-.233-.371A9.773 9.773 0 0 1 2.25 12.042C2.25 6.634 6.643 2.25 12.052 2.25c2.617 0 5.076 1.02 6.927 2.871a9.743 9.743 0 0 1 2.871 6.921c0 5.409-4.4 9.766-9.808 9.766zm7.808-17.618A11.026 11.026 0 0 0 12.052 1C5.952 1 1 5.952 1 12.042c0 1.948.508 3.85 1.474 5.524L1 23l5.603-1.47a11.023 11.023 0 0 0 5.44 1.428h.009c6.1 0 11.052-4.952 11.052-11.042 0-2.951-1.15-5.725-3.254-7.726z" />
        </svg>

        {/* Online Indicator Badge */}
        <span className="absolute top-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-white rounded-full flex items-center justify-center p-0.5 shadow-xs">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full absolute" />
        </span>
      </button>

    </div>
  );
};
