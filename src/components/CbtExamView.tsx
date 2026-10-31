import React, { useState, useEffect } from 'react';
import { CBTExam, UserRole } from '../types/lms';
import { calculateCbtScore } from '../utils/lmsLogic';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  BookOpen,
  Award,
  Sparkles,
  HelpCircle,
  HelpCircleIcon
} from 'lucide-react';

interface CbtExamViewProps {
  exam: CBTExam;
  currentRole: UserRole;
}

export const CbtExamView: React.FC<CbtExamViewProps> = ({ exam, currentRole }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(exam.durasiMenit * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [examResult, setExamResult] = useState<ReturnType<typeof calculateCbtScore> | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');

  // Countdown timer effect
  useEffect(() => {
    let timer: any = null;
    if (isStarted && !isSubmitted && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isSubmitted, timeLeftSeconds]);

  const handleStartExam = () => {
    if (tokenInput.trim().toUpperCase() !== 'SMK2026') {
      setTokenError('Token tidak valid! Gunakan token resmi ujian: SMK2026');
      return;
    }
    setTokenError('');
    setIsStarted(true);
  };

  const handleSelectAnswer = (questionId: number, key: string) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [questionId]: key,
    }));
  };

  const handleFinishExam = () => {
    const result = calculateCbtScore(studentAnswers, exam.soal as any, exam.kkm);
    setExamResult(result);
    setIsSubmitted(true);
    setShowConfirmModal(false);
  };

  const handleAutoSubmit = () => {
    const result = calculateCbtScore(studentAnswers, exam.soal as any, exam.kkm);
    setExamResult(result);
    setIsSubmitted(true);
  };

  const handleRestart = () => {
    setIsStarted(false);
    setIsSubmitted(false);
    setStudentAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeftSeconds(exam.durasiMenit * 60);
    setExamResult(null);
    setTokenInput('');
  };

  const currentQ = exam.soal[currentQuestionIndex];
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Exam Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
              CBT Asesmen Kejuruan
            </span>
            <span className="text-xs text-slate-700">KKM: {exam.kkm}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            {exam.judul}
          </h1>
        </div>

        {isStarted && !isSubmitted && (
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-mono font-bold text-sm shadow-xs self-start sm:self-auto">
            <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-slate-300">Sisa Waktu:</span>
            <span className={timeLeftSeconds < 180 ? 'text-rose-400' : 'text-emerald-400'}>
              {formatTime(timeLeftSeconds)}
            </span>
          </div>
        )}
      </div>

      {/* State 1: Start Screen */}
      {!isStarted && !isSubmitted && (
        <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
            <FileCheck2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Petunjuk Pelaksanaan Ujian CBT
            </h2>
            <p className="text-xs text-slate-700 mt-2 leading-relaxed">
              Ujian terdiri dari {exam.totalSoal} butir soal pilihan ganda teknis Rekayasa Perangkat Lunak, Pemrograman Web, dan Basis Data Relasional.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 text-slate-700">
            <div className="flex items-center justify-between">
              <span>Alokasi Waktu:</span>
              <strong className="text-slate-900">{exam.durasiMenit} Menit</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Kriteria Ketuntasan Minimal (KKM):</span>
              <strong className="text-slate-900">{exam.kkm}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Metode Penilaian:</span>
              <strong className="text-slate-900">Otomatis / Real-Time</strong>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="max-w-xs mx-auto">
              <label className="block text-xs font-bold text-slate-700 mb-1 text-left">
                Masukkan Token Ujian:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Token: SMK2026"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-center font-bold text-xs uppercase tracking-widest focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setTokenInput('SMK2026')}
                  className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold whitespace-nowrap cursor-pointer"
                  title="Gunakan token default"
                >
                  Isi Cepat
                </button>
              </div>
              {tokenError && (
                <p className="text-[11px] text-rose-600 mt-1.5 font-medium">{tokenError}</p>
              )}
            </div>

            <button
              onClick={handleStartExam}
              className="w-full max-w-xs py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Mulai Mengerjakan Ujian
            </button>
          </div>
        </div>
      )}

      {/* State 2: Taking the Exam */}
      {isStarted && !isSubmitted && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Surface (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  Soal No. {currentQuestionIndex + 1} dari {exam.soal.length}
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  Bobot: {currentQ.bobot} Poin
                </span>
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                {currentQ.pertanyaan}
              </div>

              {/* Optional Code Snippet */}
              {currentQ.kodeSnippet && (
                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                  <pre>{currentQ.kodeSnippet}</pre>
                </div>
              )}

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.pilihan.map((option) => {
                  const isSelected = studentAnswers[currentQ.id] === option.key;
                  return (
                    <button
                      key={option.key}
                      onClick={() => handleSelectAnswer(currentQ.id, option.key)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {option.key}
                      </span>
                      <span className={`text-xs sm:text-sm ${isSelected ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                        {option.teks}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                {currentQuestionIndex < exam.soal.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer flex items-center space-x-1"
                  >
                    <span>Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer flex items-center space-x-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Selesai & Kumpulkan</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Grid Navigator (1 col) */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Nomor Soal
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {exam.soal.map((q, idx) => {
                  const isAnswered = studentAnswers[q.id] !== undefined;
                  const isCurrent = currentQuestionIndex === idx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'ring-2 ring-indigo-600 ring-offset-2'
                          : ''
                      } ${
                        isAnswered
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-700 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-md bg-emerald-600 inline-block"></span>
                  <span>Sudah Dijawab ({Object.keys(studentAnswers).length})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-md bg-slate-200 inline-block"></span>
                  <span>Belum Dijawab ({exam.soal.length - Object.keys(studentAnswers).length})</span>
                </div>
              </div>

              <button
                onClick={() => setShowConfirmModal(true)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Kumpulkan Jawaban
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Konfirmasi Selesai Ujian
              </h3>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Anda telah menjawab{' '}
                <strong className="text-slate-900">{Object.keys(studentAnswers).length}</strong> dari{' '}
                <strong>{exam.soal.length}</strong> soal. Nilai akan langsung dihitung.
              </p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cek Lagi
              </button>
              <button
                onClick={handleFinishExam}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Ya, Kumpulkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State 3: Result Summary Screen */}
      {isSubmitted && examResult && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-md text-center max-w-2xl mx-auto space-y-5">
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
                examResult.passed
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                  examResult.passed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {examResult.passed ? '🎉 Tuntas KKM' : 'Perlu Remidial'}
              </span>

              <div className="mt-3">
                <span className="text-4xl sm:text-5xl font-black text-slate-900">
                  {examResult.score}
                </span>
                <span className="text-base font-semibold text-slate-700 ml-1">/ 100</span>
              </div>
              <p className="text-xs text-slate-700 mt-1 font-medium">
                Kriteria Ketuntasan Minimal (KKM): {exam.kkm}
              </p>
            </div>

            {/* Breakdown stats */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div>
                <span className="text-xs text-slate-700">Benar</span>
                <div className="text-lg font-bold text-emerald-600">
                  {examResult.correctCount}
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-700">Salah</span>
                <div className="text-lg font-bold text-rose-500">
                  {examResult.wrongCount}
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-700">Kosong</span>
                <div className="text-lg font-bold text-slate-500">
                  {examResult.unansweredCount}
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Ujian</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review & Discussion Key */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Review Pembahasan Soal & Kunci Jawaban</span>
            </h3>

            <div className="space-y-4">
              {exam.soal.map((q, idx) => {
                const userAns = studentAnswers[q.id];
                const isCorrect = userAns === q.jawabanBenar;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border ${
                      isCorrect
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-rose-50/30 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-900">
                        Soal No. {idx + 1}
                      </span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isCorrect ? 'Jawaban Benar' : 'Jawaban Salah'}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 mb-2">
                      {q.pertanyaan}
                    </p>

                    <div className="text-xs space-y-1 text-slate-700">
                      <div>
                        Jawaban Anda:{' '}
                        <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-600'}>
                          {userAns || 'Tidak Dijawab'}
                        </strong>
                      </div>
                      <div>
                        Kunci Jawaban Benar:{' '}
                        <strong className="text-emerald-700">{q.jawabanBenar}</strong>
                      </div>
                    </div>

                    <div className="mt-3 p-2.5 rounded-lg bg-white/80 border border-slate-200/60 text-xs text-slate-700">
                      <strong className="text-slate-800">Pembahasan Teknis:</strong>{' '}
                      {q.pembahasan}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
