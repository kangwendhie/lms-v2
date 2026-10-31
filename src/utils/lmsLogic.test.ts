import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCbtScore,
  calculateAttendanceStats,
  calculatePklProgress,
  createNewTaskNotification,
  createTaskGradedNotification,
  createTaskSubmittedNotification,
  filterNotificationsByRole,
  Question,
  AttendanceRecord,
  PklLogbookItem,
} from './lmsLogic';

test('calculateCbtScore calculates exact score, correct count and passing status', () => {
  const mockQuestions: Question[] = [
    {
      id: 1,
      pertanyaan: 'Metode HTTP yang tepat untuk memperbarui data secara utuh adalah?',
      pilihan: [
        { key: 'A', teks: 'GET' },
        { key: 'B', teks: 'PUT' },
        { key: 'C', teks: 'DELETE' },
      ],
      jawabanBenar: 'B',
      bobot: 2,
    },
    {
      id: 2,
      pertanyaan: 'Klausa SQL untuk menghubungkan dua tabel relasional adalah?',
      pilihan: [
        { key: 'A', teks: 'INNER JOIN' },
        { key: 'B', teks: 'GROUP BY' },
      ],
      jawabanBenar: 'A',
      bobot: 2,
    },
    {
      id: 3,
      pertanyaan: 'Port default MySQL adalah?',
      pilihan: [
        { key: 'A', teks: '80' },
        { key: 'B', teks: '3306' },
      ],
      jawabanBenar: 'B',
      bobot: 1,
    },
  ];

  // Test 1: Full correct
  const resultFull = calculateCbtScore({ 1: 'B', 2: 'A', 3: 'B' }, mockQuestions, 75);
  assert.equal(resultFull.score, 100);
  assert.equal(resultFull.correctCount, 3);
  assert.equal(resultFull.wrongCount, 0);
  assert.equal(resultFull.unansweredCount, 0);
  assert.equal(resultFull.passed, true);

  // Test 2: Partial answers (id 1 correct (weight 2), id 2 wrong, id 3 unanswered)
  // earned = 2, total = 5 -> 40%
  const resultPartial = calculateCbtScore({ 1: 'B', 2: 'B' }, mockQuestions, 75);
  assert.equal(resultPartial.score, 40);
  assert.equal(resultPartial.correctCount, 1);
  assert.equal(resultPartial.wrongCount, 1);
  assert.equal(resultPartial.unansweredCount, 1);
  assert.equal(resultPartial.passed, false);
});

test('calculateAttendanceStats computes correct rates and summaries', () => {
  const records: AttendanceRecord[] = [
    { id: '1', siswaId: 's1', siswaNama: 'Ahmad', tanggal: '2026-10-01', status: 'Hadir' },
    { id: '2', siswaId: 's1', siswaNama: 'Ahmad', tanggal: '2026-10-02', status: 'Hadir' },
    { id: '3', siswaId: 's1', siswaNama: 'Ahmad', tanggal: '2026-10-03', status: 'Izin' },
    { id: '4', siswaId: 's1', siswaNama: 'Ahmad', tanggal: '2026-10-04', status: 'Sakit' },
    { id: '5', siswaId: 's1', siswaNama: 'Ahmad', tanggal: '2026-10-05', status: 'Hadir' },
  ];

  const stats = calculateAttendanceStats(records);
  assert.equal(stats.total, 5);
  assert.equal(stats.hadir, 3);
  assert.equal(stats.izin, 1);
  assert.equal(stats.sakit, 1);
  assert.equal(stats.alpa, 0);
  assert.equal(stats.persentaseKehadiran, 60); // 3/5 = 60%
});

test('calculatePklProgress tracks internship logbook status correctly', () => {
  const logbooks: PklLogbookItem[] = [
    { id: '1', tanggal: '2026-10-01', kegiatan: 'Instalasi server debian', status: 'Disetujui' },
    { id: '2', tanggal: '2026-10-02', kegiatan: 'Konfigurasi router mikrotik', status: 'Disetujui' },
    { id: '3', tanggal: '2026-10-03', kegiatan: 'Troubleshooting LAN lab', status: 'Menunggu' },
  ];

  const pkl = calculatePklProgress(logbooks, 10);
  assert.equal(pkl.approvedCount, 2);
  assert.equal(pkl.pendingCount, 1);
  assert.equal(pkl.progressPercent, 20); // 2/10 = 20%
  assert.equal(pkl.remainingDays, 8);
});

test('in-app notifications are created and filtered accurately by role', () => {
  const newTaskNotif = createNewTaskNotification(
    'tugas_99',
    'REST API E-Raport SMK',
    '2026-11-20 23:59',
    'Praktik Lab'
  );
  assert.equal(newTaskNotif.targetRole, 'siswa');
  assert.equal(newTaskNotif.tipe, 'tugas_baru');
  assert.equal(newTaskNotif.dibaca, false);
  assert.match(newTaskNotif.pesan, /REST API E-Raport SMK/);

  const gradedNotif = createTaskGradedNotification(
    'tugas_1',
    'Proyek Presensi Digital',
    95,
    'Arsitektur MVC sangat bersih!'
  );
  assert.equal(gradedNotif.targetRole, 'siswa');
  assert.equal(gradedNotif.tipe, 'nilai_tugas');
  assert.equal(gradedNotif.judul, 'Nilai Tugas Keluar: 95/100');

  const submittedNotif = createTaskSubmittedNotification(
    'tugas_2',
    'Praktikum API',
    'Budi Santoso'
  );
  assert.equal(submittedNotif.targetRole, 'guru');
  assert.equal(submittedNotif.tipe, 'pengumpulan_tugas');

  const allNotifs = [newTaskNotif, gradedNotif, submittedNotif];
  const siswaView = filterNotificationsByRole(allNotifs, 'siswa');
  assert.equal(siswaView.items.length, 2);
  assert.equal(siswaView.unreadCount, 2);

  const guruView = filterNotificationsByRole(allNotifs, 'guru');
  assert.equal(guruView.items.length, 1);
  assert.equal(guruView.unreadCount, 1);
});

