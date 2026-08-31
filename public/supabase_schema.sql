-- ============================================================================
-- SQL SCHEMA & DATA LENGKAP PANDU MOTOR GROUP (SUPABASE)
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
    fuel_type TEXT DEFAULT 'Bensin (Injeksi)',
    color TEXT DEFAULT 'Hitam Glossy',
    plate_number_location TEXT DEFAULT 'BK (Asahan / Medan)',
    tax_status TEXT DEFAULT 'Pajak Hidup Panjang',
    document_completeness TEXT DEFAULT 'Lengkap (BPKB + STNK + Faktur)',
    warranty TEXT DEFAULT 'Garansi Mesin Showroom 6 Bulan',
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    branch_id TEXT NOT NULL DEFAULT 'kisaran',
    installment_estimates JSONB DEFAULT '{"tenor11": 0, "tenor23": 0, "tenor35": 0, "tenor47": 0}'::jsonb,
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

DROP POLICY IF EXISTS "Public can read announcements" ON public.announcements;
CREATE POLICY "Public can read announcements" ON public.announcements FOR SELECT USING (true);

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
-- SEED INITIAL DATA LENGKAP
-- ============================================================================

-- 1. SEED 4 CABANG SHOWROOM
INSERT INTO public.branches (id, name, company_name, code, city, province, address, phone, whatsapp, email, google_maps_url, operational_hours, image, logo)
VALUES
('kisaran', 'Pandu Motor Kisaran', 'CV. Pandu Motor', 'PM-KSR', 'Kisaran Barat, Asahan', 'Sumatera Utara', 'Jl. Kartini No. 204 A-B, Kisaran Barat, Asahan, Sumatera Utara', '0822-7647-7628', '6282276477628', 'pandumotor20@gmail.com', 'https://maps.app.goo.gl/TQbnnh9NAoyRbyBK8', 'Setiap Hari: 08.00 - 17.00 WIB', '/images/pandu motor kisaran.avif', '/images/logo_pandumotor.avif'),
('perdagangan', 'Pandu Motor Perdagangan', 'CV. Pandu Motor', 'PM-PDG', 'Perdagangan, Simalungun', 'Sumatera Utara', 'Jl. Rajamin Purba No. 02, Perdagangan, Kab. Simalungun, Sumatera Utara', '0822-7647-7628', '6282276477628', 'pandumotorperdagangan@gmail.com', 'https://maps.app.goo.gl/mC3Sp6pWzSwYnMrP7?g_st=aw', 'Setiap Hari: 08.00 - 17.00 WIB', '/images/pandu motor 2.avif', '/images/logo_pandumotor.avif'),
('cikampak', 'Ikabina Motor Cikampak', 'CV. Ikabina Motor', 'IM-CKP', 'Torgamba, Labuhanbatu Selatan', 'Sumatera Utara', 'Jl. Lintas Sumatera Riau, Desa Aek Batu, Torgamba, Labuhan Batu Selatan, Sumatera Utara', '0822-7647-7628', '6282276477628', 'ikabinacikampak@yahoo.com', 'https://maps.app.goo.gl/nzHjDtWnQitAaAKf6?g_st=aw', 'Setiap Hari: 08.00 - 17.00 WIB', '/images/ikabina.avif', '/images/logo_ikabina.avif'),
('dumai', 'Motorian Daya Bukit Kapur', 'CV. Motorian Daya', 'MD-DMI', 'Bukit Kapur, Dumai', 'Riau', 'Jl. Soekarno Hatta Pasar Sukaramai, Bukit Kayu Kapur, Bukit Kapur, Dumai - Riau', '0822-7647-7628', '6282276477628', 'motoriandaya@gmail.com', 'https://maps.app.goo.gl/G16opnzCUJ98irnq9?g_st=aw', 'Setiap Hari: 08.00 - 17.00 WIB', '/images/motoran daya bukit.avif', '/images/logo_motoriandaya.avif')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    whatsapp = EXCLUDED.whatsapp,
    google_maps_url = EXCLUDED.google_maps_url;

