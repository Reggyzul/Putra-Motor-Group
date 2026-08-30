import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Bike, 
  Image as ImageIcon, 
  Building2, 
  Settings, 
  Database, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { VehicleManager } from './VehicleManager';
import { BannerManager } from './BannerManager';
import { BranchManager } from './BranchManager';
import { SiteSettingsManager } from './SiteSettingsManager';
import { ServicesManager } from './ServicesManager';
import { DatabaseSetupGuide } from './DatabaseSetupGuide';
import { Vehicle, Branch, HeroBanner, SiteSettings } from '../../types';
import { formatRupiah } from '../../utils/formatters';
import { ArrowLeftRight } from 'lucide-react';

interface AdminDashboardProps {
  vehicles: Vehicle[];
  branches: Branch[];
  banners: HeroBanner[];
  siteSettings: SiteSettings;
  isSyncing: boolean;
  supabaseConnected: boolean;
  onSync: () => void;
  onSaveVehicle: (vehicle: Vehicle) => Promise<{ success: boolean; error?: string }>;
  onDeleteVehicle: (id: string) => Promise<{ success: boolean; error?: string }>;
  onSaveBranch: (branch: Branch) => Promise<{ success: boolean; error?: string }>;
  onSaveBanner: (banner: HeroBanner) => Promise<{ success: boolean; error?: string }>;
  onDeleteBanner: (id: string) => Promise<{ success: boolean; error?: string }>;
  onSaveSiteSettings: (settings: Partial<SiteSettings>) => Promise<{ success: boolean; error?: string }>;
  onBackToWebsite: () => void;
  onLogout: () => void;
}

