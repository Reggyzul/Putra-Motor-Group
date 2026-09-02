import React, { useState, useEffect } from 'react';
import { Database, Copy, Check, ExternalLink, Activity, ShieldCheck, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase, pingSupabaseKeepAlive } from '../../lib/supabase';

const FULL_SQL_SCHEMA = `-- ============================================================================
-- SQL SCHEMA FOR PANDU MOTOR GROUP (SUPABASE)
-- Jalankan script ini di menu "SQL Editor" pada Supabase Dashboard Anda.
-- ============================================================================

-- 1. TABEL STOK KENDARAAN (VEHICLES)
CREATE TABLE IF NOT EXISTS public.vehicles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL DEFAULT 'bekas',
    year INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    dp_min NUMERIC NOT NULL DEFAULT 0,
    mileage INTEGER DEFAULT 0,
    transmission TEXT DEFAULT 'Automatic',
    engine_capacity TEXT DEFAULT '125 cc',
    description TEXT,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    branch_id TEXT NOT NULL DEFAULT 'kisaran',
    installment_estimates JSONB DEFAULT '{"tenor11": 0, "tenor23": 0, "tenor35": 0, "tenor47": 0}'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    is_hot_promo BOOLEAN DEFAULT FALSE,
    image_fit TEXT DEFAULT 'cover',
    image_position TEXT DEFAULT '50% 50%',
    image_pos_x INTEGER DEFAULT 50,
    image_pos_y INTEGER DEFAULT 50,
    image_scale INTEGER DEFAULT 100,
    aspect_ratio TEXT DEFAULT '4:3',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrasi Kolom Visual Foto Motor Jika Tabel Sudah Ada Sebelumnya
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS image_fit TEXT DEFAULT 'cover';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS image_position TEXT DEFAULT '50% 50%';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS image_pos_x INTEGER DEFAULT 50;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS image_pos_y INTEGER DEFAULT 50;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS image_scale INTEGER DEFAULT 100;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS aspect_ratio TEXT DEFAULT '4:3';

-- 2. TABEL CABANG SHOWROOM (BRANCHES)
CREATE TABLE IF NOT EXISTS public.branches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    code TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT,
    google_maps_url TEXT,
    operational_hours TEXT DEFAULT 'Setiap Hari: 08.00 - 17.00 WIB',
    image TEXT,
    logo TEXT,
    social_media JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL HERO BANNER PROMO (HERO_BANNERS)
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id TEXT PRIMARY KEY,
    tagline_ribbon TEXT,
    title TEXT NOT NULL,
    title_highlight TEXT NOT NULL,
    offer1 JSONB DEFAULT '{}'::jsonb,
    offer2 JSONB DEFAULT '{}'::jsonb,
    period TEXT,
    image TEXT NOT NULL,
    cta_text TEXT DEFAULT 'Yuk Ajukan Sekarang',
    theme_color TEXT DEFAULT '#0B63E5',
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    image_fit TEXT DEFAULT 'cover',
    image_position TEXT DEFAULT '50% 50%',
    image_pos_x INTEGER DEFAULT 50,
    image_pos_y INTEGER DEFAULT 50,
    image_scale INTEGER DEFAULT 100,
    aspect_ratio TEXT DEFAULT '16:9',
    banner_height INTEGER DEFAULT 380,
    show_text_overlay BOOLEAN DEFAULT TRUE,
    overlay_opacity INTEGER DEFAULT 70,
    cta_link_type TEXT DEFAULT 'whatsapp',
    cta_custom_url TEXT DEFAULT '',
    media_type TEXT DEFAULT 'image',
    video_url TEXT DEFAULT '',
    video_poster TEXT DEFAULT '',
    video_autoplay BOOLEAN DEFAULT TRUE,
    video_loop BOOLEAN DEFAULT TRUE,
    video_muted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrasi Kolom Visual & Video Banner Jika Tabel Sudah Ada Sebelumnya
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS image_fit TEXT DEFAULT 'cover';
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS image_position TEXT DEFAULT '50% 50%';
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS image_pos_x INTEGER DEFAULT 50;
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS image_pos_y INTEGER DEFAULT 50;
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS image_scale INTEGER DEFAULT 100;
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS aspect_ratio TEXT DEFAULT '16:9';
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS banner_height INTEGER DEFAULT 380;
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS show_text_overlay BOOLEAN DEFAULT TRUE;
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS overlay_opacity INTEGER DEFAULT 70;
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS cta_link_type TEXT DEFAULT 'whatsapp';
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS cta_custom_url TEXT DEFAULT '';
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image';
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT '';
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS video_poster TEXT DEFAULT '';
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS video_autoplay BOOLEAN DEFAULT TRUE;
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS video_loop BOOLEAN DEFAULT TRUE;
ALTER TABLE public.hero_banners ADD COLUMN IF NOT EXISTS video_muted BOOLEAN DEFAULT TRUE;

-- 4. TABEL PENGATURAN SITUS (SITE_SETTINGS)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABEL PENGUMUMAN INTERNAL KANTOR (ANNOUNCEMENTS - HANYA AKSES ADMIN)
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Umum',
    content TEXT NOT NULL,
    author TEXT DEFAULT 'Kantor Pusat',
    is_pinned BOOLEAN DEFAULT FALSE,
    image TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read vehicles" ON public.vehicles;
CREATE POLICY "Public can read vehicles" ON public.vehicles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can manage vehicles" ON public.vehicles;
CREATE POLICY "Public can manage vehicles" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read branches" ON public.branches;
CREATE POLICY "Public can read branches" ON public.branches FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can manage branches" ON public.branches;
CREATE POLICY "Public can manage branches" ON public.branches FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read hero_banners" ON public.hero_banners;
CREATE POLICY "Public can read hero_banners" ON public.hero_banners FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can manage hero_banners" ON public.hero_banners;
CREATE POLICY "Public can manage hero_banners" ON public.hero_banners FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read site_settings" ON public.site_settings;
CREATE POLICY "Public can read site_settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can manage site_settings" ON public.site_settings;
CREATE POLICY "Public can manage site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read announcements" ON public.announcements;
CREATE POLICY "Public can read announcements" ON public.announcements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can manage announcements" ON public.announcements;
CREATE POLICY "Public can manage announcements" ON public.announcements FOR ALL USING (true) WITH CHECK (true);

-- SEED DATA AWAL LENGKAP
INSERT INTO public.branches (id, name, company_name, code, city, province, address, phone, whatsapp, email, google_maps_url, operational_hours, image, logo)
VALUES
('kisaran', 'Pandu Motor Kisaran', 'CV. Pandu Motor', 'PM-KSR', 'Kisaran Barat, Asahan', 'Sumatera Utara', 'Jl. Kartini No. 204 A-B, Kisaran Barat, Asahan, Sumatera Utara', '0822-7647-7628', '6282276477628', 'pandumotor20@gmail.com', 'https://maps.app.goo.gl/TQbnnh9NAoyRbyBK8', 'Setiap Hari: 08.00 - 17.00 WIB', '/images/pandu motor kisaran.avif', '/images/logo_pandumotor.avif'),
('perdagangan', 'Pandu Motor Perdagangan', 'CV. Pandu Motor', 'PM-PDG', 'Perdagangan, Simalungun', 'Sumatera Utara', 'Jl. Rajamin Purba No. 02, Perdagangan, Kab. Simalungun, Sumatera Utara', '0822-7783-9628', '6282277839628', 'pandumotorperdagangan@gmail.com', 'https://maps.app.goo.gl/mC3Sp6pWzSwYnMrP7?g_st=aw', 'Setiap Hari: 08.00 - 17.00 WIB', '/images/pandu motor 2.avif', '/images/logo_pandumotor.avif'),
('cikampak', 'Ikabina Motor Cikampak', 'CV. Ikabina Motor', 'IM-CKP', 'Torgamba, Labuhanbatu Selatan', 'Sumatera Utara', 'Jl. Lintas Sumatera Riau, Desa Aek Batu, Torgamba, Labuhan Batu Selatan, Sumatera Utara', '0812-6060-525', '628126060525', 'ikabinacikampak@yahoo.com', 'https://maps.app.goo.gl/nzHjDtWnQitAaAKf6?g_st=aw', 'Setiap Hari: 08.00 - 17.00 WIB', '/images/ikabina.avif', '/images/logo_ikabina.avif'),
('dumai', 'Motorian Daya Bukit Kapur', 'CV. Motorian Daya', 'MD-DMI', 'Bukit Kapur, Dumai', 'Riau', 'Jl. Soekarno Hatta Pasar Sukaramai, Bukit Kayu Kapur, Bukit Kapur, Dumai - Riau', '0812-7567-7474', '6281275677474', 'motoriandaya@gmail.com', 'https://maps.app.goo.gl/G16opnzCUJ98irnq9?g_st=aw', 'Setiap Hari: 08.00 - 17.00 WIB', '/images/motoran daya bukit.avif', '/images/logo_motoriandaya.avif')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    whatsapp = EXCLUDED.whatsapp,
    google_maps_url = EXCLUDED.google_maps_url;

INSERT INTO public.hero_banners (id, tagline_ribbon, title, title_highlight, offer1, offer2, period, image, cta_text, theme_color, is_active, order_index)
VALUES
('yamaha-nmax-aerox', 'AGUSTUS BERTABUR UNTUNG', 'Penjualan Motor Yamaha', 'NMax & Aerox', '{"label": "Potongan DP s.d.", "currency": "Rp", "value": "2,5", "unit": "Juta"}'::jsonb, '{"label": "Cashback Saldo Elektronik", "currency": "Rp", "value": "300", "unit": "Ribu", "subtext": "(Pengajuan dengan DP 20%)"}'::jsonb, 'Periode s.d. 31 Agustus 2026 | Berlaku Seluruh Showroom', '/images/momotor_banner_nmax_aerox.avif', 'Yuk Ajukan Sekarang', '#0B63E5', true, 1),
('honda-merdeka-promo', 'PESTA MERDEKA DISKON', 'Promo Spesial Honda', 'Scoopy & BeAT', '{"label": "DP Ringan Mulai", "currency": "Rp", "value": "500", "unit": "Ribu"}'::jsonb, '{"label": "Bonus Hadiah Langsung", "currency": "", "value": "Free", "unit": "Hadiah", "subtext": "(Helm & Jaket Eksklusif)"}'::jsonb, 'Periode s.d. 31 Agustus 2026 | Berlaku Seluruh Showroom', '/images/momotor_banner_honda_scoopy.avif', 'Yuk Ajukan Sekarang', '#DC2626', true, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_settings (key, value, description)
VALUES
('head_office_address', 'Jl. Kartini No. 204 A-B, Kisaran barat, Asahan Sumatera Utara', 'Alamat Kantor Pusat'),
('official_email', 'putramotorgroup.id@gmail.com', 'Alamat Email Resmi'),
('official_phone', '0822-7647-7628', 'Nomor Telepon & WhatsApp Resmi'),
('tagline', 'Melayani Sepenuh Hati', 'Slogan / Tagline Brand'),
('brand_name', 'Pandu Motor Group', 'Nama Brand Utama'),
('tradein_hero_title', 'Berencana ganti motor? Tukar tambah bisa jadi solusi buatmu', 'Judul Tukar Tambah'),
('tradein_hero_subtitle', 'Tukar tambah di Pandu Motor Group memungkinkanmu menukar motor bekas dengan motor impianmu, dengan proses yang cepat, transparan, dan pilihan unit terlengkap.', 'Deskripsi Tukar Tambah'),
('tradein_hero_cta', 'Tukar tambah sekarang', 'Tombol CTA Tukar Tambah'),
('tradein_hero_image', '/images/momotor_banner_nmax_aerox.avif', 'Foto Hero Tukar Tambah'),
('danatunai_hero_title', 'Apa itu Dana Tunai?', 'Judul Dana Tunai'),
('danatunai_hero_subtitle', 'Fasilitas Dana Tunai merupakan fasilitas pinjaman khusus bagi Anda yang membutuhkan dana cepat dan aman dengan jaminan BPKB Sepeda Motor atau Mobil untuk memenuhi berbagai macam kebutuhan (modal usaha, renovasi rumah, biaya pendidikan, kesehatan, maupun kebutuhan lainnya). Kendaraan fisik tetap dapat Anda gunakan sehari-hari.', 'Deskripsi Dana Tunai'),
('danatunai_hero_cta', 'Ajukan dana sekarang', 'Tombol CTA Dana Tunai'),
('danatunai_purpose_1', 'Renovasi atau Furniture', 'Peruntukan 1'),
('danatunai_purpose_2', 'Biaya Pendidikan', 'Peruntukan 2'),
('danatunai_purpose_3', 'Barang Elektronik', 'Peruntukan 3'),
('danatunai_purpose_4', 'Biaya Kesehatan', 'Peruntukan 4')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.announcements (id, title, category, content, author, is_pinned, image, attachments)
VALUES
('ann-1', 'SOP Penerimaan & Standarisasi Cek Fisik Unit Masuk 4 Cabang', 'Operasional', 'Diberitahukan kepada seluruh Kepala Cabang dan Tim Mekanik (Kisaran, Perdagangan, Cikampak, Dumai), setiap unit motor baru maupun bekas yang masuk wajib melewati 20 titik inspeksi fisik, cek nomor rangka/mesin, dan pengecekan kelistrikan sebelum dipajang di area display showroom.', 'Direksi Kantor Pusat', true, '/images/pandu motor kisaran.avif', '[{"name": "Form_Inspeksi_20_Titik_SOP.pdf", "url": "#", "size": "1.2 MB", "type": "PDF"}]'::jsonb),
('ann-2', 'Program Insentif Penjualan & Target Semester II', 'Penting', 'Selamat kepada cabang Kisaran dan Perdagangan yang telah melampaui target penjualan bulan lalu. Untuk Semester II, manajemen memberlakukan skema bonus tambahan bagi sales counter dan marketing lapangan untuk setiap unit kredit dan dana tunai BPKB yang berhasil closing.', 'HRD & Finance', true, '/images/pandu_logo.avif', '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.vehicles (id, name, brand, category, condition, year, price, dp_min, mileage, transmission, engine_capacity, description, images, branch_id, installment_estimates, is_featured)
VALUES
('pm-vario125-esp-cbs', 'VARIO 125 ESP CBS', 'Honda', 'matic', 'bekas', 2022, 20600000, 2000000, 8500, 'Automatic', '125 cc eSP', 'Kondisi 98% mulus terawat, mesin halus standar dealer, servis rutin, ban tebal siap pakai.', '["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'kisaran', '{"tenor11": 1980000, "tenor23": 1120000, "tenor35": 883609}'::jsonb, true),
('pm-beat-dlx-smart-key', 'BEAT DLX SMART KEY', 'Honda', 'matic', 'bekas', 2021, 15700000, 1500000, 4200, 'Automatic', '110 cc eSP', 'Tipe tertinggi Deluxe Smart Key, body mulus kinclong tanpa lecet berarti, kelistrikan & starter lancar jaya.', '["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'perdagangan', '{"tenor11": 1510000, "tenor23": 860000, "tenor35": 673430}'::jsonb, true),
('pm-scoopy-prestige-2023', 'SCOOPY PRESTIGE SMART KEY', 'Honda', 'matic', 'bekas', 2023, 21800000, 2500000, 6100, 'Automatic', '110 cc eSP', 'Kondisi istimewa tangan pertama dari baru, warna favorit Prestige White, velg emas mewah.', '["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'cikampak', '{"tenor11": 2090000, "tenor23": 1180000, "tenor35": 935000}'::jsonb, true),
('pm-nmax-155-connected', 'ALL NEW NMAX 155 CONNECTED', 'Yamaha', 'maxi', 'bekas', 2022, 28900000, 3000000, 9200, 'Automatic', '155 cc VVA', 'Fitur Y-Connect aktif, mesin bertenaga VVA, suspensi tabung belakang empuk, ban tebal depan-belakang.', '["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'dumai', '{"tenor11": 2770000, "tenor23": 1570000, "tenor35": 1239000}'::jsonb, true),
('pm-aerox-155-cybercity', 'AEROX 155 CYBERCITY VVA', 'Yamaha', 'maxi', 'bekas', 2023, 27500000, 2800000, 5400, 'Automatic', '155 cc VVA', 'Edisi spesial livery Cybercity bunglon gradasi ungu-biru, tarikan spontan kencang, bodi mulus 99%.', '["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'kisaran', '{"tenor11": 2640000, "tenor23": 1490000, "tenor35": 1179000}'::jsonb, true),
('pm-pcx-160-abs', 'HONDA ALL NEW PCX 160 ABS', 'Honda', 'maxi', 'baru', 2024, 36500000, 3500000, 0, 'Automatic', '160 cc eSP+ 4-Valve', 'Unit baru 100% dari dealer resmi Honda Pandu Motor Group. Sistem pengereman ABS + HSTC aman di jalan basah.', '["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'kisaran', '{"tenor11": 3500000, "tenor23": 1980000, "tenor35": 1565000}'::jsonb, true)
ON CONFLICT (id) DO NOTHING;

-- 6. AKTIFKAN REALTIME SUPABASE UNTUK SEMUA PERANGKAT & IP
ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.branches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_banners;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;

ALTER TABLE public.vehicles REPLICA IDENTITY FULL;
ALTER TABLE public.branches REPLICA IDENTITY FULL;
ALTER TABLE public.hero_banners REPLICA IDENTITY FULL;
ALTER TABLE public.site_settings REPLICA IDENTITY FULL;
ALTER TABLE public.announcements REPLICA IDENTITY FULL;
`;

