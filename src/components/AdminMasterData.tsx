import React, { useState } from 'react';
import { Jurusan, Kelas, UserRole } from '../types/lms';
import { MOCK_JURUSAN, MOCK_KELAS } from '../data/mockData';
import {
  Layers,
  Plus,
  Users,
  Building,
  GraduationCap,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle2,
  X
} from 'lucide-react';

interface AdminMasterDataProps {
  currentRole: UserRole;
}

export const AdminMasterData: React.FC<AdminMasterDataProps> = ({ currentRole }) => {
  const [jurusanList, setJurusanList] = useState<Jurusan[]>(MOCK_JURUSAN);
  const [kelasList, setKelasList] = useState<Kelas[]>(MOCK_KELAS);
  const [activeTab, setActiveTab] = useState<'jurusan' | 'kelas'>('jurusan');

  // Modal Tambah Jurusan
  const [isModalJurusanOpen, setIsModalJurusanOpen] = useState(false);
  const [kodeJurusan, setKodeJurusan] = useState('');
  const [namaJurusan, setNamaJurusan] = useState('');
  const [kajur, setKajur] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  // Modal Tambah Kelas
  const [isModalKelasOpen, setIsModalKelasOpen] = useState(false);
  const [namaKelas, setNamaKelas] = useState('');
  const [tingkat, setTingkat] = useState<'X' | 'XI' | 'XII'>('X');
  const [jurusanId, setJurusanId] = useState(jurusanList[0]?.id || 'jur_rpl');
  const [waliKelas, setWaliKelas] = useState('');

  const handleAddJurusan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kodeJurusan.trim() || !namaJurusan.trim()) return;

    const newJur: Jurusan = {
      id: `jur_${Date.now()}`,
      kode: kodeJurusan.toUpperCase(),
      nama: namaJurusan,
      kepalaJurusan: kajur,
      deskripsi,
      jumlahSiswa: 0,
      warna: 'indigo',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badgeText: 'text-indigo-700',
      iconName: 'Code2',
    };

    setJurusanList([...jurusanList, newJur]);
    setIsModalJurusanOpen(false);
    setKodeJurusan('');
    setNamaJurusan('');
    setKajur('');
    setDeskripsi('');
  };

  const handleAddKelas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKelas.trim()) return;

    const newKelas: Kelas = {
      id: `kelas_${Date.now()}`,
      nama: namaKelas,
      tingkat,
      jurusanId,
      waliKelas,
      tahunAjaran: '2026/2027',
      kapasitas: 36,
    };

    setKelasList([...kelasList, newKelas]);
    setIsModalKelasOpen(false);
    setNamaKelas('');
    setWaliKelas('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Data Master Jurusan & Rombel Kelas SMK
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Konfigurasi Program Keahlian, Rombongan Belajar, dan Struktur Akademik SMK
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('jurusan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'jurusan'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Program Keahlian ({jurusanList.length})
            </button>
            <button
              onClick={() => setActiveTab('kelas')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'kelas'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rombel Kelas ({kelasList.length})
            </button>
          </div>

          <button
            onClick={() =>
              activeTab === 'jurusan'
                ? setIsModalJurusanOpen(true)
                : setIsModalKelasOpen(true)
            }
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah {activeTab === 'jurusan' ? 'Jurusan' : 'Kelas'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Jurusan List */}
      {activeTab === 'jurusan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jurusanList.map((jur) => (
            <div
              key={jur.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md border ${jur.badgeBg}`}>
                    {jur.kode}
                  </span>
                  <span className="text-xs text-slate-700 font-bold">
                    {jur.jumlahSiswa} Siswa Terdaftar
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{jur.nama}</h3>
                <p className="text-xs text-slate-700 mt-1 line-clamp-3 leading-relaxed">
                  {jur.deskripsi}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
                <span className="truncate max-w-[180px]">
                  Kajur: <strong>{jur.kepalaJurusan}</strong>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  SKKNI Aktif
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Rombel Kelas List */}
      {activeTab === 'kelas' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama Kelas</th>
                  <th className="px-4 py-3">Tingkat</th>
                  <th className="px-4 py-3">Program Keahlian</th>
                  <th className="px-4 py-3">Wali Kelas</th>
                  <th className="px-4 py-3">Tahun Ajaran</th>
                  <th className="px-4 py-3">Kapasitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {kelasList.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-bold text-indigo-700">{k.nama}</td>
                    <td className="px-4 py-3 font-bold text-slate-700">{k.tingkat}</td>
                    <td className="px-4 py-3 text-slate-800">
                      {jurusanList.find((j) => j.id === k.jurusanId)?.nama || k.jurusanId}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{k.waliKelas}</td>
                    <td className="px-4 py-3 font-mono text-slate-700">{k.tahunAjaran}</td>
                    <td className="px-4 py-3 text-slate-700 font-semibold">{k.kapasitas} Siswa</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Tambah Jurusan */}
      {isModalJurusanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsModalJurusanOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900">
              Tambah Program Keahlian SMK
            </h3>

            <form onSubmit={handleAddJurusan} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kode Singkat (3-4 huruf)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: MM"
                    value={kodeJurusan}
                    onChange={(e) => setKodeJurusan(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kepala Program Keahlian
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Kajur & Gelar"
                    value={kajur}
                    onChange={(e) => setKajur(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Jurusan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Multimedia & Animasi Game"
                  value={namaJurusan}
                  onChange={(e) => setNamaJurusan(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Fokus Kejuruan
                </label>
                <textarea
                  rows={2}
                  placeholder="Kompetensi lulusan, materi praktik laboratorium..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalJurusanOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                >
                  Simpan Jurusan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Kelas */}
      {isModalKelasOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsModalKelasOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900">
              Tambah Rombel Kelas SMK
            </h3>

            <form onSubmit={handleAddKelas} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Rombel
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: XII RPL 3"
                    value={namaKelas}
                    onChange={(e) => setNamaKelas(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tingkat
                  </label>
                  <select
                    value={tingkat}
                    onChange={(e) => setTingkat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Program Keahlian
                </label>
                <select
                  value={jurusanId}
                  onChange={(e) => setJurusanId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                >
                  {jurusanList.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.kode} - {j.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Wali Kelas
                </label>
                <input
                  type="text"
                  placeholder="Nama Guru Wali Kelas"
                  value={waliKelas}
                  onChange={(e) => setWaliKelas(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalKelasOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                >
                  Simpan Rombel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
