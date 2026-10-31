export interface Question {
  id: number;
  pertanyaan: string;
  pilihan: { key: string; teks: string }[];
  jawabanBenar: string;
  bobot: number;
  pembahasan?: string;
}

export interface AttendanceRecord {
  id: string;
  siswaId: string;
  siswaNama: string;
  tanggal: string;
  status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
  keterangan?: string;
}

export interface PklLogbookItem {
  id: string;
  tanggal: string;
  kegiatan: string;
  status: 'Disetujui' | 'Menunggu' | 'Revisi';
  catatanPembimbing?: string;
}

/**
 * Hitung skor ujian CBT berdasarkan jawaban siswa dan bobot soal
 */
export function calculateCbtScore(
  answers: Record<number, string>,
  questions: Question[],
  kkm: number = 75
): {
  score: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  totalQuestions: number;
  passed: boolean;
} {
  if (!questions || questions.length === 0) {
    return { score: 0, correctCount: 0, wrongCount: 0, unansweredCount: 0, totalQuestions: 0, passed: false };
  }

  let totalWeight = 0;
  let earnedWeight = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;

  for (const q of questions) {
    const weight = q.bobot || 1;
    totalWeight += weight;

    const studentAns = answers[q.id];
    if (!studentAns) {
      unansweredCount++;
    } else if (studentAns.toUpperCase() === q.jawabanBenar.toUpperCase()) {
      correctCount++;
      earnedWeight += weight;
    } else {
      wrongCount++;
    }
  }

  const rawScore = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0;
  const score = Math.round(rawScore * 10) / 10;
  const passed = score >= kkm;

  return {
    score,
    correctCount,
    wrongCount,
    unansweredCount,
    totalQuestions: questions.length,
    passed,
  };
}

/**
 * Hitung persentase dan rekap kehadiran siswa
 */
export function calculateAttendanceStats(records: AttendanceRecord[]): {
  total: number;
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  persentaseKehadiran: number;
} {
  const total = records.length;
  if (total === 0) {
    return { total: 0, hadir: 0, sakit: 0, izin: 0, alpa: 0, persentaseKehadiran: 100 };
  }

  let hadir = 0;
  let sakit = 0;
  let izin = 0;
  let alpa = 0;

  for (const rec of records) {
    switch (rec.status) {
      case 'Hadir':
        hadir++;
        break;
      case 'Sakit':
        sakit++;
        break;
      case 'Izin':
        izin++;
        break;
      case 'Alpa':
        alpa++;
        break;
    }
  }

  // Sesuai standar SMK: Hadir dihitung 100%, Sakit & Izin dengan surat dispensasi resmi biasanya dihitung 75-80% atau persentase kehadiran murni Hadir/Total
  const persentaseKehadiran = Math.round((hadir / total) * 100);

  return {
    total,
    hadir,
    sakit,
    izin,
    alpa,
    persentaseKehadiran,
  };
}

/**
 * Hitung progress PKL (Praktik Kerja Lapangan) siswa SMK
 */
export function calculatePklProgress(
  logbooks: PklLogbookItem[],
  targetDays: number = 90
): {
  approvedCount: number;
  pendingCount: number;
  progressPercent: number;
  remainingDays: number;
} {
  const approvedCount = logbooks.filter((l) => l.status === 'Disetujui').length;
  const pendingCount = logbooks.filter((l) => l.status === 'Menunggu').length;
  const progressPercent = Math.min(100, Math.round((approvedCount / targetDays) * 100));
  const remainingDays = Math.max(0, targetDays - approvedCount);

  return {
    approvedCount,
    pendingCount,
    progressPercent,
    remainingDays,
  };
}

export interface NotificationItem {
  id: string;
  targetRole: 'siswa' | 'guru' | 'admin' | 'all';
  tipe: 'tugas_baru' | 'nilai_tugas' | 'pengumpulan_tugas' | 'info';
  judul: string;
  pesan: string;
  waktu: string;
  dibaca: boolean;
  targetNav: string;
  tugasId?: string;
}

/**
 * Buat notifikasi in-app saat guru memberikan tugas baru untuk siswa
 */
