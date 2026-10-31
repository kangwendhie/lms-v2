import React, { useState } from 'react';
import { UserRole, JurnalMengajar } from '../types/lms';
import { MOCK_ATTENDANCE, MOCK_JURNAL, MOCK_KELAS, MOCK_MAPEL } from '../data/mockData';
import { calculateAttendanceStats, AttendanceRecord } from '../utils/lmsLogic';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Plus,
  BookOpen,
  MapPin,
  AlertCircle,
  Users,
  FileSpreadsheet
} from 'lucide-react';

interface PresensiJurnalProps {
  currentRole: UserRole;
  currentUserName: string;
}

export const PresensiJurnal: React.FC<PresensiJurnalProps> = ({ currentRole, currentUserName }) => {
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [jurnalList, setJurnalList] = useState<JurnalMengajar[]>(MOCK_JURNAL);
  const [activeTab, setActiveTab] = useState<'presensi' | 'jurnal'>(
    currentRole === 'guru' ? 'jurnal' : 'presensi'
  );

  // Student check-in feedback state
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [checkInMsg, setCheckInMsg] = useState('');

  // New Journal form state
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [jamKe, setJamKe] = useState('1 - 4 (07:15 - 10:15 WIB)');
  const [kelasId, setKelasId] = useState(MOCK_KELAS[0].id);
  const [mapelId, setMapelId] = useState(MOCK_MAPEL[0].id);
  const [materiPokok, setMateriPokok] = useState('');
  const [kegiatanBelajar, setKegiatanBelajar] = useState('');
  const [kendala, setKendala] = useState('');
  const [jumlahHadir, setJumlahHadir] = useState(36);
  const [jumlahAbsen, setJumlahAbsen] = useState(0);

  const stats = calculateAttendanceStats(attendanceList);

  const handleStudentCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      siswaId: 'user_siswa_1',
      siswaNama: currentUserName,
      tanggal: today,
      status: 'Hadir',
      keterangan: 'Presensi digital via portal EduSMK',
    };

    setAttendanceList([newRecord, ...attendanceList]);
    setHasCheckedInToday(true);
    setCheckInMsg('Presensi berhasil dicatat! Terverifikasi hadir di Lab Komputer RPL.');
  };

  const handleSaveJurnal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materiPokok.trim()) return;

    const newJurnal: JurnalMengajar = {
      id: `jurn_${Date.now()}`,
      tanggal: new Date().toISOString().split('T')[0],
      jamKe,
      kelasId,
      mapelId,
      materiPokok,
      kegiatanBelajar,
      kendala: kendala || undefined,
      jumlahHadir: Number(jumlahHadir),
      jumlahAbsen: Number(jumlahAbsen),
    };

    setJurnalList([newJurnal, ...jurnalList]);
    setIsJournalModalOpen(false);
    setMateriPokok('');
    setKegiatanBelajar('');
    setKendala('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Presensi Kehadiran & Jurnal Mengajar Guru
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Rekapitulasi kedisiplinan belajar dan monitoring aktivitas kelas SMK
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('presensi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'presensi'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Presensi Siswa
          </button>
          <button
            onClick={() => setActiveTab('jurnal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'jurnal'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jurnal Mengajar Guru
          </button>
        </div>
      </div>

      {/* Tab 1: Presensi Siswa */}
      {activeTab === 'presensi' && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-700">Persentase</span>
              <div className="text-2xl font-black text-indigo-600 mt-1">
                {stats.persentaseKehadiran}%
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-700">Hadir</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{stats.hadir}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-700">Sakit (S)</span>
              <div className="text-2xl font-black text-amber-500 mt-1">{stats.sakit}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] font-semibold text-slate-700">Izin (I)</span>
              <div className="text-2xl font-black text-sky-600 mt-1">{stats.izin}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-slate-700">Alpa (A)</span>
              <div className="text-2xl font-black text-rose-500 mt-1">{stats.alpa}</div>
            </div>
          </div>

          {/* Quick Check-In Banner for Siswa */}
          {currentRole === 'siswa' && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Presensi Kehadiran Hari Ini (Geofencing SMK)
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  Lokasi: Kampus SMK Negeri 1 Kejuruan &bull; Jam Operasional: 06:45 - 07:30 WIB
                </p>
                {checkInMsg && (
                  <p className="text-xs font-bold text-emerald-700 pt-1 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{checkInMsg}</span>
                  </p>
                )}
              </div>

              <button
                disabled={hasCheckedInToday}
                onClick={handleStudentCheckIn}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-emerald-600 text-white text-xs font-bold shadow-xs cursor-pointer disabled:cursor-default transition-all whitespace-nowrap self-start sm:self-auto"
              >
                {hasCheckedInToday ? '✓ Sudah Hadir Hari Ini' : 'Tap Hadir Sekarang'}
              </button>
            </div>
          )}

          {/* Attendance Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Riwayat Presensi Siswa
              </h2>
              <span className="text-xs text-slate-700">
                Total {attendanceList.length} Catatan
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Nama Siswa</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 font-mono font-medium text-slate-700">
                        {item.tanggal}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {item.siswaNama}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                            item.status === 'Hadir'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Sakit'
                              ? 'bg-amber-100 text-amber-800'
                              : item.status === 'Izin'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.keterangan || 'Presensi reguler'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Jurnal Mengajar Guru */}
      {activeTab === 'jurnal' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Jurnal Harian Aktivitas Mengajar Guru
            </h2>

            {currentRole !== 'siswa' && (
              <button
                onClick={() => setIsJournalModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Isi Jurnal Mengajar</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jurnalList.map((jurnal) => (
              <div
                key={jurnal.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    XII RPL 1
                  </span>
                  <span className="text-xs text-slate-700 font-mono font-medium">
                    {jurnal.tanggal} &bull; {jurnal.jamKe}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Materi Pokok: {jurnal.materiPokok}
                  </h3>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {jurnal.kegiatanBelajar}
                  </p>
                </div>

                {jurnal.kendala && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/60 text-xs text-amber-900">
                    <strong>Kendala Kelas:</strong> {jurnal.kendala}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700 font-medium">
                  <span className="flex items-center space-x-1 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hadir: {jurnal.jumlahHadir} Siswa</span>
                  </span>
                  <span className="text-rose-600">
                    Absen: {jurnal.jumlahAbsen} Siswa
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Tambah Jurnal Mengajar */}
      {isJournalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900">
              Input Jurnal Mengajar Guru Produktif
            </h3>

            <form onSubmit={handleSaveJurnal} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kelas / Rombel
                  </label>
                  <select
                    value={kelasId}
                    onChange={(e) => setKelasId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  >
                    {MOCK_KELAS.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Mengajar Ke-
                  </label>
                  <input
                    type="text"
                    value={jamKe}
                    onChange={(e) => setJamKe(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Materi Pokok Pembelajaran
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: REST API Authentication & Keamanan Token"
                  value={materiPokok}
                  onChange={(e) => setMateriPokok(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Kegiatan Belajar Mengajar
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Aktivitas siswa di laboratorium, praktikum yang dijalankan..."
                  value={kegiatanBelajar}
                  onChange={(e) => setKegiatanBelajar(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kendala / Catatan Siswa (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: 2 PC laboratorium perlu instalasi ulang perangkat lunak"
                  value={kendala}
                  onChange={(e) => setKendala(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJournalModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                >
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