type AdminTab = 'overview' | 'vehicles' | 'banners' | 'branches' | 'services' | 'settings' | 'database';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  vehicles,
  branches,
  banners,
  siteSettings,
  isSyncing,
  supabaseConnected,
  onSync,
  onSaveVehicle,
  onDeleteVehicle,
  onSaveBranch,
  onSaveBanner,
  onDeleteBanner,
  onSaveSiteSettings,
  onBackToWebsite,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const navItems = [
    { id: 'overview', label: 'Ringkasan Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'vehicles', label: 'Kelola Stok Motor', icon: Bike, badge: `${vehicles.length}` },
    { id: 'banners', label: 'Hero Promo Banner', icon: ImageIcon, badge: `${banners.length}` },
    { id: 'branches', label: 'Cabang Showroom', icon: Building2, badge: `${branches.length}` },
    { id: 'services', label: 'Tukar Tambah & Dana Tunai', icon: ArrowLeftRight, badge: null },
    { id: 'settings', label: 'Pengaturan Website', icon: Settings, badge: null },
    { id: 'database', label: 'Status DB & Keep-Alive', icon: Database, badge: 'Aktif' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-800 flex font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR NAVIGATION (Desktop Sticky, Full Cerah & Clean)           */}
      {/* ========================================================================= */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-blue-100 shadow-sm flex flex-col justify-between transition-transform duration-200 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/images/pandu_logo.avif" 
                alt="Pandu Motor Group Logo" 
                className="w-10 h-10 rounded-full object-cover shadow-2xs border border-emerald-500/40 bg-white"
              />
              <div className="flex flex-col">
                <span className="text-sm font-black text-[#DC2626] font-['Outfit',sans-serif]">
                  Pandu Motor Group
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Admin Control Panel
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu Buttons */}
          <nav className="p-3.5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as AdminTab);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-[#0B63E5] shadow-xs border border-blue-200/80 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0B63E5]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-3.5 border-t border-gray-100 space-y-2 bg-slate-50/50">
          
          <button
            type="button"
            onClick={onBackToWebsite}
            className="w-full py-2.5 px-3 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-gray-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Lihat Website</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>

        </div>

      </aside>

      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA                                                      */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl border border-gray-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-400">Panel Administrasi</div>
              <div className="text-sm font-black text-slate-900">{siteSettings.brand_name || 'Pandu Motor Group'}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Supabase Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">Supabase & Keep-Alive:</span>
              <span>Aktif</span>
            </div>

            {/* Sync Button */}
            <button
              type="button"
              onClick={onSync}
              disabled={isSyncing}
              className="p-2 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl transition cursor-pointer"
              title="Sinkronkan dengan Supabase"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {/* View Website CTA */}
            <button
              type="button"
              onClick={onBackToWebsite}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <span>Lihat Website</span>
              <ExternalLink className="w-3 h-3" />
            </button>

          </div>

        </header>

        {/* Main Content Body */}
        <main className="p-4 sm:p-8 flex-1 max-w-6xl w-full mx-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-[#0B63E5] to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 max-w-xl space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Selamat Datang di Admin Panel
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {siteSettings.brand_name || 'Pandu Motor Group'}
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
                    Kelola seluruh data website dengan antarmuka yang ramah dan mudah. Seluruh perubahan langsung tersimpan ke Supabase dan aktif seketika di website.
                  </p>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Total Motor */}
                <div 
                  onClick={() => setActiveTab('vehicles')}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-400">Total Stok Motor</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">{vehicles.length} Unit</div>
                </div>

                {/* 2. Total Cabang */}
                <div 
                  onClick={() => setActiveTab('branches')}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-400">Cabang Showroom</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">{branches.length} Lokasi</div>
                </div>

                {/* 3. Hero Promo Banner */}
                <div 
                  onClick={() => setActiveTab('banners')}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-400">Promo Banner Aktif</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">{banners.length} Slide</div>
                </div>

                {/* 4. Sistem Keep-Alive */}
                <div 
                  onClick={() => setActiveTab('database')}
                  className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs hover:shadow-md transition cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-400">Status Keep-Alive</div>
                  <div className="text-2xl font-black text-emerald-600 mt-0.5">100% Aktif</div>
                </div>

              </div>

              {/* Quick Actions & Recent Inventory Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Quick Motor List */}
                <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900">
                      Stok Motor Terkini
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('vehicles')}
                      className="text-xs font-bold text-[#0B63E5] hover:underline"
                    >
                      Lihat Semua ({vehicles.length}) →
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {vehicles.slice(0, 5).map((v) => (
                      <div key={v.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={v.images[0]} alt={v.name} className="w-12 h-9 object-cover rounded-lg border border-gray-200 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">{v.name}</div>
                            <div className="text-[10px] text-slate-400">{v.brand} • {v.year}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-black text-[#0B63E5]">{formatRupiah(v.price)}</div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                            {v.condition}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Quick Settings Summary */}
                <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
                  <h3 className="text-base font-black text-slate-900">
                    Kontak Resmi
                  </h3>

                  <div className="space-y-3 text-xs text-slate-600">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Kantor Pusat:</div>
                      <div className="font-medium mt-0.5 leading-snug">{siteSettings.head_office_address}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Email:</div>
                      <div className="font-bold text-blue-600">{siteSettings.official_email}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Telepon / WhatsApp:</div>
                      <div className="font-bold text-slate-900">{siteSettings.official_phone}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Ubah Pengaturan Website
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: VEHICLES */}
          {activeTab === 'vehicles' && (
            <VehicleManager
              vehicles={vehicles}
              branches={branches}
              onSaveVehicle={onSaveVehicle}
              onDeleteVehicle={onDeleteVehicle}
            />
          )}

          {/* TAB 3: BANNERS */}
          {activeTab === 'banners' && (
            <BannerManager
              banners={banners}
              onSaveBanner={onSaveBanner}
              onDeleteBanner={onDeleteBanner}
            />
          )}

          {/* TAB 4: BRANCHES */}
          {activeTab === 'branches' && (
            <BranchManager
              branches={branches}
              onSaveBranch={onSaveBranch}
            />
          )}

          {/* TAB 5: SERVICES (TUKAR TAMBAH & DANA TUNAI) */}
          {activeTab === 'services' && (
            <ServicesManager
              siteSettings={siteSettings}
              onSaveSiteSettings={onSaveSiteSettings}
            />
          )}

          {/* TAB 6: SITE SETTINGS */}
          {activeTab === 'settings' && (
            <SiteSettingsManager
              siteSettings={siteSettings}
              onSaveSiteSettings={onSaveSiteSettings}
            />
          )}

          {/* TAB 6: DATABASE & KEEP-ALIVE */}
          {activeTab === 'database' && (
            <DatabaseSetupGuide />
          )}

        </main>

      </div>

    </div>
  );
};