-- 2. SEED HERO BANNER PROMO
INSERT INTO public.hero_banners (id, tagline_ribbon, title, title_highlight, offer1, offer2, period, image, cta_text, theme_color, is_active, order_index)
VALUES
('yamaha-nmax-aerox', 'AGUSTUS BERTABUR UNTUNG', 'Penjualan Motor Yamaha', 'NMax & Aerox', '{"label": "Potongan DP s.d.", "currency": "Rp", "value": "2,5", "unit": "Juta"}'::jsonb, '{"label": "Cashback Saldo Elektronik", "currency": "Rp", "value": "300", "unit": "Ribu", "subtext": "(Pengajuan dengan DP 20%)"}'::jsonb, 'Periode s.d. 31 Agustus 2026 | Berlaku Seluruh Showroom', '/images/momotor_banner_nmax_aerox.avif', 'Yuk Ajukan Sekarang', '#0B63E5', true, 1),
('honda-merdeka-promo', 'PESTA MERDEKA DISKON', 'Promo Spesial Honda', 'Scoopy & BeAT', '{"label": "DP Ringan Mulai", "currency": "Rp", "value": "500", "unit": "Ribu"}'::jsonb, '{"label": "Bonus Hadiah Langsung", "currency": "", "value": "Free", "unit": "Hadiah", "subtext": "(Helm & Jaket Eksklusif)"}'::jsonb, 'Periode s.d. 31 Agustus 2026 | Berlaku Seluruh Showroom', '/images/momotor_banner_honda_scoopy.avif', 'Yuk Ajukan Sekarang', '#DC2626', true, 2)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    title_highlight = EXCLUDED.title_highlight,
    image = EXCLUDED.image;

-- 3. SEED PENGATURAN SITUS & LAYANAN
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
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value;

