import React, { useState } from 'react';
import { Materi, UserRole } from '../types/lms';
import { MOCK_MAPEL } from '../data/mockData';
import {
  BookOpen,
  Video,
  FileText,
  Code,
  CheckCircle2,
  Download,
  Plus,
  Play,
  Clock,
  Search,
  ExternalLink,
  X,
  Layers,
  Sparkles
} from 'lucide-react';

interface MateriListProps {
  materiList: Materi[];
  currentRole: UserRole;
  onToggleComplete: (id: string) => void;
  onAddMateri: (newMateri: Materi) => void;
}

export const MateriList: React.FC<MateriListProps> = ({
  materiList,
  currentRole,
  onToggleComplete,
  onAddMateri,
}) => {
  const [selectedMapel, setSelectedMapel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMateri, setActiveMateri] = useState<Materi | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for adding new lesson
  const [newJudul, setNewJudul] = useState('');
  const [newDeskripsi, setNewDeskripsi] = useState('');
  const [newMapelId, setNewMapelId] = useState(MOCK_MAPEL[0].id);
  const [newPertemuan, setNewPertemuan] = useState(materiList.length + 1);
  const [newTipe, setNewTipe] = useState<'video' | 'dokumen' | 'praktikum'>('praktikum');
  const [newDurasi, setNewDurasi] = useState('60 Menit');
  const [newKompetensi, setNewKompetensi] = useState('');

  const filteredMateri = materiList.filter((m) => {
    const matchMapel = selectedMapel === 'all' || m.mapelId === selectedMapel;
    const matchSearch =
      m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMapel && matchSearch;
  });

  const handleCreateMateri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJudul.trim()) return;

    const poinList = newKompetensi
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const created: Materi = {
      id: `mat_${Date.now()}`,
      mapelId: newMapelId,
      judul: newJudul,
      deskripsi: newDeskripsi,
      pertemuanKe: Number(newPertemuan),
      tipe: newTipe,
      durasi: newDurasi,
      poinKompetensi: poinList.length > 0 ? poinList : ['Menguasai implementasi teknis kompetensi SMK'],
      fileLampiran: {
        nama: `Modul_${newJudul.slice(0, 15).replace(/\\s+/g, '_')}.pdf`,
        ukuran: '1.8 MB',
        tipe: 'PDF Modul Ajar',
      },
      statusSelesai: false,
    };

    onAddMateri(created);
    setIsAddModalOpen(false);
    setNewJudul('');
    setNewDeskripsi('');
    setNewKompetensi('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Modul & Video Praktikum Kejuruan
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Kurikulum Merdeka SMK &bull; Project-Based Learning & Standar Industri
          </p>
        </div>

        {currentRole !== 'siswa' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Modul Ajar</span>
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Mapel Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedMapel('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedMapel === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Mapel
          </button>
          {MOCK_MAPEL.map((mapel) => (
            <button
              key={mapel.id}
              onClick={() => setSelectedMapel(mapel.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedMapel === mapel.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mapel.nama.split(' ')[0]} {mapel.nama.split(' ')[1] || ''}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi pembelajaran..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Lesson Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMateri.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                    Pertemuan {item.pertemuanKe}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize flex items-center space-x-1">
                    {item.tipe === 'video' ? (
                      <Video className="w-3 h-3 text-red-500" />
                    ) : item.tipe === 'praktikum' ? (
                      <Code className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <FileText className="w-3 h-3 text-indigo-600" />
                    )}
                    <span>{item.tipe}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-xs text-slate-700 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.durasi}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.judul}
                </h3>
                <p className="text-xs text-slate-700 mt-1 line-clamp-2 leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>

              {/* Capaian Pembelajaran / Kompetensi */}
              <div className="space-y-1 pt-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  Target Kompetensi Siswa:
                </div>
                <div className="space-y-1">
                  {item.poinKompetensi.slice(0, 2).map((poin, idx) => (
                    <div key={idx} className="flex items-start space-x-1.5 text-[11px] text-slate-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{poin}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onToggleComplete(item.id)}
                className={`flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  item.statusSelesai
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${item.statusSelesai ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.statusSelesai ? 'Sudah Dipelajari' : 'Tandai Selesai'}</span>
              </button>

              <button
                onClick={() => setActiveMateri(item)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                <span>Buka Materi</span>
                <Play className="w-3.5 h-3.5 fill-indigo-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal for Lesson */}
      {activeMateri && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setActiveMateri(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                  Pertemuan {activeMateri.pertemuanKe}
                </span>
                <span className="text-xs text-slate-700 font-semibold">{activeMateri.durasi}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {activeMateri.judul}
              </h2>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {activeMateri.deskripsi}
              </p>
            </div>

            {/* Video or Practical Sandbox Display */}
            {activeMateri.kontenUrl ? (
              <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video shadow-md border border-slate-800">
                <iframe
                  src={activeMateri.kontenUrl}
                  title={activeMateri.judul}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                  <span>Simulasi Praktikum Laboratorium RPL</span>
                  <span>Lingkungan Praktik Web & Basis Data</span>
                </div>
                <div className="text-emerald-400">$ git clone https://github.com/smk-pusat-keunggulan/proyek-presensi.git</div>
                <div className="text-slate-300">$ npm install && npm run build</div>
                <div className="text-slate-300">$ npm run test</div>
                <div className="text-indigo-300 font-sans text-xs pt-1">
                  💡 Tip Guru: Pastikan struktur tabel relasional dan endpoint autentikasi diuji sebelum mengumpulkan proyek.
                </div>
              </div>
            )}

            {/* Kompetensi Ajar */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Indikator Capaian Pembelajaran (Kurikulum Merdeka):</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activeMateri.poinKompetensi.map((poin, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{poin}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lampiran Download */}
            {activeMateri.fileLampiran && (
              <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {activeMateri.fileLampiran.nama}
                    </div>
                    <div className="text-[11px] text-slate-700">
                      {activeMateri.fileLampiran.ukuran} &bull; {activeMateri.fileLampiran.tipe}
                    </div>
                  </div>
                </div>

                <a
                  href={`#download-${activeMateri.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const blob = new Blob([`Simulasi Download File Bahan Ajar SMK: ${activeMateri.fileLampiran?.nama}`], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = activeMateri.fileLampiran?.nama || 'modul.txt';
                    a.click();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Unduh File
                </a>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  onToggleComplete(activeMateri.id);
                  setActiveMateri(null);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Selesai Belajar & Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Modul (Khusus Guru) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900">
              Tambah Modul Ajar Kejuruan Baru
            </h2>

            <form onSubmit={handleCreateMateri} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Modul Pembelajaran
                </label>
                <input
                  type="text"
                  required
                  value={newJudul}
                  onChange={(e) => setNewJudul(e.target.value)}
                  placeholder="Contoh: Implementasi Arsitektur RESTful API & Autentikasi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
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
                    Pertemuan Ke-
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="32"
                    value={newPertemuan}
                    onChange={(e) => setNewPertemuan(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipe Modul
                  </label>
                  <select
                    value={newTipe}
                    onChange={(e) => setNewTipe(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  >
                    <option value="praktikum">Praktikum Lab/Bengkel</option>
                    <option value="video">Video Tutorial</option>
                    <option value="dokumen">Dokumen Modul PDF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alokasi Durasi
                  </label>
                  <input
                    type="text"
                    value={newDurasi}
                    onChange={(e) => setNewDurasi(e.target.value)}
                    placeholder="Contoh: 90 Menit"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Ringkas
                </label>
                <textarea
                  rows={2}
                  required
                  value={newDeskripsi}
                  onChange={(e) => setNewDeskripsi(e.target.value)}
                  placeholder="Ringkasan materi yang akan dipelajari siswa..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Kompetensi (1 baris = 1 poin)
                </label>
                <textarea
                  rows={2}
                  value={newKompetensi}
                  onChange={(e) => setNewKompetensi(e.target.value)}
                  placeholder="Contoh:\nMampu merancang skema basis data relasional 3NF\nMampu membuat endpoint API dengan validasi input"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                >
                  Simpan Modul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
