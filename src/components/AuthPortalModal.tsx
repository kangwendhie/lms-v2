import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types/lms';
import { MOCK_USERS } from '../data/mockData';
import { authenticateUser } from '../utils/lmsLogic';
import {
  GraduationCap,
  KeyRound,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  LogIn,
  X,
  BookOpen,
  UserCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface AuthPortalModalProps {
  isOpen: boolean;
  isFullScreenLogin?: boolean;
  currentRole: UserRole;
  onLoginSuccess: (role: UserRole) => void;
  onClose?: () => void;
}

export const AuthPortalModal: React.FC<AuthPortalModalProps> = ({
  isOpen,
  isFullScreenLogin = false,
  currentRole,
  onLoginSuccess,
  onClose,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen && !isFullScreenLogin) return null;

  const accountsList: UserProfile[] = [
    MOCK_USERS.siswa,
    MOCK_USERS.guru,
    MOCK_USERS.admin,
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFillForm = (acc: UserProfile) => {
    setIdentifier(acc.username);
    setPassword(acc.password);
    setErrorMsg('');
    setSuccessMsg(`Form diisi dengan kredensial ${acc.role.toUpperCase()} (@${acc.username}). Klik "Masuk ke Portal" di bawah.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const result = authenticateUser(identifier, password, MOCK_USERS);
    if (!result.success || !result.role) {
      setErrorMsg(result.message);
      return;
    }

    setSuccessMsg(result.message);
    onLoginSuccess(result.role);
  };

  const roleBadgeConfig: Record<
    UserRole,
    { label: string; badgeClass: string; icon: React.ReactNode }
  > = {
    siswa: {
      label: 'Akun Siswa',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
    },
    guru: {
      label: 'Akun Guru',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <UserCheck className="w-4 h-4 text-emerald-600" />,
    },
    admin: {
      label: 'Akun Admin',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
    },
  };

  return (
    <div
      className={
        isFullScreenLogin
          ? 'min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6'
          : 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto'
      }
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 grid grid-cols-1 lg:grid-cols-12 relative my-auto">
        {!isFullScreenLogin && onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Tutup modal akun dan login"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Left Column: Login Form (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white flex flex-col justify-between">
          <div className="space-y-6">
            {/* Brand Header */}
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-xl tracking-tight text-white">
                    Edu<span className="text-emerald-400">SMK</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 border border-white/15">
                    SSO Portal
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  SMK Negeri 1 Kejuruan &bull; Kurikulum Merdeka
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Login Portal Akademik
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Masuk menggunakan <strong className="text-white">Username</strong>,{' '}
                <strong className="text-white">NISN/NIP</strong>, atau{' '}
                <strong className="text-white">Email</strong> sesuai peran Anda.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Username / NISN / NIP / Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Ketik: siswa, guru, atau admin"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ketik: siswa123, guru123, atau admin123"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 focus:bg-white/15 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white cursor-pointer"
                    aria-label="Tampilkan atau sembunyikan password"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-xs text-rose-200 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-200 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Portal EduSMK</span>
              </button>
            </form>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 text-[11px] text-slate-300 flex items-center justify-between">
            <span>Status Sesi Aktif:</span>
            <span className="font-bold text-emerald-300 uppercase">
              @{MOCK_USERS[currentRole].username} ({currentRole})
            </span>
          </div>
        </div>

        {/* Right Column: Role Credentials Directory (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-slate-50 space-y-5 max-h-[85vh] overflow-y-auto">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 mb-2">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Daftar Kredensial Akun Resmi</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Username & Password Akun EduSMK
            </h3>
            <p className="text-xs text-slate-700 mt-0.5">
              Gunakan kredensial di bawah ini untuk menguji hak akses atau klik{' '}
              <strong>Isi Form</strong> / <strong>Masuk Langsung</strong>.
            </p>
          </div>

          <div className="space-y-3.5">
            {accountsList.map((acc) => {
              const cfg = roleBadgeConfig[acc.role];
              const isCurrent = currentRole === acc.role && !isFullScreenLogin;

              return (
                <div
                  key={acc.id}
                  className={`p-4 rounded-2xl bg-white border transition-all ${
                    isCurrent
                      ? 'border-indigo-500 ring-2 ring-indigo-500/15 shadow-sm'
                      : 'border-slate-200/90 hover:border-indigo-300 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase flex items-center space-x-1 ${cfg.badgeClass}`}
                          >
                            {cfg.icon}
                            <span>{cfg.label}</span>
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              Sedang Aktif
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                          {acc.name}
                        </h4>
                        <p className="text-[11px] text-slate-600">{acc.jabatan}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleFillForm(acc)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Isi Form
                      </button>
                      <button
                        type="button"
                        onClick={() => onLoginSuccess(acc.role)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
                      >
                        <LogIn className="w-3 h-3" />
                        <span>Masuk Langsung</span>
                      </button>
                    </div>
                  </div>

                  {/* Credential Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 text-xs">
                    {/* Username Box */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-500 block">
                          Username
                        </span>
                        <code className="font-mono font-extrabold text-indigo-700 text-xs">
                          {acc.username}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.username, `user_${acc.role}`)}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
                        title="Salin Username"
                      >
                        {copiedKey === `user_${acc.role}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Password Box */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-500 block">
                          Password
                        </span>
                        <code className="font-mono font-extrabold text-emerald-700 text-xs">
                          {acc.password}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.password, `pass_${acc.role}`)}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
                        title="Salin Password"
                      >
                        {copiedKey === `pass_${acc.role}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* NISN / NIP / Email Box */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                      <div className="truncate pr-1">
                        <span className="text-[10px] font-bold uppercase text-slate-500 block">
                          {acc.nisn ? 'NISN Siswa' : 'NIP Pegawai'}
                        </span>
                        <code className="font-mono font-bold text-slate-800 text-[11px]">
                          {acc.nisn || acc.nip}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(acc.nisn || acc.nip || '', `id_${acc.role}`)
                        }
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer shrink-0"
                        title="Salin Nomor Induk"
                      >
                        {copiedKey === `id_${acc.role}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
