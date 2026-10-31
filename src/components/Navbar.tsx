import React, { useState, useRef, useEffect } from 'react';
import { UserRole, UserProfile, InAppNotification } from '../types/lms';
import { filterNotificationsByRole } from '../utils/lmsLogic';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Bell,
  CheckCheck,
  Award,
  FolderGit2,
  Clock,
  KeyRound,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  currentRole: UserRole;
  onSelectNav: (nav: string) => void;
  activeNav: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  notifications: InAppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  onSelectNav,
  activeNav,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onOpenAuthModal,
  onLogout,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifContainerRef = useRef<HTMLDivElement>(null);

  const { items: roleNotifications, unreadCount } = filterNotificationsByRole(
    notifications,
    currentRole
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifContainerRef.current &&
        !notifContainerRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSelectNav('dashboard')}
              className="flex items-center space-x-3 group text-left cursor-pointer focus:outline-hidden"
              aria-label="Kembali ke Beranda EduSMK"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-lg tracking-tight text-slate-900">
                    Edu<span className="text-indigo-600">SMK</span>
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    SMK Pusat Keunggulan
                  </span>
                </div>
                <p className="text-xs text-slate-700 hidden sm:block font-medium">
                  SMK Negeri 1 Kejuruan &bull; Kurikulum Merdeka
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Shortcuts (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => onSelectNav('materi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeNav === 'materi'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Modul Kejuruan
            </button>
            <button
              onClick={() => onSelectNav('tugas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeNav === 'tugas'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Tugas Proyek
            </button>
            <button
              onClick={() => onSelectNav('cbt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeNav === 'cbt'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Ujian CBT
            </button>
            <button
              onClick={() => onSelectNav('pkl')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeNav === 'pkl'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Praktik Industri (PKL)
            </button>
          </div>

          {/* Right Action: Notification Bell & User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* In-App Notification Center Dropdown */}
            <div className="relative" ref={notifContainerRef}>
              <button
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
                  isNotifOpen
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                aria-label={`Notifikasi (${unreadCount} belum dibaca)`}
                aria-expanded={isNotifOpen}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-slate-900">
                        Notifikasi Akademik
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 capitalize">
                        {currentRole}
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkAllNotificationsRead}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Tandai Semua Dibaca</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {roleNotifications.length === 0 ? (
                      <div className="p-6 text-center space-y-2">
                        <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs font-semibold text-slate-600">
                          Belum ada notifikasi untuk peran {currentRole}.
                        </p>
                      </div>
                    ) : (
                      roleNotifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => {
                            onMarkNotificationRead(notif.id);
                            onSelectNav(notif.targetNav);
                            setIsNotifOpen(false);
                          }}
                          className={`w-full text-left p-3.5 transition-colors flex items-start space-x-3 cursor-pointer ${
                            notif.dibaca
                              ? 'bg-white hover:bg-slate-50'
                              : 'bg-indigo-50/50 hover:bg-indigo-50'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              notif.tipe === 'nilai_tugas'
                                ? 'bg-emerald-100 text-emerald-700'
                                : notif.tipe === 'tugas_baru'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {notif.tipe === 'nilai_tugas' ? (
                              <Award className="w-4 h-4" />
                            ) : (
                              <FolderGit2 className="w-4 h-4" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-xs truncate ${
                                  notif.dibaca
                                    ? 'font-semibold text-slate-800'
                                    : 'font-extrabold text-slate-900'
                                }`}
                              >
                                {notif.judul}
                              </span>
                              {!notif.dibaca && (
                                <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed line-clamp-2">
                              {notif.pesan}
                            </p>
                            <div className="flex items-center space-x-1 text-[10px] text-slate-500 mt-1.5 font-medium">
                              <Clock className="w-3 h-3" />
                              <span>{notif.waktu}</span>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">
                      Klik item untuk membuka Tugas Proyek
                    </span>
                    <button
                      onClick={() => {
                        onSelectNav('tugas');
                        setIsNotifOpen(false);
                      }}
                      className="font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      Buka Semua Tugas &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Mini Badge & Auth Buttons */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 shrink-0">
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                title="Lihat daftar username & password atau ganti akun"
              >
                <KeyRound className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Akun & Login</span>
              </button>

              <div className="hidden md:flex items-center space-x-2 pl-1 shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100 shrink-0"
                />
                <div className="text-left whitespace-nowrap">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.name.split(',')[0]}
                  </div>
                  <div className="text-[10px] text-slate-700 font-mono">
                    @{currentUser.username} &bull; <span className="font-sans">{currentUser.jabatan}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                title="Keluar / Tampilkan Halaman Login"
                aria-label="Keluar dari sesi saat ini"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Buka menu navigasi"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
