import React, { useState } from 'react';
import { Tugas, UserRole } from '../types/lms';
import { MOCK_MAPEL } from '../data/mockData';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Link2,
  Edit3,
  X,
  MessageSquare,
  Sparkles,
  Plus,
  BellRing
} from 'lucide-react';

interface TugasProyekProps {
  tugasList: Tugas[];
  currentRole: UserRole;
  onSubmitTugas: (tugasId: string, fileUrl: string, catatan: string) => void;
  onGradeTugas: (tugasId: string, nilai: number, feedback: string) => void;
  onAddTugas: (newTugas: Tugas) => void;
}

export const TugasProyek: React.FC<TugasProyekProps> = ({
  tugasList,
  currentRole,
  onSubmitTugas,
  onGradeTugas,
  onAddTugas,
}) => {
  const [selectedTugasId, setSelectedTugasId] = useState<string>(tugasList[0]?.id || '');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Teacher grading modal state
  const [isGradingOpen, setIsGradingOpen] = useState(false);
  const [gradeInput, setGradeInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState('');

  // Teacher create new assignment modal state
  const [isAddTugasOpen, setIsAddTugasOpen] = useState(false);
  const [newJudul, setNewJudul] = useState('');
  const [newDeskripsi, setNewDeskripsi] = useState('');
  const [newMapelId, setNewMapelId] = useState(MOCK_MAPEL[0].id);
  const [newTipe, setNewTipe] = useState<'Proyek Kelompok' | 'Praktik Lab' | 'Tugas Teori'>('Praktik Lab');
  const [newDeadline, setNewDeadline] = useState('2026-11-25 23:59');

  const selectedTugas =
    tugasList.find((t) => t.id === selectedTugasId) || tugasList[0] || null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTugas || !submissionUrl.trim()) return;

    onSubmitTugas(selectedTugas.id, submissionUrl, submissionNotes);
    setIsSubmitSuccess(true);
    setTimeout(() => setIsSubmitSuccess(false), 4000);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTugas) return;
    onGradeTugas(selectedTugas.id, Number(gradeInput), feedbackInput);
    setIsGradingOpen(false);
  };

  const handleCreateTugas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudul.trim() || !newDeskripsi.trim()) return;

    const created: Tugas = {
      id: `tugas_${Date.now()}`,
      mapelId: newMapelId,
      judul: newJudul.trim(),
      deskripsi: newDeskripsi.trim(),
      deadline: newDeadline,
      tipe: newTipe,
      kriteriaPenilaian: [
        { kriteria: 'Kesesuaian Spesifikasi Teknis & Fungsi', bobot: 40 },
        { kriteria: 'Struktur Kode & Clean Architecture', bobot: 30 },
        { kriteria: 'Dokumentasi & Kerapian Laporan', bobot: 30 },
      ],
      sudahDikumpulkan: false,
    };

    onAddTugas(created);
    setSelectedTugasId(created.id);
    setIsAddTugasOpen(false);
    setNewJudul('');
    setNewDeskripsi('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Penugasan & Proyek Praktik Kejuruan (PBL)
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Penilaian berbasis portofolio proyek riil siswa SMK dengan notifikasi otomatis real-time
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            {tugasList.length} Proyek Terdaftar
          </span>

          {currentRole !== 'siswa' && (
            <button
              onClick={() => setIsAddTugasOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Beri Tugas Baru</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Assignments */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Daftar Penugasan
          </div>

          {tugasList.map((tugas) => {
            const isSelected = selectedTugas?.id === tugas.id;
            return (
              <button
                type="button"
                key={tugas.id}
                onClick={() => {
                  setSelectedTugasId(tugas.id);
                  setSubmissionUrl(tugas.fileSiswa || '');
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-400 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 uppercase">
                    {tugas.tipe}
                  </span>
                  {tugas.sudahDikumpulkan ? (
                    <span className="text-[11px] font-bold text-emerald-700 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{tugas.nilai !== undefined ? `Nilai: ${tugas.nilai}` : 'Terkumpul'}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-700 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Belum Kumpul</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-900 line-clamp-2">
                  {tugas.judul}
                </h3>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-700">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Deadline: {tugas.deadline}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column (2 Cols): Detail & Submission Workspace */}
        {selectedTugas && (
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {selectedTugas.tipe}
                  </span>
                  <div className="text-xs text-slate-700 font-semibold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Batas Akhir: {selectedTugas.deadline}</span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  {selectedTugas.judul}
                </h2>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  {selectedTugas.deskripsi}
                </p>
              </div>

              {/* Rubrik Penilaian SMK */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Rubrik Penilaian Kompetensi Kejuruan:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedTugas.kriteriaPenilaian.map((kriteria, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white rounded-lg border border-slate-200/70 text-xs flex items-center justify-between"
                    >
                      <span className="text-slate-700 font-medium">{kriteria.kriteria}</span>
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                        Bobot {kriteria.bobot}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Hasil Nilai Siswa */}
              {selectedTugas.sudahDikumpulkan && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Proyek Sudah Dikumpulkan</span>
                    </div>
                    {selectedTugas.nilai !== undefined && (
                      <div className="text-right">
                        <span className="text-xl font-black text-emerald-700">
                          {selectedTugas.nilai}
                        </span>
                        <span className="text-xs text-emerald-600 font-bold ml-1">/ 100</span>
                      </div>
                    )}
                  </div>

                  {selectedTugas.fileSiswa && (
                    <div className="text-xs text-slate-700 flex items-center space-x-1.5 bg-white/70 p-2 rounded-lg">
                      <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                      <a
                        href={selectedTugas.fileSiswa}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline font-mono truncate"
                      >
                        {selectedTugas.fileSiswa}
                      </a>
                    </div>
                  )}

                  {selectedTugas.catatanGuru && (
                    <div className="pt-2 border-t border-emerald-200/60 text-xs text-slate-700">
                      <strong className="text-emerald-900 flex items-center space-x-1 mb-0.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Catatan Review Pengajar:</span>
                      </strong>
                      <p className="italic text-slate-700 leading-relaxed">"{selectedTugas.catatanGuru}"</p>
                    </div>
                  )}

                  {currentRole !== 'siswa' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setGradeInput(selectedTugas.nilai || 85);
                          setFeedbackInput(selectedTugas.catatanGuru || '');
                          setIsGradingOpen(true);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Penilaian & Kirim Notifikasi Nilai</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Jika belum dikumpulkan tapi Guru ingin memberi nilai langsung / simulasi */}
              {!selectedTugas.sudahDikumpulkan && currentRole !== 'siswa' && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-amber-900">
                    <strong>Status Pengumpulan:</strong> Siswa sedang mengerjakan tugas ini. Anda tetap dapat memasukkan nilai hasil evaluasi lab secara langsung.
                  </div>
                  <button
                    onClick={() => {
                      setGradeInput(selectedTugas.nilai || 88);
                      setFeedbackInput(selectedTugas.catatanGuru || 'Praktikum di laboratorium berjalan dengan sangat baik.');
                      setIsGradingOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Input Nilai & Kirim Notifikasi</span>
                  </button>
                </div>
              )}

              {/* Form Pengumpulan (Khusus Siswa) */}
              {(!selectedTugas.sudahDikumpulkan || currentRole === 'siswa') && (
                <form onSubmit={handleSubmit} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50">
                  <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <Send className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Form Pengumpulan Hasil Praktikum Siswa</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tautan Repository Git / Google Drive / URL Demo Proyek:
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/username/proyek-presensi-smk.git"
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Catatan / Dokumentasi Hasil Praktikum:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Jelaskan fitur utama aplikasi, pengujian yang telah dilakukan, atau kendala yang dihadapi..."
                      value={submissionNotes}
                      onChange={(e) => setSubmissionNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 bg-white"
                    ></textarea>
                  </div>

                  {isSubmitSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Tugas proyek berhasil dikirimkan & notifikasi terkirim ke Guru!</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{selectedTugas.sudahDikumpulkan ? 'Perbarui Pengumpulan' : 'Kirim Tugas Proyek'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Buat Tugas Baru (Khusus Guru/Admin) */}
      {isAddTugasOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddTugasOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase inline-flex items-center space-x-1">
                <BellRing className="w-3 h-3" />
                <span>Notifikasi Otomatis ke Siswa</span>
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Berikan Tugas / Proyek Baru untuk Siswa
              </h2>
            </div>

            <form onSubmit={handleCreateTugas} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Tugas Proyek
                </label>
                <input
                  type="text"
                  required
                  value={newJudul}
                  onChange={(e) => setNewJudul(e.target.value)}
                  placeholder="Contoh: Proyek Pembuatan Sistem E-Perpustakaan Sekolah"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mata Pelajaran
                  </label>
                  <select
                    value={newMapelId}
                    onChange={(e) => setNewMapelId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  >
                    {MOCK_MAPEL.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Tugas
                  </label>
                  <select
                    value={newTipe}
                    onChange={(e) => setNewTipe(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  >
                    <option value="Praktik Lab">Praktik Lab</option>
                    <option value="Proyek Kelompok">Proyek Kelompok</option>
                    <option value="Tugas Teori">Tugas Teori</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Batas Akhir Pengumpulan (Deadline)
                </label>
                <input
                  type="text"
                  required
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  placeholder="2026-11-25 23:59"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instruksi & Spesifikasi Tugas
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDeskripsi}
                  onChange={(e) => setNewDeskripsi(e.target.value)}
                  placeholder="Tuliskan langkah pengerjaan, format pengumpulan, dan target capaian..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTugasOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                >
                  Terbitkan Tugas & Kirim Notifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Grading untuk Guru */}
      {isGradingOpen && selectedTugas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsGradingOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              aria-label="Tutup modal penilaian"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase inline-flex items-center space-x-1">
                <BellRing className="w-3 h-3" />
                <span>Buku Nilai & Notifikasi Siswa</span>
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Beri Nilai & Feedback Proyek
              </h2>
              <p className="text-xs text-slate-700">{selectedTugas.judul}</p>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Skor Nilai Siswa (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-base font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Konstruktif & Rekomendasi
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Misal: Penataan database sudah sangat baik sesuai normalisasi 3NF. Perbaiki dokumentasi endpoint API..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGradingOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  Simpan Nilai & Kirim Notifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
