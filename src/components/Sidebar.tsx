import React from 'react';
import { UserRole } from '../types/lms';
import {
  LayoutDashboard,
  BookOpen,
  FolderGit2,
  FileCheck2,
  CalendarCheck,
  Building2,
  Layers,
  Award
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  activeNav: string;
  onSelectNav: (nav: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeNav,
  onSelectNav,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['siswa', 'guru', 'admin'],
      badge: 'Utama',
    },
    {
      id: 'materi',
      label: 'Modul & Video Kejuruan',
      icon: BookOpen,
      roles: ['siswa', 'guru', 'admin'],
      badge: '4 Modul',
    },
    {
      id: 'tugas',
      label: currentRole === 'guru' ? 'Penilaian Proyek Siswa' : 'Tugas Proyek SMK',
      icon: FolderGit2,
      roles: ['siswa', 'guru', 'admin'],
      badge: 'Aktif',
    },
    {
      id: 'cbt',
      label: 'Ujian CBT Online',
      icon: FileCheck2,
      roles: ['siswa', 'guru', 'admin'],
      badge: 'Asesmen',
    },
    {
      id: 'presensi',
      label: currentRole === 'guru' ? 'Jurnal Mengajar & Presensi' : 'Presensi Kehadiran',
      icon: CalendarCheck,
      roles: ['siswa', 'guru', 'admin'],
    },
    {
      id: 'pkl',
      label: 'Monitoring Magang (PKL)',
      icon: Building2,
      roles: ['siswa', 'guru', 'admin'],
      badge: 'DU/DI',
    },
    {
      id: 'master',
      label: 'Data Master Jurusan & Rombel',
      icon: Layers,
      roles: ['guru', 'admin'],
    },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(currentRole));

  const content = (
    <div className="h-full flex flex-col justify-between py-5 px-4 bg-white border-r border-slate-200">
      <div className="space-y-6">
        {/* Jurusan Filter Quick View */}
        <div className="p-3 bg-gradient-to-br from-indigo-50/80 to-slate-50 rounded-xl border border-indigo-100">
          <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Program Kejuruan</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-xs font-bold text-slate-800">
            SMK Negeri 1 Kejuruan
          </div>
          <p className="text-[11px] text-slate-700 mt-0.5">
            5 Kompetensi Keahlian &bull; Tahun 2026/2027
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 px-3 mb-2">
            Menu Pembelajaran
          </div>
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectNav(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sertifikasi & UKK SMK Callout */}
      <div className="pt-4 border-t border-slate-100">
        <div className="p-3.5 rounded-xl bg-slate-900 text-white relative overflow-hidden shadow-sm">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300">
              LSP-P1 SMK
            </span>
            <span className="text-[10px] text-slate-400">SKKNI</span>
          </div>
          <p className="text-xs font-semibold text-white">
            Uji Kompetensi Keahlian
          </p>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
            Persiapkan diri menghadapi sertifikasi profesi dan asesmen sumatif kejuruan.
          </p>
          <button
            onClick={() => {
              onSelectNav('cbt');
              onCloseMobile();
            }}
            className="mt-2.5 w-full py-1.5 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Buka Asesmen CBT</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
