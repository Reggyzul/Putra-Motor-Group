import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Bike, 
  BadgeDollarSign, 
  ArrowLeftRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { Branch } from '../types';
import { BRANCHES_DATA } from '../data/branches';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  selectedBranch: Branch;
  onLoginSuccess: (userData: { name: string; phone: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  selectedBranch,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [primaryInterest, setPrimaryInterest] = useState<'motor_bekas' | 'motor_baru' | 'tukar_tambah' | 'dana_tunai'>('motor_bekas');
  const [preferredBranch, setPreferredBranch] = useState(selectedBranch.id);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const nameToUse = loginIdentifier ? loginIdentifier.split('@')[0] : 'Member Pandu Motor';
      onLoginSuccess({
        name: nameToUse.charAt(0).toUpperCase() + nameToUse.slice(1),
        phone: '08123456789',
        email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@gmail.com`,
      });
      onClose();
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Pendaftaran akun berhasil!');
      setTimeout(() => {
        onLoginSuccess({
          name: fullName,
          phone: phone,
          email: email,
        });
        onClose();
      }, 700);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B63E5] to-blue-700 flex items-center justify-center text-white shadow-sm">
              <Bike className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center text-xl font-black">
              <span className="text-slate-900 font-['Outfit',sans-serif]">Pandu</span>
              <span className="text-[#0B63E5] font-['Outfit',sans-serif] ml-1">Motor</span>
              <span className="text-[10px] font-extrabold text-amber-500 uppercase ml-1.5 tracking-wider">GROUP</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Akses simulasi kredit motor, booking unit & layanan terlengkap
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'login'
                ? 'bg-white text-[#0B63E5] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'register'
                ? 'bg-white text-[#0B63E5] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Daftar Baru
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email atau No. Handphone:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="Contoh: user@email.com / 0812xxxx"
                  className="w-full bg-slate-50 border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">Password:</label>
                <span className="text-[11px] text-[#0B63E5] hover:underline cursor-pointer">Lupa Password?</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-gray-300 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap:</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama Lengkap Sesuai KTP"
                  className="w-full bg-slate-50 border border-gray-300 rounded-xl pl-10 pr-3.5 py-2 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">No. WhatsApp:</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxx"
                  className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@mail.com"
                  className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password:</label>
              <input
                type="password"
                required
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full bg-slate-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            {successMessage && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0B63E5] hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? <span>Mendaftarkan...</span> : <span>Daftar Akun Baru</span>}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
