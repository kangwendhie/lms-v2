import React, { useState } from 'react';
import { UserRole, PklRecord } from '../types/lms';
import { MOCK_PKL_DATA } from '../data/mockData';
import { calculatePklProgress, PklLogbookItem } from '../utils/lmsLogic';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  UserCheck,
  Award,
  Sparkles,
  MapPin,
  ExternalLink,
  X
} from 'lucide-react';

interface PklMonitoringProps {
  currentRole: UserRole;
  currentUserName: string;
}

export const PklMonitoring: React.FC<PklMonitoringProps> = ({ currentRole, currentUserName }) => {
  const [pklData, setPklData] = useState<PklRecord>(MOCK_PKL_DATA[0]);
  const [isLogbookModalOpen, setIsLogbookModalOpen] = useState(false);
  const [kegiatanBaru, setKegiatanBaru] = useState('');
  const [tanggalBaru, setTanggalBaru] = useState(new Date().toISOString().split('T')[0]);

  const pklStats = calculatePklProgress(pklData.logbook as any, 90);

  const handleAddLogbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kegiatanBaru.trim()) return;

    const newEntry: PklLogbookItem = {
      id: `lb_${Date.now()}`,
      tanggal: tanggalBaru,
      kegiatan: kegiatanBaru,
      status: 'Menunggu',
      catatanPembimbing: 'Menunggu verifikasi guru pembimbing SMK',
    };

    setPklData({
      ...pklData,
      logbook: [newEntry, ...pklData.logbook],
    });

    setIsLogbookModalOpen(false);
    setKegiatanBaru('');
  };

  const handleApproveLogbook = (logbookId: string) => {
    setPklData({
      ...pklData,
      logbook: pklData.logbook.map((lb) =>
        lb.id === logbookId
          ? { ...lb, status: 'Disetujui', catatanPembimbing: 'Diverifikasi & disetujui oleh guru pembimbing.' }
          : lb
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Praktik Kerja Lapangan (PKL) & Magang Industri
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Monitoring DU/DI (Dunia Usaha & Dunia Industri) & Portofolio Kerja Lapangan SMK
          </p>
        </div>

        {currentRole === 'siswa' && (
          <button
            onClick={() => setIsLogbookModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Logbook Harian</span>
          </button>
        )}
      </div>

      {/* DUDI Partner Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase">
                  {pklData.status}
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {pklData.bidangUsaha}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                {pklData.perusahaanDudi}
              </h2>
              <p className="text-xs text-slate-700 mt-0.5 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{pklData.alamatPerusahaan}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div>
              <div className="text-[10px] text-slate-700 uppercase font-bold">Pembimbing DU/DI</div>
              <div className="font-bold text-slate-900">{pklData.pembimbingDudi}</div>
            </div>
            <div className="border-l border-slate-200 pl-3">
              <div className="text-[10px] text-slate-700 uppercase font-bold">Guru Pembimbing</div>
              <div className="font-bold text-slate-900">{pklData.guruPembimbing}</div>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Progress Pelaksanaan Magang ({pklStats.progressPercent}% Selesai)
            </span>
            <span className="text-slate-700">
              {pklStats.approvedCount} hari disetujui &bull; Sisa {pklStats.remainingDays} hari
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, pklStats.progressPercent)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Logbook Harian Feed */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Logbook Aktivitas Harian Siswa di Industri
          </h2>
          <span className="text-xs text-slate-700 font-semibold">
            {pklData.logbook.length} Jurnal Terdaftar
          </span>
        </div>

        <div className="space-y-3">
          {pklData.logbook.map((lb) => (
            <div
              key={lb.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-200 bg-slate-50/50 space-y-2 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-slate-700">
                    {lb.tanggal}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      lb.status === 'Disetujui'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {lb.status}
                  </span>
                </div>

                {currentRole === 'guru' && lb.status !== 'Disetujui' && (
                  <button
                    onClick={() => handleApproveLogbook(lb.id)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Verifikasi Logbook
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-800 leading-relaxed">
                {lb.kegiatan}
              </p>

              {lb.catatanPembimbing && (
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Catatan Pembimbing:</span> {lb.catatanPembimbing}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tambah Logbook */}
      {isLogbookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsLogbookModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900">
              Tambah Logbook Harian PKL
            </h3>

            <form onSubmit={handleAddLogbook} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tanggal Kegiatan
                </label>
                <input
                  type="date"
                  required
                  value={tanggalBaru}
                  onChange={(e) => setTanggalBaru(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Uraian Pekerjaan / Praktik di Perusahaan
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Deskripsikan modul teknis yang dikerjakan, alat/software industri yang digunakan, dan hasil pekerjaan..."
                  value={kegiatanBaru}
                  onChange={(e) => setKegiatanBaru(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogbookModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                >
                  Kirim ke Pembimbing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
