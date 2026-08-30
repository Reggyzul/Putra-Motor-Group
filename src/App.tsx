import React, { useState, useEffect } from 'react';
import { BRANCHES_DATA } from './data/branches';
import { VEHICLES_DATA } from './data/vehicles';
import { Branch, Vehicle } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VehicleCatalog } from './components/VehicleCatalog';
import { VehicleDetail } from './components/VehicleDetail';
import { DanaTunaiSection } from './components/DanaTunaiSection';
import { TradeInSimulator } from './components/TradeInSimulator';
import { BranchShowcase } from './components/BranchShowcase';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { ArrowLeft, Home, ChevronRight, BadgeDollarSign, ArrowLeftRight, Building2, Bike } from 'lucide-react';

export type PageView = 'home' | 'dana-tunai' | 'tukar-tambah' | 'cabang' | 'katalog' | 'detail';

export default function App() {
  const [selectedBranch, setSelectedBranch] = useState<Branch>(BRANCHES_DATA[0]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(VEHICLES_DATA[0]);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentPage('detail');
  };

  const handleSearchSubmit = (query: string) => {
    setGlobalSearchQuery(query);
    setCurrentPage('katalog');
  };

  const handleNavigate = (target: string) => {
    if (target === 'dana-tunai') {
      setCurrentPage('dana-tunai');
      return;
    }

    if (target === 'tukar-tambah') {
      setCurrentPage('tukar-tambah');
      return;
    }

    if (target === 'cabang') {
      setCurrentPage('cabang');
      return;
    }

    if (target === 'katalog' || target === 'motor-baru' || target === 'motor-bekas') {
      setCurrentPage('katalog');
      return;
    }

    if (target === 'detail') {
      setCurrentPage('detail');
      return;
    }

    if (target === 'hero' || target === 'home') {
      setCurrentPage('home');
      setActiveSection('hero');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Default scroll to anchor if on home
    if (currentPage === 'home') {
      const elem = document.getElementById(target);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setCurrentPage('home');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Navbar with Live Search Sync */}
      <Navbar
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        searchQuery={globalSearchQuery}
        onSearchChange={setGlobalSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onSelectVehicle={handleSelectVehicle}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* ========================================================================= */}
        {/* VIEW 1: LANDING PAGE (Home)                                               */}
        {/* ========================================================================= */}
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-200">
            {/* 1. Hero Carousel Banner & 3 Layanan Utama (Beli Motor, Dana Tunai, Tukar Tambah) */}
            <Hero
              selectedBranch={selectedBranch}
              onNavigate={handleNavigate}
            />

            {/* 2. Katalog Motor (12 Motor Pilihan + Klik membuka Detail) */}
            <VehicleCatalog
              selectedBranch={selectedBranch}
              onNavigate={handleNavigate}
              onSelectVehicle={handleSelectVehicle}
              searchQuery={globalSearchQuery}
              onSearchChange={setGlobalSearchQuery}
              isLandingPage={true}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: HALAMAN DETAIL MOTOR (Deskripsi Membedakan Baru/Bekas Lengkap)     */}
        {/* ========================================================================= */}
        {currentPage === 'detail' && selectedVehicle && (
          <VehicleDetail
            vehicle={selectedVehicle}
            selectedBranch={selectedBranch}
            onNavigate={handleNavigate}
          />
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: HALAMAN 4 CABANG SHOWROOM (Dedicated Next Page)                   */}
        {/* ========================================================================= */}
        {currentPage === 'cabang' && (
          <div className="animate-in fade-in duration-200">
            {/* Breadcrumb Navigation Bar */}
            <div className="bg-white border-b border-gray-200 py-3 shadow-2xs">
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleNavigate('home')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Beranda</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span onClick={() => handleNavigate('home')} className="hover:text-blue-600 cursor-pointer flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Beranda</span>
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="font-bold text-[#0B63E5] flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>4 Cabang Showroom</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Dedicated 4 Cabang Showroom Section */}
            <BranchShowcase
              selectedBranch={selectedBranch}
              onSelectBranch={setSelectedBranch}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: HALAMAN KATALOG LENGKAP MOTOR (Satu Kesatuan Baru & Bekas)         */}
        {/* ========================================================================= */}
        {currentPage === 'katalog' && (
          <div className="animate-in fade-in duration-200">
            {/* Breadcrumb Navigation Bar */}
            <div className="bg-white border-b border-gray-200 py-3 shadow-2xs">
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleNavigate('home')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Beranda</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span onClick={() => handleNavigate('home')} className="hover:text-blue-600 cursor-pointer flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Beranda</span>
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="font-bold text-[#0B63E5] flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5" />
                    <span>Katalog Lengkap Motor</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Full Vehicle Catalog with Search & Filter */}
            <VehicleCatalog
              selectedBranch={selectedBranch}
              onNavigate={handleNavigate}
              onSelectVehicle={handleSelectVehicle}
              searchQuery={globalSearchQuery}
              onSearchChange={setGlobalSearchQuery}
              isLandingPage={false}
              pageTitle="Katalog Lengkap Motor Pandu Motor Group"
              pageSubtitle="Jelajahi seluruh pilihan motor baru & motor bekas berkualitas dari seluruh jaringan showroom Pandu Motor Group."
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: HALAMAN DANA TUNAI (Dedicated Next Page)                          */}
        {/* ========================================================================= */}
        {currentPage === 'dana-tunai' && (
          <div className="animate-in fade-in duration-200">
            {/* Breadcrumb Navigation Bar */}
            <div className="bg-white border-b border-gray-200 py-3 shadow-2xs">
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleNavigate('home')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Beranda</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span onClick={() => handleNavigate('home')} className="hover:text-blue-600 cursor-pointer flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Beranda</span>
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <BadgeDollarSign className="w-3.5 h-3.5" />
                    <span>Dana Tunai BPKB</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Dedicated Dana Tunai Section */}
            <DanaTunaiSection selectedBranch={selectedBranch} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 6: HALAMAN TUKAR TAMBAH (Dedicated Next Page)                        */}
        {/* ========================================================================= */}
        {currentPage === 'tukar-tambah' && (
          <div className="animate-in fade-in duration-200">
            {/* Breadcrumb Navigation Bar */}
            <div className="bg-white border-b border-gray-200 py-3 shadow-2xs">
              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleNavigate('home')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-xs sm:text-sm transition cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Beranda</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span onClick={() => handleNavigate('home')} className="hover:text-blue-600 cursor-pointer flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Beranda</span>
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="font-bold text-sky-700 flex items-center gap-1">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Tukar Tambah Motor</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Dedicated Trade-In Section */}
            <TradeInSimulator selectedBranch={selectedBranch} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
      />

      {/* Floating Fast Contact WhatsApp Widget */}
      <FloatingWhatsApp
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
      />
    </div>
  );
}
