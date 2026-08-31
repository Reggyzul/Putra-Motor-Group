import { useState, useEffect, useCallback } from 'react';
import { supabase, pingSupabaseKeepAlive } from '../lib/supabase';
import { Vehicle, Branch, HeroBanner, SiteSettings, Announcement } from '../types';
import { VEHICLES_DATA } from '../data/vehicles';
import { BRANCHES_DATA } from '../data/branches';

export const DEFAULT_BANNERS: HeroBanner[] = [
  {
    id: 'yamaha-nmax-aerox',
    taglineRibbon: 'AGUSTUS BERTABUR UNTUNG',
    title: 'Penjualan Motor Yamaha',
    titleHighlight: 'NMax & Aerox',
    offer1: {
      label: 'Potongan DP s.d.',
      currency: 'Rp',
      value: '2,5',
      unit: 'Juta',
    },
    offer2: {
      label: 'Cashback Saldo Elektronik',
      currency: 'Rp',
      value: '300',
      unit: 'Ribu',
      subtext: '(Pengajuan dengan DP 20%)',
    },
    period: 'Periode s.d. 31 Agustus 2026 | Berlaku Seluruh Showroom',
    image: '/images/momotor_banner_nmax_aerox.avif',
    ctaText: 'Yuk Ajukan Sekarang',
    themeColor: '#0B63E5',
    isActive: true,
    orderIndex: 1,
  },
  {
    id: 'honda-merdeka-promo',
    taglineRibbon: 'PESTA MERDEKA DISKON',
    title: 'Promo Spesial Honda',
    titleHighlight: 'Scoopy & BeAT',
    offer1: {
      label: 'DP Ringan Mulai',
      currency: 'Rp',
      value: '500',
      unit: 'Ribu',
    },
    offer2: {
      label: 'Bonus Hadiah Langsung',
      currency: '',
      value: 'Free',
      unit: 'Hadiah',
      subtext: '(Helm & Jaket Eksklusif)',
    },
    period: 'Periode s.d. 31 Agustus 2026 | Berlaku Seluruh Showroom',
    image: '/images/momotor_banner_honda_scoopy.avif',
    ctaText: 'Yuk Ajukan Sekarang',
    themeColor: '#DC2626',
    isActive: true,
    orderIndex: 2,
  },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  head_office_address: 'Jl. Kartini No. 204 A-B, Kisaran barat, Asahan Sumatera Utara',
  official_email: 'putramotorgroup.id@gmail.com',
  official_phone: '0822-7647-7628',
  tagline: 'Melayani Sepenuh Hati',
  brand_name: 'Pandu Motor Group',
};

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'SOP Penerimaan & Standarisasi Cek Fisik Unit Masuk 4 Cabang',
    category: 'Operasional',
    content: 'Diberitahukan kepada seluruh Kepala Cabang dan Tim Mekanik (Kisaran, Perdagangan, Cikampak, Dumai), setiap unit motor baru maupun bekas yang masuk wajib melewati 20 titik inspeksi fisik, cek nomor rangka/mesin, dan pengecekan kelistrikan sebelum dipajang di area display showroom.',
    author: 'Direksi Kantor Pusat',
    isPinned: true,
    image: '/images/pandu motor kisaran.avif',
    attachments: [
      { name: 'Form_Inspeksi_20_Titik_SOP.pdf', url: '#', size: '1.2 MB', type: 'PDF' },
      { name: 'Jadwal_Rolling_Stok_Mingguan.xlsx', url: '#', size: '420 KB', type: 'EXCEL' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ann-2',
    title: 'Program Insentif Penjualan & Target Semester II',
    category: 'Penting',
    content: 'Selamat kepada cabang Kisaran dan Perdagangan yang telah melampaui target penjualan bulan lalu. Untuk Semester II, manajemen memberlakukan skema bonus tambahan bagi sales counter dan marketing lapangan untuk setiap unit kredit dan dana tunai BPKB yang berhasil closing.',
    author: 'HRD & Finance',
    isPinned: true,
    image: '/images/pandu_logo.avif',
    attachments: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const LS_VEHICLES_KEY = 'pmg_cache_vehicles';
const LS_BRANCHES_KEY = 'pmg_cache_branches';
const LS_BANNERS_KEY = 'pmg_cache_banners';
const LS_SETTINGS_KEY = 'pmg_cache_settings';
const LS_ANNOUNCEMENTS_KEY = 'pmg_cache_announcements';

export function useDataStore() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const cached = localStorage.getItem(LS_VEHICLES_KEY);
      return cached ? JSON.parse(cached) : VEHICLES_DATA;
    } catch {
      return VEHICLES_DATA;
    }
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    try {
      const cached = localStorage.getItem(LS_BRANCHES_KEY);
      if (cached) {
        const parsed: Branch[] = JSON.parse(cached);
        // If cached has outdated duplicate phone for other branches, update with fresh BRANCHES_DATA
        if (parsed.some((b) => b.id === 'perdagangan' && b.phone === '0822-7647-7628')) {
          localStorage.setItem(LS_BRANCHES_KEY, JSON.stringify(BRANCHES_DATA));
          return BRANCHES_DATA;
        }
        return parsed;
      }
      return BRANCHES_DATA;
    } catch {
      return BRANCHES_DATA;
    }
  });

  const [banners, setBanners] = useState<HeroBanner[]>(() => {
    try {
      const cached = localStorage.getItem(LS_BANNERS_KEY);
      return cached ? JSON.parse(cached) : DEFAULT_BANNERS;
    } catch {
      return DEFAULT_BANNERS;
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const cached = localStorage.getItem(LS_SETTINGS_KEY);
      return cached ? JSON.parse(cached) : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const cached = localStorage.getItem(LS_ANNOUNCEMENTS_KEY);
      return cached ? JSON.parse(cached) : DEFAULT_ANNOUNCEMENTS;
    } catch {
      return DEFAULT_ANNOUNCEMENTS;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(true);
  const [dbTablesReady, setDbTablesReady] = useState<boolean>(true);

  // Fetch and Sync directly from Supabase
  const syncWithSupabase = useCallback(async () => {
    setIsSyncing(true);
    try {
      // Ping keepalive
      await pingSupabaseKeepAlive();

      // A. Fetch Vehicles from Supabase
      const { data: dbVehicles, error: vErr } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (vErr && vErr.code === 'PGRST205') {
        setDbTablesReady(false);
      } else if (!vErr && dbVehicles && dbVehicles.length > 0) {
        setDbTablesReady(true);
        const formatted: Vehicle[] = dbVehicles.map((v: any) => ({
          id: v.id,
          name: v.name,
          brand: v.brand,
          category: v.category,
          condition: v.condition,
          year: Number(v.year),
          price: Number(v.price),
          dpMin: Number(v.dp_min || 0),
          mileage: v.mileage ? Number(v.mileage) : undefined,
          transmission: v.transmission || 'Automatic',
          engineCapacity: v.engine_capacity || '125 cc',
          description: v.description || '',
          fuelType: v.fuel_type || 'Bensin',
          color: v.color || 'Hitam Glossy',
          plateNumberLocation: v.plate_number_location || 'BK (Asahan / Medan)',
          taxStatus: v.tax_status || 'Pajak Hidup Panjang',
          documentCompleteness: v.document_completeness || 'Lengkap (BPKB + STNK + Faktur)',
          warranty: v.warranty || 'Garansi Mesin Showroom 1 Tahun',
          features: Array.isArray(v.features) ? v.features : [],
          images: Array.isArray(v.images) ? v.images : [],
          branchId: v.branch_id || 'kisaran',
          installmentEstimates: v.installment_estimates || { tenor11: 0, tenor23: 0, tenor35: 0 },
          isFeatured: Boolean(v.is_featured),
          isHotPromo: Boolean(v.is_hot_promo),
        }));
        setVehicles(formatted);
        localStorage.setItem(LS_VEHICLES_KEY, JSON.stringify(formatted));
      }

      // B. Fetch Branches from Supabase
      const { data: dbBranches, error: bErr } = await supabase
        .from('branches')
        .select('*');

      if (!bErr && dbBranches && dbBranches.length > 0) {
        const formatted: Branch[] = dbBranches.map((b: any) => ({
          id: b.id,
          name: b.name,
          companyName: b.company_name,
          code: b.code,
          city: b.city,
          province: b.province,
          address: b.address,
          phone: b.phone,
          whatsapp: b.whatsapp,
          email: b.email,
          googleMapsUrl: b.google_maps_url,
          operationalHours: b.operational_hours,
          image: b.image,
          logo: b.logo,
          socialMedia: b.social_media || {},
        }));
        setBranches(formatted);
        localStorage.setItem(LS_BRANCHES_KEY, JSON.stringify(formatted));
      }

      // C. Fetch Banners from Supabase
      const { data: dbBanners, error: bnErr } = await supabase
        .from('hero_banners')
        .select('*')
        .order('order_index', { ascending: true });

      if (!bnErr && dbBanners && dbBanners.length > 0) {
        const formatted: HeroBanner[] = dbBanners.map((bn: any) => ({
          id: bn.id,
          taglineRibbon: bn.tagline_ribbon || '',
          title: bn.title,
          titleHighlight: bn.title_highlight,
          offer1: bn.offer1 || { label: '', currency: '', value: '', unit: '' },
          offer2: bn.offer2 || { label: '', currency: '', value: '', unit: '' },
          period: bn.period || '',
          image: bn.image,
          ctaText: bn.cta_text || 'Yuk Ajukan Sekarang',
          themeColor: bn.theme_color || '#0B63E5',
          isActive: bn.is_active ?? true,
          orderIndex: bn.order_index ?? 1,
        }));
        setBanners(formatted);
        localStorage.setItem(LS_BANNERS_KEY, JSON.stringify(formatted));
      }

      // D. Fetch Site Settings from Supabase
      const { data: dbSettings, error: sErr } = await supabase
        .from('site_settings')
        .select('*');

      if (!sErr && dbSettings && dbSettings.length > 0) {
        const settingsMap: SiteSettings = { ...DEFAULT_SITE_SETTINGS };
        dbSettings.forEach((row: any) => {
          if (row.key) settingsMap[row.key] = row.value;
        });
        setSiteSettings(settingsMap);
        localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settingsMap));
      }

      // E. Fetch Announcements from Supabase
      const { data: dbAnnouncements, error: aErr } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (!aErr && dbAnnouncements && dbAnnouncements.length > 0) {
        const formatted: Announcement[] = dbAnnouncements.map((a: any) => ({
          id: a.id,
          title: a.title,
          category: a.category || 'Umum',
          content: a.content,
          author: a.author || 'Kantor Pusat',
          isPinned: Boolean(a.is_pinned),
          image: a.image,
          attachments: Array.isArray(a.attachments) ? a.attachments : [],
          createdAt: a.created_at || new Date().toISOString(),
          updatedAt: a.updated_at,
        }));
        setAnnouncements(formatted);
        localStorage.setItem(LS_ANNOUNCEMENTS_KEY, JSON.stringify(formatted));
      }

      setSupabaseConnected(true);
      setLastSynced(new Date());
    } catch (err) {
      console.warn('Supabase sync notice:', err);
      setSupabaseConnected(false);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // Multi-Device Realtime Listener & Window Focus Synchronization
  useEffect(() => {
    syncWithSupabase();

    // 1. Supabase Realtime Broadcast Subscription
    const channel = supabase
      .channel('schema-db-realtime-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        syncWithSupabase();
      })
      .subscribe();

    // 2. Window Focus & Visibility Listener (Auto-fetch when switching back to app)
    const handleFocus = () => syncWithSupabase();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') syncWithSupabase();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    // 3. Periodic 15s poll
    const interval = setInterval(syncWithSupabase, 15000);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [syncWithSupabase]);

  // MUTATION: Save Vehicle (Insert / Update to Cloud & Local)
  const saveVehicle = async (vehicle: Vehicle): Promise<{ success: boolean; error?: string }> => {
    try {
      const dbPayload = {
        id: vehicle.id,
        name: vehicle.name,
        brand: vehicle.brand,
        category: vehicle.category,
        condition: vehicle.condition,
        year: vehicle.year,
        price: vehicle.price,
        dp_min: vehicle.dpMin,
        mileage: vehicle.mileage || 0,
        transmission: vehicle.transmission,
        engine_capacity: vehicle.engineCapacity,
        description: vehicle.description,
        images: vehicle.images,
        branch_id: vehicle.branchId,
        installment_estimates: vehicle.installmentEstimates,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('vehicles').upsert(dbPayload);
      if (error) {
        throw error;
      }

      // Optimistic local update after cloud save succeeds
      const updated = vehicles.some((v) => v.id === vehicle.id)
        ? vehicles.map((v) => (v.id === vehicle.id ? vehicle : v))
        : [vehicle, ...vehicles];

      setVehicles(updated);
      localStorage.setItem(LS_VEHICLES_KEY, JSON.stringify(updated));
      setDbTablesReady(true);
      return { success: true };
    } catch (err: any) {
      console.error('Supabase vehicle save error:', err);
      const isMissingTable = err.code === 'PGRST205' || err.message?.includes('schema cache');
      if (isMissingTable) setDbTablesReady(false);
      return { 
        success: false, 
        error: isMissingTable 
          ? 'Tabel Supabase belum dibuat! Buka menu "Status DB & Keep-Alive", salin script SQL, lalu jalankan di Supabase SQL Editor.' 
          : err.message 
      };
    }
  };

  // MUTATION: Delete Vehicle
  const deleteVehicle = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (error) throw error;

      const updated = vehicles.filter((v) => v.id !== id);
      setVehicles(updated);
      localStorage.setItem(LS_VEHICLES_KEY, JSON.stringify(updated));
      return { success: true };
    } catch (err: any) {
      console.error('Supabase vehicle delete error:', err);
      return { success: false, error: err.message };
    }
  };

  // MUTATION: Save Branch
  const saveBranch = async (branch: Branch): Promise<{ success: boolean; error?: string }> => {
    try {
      const dbPayload = {
        id: branch.id,
        name: branch.name,
        company_name: branch.companyName,
        code: branch.code,
        city: branch.city,
        province: branch.province,
        address: branch.address,
        phone: branch.phone,
        whatsapp: branch.whatsapp,
        email: branch.email,
        google_maps_url: branch.googleMapsUrl,
        operational_hours: branch.operationalHours,
        image: branch.image,
        logo: branch.logo,
        social_media: branch.socialMedia,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('branches').upsert(dbPayload);
      if (error) throw error;

      const updated = branches.map((b) => (b.id === branch.id ? branch : b));
      setBranches(updated);
      localStorage.setItem(LS_BRANCHES_KEY, JSON.stringify(updated));
      return { success: true };
    } catch (err: any) {
      console.error('Supabase branch save error:', err);
      return { success: false, error: err.message };
    }
  };

  // MUTATION: Save Banner
  const saveBanner = async (banner: HeroBanner): Promise<{ success: boolean; error?: string }> => {
    try {
      const dbPayload = {
        id: banner.id,
        tagline_ribbon: banner.taglineRibbon,
        title: banner.title,
        title_highlight: banner.titleHighlight,
        offer1: banner.offer1,
        offer2: banner.offer2,
        period: banner.period,
        image: banner.image,
        cta_text: banner.ctaText,
        theme_color: banner.themeColor,
        is_active: banner.isActive ?? true,
        order_index: banner.orderIndex ?? 1,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('hero_banners').upsert(dbPayload);
      if (error) throw error;

      const updated = banners.some((b) => b.id === banner.id)
        ? banners.map((b) => (b.id === banner.id ? banner : b))
        : [...banners, banner];

      setBanners(updated);
      localStorage.setItem(LS_BANNERS_KEY, JSON.stringify(updated));
      return { success: true };
    } catch (err: any) {
      console.error('Supabase banner save error:', err);
      return { success: false, error: err.message };
    }
  };

  // MUTATION: Delete Banner
  const deleteBanner = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.from('hero_banners').delete().eq('id', id);
      if (error) throw error;

      const updated = banners.filter((b) => b.id !== id);
      setBanners(updated);
      localStorage.setItem(LS_BANNERS_KEY, JSON.stringify(updated));
      return { success: true };
    } catch (err: any) {
      console.error('Supabase banner delete error:', err);
      return { success: false, error: err.message };
    }
  };

  // MUTATION: Save Site Settings
  const saveSiteSettings = async (settings: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> => {
    try {
      const upsertPromises = Object.entries(settings).map(([key, value]) =>
        supabase.from('site_settings').upsert({
          key,
          value,
          updated_at: new Date().toISOString(),
        })
      );
      const results = await Promise.all(upsertPromises);
      const firstError = results.find((r) => r.error)?.error;
      if (firstError) throw firstError;

      const updated = { ...siteSettings, ...settings };
      setSiteSettings(updated);
      localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(updated));
      return { success: true };
    } catch (err: any) {
      console.error('Supabase site settings save error:', err);
      return { success: false, error: err.message };
    }
  };

  // MUTATION: Save Announcement
  const saveAnnouncement = async (announcement: Announcement): Promise<{ success: boolean; error?: string }> => {
    try {
      const dbPayload = {
        id: announcement.id,
        title: announcement.title,
        category: announcement.category,
        content: announcement.content,
        author: announcement.author,
        is_pinned: announcement.isPinned ?? false,
        image: announcement.image,
        attachments: announcement.attachments || [],
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('announcements').upsert(dbPayload);
      if (error) throw error;

      const updated = announcements.some((a) => a.id === announcement.id)
        ? announcements.map((a) => (a.id === announcement.id ? announcement : a))
        : [announcement, ...announcements];

      setAnnouncements(updated);
      localStorage.setItem(LS_ANNOUNCEMENTS_KEY, JSON.stringify(updated));
      return { success: true };
    } catch (err: any) {
      console.error('Supabase announcement save error:', err);
      return { success: false, error: err.message };
    }
  };

  // MUTATION: Delete Announcement
  const deleteAnnouncement = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;

      const updated = announcements.filter((a) => a.id !== id);
      setAnnouncements(updated);
      localStorage.setItem(LS_ANNOUNCEMENTS_KEY, JSON.stringify(updated));
      return { success: true };
    } catch (err: any) {
      console.error('Supabase announcement delete error:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    vehicles,
    branches,
    banners,
    siteSettings,
    announcements,
    isLoading,
    isSyncing,
    lastSynced,
    supabaseConnected,
    dbTablesReady,
    syncWithSupabase,
    saveVehicle,
    deleteVehicle,
    saveBranch,
    saveBanner,
    deleteBanner,
    saveSiteSettings,
    saveAnnouncement,
    deleteAnnouncement,
  };
}
