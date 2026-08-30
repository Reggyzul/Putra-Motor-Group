import { useState, useEffect, useCallback } from 'react';
import { supabase, pingSupabaseKeepAlive } from '../lib/supabase';
import { Vehicle, Branch, HeroBanner, SiteSettings } from '../types';
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

// Local storage keys for instant hydration
const LS_VEHICLES_KEY = 'pmg_cache_vehicles';
const LS_BRANCHES_KEY = 'pmg_cache_branches';
const LS_BANNERS_KEY = 'pmg_cache_banners';
const LS_SETTINGS_KEY = 'pmg_cache_settings';

export function useDataStore() {
  // 1. Instant hydration initialization from localStorage or defaults (0ms delay)
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
      return cached ? JSON.parse(cached) : BRANCHES_DATA;
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

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [supabaseConnected, setSupabaseConnected] = useState(true);

  // 2. Fetch and Sync from Supabase in the background
  const syncWithSupabase = useCallback(async () => {
    setIsSyncing(true);
    try {
      // Ping keepalive
      await pingSupabaseKeepAlive();

      // A. Fetch Vehicles
      const { data: dbVehicles, error: vErr } = await supabase.from('vehicles').select('*');
      if (!vErr && dbVehicles && dbVehicles.length > 0) {
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

      // B. Fetch Branches
      const { data: dbBranches, error: bErr } = await supabase.from('branches').select('*');
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

      // C. Fetch Banners
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

      // D. Fetch Site Settings
      const { data: dbSettings, error: sErr } = await supabase.from('site_settings').select('*');
      if (!sErr && dbSettings && dbSettings.length > 0) {
        const settingsMap: SiteSettings = { ...DEFAULT_SITE_SETTINGS };
        dbSettings.forEach((row: any) => {
          if (row.key) settingsMap[row.key] = row.value;
        });
        setSiteSettings(settingsMap);
        localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settingsMap));
      }

      setSupabaseConnected(true);
      setLastSynced(new Date());
    } catch (err) {
      console.warn('Supabase sync warning (using cached data):', err);
      setSupabaseConnected(false);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Initial mount sync & Keep-Alive ping
  useEffect(() => {
    syncWithSupabase();
  }, [syncWithSupabase]);

  // 3. MUTATION: Save Vehicle (Insert / Update)
  const saveVehicle = async (vehicle: Vehicle): Promise<{ success: boolean; error?: string }> => {
    // 1. Optimistic local update
    const updated = vehicles.some((v) => v.id === vehicle.id)
      ? vehicles.map((v) => (v.id === vehicle.id ? vehicle : v))
      : [vehicle, ...vehicles];

    setVehicles(updated);
    localStorage.setItem(LS_VEHICLES_KEY, JSON.stringify(updated));

    // 2. Persist to Supabase
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
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('Supabase vehicle upsert warning:', err);
      return { success: true, error: err.message };
    }
  };

  // 4. MUTATION: Delete Vehicle
  const deleteVehicle = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const updated = vehicles.filter((v) => v.id !== id);
    setVehicles(updated);
    localStorage.setItem(LS_VEHICLES_KEY, JSON.stringify(updated));

    try {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('Supabase vehicle delete warning:', err);
      return { success: true, error: err.message };
    }
  };

  // 5. MUTATION: Save Branch
  const saveBranch = async (branch: Branch): Promise<{ success: boolean; error?: string }> => {
    const updated = branches.map((b) => (b.id === branch.id ? branch : b));
    setBranches(updated);
    localStorage.setItem(LS_BRANCHES_KEY, JSON.stringify(updated));

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
      return { success: true };
    } catch (err: any) {
      console.warn('Supabase branch upsert warning:', err);
      return { success: true, error: err.message };
    }
  };

  // 6. MUTATION: Save Banner
  const saveBanner = async (banner: HeroBanner): Promise<{ success: boolean; error?: string }> => {
    const updated = banners.some((b) => b.id === banner.id)
      ? banners.map((b) => (b.id === banner.id ? banner : b))
      : [...banners, banner];

    setBanners(updated);
    localStorage.setItem(LS_BANNERS_KEY, JSON.stringify(updated));

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
      return { success: true };
    } catch (err: any) {
      console.warn('Supabase banner upsert warning:', err);
      return { success: true, error: err.message };
    }
  };

  // 7. MUTATION: Delete Banner
  const deleteBanner = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const updated = banners.filter((b) => b.id !== id);
    setBanners(updated);
    localStorage.setItem(LS_BANNERS_KEY, JSON.stringify(updated));

    try {
      const { error } = await supabase.from('hero_banners').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.warn('Supabase banner delete warning:', err);
      return { success: true, error: err.message };
    }
  };

  // 8. MUTATION: Save Site Settings
  const saveSiteSettings = async (settings: Partial<SiteSettings>): Promise<{ success: boolean; error?: string }> => {
    const updated = { ...siteSettings, ...settings };
    setSiteSettings(updated);
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(updated));

    try {
      const upsertPromises = Object.entries(settings).map(([key, value]) =>
        supabase.from('site_settings').upsert({
          key,
          value,
          updated_at: new Date().toISOString(),
        })
      );
      await Promise.all(upsertPromises);
      return { success: true };
    } catch (err: any) {
      console.warn('Supabase site settings upsert warning:', err);
      return { success: true, error: err.message };
    }
  };

  return {
    vehicles,
    branches,
    banners,
    siteSettings,
    isSyncing,
    lastSynced,
    supabaseConnected,
    syncWithSupabase,
    saveVehicle,
    deleteVehicle,
    saveBranch,
    saveBanner,
    deleteBanner,
    saveSiteSettings,
  };
}
