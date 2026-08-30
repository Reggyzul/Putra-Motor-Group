import React, { useState, useEffect } from 'react';
import { Database, Copy, Check, ExternalLink, Activity, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import { pingSupabaseKeepAlive } from '../../lib/supabase';

export const DatabaseSetupGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ success: boolean; timestamp: string; message: string } | null>(null);
  const [lastPingTime, setLastPingTime] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('supabase_last_keepalive');
    if (saved) setLastPingTime(saved);
  }, []);

  const handleCopySql = () => {
    fetch('/supabase_schema.sql')
      .then((res) => res.text())
      .then((sql) => {
        navigator.clipboard.writeText(sql);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {
        alert('Silakan buka file public/supabase_schema.sql untuk menyalin query.');
      });
  };

  const handleTestKeepAlive = async () => {
    setPinging(true);
    const res = await pingSupabaseKeepAlive();
    setPinging(false);
    setPingResult(res);
    setLastPingTime(res.timestamp);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Status Database Supabase & Sistem Anti-Pause 7 Hari
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Monitoring koneksi database, setup tabel Supabase, dan sistem Keep-Alive otomatis
        </p>
      </div>

      {/* 1. KEEP-ALIVE MONITOR CARD */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-white to-blue-50 p-6 rounded-3xl border border-emerald-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                Sistem Keep-Alive 7 Hari: AKTIF
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Supabase Free Tier Dijamin Selalu Aktif
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestKeepAlive}
            disabled={pinging}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${pinging ? 'animate-spin' : ''}`} />
            <span>{pinging ? 'Mengirim Ping...' : 'Test Keep-Alive Sekarang'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-2 border-t border-emerald-100">
          <div className="bg-white/80 p-3 rounded-xl border border-emerald-100">
            <div className="font-bold text-slate-900 mb-0.5">🤖 GitHub Action Auto-Cron:</div>
            <div>Berjalan otomatis setiap hari (00:00 UTC) untuk menjaga Supabase tetap aktif 100%.</div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-emerald-100">
            <div className="font-bold text-slate-900 mb-0.5">⏱️ Ping Terakhir dari Browser:</div>
            <div className="font-mono text-emerald-800">
              {lastPingTime ? new Date(lastPingTime).toLocaleString('id-ID') : 'Belum ada ping'}
            </div>
          </div>
        </div>

        {pingResult && (
          <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
            pingResult.success ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
          }`}>
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{pingResult.message}</span>
          </div>
        )}
      </div>

      {/* 2. SQL SETUP INSTRUCTIONS */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span>Script SQL Inisialisasi Database (Supabase SQL Editor)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Jika tabel belum dibuat di Supabase, cukup salin query di bawah lalu jalankan di Supabase SQL Editor.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopySql}
              className="px-4 py-2 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : '1-Klik Salin Script SQL'}</span>
            </button>

            <a
              href="https://supabase.com/dashboard/project/buvlwphnwaqrcsuravot/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>Buka SQL Editor</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-xs space-y-2 text-slate-700">
          <div className="font-bold text-blue-900">Petunjuk 3 Langkah Mudah:</div>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 font-medium">
            <li>Klik tombol <strong>"1-Klik Salin Script SQL"</strong> di atas.</li>
            <li>Buka menu <strong>SQL Editor</strong> pada Dashboard Supabase Anda.</li>
            <li>Tempel (*Paste*) lalu klik tombol hijau <strong>"Run"</strong>. Selesai! Semua tabel otomatis terbuat beserta data awalnya.</li>
          </ol>
        </div>

      </div>

    </div>
  );
};