export function createNewTaskNotification(
  tugasId: string,
  judulTugas: string,
  deadline: string,
  tipeTugas: string,
  waktu: string = 'Baru saja'
): NotificationItem {
  return {
    id: `notif_task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    targetRole: 'siswa',
    tipe: 'tugas_baru',
    judul: 'Tugas Baru Diberikan',
    pesan: `Guru memberikan ${tipeTugas}: "${judulTugas}". Batas pengumpulan: ${deadline}.`,
    waktu,
    dibaca: false,
    targetNav: 'tugas',
    tugasId,
  };
}

/**
 * Buat notifikasi in-app saat guru memberikan nilai pada tugas yang telah dikumpulkan siswa
 */
export function createTaskGradedNotification(
  tugasId: string,
  judulTugas: string,
  nilai: number,
  catatanGuru: string,
  waktu: string = 'Baru saja'
): NotificationItem {
  return {
    id: `notif_grade_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    targetRole: 'siswa',
    tipe: 'nilai_tugas',
    judul: `Nilai Tugas Keluar: ${nilai}/100`,
    pesan: `Tugas "${judulTugas}" telah dinilai (${nilai}/100). Catatan: "${catatanGuru}"`,
    waktu,
    dibaca: false,
    targetNav: 'tugas',
    tugasId,
  };
}

/**
 * Buat notifikasi in-app untuk guru saat siswa mengumpulkan tugas
 */
export function createTaskSubmittedNotification(
  tugasId: string,
  judulTugas: string,
  namaSiswa: string,
  waktu: string = 'Baru saja'
): NotificationItem {
  return {
    id: `notif_sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    targetRole: 'guru',
    tipe: 'pengumpulan_tugas',
    judul: 'Pengumpulan Tugas Siswa',
    pesan: `${namaSiswa} telah mengumpulkan tugas "${judulTugas}" dan menunggu penilaian Anda.`,
    waktu,
    dibaca: false,
    targetNav: 'tugas',
    tugasId,
  };
}

/**
 * Filter notifikasi berdasarkan peran aktif dan hitung jumlah belum dibaca
 */
export function filterNotificationsByRole(
  notifications: NotificationItem[],
  role: 'siswa' | 'guru' | 'admin'
): {
  items: NotificationItem[];
  unreadCount: number;
} {
  const items = notifications.filter(
    (n) => n.targetRole === role || n.targetRole === 'all'
  );
  const unreadCount = items.filter((n) => !n.dibaca).length;
  return { items, unreadCount };
}

export interface AuthAccount {
  username: string;
  password: string;
  email: string;
  nisn?: string;
  nip?: string;
  role: 'siswa' | 'guru' | 'admin';
  name: string;
}

/**
 * Validasi kredensial login pengguna berdasarkan username, email, NISN, atau NIP
 */
export function authenticateUser(
  identifier: string,
  password: string,
  accounts: Record<string, AuthAccount>
): {
  success: boolean;
  role?: 'siswa' | 'guru' | 'admin';
  user?: AuthAccount;
  message: string;
} {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanId || !cleanPass) {
    return {
      success: false,
      message: 'Username dan password wajib diisi.',
    };
  }

  const accountList = Object.values(accounts);
  const matched = accountList.find(
    (acc) =>
      acc.username.toLowerCase() === cleanId ||
      acc.email.toLowerCase() === cleanId ||
      (acc.nisn && acc.nisn.toLowerCase() === cleanId) ||
      (acc.nip && acc.nip.toLowerCase() === cleanId)
  );

  if (!matched) {
    return {
      success: false,
      message: 'Akun tidak ditemukan. Gunakan username: siswa, guru, atau admin.',
    };
  }

  if (matched.password !== cleanPass) {
    return {
      success: false,
      message: `Password salah untuk akun @${matched.username}. Silakan periksa daftar kredensial.`,
    };
  }

  return {
    success: true,
    role: matched.role,
    user: matched,
    message: `Berhasil masuk sebagai ${matched.name} (${matched.role.toUpperCase()}).`,
  };
}


