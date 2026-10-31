import React from 'react';
import { UserProfile, UserRole } from '../types/lms';
import { MOCK_JURUSAN, MOCK_MATERI, MOCK_CBT_EXAM, MOCK_PKL_DATA } from '../data/mockData';
import { 
  BookOpen, 
  FileCheck2, 
  CalendarCheck2, 
  Building2, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Code2, 
  Network, 
  Palette, 
  Wrench, 
  Calculator, 
  Users, 
  Sparkles,
  Award
} from 'lucide-react';

interface DashboardOverviewProps {
  currentUser: UserProfile;
  currentRole: UserRole;
  onNavigate: (nav: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentUser,
  currentRole,
  onNavigate,
}) => {
  const jurusanIconMap: Record<string, React.ReactNode> = {
    Code2: <Code2 className="w-5 h-5 text-emerald-600" />,
    Network: <Network className="w-5 h-5 text-sky-600" />,
    Palette: <Palette className="w-5 h-5 text-purple-600" />,
    Wrench: <Wrench className="w-5 h-5 text-amber-600" />,
    Calculator: <Calculator className="w-5 h-5 text-indigo-600" />,
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 top-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tahun Ajaran 2026/2027 &bull; Semester Ganjil SMK</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Selamat Datang di EduSMK, {currentUser.name}! 👋
          </h1>
          
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            {currentRole === 'siswa' && (
              <>
                Siswa Kelas <strong className="text-white">XII RPL 1</strong> (Rekayasa Perangkat Lunak). 
                Pantau modul ajar kejuruan, selesaikan tugas proyek, kerjakan asesmen CBT, dan isi logbook magang industri (PKL).
              </>
            )}
            {currentRole === 'guru' && (
              <>
                Portal Pengajar Produktif RPL. Kelola modul materi praktik kejuruan, review penugasan proyek, 
                buat bank soal ujian CBT, dan catat jurnal harian mengajar.
              </>
            )}
            {currentRole === 'admin' && (
              <>
                Administrator Kurikulum & Sistem SMK. Kelola data master jurusan, rombel, akun pengajar, 
                serta pantau ketuntasan belajar dan pelaksanaan PKL siswa.
              </>
            )}
          </p>

          {/* Quick Action Badges */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('cbt')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Ikuti Ujian CBT Kejuruan</span>
            </button>
            <button
              onClick={() => onNavigate('tugas')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Lihat Tugas & Nilai Proyek</span>
            </button>
            <button
              onClick={() => onNavigate('pkl')}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>Monitoring Magang (PKL)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {currentRole === 'siswa' ? (
          <>
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Presensi Kehadiran</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">100%</span>
                <span className="text-xs font-semibold text-emerald-600">Disiplin</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-700">5 dari 5 pertemuan hadir</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Modul Kejuruan</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">2 / 4</span>
                <span className="text-xs font-semibold text-indigo-600">50% Tuntas</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-700">Pemrograman Web & Basis Data</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Tugas Proyek</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">92.0</span>
                <span className="text-xs font-semibold text-emerald-600">Grade A</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-700">Proyek Sistem Presensi Digital</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Progress PKL Industri</span>
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">PT Telkom</span>
                <span className="text-xs font-semibold text-sky-600">Aktif</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-700">3 Logbook disetujui pembimbing</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Siswa Produktif</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">144</span>
                <span className="text-xs font-semibold text-indigo-600">Siswa RPL</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-700">Kelas XII RPL 1 & 2 Aktif</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Modul & Bank Soal</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">4 Modul</span>
                <span className="text-xs font-semibold text-emerald-600">Lengkap</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-700">Pemrograman Web & Basis Data</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Tugas Masuk</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">35 / 36</span>
                <span className="text-xs font-semibold text-amber-600">Perlu Review</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-700">Proyek Presensi & Jurnal Kelas</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">Rata-Rata Nilai Kelas</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl font-black text-emerald-600">88.5</span>
                <span className="text-xs font-semibold text-slate-500">Tuntas</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-700">Di atas standar KKM (75.0)</p>
            </div>
          </>
        )}
      </div>

      {/* Program Keahlian / Jurusan SMK Showcase */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              5 Program Keahlian Unggulan SMK
            </h2>
            <p className="text-xs text-slate-700">
              Diselaraskan dengan Standar Kompetensi Kerja Nasional Indonesia (SKKNI) & Kurikulum Merdeka
            </p>
          </div>
          <button
            onClick={() => onNavigate('master')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Kelola Kurikulum Jurusan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {MOCK_JURUSAN.map((jur) => (
            <div
              key={jur.id}
              className="p-4 rounded-xl border border-slate-200/70 hover:border-indigo-300 hover:shadow-xs transition-all bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${jur.badgeBg}`}>
                    {jur.kode}
                  </span>
                  <div className="p-1 rounded-md bg-white shadow-2xs">
                    {jurusanIconMap[jur.iconName]}
                  </div>
                </div>
                <h3 className="text-xs font-bold text-slate-800 leading-snug line-clamp-1">
                  {jur.nama}
                </h3>
                <p className="text-[11px] text-slate-700 mt-1 line-clamp-3 leading-relaxed">
                  {jur.deskripsi}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-700">
                <span>{jur.jumlahSiswa} Siswa</span>
                <span className="font-semibold text-indigo-700">Aktif</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Jadwal Praktikum & Asesmen Ujian CBT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Materi Pembelajaran Terbaru */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Modul Ajar & Praktikum Kejuruan
              </h2>
              <p className="text-xs text-slate-700">
                Materi berbasis proyek nyata (Project-Based Learning)
              </p>
            </div>
            <button
              onClick={() => onNavigate('materi')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>Semua Modul ({MOCK_MATERI.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_MATERI.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigate('materi')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer flex items-start justify-between group"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                        Pertemuan {item.pertemuanKe}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {item.durasi}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 mt-1 group-hover:text-indigo-600 transition-colors">
                      {item.judul}
                    </h3>
                    <p className="text-[11px] text-slate-700 mt-0.5 line-clamp-1">
                      {item.deskripsi}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 ml-3">
                  {item.statusSelesai ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Tuntas</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                      Belum
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Ujian CBT & Agenda PKL */}
        <div className="space-y-6">
          {/* Ujian CBT Highlight Box */}
          <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-2xl border border-indigo-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white uppercase tracking-wider">
                Asesmen Aktif
              </span>
              <span className="text-xs font-semibold text-indigo-700 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>20 Menit</span>
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              {MOCK_CBT_EXAM.judul}
            </h3>
            <p className="text-xs text-slate-700 mt-1">
              5 Soal Kejuruan (Rekayasa Perangkat Lunak & Basis Data) dengan timer otomatis.
            </p>

            <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between">
              <div className="text-xs text-slate-700">
                KKM: <strong className="text-slate-800">{MOCK_CBT_EXAM.kkm}</strong>
              </div>
              <button
                onClick={() => onNavigate('cbt')}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Mulai Ujian
              </button>
            </div>
          </div>

          {/* PKL DU/DI Partner Mini Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 mb-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Mitra Industri PKL Aktif</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="text-xs font-bold text-slate-800">
                {MOCK_PKL_DATA[0].perusahaanDudi}
              </div>
              <div className="text-[11px] text-slate-700 mt-0.5">
                Pembimbing: {MOCK_PKL_DATA[0].pembimbingDudi}
              </div>
              <div className="mt-2.5 flex items-center justify-between text-[11px]">
                <span className="text-slate-700">Status Magang:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {MOCK_PKL_DATA[0].status}
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('pkl')}
              className="mt-3 w-full py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Buka Logbook Harian PKL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
