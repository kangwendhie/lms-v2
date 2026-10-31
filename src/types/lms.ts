export type UserRole = 'siswa' | 'guru' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  nisn?: string;
  nip?: string;
  jurusanId: string;
  kelasId?: string;
  telepon: string;
}

export interface Jurusan {
  id: string;
  kode: string;
  nama: string;
  kepalaJurusan: string;
  deskripsi: string;
  jumlahSiswa: number;
  warna: string;
  badgeBg: string;
  badgeText: string;
  iconName: string;
}

export interface Kelas {
  id: string;
  nama: string;
  tingkat: 'X' | 'XI' | 'XII';
  jurusanId: string;
  waliKelas: string;
  tahunAjaran: string;
  kapasitas: number;
}

export interface MataPelajaran {
  id: string;
  kode: string;
  nama: string;
  kelompok: 'Kejuruan' | 'Normatif-Adaptif' | 'Muatan Lokal';
  guruId: string;
  guruNama: string;
  jurusanId: string;
  jamPerMinggu: number;
  kkm: number;
  icon: string;
}

export interface Materi {
  id: string;
  mapelId: string;
  judul: string;
  deskripsi: string;
  pertemuanKe: number;
  tipe: 'video' | 'dokumen' | 'praktikum';
  kontenUrl?: string;
  durasi?: string;
  fileLampiran?: {
    nama: string;
    ukuran: string;
    tipe: string;
  };
  poinKompetensi: string[];
  statusSelesai?: boolean;
}

export interface Tugas {
  id: string;
  mapelId: string;
  judul: string;
  deskripsi: string;
  deadline: string;
  tipe: 'Proyek Kelompok' | 'Praktik Lab' | 'Tugas Teori';
  kriteriaPenilaian: { kriteria: string; bobot: number }[];
  sudahDikumpulkan?: boolean;
  nilai?: number;
  catatanGuru?: string;
  fileSiswa?: string;
  tanggalKumpul?: string;
}

export interface CBTExam {
  id: string;
  mapelId: string;
  judul: string;
  tanggalMulai: string;
  durasiMenit: number;
  kkm: number;
  totalSoal: number;
  soal: Array<{
    id: number;
    pertanyaan: string;
    kodeSnippet?: string;
    pilihan: { key: string; teks: string }[];
    jawabanBenar: string;
    bobot: number;
    pembahasan: string;
  }>;
}

export interface JurnalMengajar {
  id: string;
  tanggal: string;
  jamKe: string;
  kelasId: string;
  mapelId: string;
  materiPokok: string;
  kegiatanBelajar: string;
  kendala?: string;
  jumlahHadir: number;
  jumlahAbsen: number;
}

export interface PklRecord {
  id: string;
  siswaId: string;
  siswaNama: string;
  kelas: string;
  perusahaanDudi: string;
  bidangUsaha: string;
  alamatPerusahaan: string;
  pembimbingDudi: string;
  guruPembimbing: string;
  periodeMulai: string;
  periodeSelesai: string;
  nilaiIndustri?: number;
  status: 'Aktif' | 'Selesai' | 'Persiapan';
  logbook: Array<{
    id: string;
    tanggal: string;
    kegiatan: string;
    status: 'Disetujui' | 'Menunggu' | 'Revisi';
    catatanPembimbing?: string;
  }>;
}

export interface InAppNotification {
  id: string;
  targetRole: UserRole | 'all';
  tipe: 'tugas_baru' | 'nilai_tugas' | 'pengumpulan_tugas' | 'info';
  judul: string;
  pesan: string;
  waktu: string;
  dibaca: boolean;
  targetNav: string;
  tugasId?: string;
}

