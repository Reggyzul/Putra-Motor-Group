import React, { useState } from 'react';
import { 
  Bike, 
  BadgeDollarSign, 
  ArrowLeftRight, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles,
  PhoneCall,
  Building2,
  Send
} from 'lucide-react';
import { Branch } from '../types';
import { buildWhatsAppLink } from '../utils/formatters';

interface SeoContentSectionProps {
  onNavigate: (sectionId: string) => void;
  selectedBranch: Branch;
}

export const SeoContentSection: React.FC<SeoContentSectionProps> = ({
  onNavigate,
  selectedBranch,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'Bagaimana cara pengajuan pinjaman Dana Tunai jaminan BPKB di Pandu Motor Group?',
      a: 'Pengajuannya sangat cepat dan tanpa ribet. Anda cukup menyiapkan KTP, Kartu Keluarga (KK), serta BPKB dan STNK asli motor. Anda bisa datang langsung ke showroom Pandu Motor terdekat di Kisaran, Perdagangan, Cikampak, atau Dumai, atau ajukan secara instan via WhatsApp di website kami. Dana dapat cair dalam waktu 1 hari kerja setelah verifikasi berkas, dan fisik sepeda motor tetap aman dapat Anda gunakan untuk aktivitas sehari-hari.'
    },
    {
      q: 'Apakah bisa tukar tambah (trade-in) motor lama dengan motor baru atau motor bekas?',
      a: 'Sangat bisa! Pandu Motor Group menerima tukar tambah segala merek motor (Honda, Yamaha, Suzuki, Kawasaki) dalam kondisi apapun. Tim kami akan melakukan estimasi dan inspeksi profesional dengan harga pasar terbaik. Nilai taksiran motor lama Anda bisa langsung dijadikan uang muka (DP) atau pemotong harga untuk membawa pulang motor impian Anda.'
    },
    {
      q: 'Apakah semua unit motor bekas di Pandu Motor Group terjamin dan bergaransi?',
      a: 'Ya, 100% bergaransi dan terpercaya. Setiap motor bekas yang masuk ke showroom telah melewati inspeksi teknis menyeluruh (multi-point inspection), dipastikan bukan bekas kecelakaan berat atau banjir, kilometer asli tanpa manipulasi odometer, serta kelengkapan surat-surat (BPKB & STNK) dijamin asli dan sah terverifikasi Samsat.'
    },
    {
      q: 'Di mana saja cakupan wilayah layanan Pandu Motor Group di Sumatera Utara dan Riau?',
      a: 'Jaringan kami mencakup 4 Showroom Resmi di Kisaran (Asahan), Perdagangan (Simalungun), Cikampak (Labuhanbatu Selatan), dan Bukit Kapur (Dumai, Riau), serta didukung oleh 11 Pos Penjualan Resmi di Aek Kanopan, Petatal, Air Batu, Serbelawan, Simpang Kopi, Mandoge, Tanah Jawa, Mahato, Aek Nabara, Teluk Panji, dan Lubuk Gaung.'
    },
    {
      q: 'Apakah tersedia opsi kredit dengan DP murah dan cicilan ringan?',
      a: 'Tentu saja. Kami bekerjasama dengan lembaga pembiayaan resmi (leasing) terkemuka yang terdaftar dan diawasi oleh OJK. Kami menawarkan berbagai program promo DP ringan, tenor fleksibel hingga 35 bulan, serta bunga cicilan yang sangat kompetitif.'
    }
  ];

  const regionalAreas = [
    { region: 'Kabupaten Asahan', towns: ['Kisaran (Pusat)', 'Air Batu', 'Bandar Pasir Mandoge', 'Simpang Empat'] },
    { region: 'Kabupaten Simalungun', towns: ['Perdagangan', 'Serbelawan', 'Tanah Jawa', 'Bandar Huluan'] },
    { region: 'Kabupaten Batu Bara', towns: ['Petatal', 'Simpang Kopi', 'Lima Puluh', 'Sei Suka'] },
    { region: 'Labuhanbatu Raya', towns: ['Aek Kanopan (Labura)', 'Cikampak (Labusel)', 'Aek Nabara', 'Teluk Panji', 'Rantauprapat'] },
    { region: 'Kota Dumai & Riau', towns: ['Bukit Kapur', 'Lubuk Gaung', 'Sungai Sembilan', 'Mahato (Rokan Hulu)'] },
  ];

  const handleConsultWa = (topic: string) => {
    const waUrl = buildWhatsAppLink(
      selectedBranch.whatsapp,
      `Halo ${selectedBranch.name} (Pandu Motor Group), saya ingin konsultasi mengenai layanan ${topic}. Mohon informasi promo dan persyaratannya. Terima kasih!`
    );
    window.open(waUrl, '_blank');
  };

  return (
    <section className="w-full bg-slate-50 py-12 sm:py-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title & Intro (Rich Keywords for Search Engines) */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Solusi Otomotif & Finansial Terpercaya Sumut</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Pusat Jual Beli Motor, Dana Tunai BPKB &amp; Tukar Tambah Terpercaya di Sumatera Utara
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Pandu Motor Group menghadirkan ekosistem terlengkap untuk kebutuhan kendaraan roda dua Anda: mulai dari jual beli sepeda motor baru dan bekas berkualitas, fasilitas pinjaman dana tunai jaminan BPKB resmi cair cepat, hingga program tukar tambah dengan taksiran harga tertinggi di Sumatera Utara dan Riau.
          </p>
        </div>

        {/* 3 Pillar Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          
          {/* Card 1: Jual Beli Motor */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Jual Beli Motor Baru &amp; Bekas
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Koleksi terlengkap berbagai merek ternama (Honda, Yamaha, Kawasaki, Suzuki, Vespa). Unit motor bekas melewati inspeksi ketat bebas oplosan, odometer asli, serta garansi mesin resmi showroom.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Surat BPKB &amp; STNK lengkap dan sah Samsat</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pilihan bayar tunai (Cash) atau Kredit DP Murah</span>
                </li>
              </ul>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('katalog')}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer text-center"
              >
                Lihat Katalog Motor
              </button>
            </div>
          </div>

          {/* Card 2: Dana Tunai BPKB */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BadgeDollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Dana Tunai Jaminan BPKB
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Solusi pinjaman dana tunai cepat untuk kebutuhan modal usaha, renovasi rumah, pendidikan, atau kesehatan dengan jaminan BPKB motor atau mobil. Proses mudah, bunga ringan, dan motor tetap Anda pakai.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pencairan cepat dalam 1 hari kerja</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Jaminan BPKB resmi tersimpan aman</span>
                </li>
              </ul>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('dana-tunai')}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer text-center"
              >
                Ajukan Dana Tunai
              </button>
            </div>
          </div>

          {/* Card 3: Tukar Tambah (Trade-In) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Tukar Tambah Motor (Trade-In)
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Tukar motor lama Anda dari merk dan tahun berapa pun dengan motor impian terbaru. Dapatkan taksiran harga tertinggi yang transparan dan proses verifikasi cepat langsung di showroom kami.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Taksiran harga wajar &amp; kompetitif</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nilai motor lama langsung potong DP</span>
                </li>
              </ul>
            </div>
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('tukar-tambah')}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs transition cursor-pointer text-center"
              >
                Simulasi Tukar Tambah
              </button>
            </div>
          </div>

        </div>

        {/* Local Area Coverage Badges (Crucial for Local SEO in Sumut & Riau) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                <span>Jangkauan Wilayah Layanan Pandu Motor Group</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Melayani nasabah dan pembeli sepeda motor di seluruh penjuru Sumatera Utara dan Riau
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('cabang')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Lihat 4 Showroom &amp; 11 Pos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            {regionalAreas.map((area, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                <span className="font-extrabold text-slate-900 block text-xs border-b border-slate-200 pb-1">
                  {area.region}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {area.towns.map((town, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] text-slate-700 font-medium"
                    >
                      {town}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Accordion (For Google SERP Rich Snippet / Accordion) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Tanya Jawab Seputar Layanan</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pertanyaan Sering Diajukan (FAQ)
            </h3>
            <p className="text-xs text-slate-500">
              Temukan jawaban cepat seputar jual beli motor, pengajuan dana tunai BPKB, dan mekanisme tukar tambah
            </p>
          </div>

          <div className="divide-y divide-slate-200 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="mt-2.5 text-xs text-slate-600 leading-relaxed animate-in fade-in duration-200 pr-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Fast Contact Banner */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-blue-50 to-slate-50 p-4 rounded-2xl">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold text-slate-900 block">Masih memiliki pertanyaan lain?</span>
              <span className="text-[11px] text-slate-500">Konsultasikan kebutuhan motor atau dana tunai Anda langsung dengan tim resmi kami.</span>
            </div>
            <button
              type="button"
              onClick={() => handleConsultWa('Jual Beli Motor dan Dana Tunai')}
              className="px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Hubungi CS WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
