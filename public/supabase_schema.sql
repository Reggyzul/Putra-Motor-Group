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

-- Policy: Publik bisa membaca data umum
DROP POLICY IF EXISTS "Public can read vehicles" ON public.vehicles;
CREATE POLICY "Public can read vehicles" ON public.vehicles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read branches" ON public.branches;
CREATE POLICY "Public can read branches" ON public.branches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read hero_banners" ON public.hero_banners;
CREATE POLICY "Public can read hero_banners" ON public.hero_banners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read site_settings" ON public.site_settings;
CREATE POLICY "Public can read site_settings" ON public.site_settings FOR SELECT USING (true);

-- Policy: Announcements hanya bisa diakses oleh Admin Authenticated
DROP POLICY IF EXISTS "Authenticated users can manage announcements" ON public.announcements;
CREATE POLICY "Authenticated users can manage announcements" ON public.announcements FOR ALL TO authenticated USING (true) WITH CHECK (true);


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
('brand_name', 'Pandu Motor Group', 'Nama Brand Utama')
ON CONFLICT (key) DO NOTHING;
