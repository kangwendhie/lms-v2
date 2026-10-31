import React, { useState } from 'react';
import { UserRole, UserProfile, Materi, Tugas, CBTExam, InAppNotification } from './types/lms';
import { MOCK_USERS, MOCK_MATERI, MOCK_TUGAS, MOCK_CBT_EXAM, MOCK_NOTIFICATIONS } from './data/mockData';
import {
  createNewTaskNotification,
  createTaskGradedNotification,
  createTaskSubmittedNotification,
} from './utils/lmsLogic';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { MateriList } from './components/MateriList';
import { TugasProyek } from './components/TugasProyek';
import { CbtExamView } from './components/CbtExamView';
import { PresensiJurnal } from './components/PresensiJurnal';
import { PklMonitoring } from './components/PklMonitoring';
import { AdminMasterData } from './components/AdminMasterData';
import { AuthPortalModal } from './components/AuthPortalModal';
import { BellRing, X } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('siswa');
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Core application reactive state
  const [materiList, setMateriList] = useState<Materi[]>(MOCK_MATERI);
  const [tugasList, setTugasList] = useState<Tugas[]>(MOCK_TUGAS);
  const [exam] = useState<CBTExam>(MOCK_CBT_EXAM);
  const [notifications, setNotifications] = useState<InAppNotification[]>(MOCK_NOTIFICATIONS);
  const [toastNotification, setToastNotification] = useState<InAppNotification | null>(null);

  // Active user object based on role
  const currentUser: UserProfile = MOCK_USERS[currentRole];

  const triggerToast = (notif: InAppNotification) => {
    setToastNotification(notif);
    setTimeout(() => {
      setToastNotification((prev) => (prev?.id === notif.id ? null : prev));
    }, 5000);
  };

  // Handler: toggle lesson completed status
  const handleToggleCompleteMateri = (materiId: string) => {
    setMateriList((prev) =>
      prev.map((m) =>
        m.id === materiId ? { ...m, statusSelesai: !m.statusSelesai } : m
      )
    );
  };

  // Handler: add new lesson (Guru/Admin)
  const handleAddMateri = (newMateri: Materi) => {
    setMateriList((prev) => [newMateri, ...prev]);
  };

  // Handler: add new assignment (Guru/Admin) -> Notify Siswa
  const handleAddTugas = (newTugas: Tugas) => {
    setTugasList((prev) => [newTugas, ...prev]);
    const notif = createNewTaskNotification(
      newTugas.id,
      newTugas.judul,
      newTugas.deadline,
      newTugas.tipe
    );
    setNotifications((prev) => [notif, ...prev]);
    triggerToast(notif);
  };

  // Handler: submit student project -> Notify Guru
  const handleSubmitTugas = (tugasId: string, fileUrl: string, _catatan: string) => {
    const targetTugas = tugasList.find((t) => t.id === tugasId);
    setTugasList((prev) =>
      prev.map((t) =>
        t.id === tugasId
          ? {
              ...t,
              sudahDikumpulkan: true,
              fileSiswa: fileUrl,
              catatanGuru: t.catatanGuru || 'Menunggu tinjauan guru pengampu',
              tanggalKumpul: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : t
      )
    );

    if (targetTugas) {
      const notif = createTaskSubmittedNotification(
        tugasId,
        targetTugas.judul,
        MOCK_USERS.siswa.name
      );
      setNotifications((prev) => [notif, ...prev]);
      triggerToast(notif);
    }
  };

  // Handler: grade student project (Guru) -> Notify Siswa
  const handleGradeTugas = (tugasId: string, nilai: number, feedback: string) => {
    const targetTugas = tugasList.find((t) => t.id === tugasId);
    setTugasList((prev) =>
      prev.map((t) =>
        t.id === tugasId
          ? {
              ...t,
              sudahDikumpulkan: true,
              nilai,
              catatanGuru: feedback,
            }
          : t
      )
    );

    if (targetTugas) {
      const notif = createTaskGradedNotification(
        tugasId,
        targetTugas.judul,
        nilai,
        feedback
      );
      setNotifications((prev) => [notif, ...prev]);
      triggerToast(notif);
    }
  };

  // Handler: mark single notification read
  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, dibaca: true } : n))
    );
  };

  // Handler: mark all notifications read for current role
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.targetRole === currentRole || n.targetRole === 'all'
          ? { ...n, dibaca: true }
          : n
      )
    );
  };

  const handleLoginSuccess = (role: UserRole) => {
    setCurrentRole(role);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    const user = MOCK_USERS[role];
    triggerToast({
      id: `notif_login_${Date.now()}`,
      targetRole: role,
      tipe: 'info',
      judul: `Login Berhasil (@${user.username})`,
      pesan: `Selamat datang kembali, ${user.name} (${user.jabatan}).`,
      waktu: 'Baru saja',
      dibaca: true,
      targetNav: 'dashboard',
    });
  };

  if (!isLoggedIn) {
    return (
      <AuthPortalModal
        isOpen={true}
        isFullScreenLogin={true}
        currentRole={currentRole}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Sticky Header Navbar */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        onSelectNav={(nav) => setActiveNav(nav)}
        activeNav={activeNav}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Modal Akun & Login */}
      <AuthPortalModal
        isOpen={isAuthModalOpen}
        currentRole={currentRole}
        onLoginSuccess={handleLoginSuccess}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* In-App Real-Time Toast Banner */}
      {toastNotification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start space-x-3"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <BellRing className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300">
                Notifikasi Terkirim ({toastNotification.targetRole})
              </span>
              <button
                onClick={() => setToastNotification(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
                aria-label="Tutup notifikasi pop-up"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs font-bold text-white mt-1">
              {toastNotification.judul}
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
              {toastNotification.pesan}
            </p>
          </div>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          currentRole={currentRole}
          activeNav={activeNav}
          onSelectNav={(nav) => setActiveNav(nav)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Content View Area */}
        <main className="flex-1 py-6 lg:pl-8 overflow-y-auto">
          {activeNav === 'dashboard' && (
            <DashboardOverview
              currentUser={currentUser}
              currentRole={currentRole}
              onNavigate={(nav) => setActiveNav(nav)}
            />
          )}

          {activeNav === 'materi' && (
            <MateriList
              materiList={materiList}
              currentRole={currentRole}
              onToggleComplete={handleToggleCompleteMateri}
              onAddMateri={handleAddMateri}
            />
          )}

          {activeNav === 'tugas' && (
            <TugasProyek
              tugasList={tugasList}
              currentRole={currentRole}
              onSubmitTugas={handleSubmitTugas}
              onGradeTugas={handleGradeTugas}
              onAddTugas={handleAddTugas}
            />
          )}

          {activeNav === 'cbt' && (
            <CbtExamView exam={exam} currentRole={currentRole} />
          )}

          {activeNav === 'presensi' && (
            <PresensiJurnal
              currentRole={currentRole}
              currentUserName={currentUser.name}
            />
          )}

          {activeNav === 'pkl' && (
            <PklMonitoring
              currentRole={currentRole}
              currentUserName={currentUser.name}
            />
          )}

          {activeNav === 'master' && (
            <AdminMasterData currentRole={currentRole} />
          )}
        </main>
      </div>

      {/* Modern Footer with Tech Stack Indicator */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-700 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">EduSMK Learning System</span>
            <span>&bull;</span>
            <span>Kurikulum Merdeka Kejuruan Indonesia</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-slate-700">
            <span className="font-semibold text-indigo-700">SMK Pusat Keunggulan</span>
            <span>&bull;</span>
            <span>Tahun Ajaran 2026/2027</span>
            <span>&bull;</span>
            <span className="text-emerald-700 font-bold">Terakreditasi A</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
