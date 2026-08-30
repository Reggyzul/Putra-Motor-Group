import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Send } from 'lucide-react';
import { FAQ_DATA } from '../data/testimonials';
import { Branch } from '../types';
import { buildWhatsAppLink } from '../utils/formatters';

interface FaqSectionProps {
  selectedBranch: Branch;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ selectedBranch }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const waHelpUrl = buildWhatsAppLink(
    selectedBranch.whatsapp,
    `Halo Pandu Motor Group (${selectedBranch.name}), saya ingin konsultasi dan menanyakan beberapa hal terkait pembelian motor / kredit / dana tunai BPKB. Terima kasih!`
  );

  return (
    <section className="py-14 bg-slate-50 border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0B63E5] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            Tanya Jawab (FAQ)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Informasi seputar legalitas unit, syarat pengajuan kredit, dan garansi mesin Pandu Motor Group.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 text-left">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-gray-200 overflow-hidden transition shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:bg-slate-50 transition cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-800">
                    {item.q}
                  </span>
                  <div className="p-1 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-gray-100 bg-slate-50/50 animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Help CTA */}
        <div className="mt-8 p-6 rounded-2xl bg-white border border-gray-200 text-center space-y-3 shadow-xs">
          <h4 className="text-base font-bold text-slate-900">
            Masih ada pertanyaan lain yang belum terjawab?
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Tim customer support Pandu Motor Group siap membantu menjawab pertanyaan Anda dengan ramah dan cepat.
          </p>
          <a
            href={waHelpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B63E5] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Chat WhatsApp Customer Care</span>
          </a>
        </div>

      </div>
    </section>
  );
};