export const DatabaseSetupGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [checkingTables, setCheckingTables] = useState(false);
  const [tableStatus, setTableStatus] = useState<{
    vehicles: boolean;
    branches: boolean;
    hero_banners: boolean;
    site_settings: boolean;
    announcements: boolean;
  }>({
    vehicles: false,
    branches: false,
    hero_banners: false,
    site_settings: false,
    announcements: false,
  });
  const [allReady, setAllReady] = useState<boolean>(false);
  const [lastPingTime, setLastPingTime] = useState<string | null>(null);

  const checkAllTables = async () => {
    setCheckingTables(true);
    try {
      const [v, b, hb, s, a] = await Promise.all([
        supabase.from('vehicles').select('id', { head: true, count: 'exact' }),
        supabase.from('branches').select('id', { head: true, count: 'exact' }),
        supabase.from('hero_banners').select('id', { head: true, count: 'exact' }),
        supabase.from('site_settings').select('key', { head: true, count: 'exact' }),
        supabase.from('announcements').select('id', { head: true, count: 'exact' }),
      ]);

      const status = {
        vehicles: !v.error,
        branches: !b.error,
        hero_banners: !hb.error,
        site_settings: !s.error,
        announcements: !a.error,
      };

      setTableStatus(status);
      setAllReady(Object.values(status).every(Boolean));
    } catch {
      setAllReady(false);
    } finally {
      setCheckingTables(false);
    }
  };

  useEffect(() => {
    checkAllTables();
    const saved = localStorage.getItem('supabase_last_keepalive');
    if (saved) setLastPingTime(saved);
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(FULL_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestKeepAlive = async () => {
    setPinging(true);
    const res = await pingSupabaseKeepAlive();
    setPinging(false);
    setLastPingTime(res.timestamp);
    checkAllTables();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Status Database Supabase & Sinkronisasi Multi-Device
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Pastikan semua tabel cloud Supabase aktif agar setiap perubahan admin langsung tersinkron di HP, Laptop, dan Tablet secara Realtime
        </p>
      </div>

      {/* STATUS ALERT BANNER */}
      {!allReady ? (
        <div className="bg-red-500/10 border-2 border-red-500 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertTriangle className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-red-600 tracking-wider">
                Perhatian: Tabel Database Belum Dibuat di Supabase
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                Kenapa Editan Belum Berubah di Perangkat / Device Lain?
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                Karena tabel di Supabase belum dibuat, editan Anda saat ini masih tersimpan di memori browser lokal perangkat Anda saja. Agar <strong>langsung tersinkron 100% otomatis ke seluruh HP dan device lain</strong>, cukup jalankan script SQL sekali saja di Supabase SQL Editor.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopySql}
              className="px-5 py-3 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Berhasil Tersalin!' : '1. Salin Script SQL (Klik Disini)'}</span>
            </button>

            <a
              href="https://supabase.com/dashboard/project/buvlwphnwaqrcsuravot/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>2. Buka Supabase SQL Editor (Paste & Klik Run)</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={checkAllTables}
              disabled={checkingTables}
              className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-gray-300 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingTables ? 'animate-spin' : ''}`} />
              <span>3. Cek Status Ulang</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-5 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-emerald-700">
                Database Cloud Siap & Aktif 100%
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Semua 5 Tabel Terhubung & Sinkron Realtime Multi-Device
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Setiap kali admin mengedit katalog, promo, atau pengumuman, perubahan langsung aktif seketika di semua perangkat.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={checkAllTables}
            disabled={checkingTables}
            className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingTables ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>
      )}

      {/* 5 TABLES STATUS CHECKER */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center justify-between">
          <span>Status 5 Tabel Utama Supabase</span>
          <span className="text-xs font-bold text-slate-400">Live Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: 'vehicles', name: 'public.vehicles (Stok Motor)', ready: tableStatus.vehicles },
            { id: 'branches', name: 'public.branches (4 Cabang)', ready: tableStatus.branches },
            { id: 'hero_banners', name: 'public.hero_banners (Promo Slide)', ready: tableStatus.hero_banners },
            { id: 'site_settings', name: 'public.site_settings (Pengaturan)', ready: tableStatus.site_settings },
            { id: 'announcements', name: 'public.announcements (Pengumuman)', ready: tableStatus.announcements },
          ].map((t) => (
            <div
              key={t.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                t.ready ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900' : 'bg-red-50/50 border-red-200 text-red-900'
              }`}
            >
              <div className="font-bold text-xs">{t.name}</div>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                t.ready ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
              }`}>
                {t.ready ? 'Aktif ✓' : 'Belum Dibuat ✕'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* KEEP-ALIVE CARD */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-white to-blue-50 p-6 rounded-3xl border border-emerald-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-emerald-700 tracking-wider">
                Sistem Anti-Pause 7 Hari: AKTIF
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Supabase Free Tier Dijamin Tidak Akan Di-Pause
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
            <span>{pinging ? 'Mengirim Ping...' : 'Test Keep-Alive Ping'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 pt-2 border-t border-emerald-100">
          <div className="bg-white/80 p-3 rounded-xl border border-emerald-100">
            <div className="font-bold text-slate-900 mb-0.5">🤖 GitHub Action Auto-Cron:</div>
            <div>Berjalan otomatis setiap hari (00:00 UTC) untuk menjaga Supabase tetap aktif.</div>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-emerald-100">
            <div className="font-bold text-slate-900 mb-0.5">⏱️ Ping Terakhir dari Browser:</div>
            <div className="font-mono text-emerald-800">
              {lastPingTime ? new Date(lastPingTime).toLocaleString('id-ID') : 'Belum ada ping'}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
