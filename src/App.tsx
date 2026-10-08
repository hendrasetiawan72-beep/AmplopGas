import { useState, useEffect, useMemo, useRef } from 'react';
import { Student, KopData, EnvelopeSettings } from './types';
import {
  DEFAULT_KOP_DATA,
  DEFAULT_SETTINGS,
  PAPER_SIZES,
  SAMPLE_STUDENTS,
} from './constants/defaultData';
import { EnvelopeItem } from './components/EnvelopeItem';
import { EnvelopePrintContainer } from './components/EnvelopePrintContainer';
import { DataInputBar } from './components/DataInputBar';
import { StudentForm } from './components/StudentForm';
import { StudentTable } from './components/StudentTable';
import { ImportExportModal } from './components/ImportExportModal';
import { KopConfigModal } from './components/KopConfigModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { SchoolLogo } from './components/SchoolLogo';
import {
  triggerBrowserPrint,
  generateDirectPdf,
  convertImageUrlToBase64,
} from './utils/pdfGenerator';
import {
  Printer,
  Download,
  Upload,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck,
  Layers,
  Sparkles,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

const STORAGE_KEYS = {
  STUDENTS: 'smk_amplop_students_v1',
  KOP: 'smk_amplop_kop_v1',
  SETTINGS: 'smk_amplop_settings_v1',
};

export default function App() {
  // --- Persistent State ---
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load students from localStorage:', e);
    }
    return SAMPLE_STUDENTS;
  });

  const [kop, setKop] = useState<KopData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KOP);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load kop from localStorage:', e);
    }
    return DEFAULT_KOP_DATA;
  });

  const [settings, setSettings] = useState<EnvelopeSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          // Pastikan ukuran default adalah DL Envelope (220 x 110 mm)
          paperSizeId: parsed.paperSizeId === 'a4-landscape' ? 'dl-landscape' : (parsed.paperSizeId || 'dl-landscape'),
        };
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  });

  // UI States
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isKopModalOpen, setIsKopModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(0.9); // 0.9 fits DL Envelope beautifully
  const [singlePrintTarget, setSinglePrintTarget] = useState<Student | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'form' | 'preview'>('preview');

  const previewWrapperRef = useRef<HTMLDivElement>(null);

  // Auto-save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KOP, JSON.stringify(kop));
  }, [kop]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Attempt base64 cache for official logo on startup if not yet cached
  useEffect(() => {
    if (!kop.logoBase64 && kop.logoUrl) {
      convertImageUrlToBase64(kop.logoUrl).then((b64) => {
        if (b64) {
          setKop((prev) => ({ ...prev, logoBase64: b64 }));
        }
      });
    }
  }, [kop.logoUrl, kop.logoBase64]);

  // Current Paper Config
  const currentPaper = useMemo(() => {
    return (
      PAPER_SIZES.find((p) => p.id === settings.paperSizeId) || PAPER_SIZES[0]
    );
  }, [settings.paperSizeId]);

  // Inject dynamic @page style for browser print dialog
  useEffect(() => {
    let styleTag = document.getElementById('dynamic-page-print') as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'dynamic-page-print';
      document.head.appendChild(styleTag);
    }

    const margin = settings.paperSizeId === 'dl-landscape' ? '5mm' : '10mm';
    styleTag.innerHTML = `
      @media print {
        @page {
          size: ${currentPaper.widthMm}mm ${currentPaper.heightMm}mm;
          margin: ${margin};
        }
      }
    `;
  }, [currentPaper, settings.paperSizeId]);

  // Sort students by attendance number
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      const numA = Number(a.absen);
      const numB = Number(b.absen);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return String(a.absen).localeCompare(String(b.absen));
    });
  }, [students]);

  // Selected Student for preview
  const currentStudent = useMemo<Student>(() => {
    if (selectedStudentId) {
      const found = sortedStudents.find((s) => s.id === selectedStudentId);
      if (found) return found;
    }
    return (
      sortedStudents[0] || {
        id: 'sample-dummy',
        absen: 1,
        nama: 'ABDULLAH KAFA BIHI',
        kelas: settings.defaultKelas,
      }
    );
  }, [sortedStudents, selectedStudentId, settings.defaultKelas]);

  // Next suggested attendance number
  const nextSuggestedAbsen = useMemo(() => {
    if (sortedStudents.length === 0) return 1;
    const numbers = sortedStudents
      .map((s) => Number(s.absen))
      .filter((n) => !isNaN(n));
    if (numbers.length === 0) return sortedStudents.length + 1;
    return Math.max(...numbers) + 1;
  }, [sortedStudents]);

  // Navigation handlers
  const currentStudentIndex = useMemo(() => {
    return sortedStudents.findIndex((s) => s.id === currentStudent.id);
  }, [sortedStudents, currentStudent]);

  const handlePrevStudent = () => {
    if (currentStudentIndex > 0) {
      setSelectedStudentId(sortedStudents[currentStudentIndex - 1].id);
    }
  };

  const handleNextStudent = () => {
    if (currentStudentIndex < sortedStudents.length - 1) {
      setSelectedStudentId(sortedStudents[currentStudentIndex + 1].id);
    }
  };

  // Student CRUD
  const handleAddStudent = (newStudent: Omit<Student, 'id'>) => {
    const created: Student = {
      ...newStudent,
      id: `student-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setStudents((prev) => [...prev, created]);
    setSelectedStudentId(created.id);
  };

  const handleUpdateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditingStudent(null);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudentId === id) {
      setSelectedStudentId(null);
    }
    if (editingStudent?.id === id) {
      setEditingStudent(null);
    }
  };

  const handleClearAll = () => {
    setStudents([]);
    setSelectedStudentId(null);
    setEditingStudent(null);
  };

  const handleImportStudents = (newOnes: Student[], mode: 'append' | 'replace') => {
    if (mode === 'replace') {
      setStudents(newOnes);
      if (newOnes.length > 0) setSelectedStudentId(newOnes[0].id);
    } else {
      setStudents((prev) => [...prev, ...newOnes]);
    }
  };

  // Printing Handlers
  const handlePrintAll = () => {
    setSinglePrintTarget(null);
    triggerBrowserPrint();
  };

  const handlePrintSingle = (student: Student) => {
    setSinglePrintTarget(student);
    triggerBrowserPrint(student.id);
  };

  // Direct jsPDF Download
  const handleDownloadDirectPdf = async () => {
    if (students.length === 0) {
      alert('Tambahkan data siswa terlebih dahulu.');
      return;
    }

    try {
      setIsExportingPdf(true);
      const studentIdsToExport = sortedStudents.map(
        (_, idx) => `envelope-print-item-${idx}`
      );

      const fileName = `Amplop_Raport_${settings.defaultKelas.replace(/\s+/g, '_')}_${sortedStudents.length}_Siswa.pdf`;

      await generateDirectPdf(
        studentIdsToExport,
        currentPaper,
        fileName,
        (current, total) => setPdfProgress({ current, total })
      );
    } catch (err) {
      console.error('Direct PDF export error:', err);
      alert('Gagal menghasilkan file PDF langsung. Anda dapat menggunakan tombol "Cetak Semua" lalu pilih "Save as PDF" di dialog browser.');
    } finally {
      setIsExportingPdf(false);
      setPdfProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      {/* 1. TOP HEADER / APP BAR */}
      <header className="no-print bg-purple-950 text-white border-b border-purple-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & School Title */}
          <div className="flex items-center gap-3">
            <div className="p-1 bg-white rounded-lg shadow-xs">
              <SchoolLogo
                src={kop.logoUrl}
                base64={kop.logoBase64}
                className="w-8 h-8"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-base leading-tight tracking-wide">
                  Pembuat Amplop Raport
                </h1>
                <span className="hidden md:inline-block bg-purple-800 text-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Siap Cetak PDF
                </span>
              </div>
              <p className="text-[11px] text-purple-200 font-medium">
                SMK Muhammadiyah Bawang &bull; Daerah Batang
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Kop Settings */}
            <button
              onClick={() => setIsKopModalOpen(true)}
              className="px-2.5 py-1.5 bg-purple-900 hover:bg-purple-800 text-purple-200 hover:text-white text-xs font-medium rounded-lg border border-purple-700/60 transition flex items-center gap-1.5 cursor-pointer"
              title="Atur teks kop surat, nomor kontak, & logo"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kop Surat</span>
            </button>

            {/* Deploy Guide */}
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="px-2.5 py-1.5 bg-purple-900 hover:bg-purple-800 text-purple-200 hover:text-white text-xs font-medium rounded-lg border border-purple-700/60 transition flex items-center gap-1.5 cursor-pointer"
              title="Panduan deploy ke Vercel dan Cloudflare Pages"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Deploy</span>
            </button>

            {/* Direct Download PDF */}
            <button
              onClick={handleDownloadDirectPdf}
              disabled={isExportingPdf || students.length === 0}
              className="px-3 py-1.5 bg-purple-800 hover:bg-purple-700 disabled:bg-purple-900/40 text-white text-xs font-semibold rounded-lg border border-purple-600 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Download file .pdf multi-halaman langsung"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>
                    {pdfProgress
                      ? `${pdfProgress.current}/${pdfProgress.total}`
                      : 'Membuat PDF...'}
                  </span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh PDF</span>
                </>
              )}
            </button>

            {/* Primary Print Button */}
            <button
              onClick={handlePrintAll}
              disabled={students.length === 0}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg shadow-md transition flex items-center gap-1.5 cursor-pointer"
              title="Cetak semua amplop atau Simpan ke PDF via dialog cetak browser (Kualitas Vektor Tajam 300 DPI)"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Semua ({students.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="no-print lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-around text-xs font-semibold">
        <button
          onClick={() => setActiveMobileTab('preview')}
          className={`py-1.5 px-4 rounded-lg cursor-pointer ${
            activeMobileTab === 'preview'
              ? 'bg-purple-100 text-purple-900'
              : 'text-slate-600'
          }`}
        >
          Preview Amplop
        </button>
        <button
          onClick={() => setActiveMobileTab('form')}
          className={`py-1.5 px-4 rounded-lg cursor-pointer ${
            activeMobileTab === 'form'
              ? 'bg-purple-100 text-purple-900'
              : 'text-slate-600'
          }`}
        >
          Data Siswa ({students.length})
        </button>
      </div>

      {/* 2. MAIN WORKSPACE (SPLIT PANEL) */}
      <main className="no-print flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT PANEL: Form, Options, & Student Table (Col 5) */}
        <div
          className={`lg:col-span-5 flex flex-col gap-3.5 ${
            activeMobileTab === 'form' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* BILAH MEMASUKKAN DATA (MANUAL & DARI FILE EXCEL) */}
          <DataInputBar
            onAddStudent={handleAddStudent}
            onImportStudents={handleImportStudents}
            nextSuggestedAbsen={nextSuggestedAbsen}
            defaultKelas={settings.defaultKelas}
          />

          {/* Envelope, Kop & Paper Configuration Card */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-700" />
                Format Kertas & Kop Amplop
              </span>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition cursor-pointer"
              >
                <Upload className="w-3 h-3" /> Impor CSV / Paste
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {/* Paper Size Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Ukuran Amplop
                </label>
                <select
                  value={settings.paperSizeId}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      paperSizeId: e.target.value as any,
                    }))
                  }
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 font-medium text-xs"
                >
                  {PAPER_SIZES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name.split(' (')[0]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Layout Style */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Gaya Amplop
                </label>
                <select
                  value={settings.layoutStyle}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      layoutStyle: e.target.value as any,
                    }))
                  }
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 font-medium text-xs"
                >
                  <option value="official-box">
                    Kotak Resmi (Gb 2)
                  </option>
                  <option value="minimal-table">
                    Baris NAMA & NO
                  </option>
                </select>
              </div>

              {/* Kop Style Mode */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Format Kop
                </label>
                <select
                  value={kop.kopMode || 'standard'}
                  onChange={(e) =>
                    setKop((prev) => ({
                      ...prev,
                      kopMode: e.target.value as any,
                    }))
                  }
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 font-medium text-xs"
                >
                  <option value="standard">Logo di Kiri + Teks</option>
                  <option value="image-banner">Gambar Kop Penuh</option>
                </select>
              </div>
            </div>

            {/* Quick Default Class setting */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">Kelas / Rombel:</span>
              <input
                type="text"
                value={settings.defaultKelas}
                onChange={(e) => {
                  const val = e.target.value;
                  setSettings((prev) => ({ ...prev, defaultKelas: val }));
                }}
                placeholder="XI TKR 1"
                className="w-28 px-2 py-0.5 bg-slate-50 border border-slate-300 rounded-md text-right font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Edit Student Form (only visible when a student is currently being edited) */}
          {editingStudent && (
            <StudentForm
              onAddStudent={handleAddStudent}
              editingStudent={editingStudent}
              onUpdateStudent={handleUpdateStudent}
              onCancelEdit={() => setEditingStudent(null)}
              defaultKelas={settings.defaultKelas}
              nextSuggestedAbsen={nextSuggestedAbsen}
            />
          )}

          {/* Students List Table */}
          <div className="flex-1 min-h-[300px]">
            <StudentTable
              students={students}
              selectedStudentId={selectedStudentId || currentStudent.id}
              onSelectStudent={(s) => {
                setSelectedStudentId(s.id);
                if (window.innerWidth < 1024) setActiveMobileTab('preview');
              }}
              onEditStudent={(s) => setEditingStudent(s)}
              onDeleteStudent={handleDeleteStudent}
              onClearAll={handleClearAll}
              onPrintSingle={handlePrintSingle}
            />
          </div>
        </div>

        {/* RIGHT PANEL: Interactive Live Preview (Col 7) */}
        <div
          className={`lg:col-span-7 flex flex-col gap-3 ${
            activeMobileTab === 'preview' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* Preview Navigation Toolbar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
            {/* Student Pagination */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevStudent}
                disabled={currentStudentIndex <= 0}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                title="Siswa Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4 text-slate-700" />
              </button>

              <div className="text-xs font-semibold text-slate-700 px-2 text-center min-w-[130px]">
                {sortedStudents.length > 0 ? (
                  <>
                    <span className="font-bold text-purple-900">
                      #{currentStudent.absen}
                    </span>{' '}
                    ({currentStudentIndex + 1} dari {sortedStudents.length})
                  </>
                ) : (
                  'Preview Kosong'
                )}
              </div>

              <button
                onClick={handleNextStudent}
                disabled={currentStudentIndex >= sortedStudents.length - 1}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                title="Siswa Berikutnya"
              >
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </button>
            </div>

            {/* Quick Action for this student */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePrintSingle(currentStudent)}
                className="px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-50 border border-purple-200 rounded-lg transition flex items-center gap-1 cursor-pointer"
                title="Cetak amplop siswa yang sedang dilihat saat ini"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Siswa Ini</span>
              </button>

              {/* Zoom controls */}
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-xs">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.4, z - 0.1))}
                  className="p-1.5 hover:bg-slate-200 transition text-slate-600"
                  title="Perkecil Preview"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 py-0.5 font-mono text-[11px] text-slate-700 font-semibold">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.2, z + 0.1))}
                  className="p-1.5 hover:bg-slate-200 transition text-slate-600"
                  title="Perbesar Preview"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel(1.0)}
                  className="p-1.5 hover:bg-slate-200 transition text-slate-600 border-l border-slate-200"
                  title="Reset Zoom (100%)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Envelope Preview Stage */}
          <div
            ref={previewWrapperRef}
            className="flex-1 bg-slate-200/70 rounded-2xl border border-slate-300 p-4 sm:p-6 flex flex-col items-center justify-center overflow-auto min-h-[480px] shadow-inner relative"
          >
            {/* Realistic Paper Envelope Container with dynamic zoom scale */}
            <div
              className="transition-transform duration-150 origin-top flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel})`,
              }}
            >
              <EnvelopeItem
                student={currentStudent}
                kop={kop}
                settings={settings}
                paper={currentPaper}
                isPrintVersion={false}
              />
            </div>
          </div>

          {/* Informational Guidance Badge */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Format cetak aktif:{' '}
                <strong className="text-slate-800">{currentPaper.name}</strong>{' '}
                ({currentPaper.widthMm} &times; {currentPaper.heightMm} mm)
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Vektor murni 300+ DPI &bull; 1 Siswa = 1 Halaman
            </div>
          </div>
        </div>
      </main>

      {/* 3. DEDICATED PRINT CONTAINER (Shown only during browser print) */}
      <EnvelopePrintContainer
        students={sortedStudents}
        singleStudent={singlePrintTarget}
        kop={kop}
        settings={settings}
        paper={currentPaper}
      />

      {/* 4. MODALS */}
      <ImportExportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportStudents}
        currentStudents={students}
        defaultKelas={settings.defaultKelas}
      />

      <KopConfigModal
        isOpen={isKopModalOpen}
        onClose={() => setIsKopModalOpen(false)}
        kop={kop}
        onSaveKop={(updated) => setKop(updated)}
      />

      <DeployGuideModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </div>
  );
}