-- 4. SEED PENGUMUMAN INTERNAL KANTOR (KHUSUS ADMIN)
INSERT INTO public.announcements (id, title, category, content, author, is_pinned, image, attachments)
VALUES
('ann-1', 'SOP Penerimaan & Standarisasi Cek Fisik Unit Masuk 4 Cabang', 'Operasional', 'Diberitahukan kepada seluruh Kepala Cabang dan Tim Mekanik (Kisaran, Perdagangan, Cikampak, Dumai), setiap unit motor baru maupun bekas yang masuk wajib melewati 20 titik inspeksi fisik, cek nomor rangka/mesin, dan pengecekan kelistrikan sebelum dipajang di area display showroom.', 'Direksi Kantor Pusat', true, '/images/pandu motor kisaran.avif', '[{"name": "Form_Inspeksi_20_Titik_SOP.pdf", "url": "#", "size": "1.2 MB", "type": "PDF"}]'::jsonb),
('ann-2', 'Program Insentif Penjualan & Target Semester II', 'Penting', 'Selamat kepada cabang Kisaran dan Perdagangan yang telah melampaui target penjualan bulan lalu. Untuk Semester II, manajemen memberlakukan skema bonus tambahan bagi sales counter dan marketing lapangan untuk setiap unit kredit dan dana tunai BPKB yang berhasil closing.', 'HRD & Finance', true, '/images/pandu_logo.avif', '[]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content;

-- 5. SEED 12 UNIT STOK MOTOR LENGKAP PANDU MOTOR GROUP
INSERT INTO public.vehicles (id, name, brand, category, condition, year, price, dp_min, mileage, transmission, engine_capacity, fuel_type, color, plate_number_location, tax_status, document_completeness, warranty, description, features, images, branch_id, installment_estimates, is_featured)
VALUES
('pm-vario125-esp-cbs', 'VARIO 125 ESP CBS', 'Honda', 'matic', 'bekas', 2022, 20600000, 2000000, 8500, 'Automatic', '125 cc eSP', 'Bensin (Injeksi)', 'Matte Black Sporty', 'BK (Kisaran)', 'Pajak Hidup Panjang', 'Lengkap (BPKB + STNK + Faktur)', 'Garansi Mesin Showroom 6 Bulan', 'Kondisi 98% mulus terawat, mesin halus standar dealer, servis rutin, ban tebal siap pakai.', '["Combi Brake System", "Idling Stop System", "Full Digital Panel Meter", "Secure Key Shutter"]'::jsonb, '["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'kisaran', '{"tenor11": 1980000, "tenor23": 1120000, "tenor35": 883609, "tenor47": 740000}'::jsonb, true),

('pm-beat-dlx-smart-key', 'BEAT DLX SMART KEY', 'Honda', 'matic', 'bekas', 2021, 15700000, 1500000, 4200, 'Automatic', '110 cc eSP', 'Bensin (Injeksi)', 'Deluxe Matte Black 3D', 'BK (Perdagangan)', 'Pajak Hidup Panjang', 'Lengkap (BPKB + STNK)', 'Garansi Mesin Showroom 6 Bulan', 'Tipe tertinggi Deluxe sudah Smart Key, irit BBM hingga 60.6 km/l, bodi mulus tanpa lecet.', '["Smart Key System", "Power Charger 12W", "Combi Brake System", "ISS System"]'::jsonb, '["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'perdagangan', '{"tenor11": 1510000, "tenor23": 860000, "tenor35": 673430, "tenor47": 560000}'::jsonb, true),

('pm-new-scoopy-sporty', 'NEW SCOOPY SPORTY', 'Honda', 'matic', 'bekas', 2017, 13800000, 1300000, 24000, 'Automatic', '110 cc eSP', 'Bensin (Injeksi)', 'Sporty Red White', 'BK (Cikampak)', 'Pajak Aktif', 'Lengkap (BPKB + STNK)', 'Garansi Mesin Showroom 3 Bulan', 'Scoopy retro klasik warna merah putih favorit, mesin terawat halus, kelistrikan normal jaya.', '["LED Projector Headlight", "Anti-Theft Alarm", "Combined Brake", "Power Charger"]'::jsonb, '["https://images.unsplash.com/photo-1525160354320-d8e92641c563?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'cikampak', '{"tenor11": 1524273, "tenor23": 880000, "tenor35": 690000, "tenor47": 570000}'::jsonb, true),

('pm-new-scoopy-prestige', 'NEW SCOOPY PRESTIGE', 'Honda', 'matic', 'bekas', 2023, 18800000, 1800000, 7200, 'Automatic', '110 cc eSP', 'Bensin (Injeksi)', 'Prestige White Titanium Gold', 'BM (Dumai)', 'Pajak Hidup Panjang', 'Lengkap (BPKB + STNK + Faktur)', 'Garansi Mesin Showroom 6 Bulan', 'Varian tertinggi Prestige dengan Smart Key dan velg emas, kondisi sangat mulus istimewa.', '["Smart Key System", "USB Charger Console Box", "LED Projector Headlight", "ISS System"]'::jsonb, '["https://images.unsplash.com/photo-1525160354320-d8e92641c563?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'dumai', '{"tenor11": 1810000, "tenor23": 1025000, "tenor35": 806400, "tenor47": 670000}'::jsonb, true),

('pm-scoopy-fashion-pink', 'NEW SCOOPY FASHION PINK', 'Honda', 'matic', 'bekas', 2024, 22500000, 2200000, 2800, 'Automatic', '110 cc eSP', 'Bensin (Injeksi)', 'Fashion Pastel Pink Metallic', 'BK (Kisaran)', 'Pajak Hidup Panjang', 'Lengkap (BPKB + STNK + Faktur)', 'Garansi Mesin Showroom 1 Tahun', 'Unit 2024 rasa baru! Bodi kinclong tanpa gores, low kilometer 2.800 km, surat-surat 100% lengkap.', '["Smart Key System", "LED Projector", "USB Charger", "Digital Panel Meter"]'::jsonb, '["https://images.unsplash.com/photo-1525160354320-d8e92641c563?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'kisaran', '{"tenor11": 2160000, "tenor23": 1220000, "tenor35": 965000, "tenor47": 810000}'::jsonb, true),

('pm-beat-street-cbs', 'BEAT STREET CBS', 'Honda', 'matic', 'bekas', 2023, 17500000, 1700000, 6500, 'Automatic', '110 cc eSP', 'Bensin (Injeksi)', 'Street Black White Extreme', 'BK (Perdagangan)', 'Pajak Hidup Panjang', 'Lengkap (BPKB + STNK)', 'Garansi Mesin Showroom 6 Bulan', 'Model stang telanjang naked bergaya street adventure, lincah bermanuver di perkotaan.', '["Naked Handle Bar", "Full Digital Panel Meter", "Combi Brake System", "Secure Key Shutter"]'::jsonb, '["https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'perdagangan', '{"tenor11": 1680000, "tenor23": 955000, "tenor35": 750000, "tenor47": 630000}'::jsonb, true),

('pm-nmax-155-connected-abs', 'NMAX 155 CONNECTED ABS', 'Yamaha', 'maxi', 'bekas', 2023, 28600000, 2800000, 9400, 'Automatic', '155 cc VVA Liquid Cooled', 'Bensin (Injeksi)', 'Matte Black Gold Wheels', 'BK (Cikampak)', 'Pajak Hidup Panjang', 'Lengkap (BPKB + STNK + Faktur)', 'Garansi Mesin Showroom 6 Bulan', 'Maxi scooter paling nyaman untuk harian dan touring. Dilengkapi fitur Y-Connect, ABS & TCS.', '["Dual Channel ABS", "Traction Control System", "Y-Connect Smartphone Connection", "Keyless Smart Key"]'::jsonb, '["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'cikampak', '{"tenor11": 2750000, "tenor23": 1560000, "tenor35": 1226000, "tenor47": 1030000}'::jsonb, true),

('pm-beat-deluxe-matte-brown', 'BEAT DELUXE MATTE BROWN', 'Honda', 'matic', 'bekas', 2023, 17600000, 1700000, 5800, 'Automatic', '110 cc eSP', 'Bensin (Injeksi)', 'Deluxe Matte Brown Gold 3D', 'BM (Dumai)', 'Pajak Hidup Panjang', 'Lengkap (BPKB + STNK)', 'Garansi Mesin Showroom 6 Bulan', 'Warna cokelat matte eksklusif dan elegan dengan 3D chrome emblem, irit dan responsif.', '["Combi Brake System (CBS)", "Idling Stop System (ISS)", "Power Charger", "Secure Key Shutter"]'::jsonb, '["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'dumai', '{"tenor11": 1690000, "tenor23": 960000, "tenor35": 754000, "tenor47": 635000}'::jsonb, true),

('pm-aerox-155-connected-vva', 'AEROX 155 CONNECTED VVA', 'Yamaha', 'matic', 'bekas', 2023, 26900000, 2600000, 8200, 'Automatic', '155 cc VVA Liquid Cooled', 'Bensin (Injeksi)', 'Cyan Silver Metallic', 'BK (Kisaran)', 'Pajak Hidup Panjang', 'Lengkap (BPKB + STNK + Faktur)', 'Garansi Mesin Showroom 6 Bulan', 'Super sport scooter dengan tarikan VVA bertenaga kencang, ban tapak lebar tubeless.', '["Y-Connect", "VVA High Performance", "Full Digital Speedometer", "Hazard Lamp", "LED Lighting"]'::jsonb, '["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'kisaran', '{"tenor11": 2580000, "tenor23": 1460000, "tenor35": 1150000, "tenor47": 970000}'::jsonb, true),

('pm-pcx160-abs-deluxe', 'PCX 160 ABS DELUXE', 'Honda', 'maxi', 'bekas', 2023, 31800000, 3200000, 6900, 'Automatic', '160 cc 4-Katup eSP+', 'Bensin (PGM-FI)', 'Imperial Matte Blue Deluxe', 'BK (Perdagangan)', 'Pajak Hidup Panjang', 'Lengkap (BPKB + STNK + Faktur)', 'Garansi Mesin Showroom 6 Bulan', 'Kondisi istimewa, rem ABS & HSTC bekerja sempurna, bagasi muat 30 liter helm full-face.', '["Anti-lock Braking System", "HSTC Traction Control", "Smart Key & Alarm", "Full Digital Meter"]'::jsonb, '["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'perdagangan', '{"tenor11": 3060000, "tenor23": 1735000, "tenor35": 1364000, "tenor47": 1150000}'::jsonb, true),

('pm-vario160-abs-grande', 'VARIO 160 ABS GRANDE', 'Honda', 'matic', 'bekas', 2023, 27800000, 2700000, 8900, 'Automatic', '160 cc 4-Katup eSP+', 'Bensin (PGM-FI)', 'Grande Matte Black Gold Emblem', 'BK (Cikampak)', 'Pajak Hidup Panjang', 'Lengkap (BPKB + STNK + Faktur)', 'Garansi Mesin Showroom 6 Bulan', 'Desain bodi gambot sporty premium. Mesin 160cc bertenaga tinggi dengan pengereman ABS.', '["Anti-lock Braking System", "Rear Disc Brake", "Honda Smart Key", "USB Charger"]'::jsonb, '["https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'cikampak', '{"tenor11": 2680000, "tenor23": 1515000, "tenor35": 1192000, "tenor47": 1005000}'::jsonb, true),

('pm-crf150l-extreme-black', 'CRF 150L EXTREME BLACK', 'Honda', 'trail', 'bekas', 2022, 30500000, 3000000, 10200, 'Manual', '150 cc PGM-FI Air-Cooled', 'Bensin (Injeksi)', 'Extreme Black Gold Upside Down', 'BM (Dumai)', 'Pajak Aktif', 'Lengkap (BPKB + STNK + Faktur)', 'Garansi Mesin Showroom 6 Bulan', 'Motor trail tangguh untuk perkebunan dan petualangan. Suspensi Showa Inverted Fork emas.', '["Showa Inverted Telescopic", "Wavy Disc Brake", "Digital Speedometer", "Aluminium Rim 21-18"]'::jsonb, '["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"]'::jsonb, 'dumai', '{"tenor11": 2940000, "tenor23": 1660000, "tenor35": 1308000, "tenor47": 1100000}'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    dp_min = EXCLUDED.dp_min,
    installment_estimates = EXCLUDED.installment_estimates,
    description = EXCLUDED.description,
    images = EXCLUDED.images;
