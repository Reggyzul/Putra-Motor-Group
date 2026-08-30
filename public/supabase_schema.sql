-- ============================================================================
-- SQL SCHEMA FOR PANDU MOTOR GROUP (SUPABASE)
-- Jalankan script ini di menu "SQL Editor" pada Supabase Dashboard Anda.
-- ============================================================================

-- 1. TABEL STOK KENDARAAN (VEHICLES)
CREATE TABLE IF NOT EXISTS public.vehicles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL DEFAULT 'bekas', -- 'baru' / 'bekas'
    year INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    dp_min NUMERIC NOT NULL DEFAULT 0,
    mileage INTEGER DEFAULT 0,
    transmission TEXT DEFAULT 'Automatic',
    engine_capacity TEXT DEFAULT '125 cc',
    description TEXT,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    branch_id TEXT NOT NULL DEFAULT 'kisaran',
    installment_estimates JSONB DEFAULT '{"tenor11": 0, "tenor23": 0, "tenor35": 0}'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    is_hot_promo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Pengunjung umum bisa melihat (SELECT), Admin login bisa mengubah (ALL)
-- ============================================================================

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Policy: Publik bisa membaca data
DROP POLICY IF EXISTS "Public can read vehicles" ON public.vehicles;
CREATE POLICY "Public can read vehicles" ON public.vehicles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read branches" ON public.branches;
CREATE POLICY "Public can read branches" ON public.branches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read hero_banners" ON public.hero_banners;
CREATE POLICY "Public can read hero_banners" ON public.hero_banners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read site_settings" ON public.site_settings;
CREATE POLICY "Public can read site_settings" ON public.site_settings FOR SELECT USING (true);

-- Policy: Admin (Authenticated User) bisa melakukan INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "Authenticated users can manage vehicles" ON public.vehicles;
CREATE POLICY "Authenticated users can manage vehicles" ON public.vehicles FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage branches" ON public.branches;
CREATE POLICY "Authenticated users can manage branches" ON public.branches FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage hero_banners" ON public.hero_banners;
CREATE POLICY "Authenticated users can manage hero_banners" ON public.hero_banners FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage site_settings" ON public.site_settings;
CREATE POLICY "Authenticated users can manage site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can manage announcements" ON public.announcements;
CREATE POLICY "Authenticated users can manage announcements" ON public.announcements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================================
-- SEED INITIAL DATA (DATA AWAL LENGKAP PANDU MOTOR GROUP)
-- ============================================================================

-- Seed Cabang
INSERT INTO public.branches (id, name, company_name, code, city, province, address, phone, whatsapp, email, google_maps_url, operational_hours, image, logo)
VALUES
('kisaran', 'Pandu Motor Kisaran', 'CV. Pandu Motor', 'PM-KSR', 'Kisaran Barat, Asahan', 'Sumatera Utara', 'Jl. Kartini No. 204 A-B, Kisaran Barat, Asahan, Sumatera Utara', '0822-7647-7628', '6282276477628', 'pandumotor20@gmail.com', 'https://maps.google.com/?q=Jl.+Kartini+No.+204+A-B+Kisaran+Barat+Asahan', 'Setiap Hari: 08.00 - 17.00 WIB', '/images/pandu motor kisaran.avif', '/images/logo_pandumotor.avif'),
('perdagangan', 'Pandu Motor Perdagangan', 'CV. Pandu Motor', 'PM-PDG', 'Perdagangan, Simalungun', 'Sumatera Utara', 'Jl. Rajamin Purba No. 02, Perdagangan, Kab. Simalungun, Sumatera Utara', '0822-7647-7628', '6282276477628', 'pandumotorperdagangan@gmail.com', 'https://maps.google.com/?q=Jl.+Rajamin+Purba+No.+02+Perdagangan+Simalungun', 'Setiap Hari: 08.00 - 17.00 WIB', '/images/pandu motor 2.avif', '/images/logo_pandumotor.avif'),
('cikampak', 'Ikabina Motor Cikampak', 'CV. Ikabina Motor', 'IM-CKP', 'Torgamba, Labuhanbatu Selatan', 'Sumatera Utara', 'Jl. Lintas Sumatera Riau, Desa Aek Batu, Torgamba, Labuhan Batu Selatan, Sumatera Utara', '0822-7647-7628', '6282276477628', 'ikabinacikampak@yahoo.com', 'https://maps.google.com/?q=Desa+Aek+Batu+Torgamba+Labuhan+Batu+Selatan', 'Setiap Hari: 08.00 - 17.00 WIB', '/images/ikabina.avif', '/images/logo_ikabina.avif'),
('dumai', 'Motorian Daya Bukit Kapur', 'CV. Motorian Daya', 'MD-DMI', 'Bukit Kapur, Dumai', 'Riau', 'Jl. Soekarno Hatta Pasar Sukaramai, Bukit Kayu Kapur, Bukit Kapur, Dumai - Riau', '0822-7647-7628', '6282276477628', 'motoriandaya@gmail.com', 'https://maps.google.com/?q=Pasar+Sukaramai+Bukit+Kayu+Kapur+Dumai+Riau', 'Setiap Hari: 08.00 - 17.00 WIB', '/images/motoran daya bukit.avif', '/images/logo_motoriandaya.avif')
ON CONFLICT (id) DO NOTHING;

