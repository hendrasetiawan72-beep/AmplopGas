import React, { useState, useRef } from 'react';
import { Student } from '../types';
import { parseExcelFile, downloadExcelTemplate } from '../utils/excelHelper';
import {
  FileSpreadsheet,
  Keyboard,
  UserPlus,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Sparkles,
} from 'lucide-react';

interface DataInputBarProps {
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onImportStudents: (students: Student[], mode: 'append' | 'replace') => void;
  nextSuggestedAbsen: number;
  defaultKelas: string;
}

export const DataInputBar: React.FC<DataInputBarProps> = ({
  onAddStudent,
  onImportStudents,
  nextSuggestedAbsen,
  defaultKelas,
}) => {
  const [activeMode, setActiveMode] = useState<'manual' | 'excel'>('manual');

  // Manual input state
  const [absen, setAbsen] = useState<string>('');
  const [nama, setNama] = useState<string>('');
  const namaInputRef = useRef<HTMLInputElement>(null);

  // Excel state
  const [isProcessing, setIsProcessing] = useState(false);
  const [excelResult, setExcelResult] = useState<{
    fileName: string;
    students: Student[];
    totalRows: number;
  } | null>(null);
  const [excelImportMode, setExcelImportMode] = useState<'append' | 'replace'>('append');
  const [excelError, setExcelError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Manual submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    const finalAbsen = absen.trim() ? (isNaN(Number(absen)) ? absen.trim() : Number(absen)) : nextSuggestedAbsen;

    onAddStudent({
      absen: finalAbsen,
      nama: nama.trim().toUpperCase(),
      kelas: defaultKelas,
    });

    // Reset and focus for rapid continuous entry
    setNama('');
    setAbsen(String(Number(finalAbsen) + 1 || nextSuggestedAbsen + 1));
    namaInputRef.current?.focus();
  };

  // Handle Excel upload
  const handleFileUpload = async (file: File) => {
    setExcelError(null);
    setIsProcessing(true);
    try {
      const result = await parseExcelFile(file, defaultKelas);
      if (result.students.length === 0) {
        setExcelError('Tidak ditemukan data siswa valid di dalam file Excel.');
        setExcelResult(null);
      } else {
        setExcelResult({
          fileName: file.name,
          students: result.students,
          totalRows: result.totalRows,
        });
      }
    } catch (err: any) {
      console.error('Error parsing Excel:', err);
      setExcelError(err.message || 'Gagal membaca file Excel. Pastikan format file adalah .xlsx atau .xls.');
      setExcelResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyExcel = () => {
    if (!excelResult || excelResult.students.length === 0) return;
    onImportStudents(excelResult.students, excelImportMode);
    setExcelResult(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-purple-200/80 shadow-sm overflow-hidden transition-all">
      {/* Top Bilah Mode Selector Tabs */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white px-3 sm:px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
            Bilah Masukkan Data:
          </span>
          <div className="flex bg-black/25 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveMode('manual')}
              className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'manual'
                  ? 'bg-white text-purple-950 shadow-xs'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Input Manual</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('excel')}
              className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'excel'
                  ? 'bg-white text-purple-950 shadow-xs'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dari File Excel (.xlsx / .xls)</span>
            </button>
          </div>
        </div>

        {activeMode === 'excel' && (
          <button
            type="button"
            onClick={downloadExcelTemplate}
            className="text-[11px] bg-white/10 hover:bg-white/20 text-purple-100 hover:text-white px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer"
            title="Download file template Excel resmi"
          >
            <Download className="w-3 h-3 text-emerald-400" />
            <span>Download Template Excel</span>
          </button>
        )}
      </div>

      {/* Mode 1: Bilah Input Manual */}
      {activeMode === 'manual' && (
        <form onSubmit={handleManualSubmit} className="p-3 sm:p-4 bg-purple-50/40">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Input Nomor Absen */}
            <div className="w-full sm:w-28 flex-shrink-0">
              <label className="block text-[11px] font-bold text-slate-600 mb-0.5 sm:sr-only">
                Nomor Absen
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={absen}
                  onChange={(e) => setAbsen(e.target.value)}
                  placeholder={`No (${nextSuggestedAbsen})`}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-center font-bold text-sm text-purple-950 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 shadow-xs"
                />
              </div>
            </div>

            {/* Input Nama Siswa */}
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-0.5 sm:sr-only">
                Nama Siswa
              </label>
              <input
                ref={namaInputRef}
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Ketik Nama Siswa... (contoh: ABDULLAH KAFA BIHI)"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold uppercase text-slate-800 placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 shadow-xs"
              />
            </div>

            {/* Tombol Tambahkan */}
            <button
              type="submit"
              disabled={!nama.trim()}
              className="px-5 py-2 bg-purple-800 hover:bg-purple-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Siswa</span>
            </button>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Tekan <kbd className="px-1 py-0.5 bg-slate-200 text-slate-700 rounded font-mono text-[10px]">Enter</kbd> untuk langsung menyimpan & lanjut siswa berikutnya</span>
            <span className="text-purple-700 font-medium hidden sm:inline">Data langsung sinkron ke preview amplop</span>
          </div>
        </form>
      )}

      {/* Mode 2: Bilah Impor dari File Excel */}
      {activeMode === 'excel' && (
        <div className="p-3 sm:p-4 bg-emerald-50/40 space-y-3">
          {!excelResult ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-white rounded-xl p-4 sm:p-5 text-center transition flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-800 flex-shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800">
                    Pilih atau Tarik File Excel (.xlsx / .xls)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Otomatis membaca kolom <strong>Nomor Absen</strong> dan <strong>Nama Siswa</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Membaca File...' : 'Pilih File Excel'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Excel Result Preview & Confirmation Bar */
            <div className="bg-white rounded-xl border border-emerald-300 p-3 sm:p-4 space-y-3 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>File Terbaca: {excelResult.fileName}</span>
                  <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full text-xs font-extrabold">
                    {excelResult.students.length} Siswa
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <label className="flex items-center gap-1 text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="excelMode"
                      checked={excelImportMode === 'append'}
                      onChange={() => setExcelImportMode('append')}
                      className="text-emerald-700 focus:ring-emerald-600"
                    />
                    <span>Tambahkan ke daftar</span>
                  </label>
                  <label className="flex items-center gap-1 text-slate-700 cursor-pointer ml-2">
                    <input
                      type="radio"
                      name="excelMode"
                      checked={excelImportMode === 'replace'}
                      onChange={() => setExcelImportMode('replace')}
                      className="text-emerald-700 focus:ring-emerald-600"
                    />
                    <span>Ganti seluruh daftar</span>
                  </label>
                </div>
              </div>

              {/* Sample parsed records */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                {excelResult.students.slice(0, 4).map((s, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-1.5 rounded-lg">
                    <span className="font-bold text-emerald-800">#{s.absen}</span> {s.nama}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setExcelResult(null)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Pilih file lain
                </button>
                <button
                  type="button"
                  onClick={handleApplyExcel}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Masukkan {excelResult.students.length} Siswa ke Amplop</span>
                </button>
              </div>
            </div>
          )}

          {excelError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{excelError}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