-- Seed Banner Hero
INSERT INTO public.hero_banners (id, tagline_ribbon, title, title_highlight, offer1, offer2, period, image, cta_text, theme_color, is_active, order_index)
VALUES
('yamaha-nmax-aerox', 'AGUSTUS BERTABUR UNTUNG', 'Penjualan Motor Yamaha', 'NMax & Aerox', '{"label": "Potongan DP s.d.", "currency": "Rp", "value": "2,5", "unit": "Juta"}'::jsonb, '{"label": "Cashback Saldo Elektronik", "currency": "Rp", "value": "300", "unit": "Ribu", "subtext": "(Pengajuan dengan DP 20%)"}'::jsonb, 'Periode s.d. 31 Agustus 2026 | Berlaku Seluruh Showroom', '/images/momotor_banner_nmax_aerox.avif', 'Yuk Ajukan Sekarang', '#0B63E5', true, 1),
('honda-merdeka-promo', 'PESTA MERDEKA DISKON', 'Promo Spesial Honda', 'Scoopy & BeAT', '{"label": "DP Ringan Mulai", "currency": "Rp", "value": "500", "unit": "Ribu"}'::jsonb, '{"label": "Bonus Hadiah Langsung", "currency": "", "value": "Free", "unit": "Hadiah", "subtext": "(Helm & Jaket Eksklusif)"}'::jsonb, 'Periode s.d. 31 Agustus 2026 | Berlaku Seluruh Showroom', '/images/momotor_banner_honda_scoopy.avif', 'Yuk Ajukan Sekarang', '#DC2626', true, 2)
ON CONFLICT (id) DO NOTHING;

-- Seed Site Settings
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

-- Seed Pengumuman Kantor
INSERT INTO public.announcements (id, title, category, content, author, is_pinned, image, attachments)
VALUES
('ann-1', 'SOP Penerimaan & Standarisasi Cek Fisik Unit Masuk 4 Cabang', 'Operasional', 'Diberitahukan kepada seluruh Kepala Cabang dan Tim Mekanik (Kisaran, Perdagangan, Cikampak, Dumai), setiap unit motor baru maupun bekas yang masuk wajib melewati 20 titik inspeksi fisik, cek nomor rangka/mesin, dan pengecekan kelistrikan sebelum dipajang di area display showroom.', 'Direksi Kantor Pusat', true, '/images/pandu motor kisaran.avif', '[{"name": "Form_Inspeksi_20_Titik_SOP.pdf", "url": "#", "size": "1.2 MB", "type": "PDF"}]'::jsonb),
('ann-2', 'Program Insentif Penjualan & Target Semester II', 'Penting', 'Selamat kepada cabang Kisaran dan Perdagangan yang telah melampaui target penjualan bulan lalu. Untuk Semester II, manajemen memberlakukan skema bonus tambahan bagi sales counter dan marketing lapangan untuk setiap unit kredit dan dana tunai BPKB yang berhasil closing.', 'HRD & Finance', true, '/images/pandu_logo.avif', '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed Stok Motor Awal
INSERT INTO public.vehicles (id, name, brand, category, condition, year, price, dp_min, mileage, transmission, engine_capacity, description, images, branch_id, installment_estimates, is_featured)
VALUES
('pm-vario125-esp-cbs', 'VARIO 125 ESP CBS', 'Honda', 'matic', 'bekas', 2022, 20600000, 2000000, 8500, 'Automatic', '125 cc eSP', 'Kondisi 98% mulus terawat, mesin halus standar dealer, servis rutin, ban tebal siap pakai.', '["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'kisaran', '{"tenor11": 1980000, "tenor23": 1120000, "tenor35": 883609}'::jsonb, true),
('pm-beat-dlx-smart-key', 'BEAT DLX SMART KEY', 'Honda', 'matic', 'bekas', 2021, 15700000, 1500000, 4200, 'Automatic', '110 cc eSP', 'Tipe tertinggi Deluxe Smart Key, body mulus kinclong tanpa lecet berarti, kelistrikan & starter lancar jaya.', '["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'perdagangan', '{"tenor11": 1510000, "tenor23": 860000, "tenor35": 673430}'::jsonb, true),
('pm-scoopy-prestige-2023', 'SCOOPY PRESTIGE SMART KEY', 'Honda', 'matic', 'bekas', 2023, 21800000, 2500000, 6100, 'Automatic', '110 cc eSP', 'Kondisi istimewa tangan pertama dari baru, warna favorit Prestige White, velg emas mewah.', '["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'cikampak', '{"tenor11": 2090000, "tenor23": 1180000, "tenor35": 935000}'::jsonb, true),
('pm-nmax-155-connected', 'ALL NEW NMAX 155 CONNECTED', 'Yamaha', 'maxi', 'bekas', 2022, 28900000, 3000000, 9200, 'Automatic', '155 cc VVA', 'Fitur Y-Connect aktif, mesin bertenaga VVA, suspensi tabung belakang empuk, ban tebal depan-belakang.', '["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'dumai', '{"tenor11": 2770000, "tenor23": 1570000, "tenor35": 1239000}'::jsonb, true),
('pm-aerox-155-cybercity', 'AEROX 155 CYBERCITY VVA', 'Yamaha', 'maxi', 'bekas', 2023, 27500000, 2800000, 5400, 'Automatic', '155 cc VVA', 'Edisi spesial livery Cybercity bunglon gradasi ungu-biru, tarikan spontan kencang, bodi mulus 99%.', '["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'kisaran', '{"tenor11": 2640000, "tenor23": 1490000, "tenor35": 1179000}'::jsonb, true),
('pm-pcx-160-abs', 'HONDA ALL NEW PCX 160 ABS', 'Honda', 'maxi', 'baru', 2024, 36500000, 3500000, 0, 'Automatic', '160 cc eSP+ 4-Valve', 'Unit baru 100% dari dealer resmi Honda Pandu Motor Group. Sistem pengereman ABS + HSTC aman di jalan basah.', '["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'kisaran', '{"tenor11": 3500000, "tenor23": 1980000, "tenor35": 1565000}'::jsonb, true)
ON CONFLICT (id) DO NOTHING;
