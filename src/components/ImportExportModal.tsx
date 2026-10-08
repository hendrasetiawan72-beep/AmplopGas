import React, { useState } from 'react';
import { Student } from '../types';
import { parseStudentsText, generateCsvTemplate, exportStudentsToCsv } from '../utils/csvHelper';
import { SAMPLE_STUDENTS } from '../constants/defaultData';
import { X, Upload, FileText, Download, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newStudents: Student[], mode: 'append' | 'replace') => void;
  currentStudents: Student[];
  defaultKelas: string;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  currentStudents,
  defaultKelas,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'file' | 'export'>('paste');
  const [rawText, setRawText] = useState('');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [importClass, setImportClass] = useState(defaultKelas);

  if (!isOpen) return null;

  const { students: parsedStudents, errors } = parseStudentsText(rawText, importClass);

  const handleApplyImport = () => {
    if (parsedStudents.length === 0) return;
    onImport(parsedStudents, importMode);
    onClose();
    setRawText('');
  };

  const handleLoadSample = () => {
    const formatted = SAMPLE_STUDENTS.map((s) => `${s.absen}, ${s.nama}, ${s.kelas}`).join('\n');
    setRawText(formatted);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      try {
        const { parseExcelFile } = await import('../utils/excelHelper');
        const res = await parseExcelFile(file, importClass);
        if (res.students.length > 0) {
          onImport(res.students, importMode);
          onClose();
          return;
        }
      } catch (err) {
        console.warn('Excel parse failed:', err);
      }
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
        setActiveTab('paste'); // Switch to paste tab to review parsed results
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const template = generateCsvTemplate();
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template_siswa_amplop_smkmuhiba.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCurrent = () => {
    if (currentStudents.length === 0) return;
    const csvContent = exportStudentsToCsv(currentStudents);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `daftar_siswa_${importClass || 'kelas'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Upload className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Impor & Ekspor Daftar Siswa
              </h3>
              <p className="text-xs text-purple-200">
                Masukkan banyak siswa sekaligus dari teks, Excel, atau file CSV
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('paste')}
            className={`py-2 px-3 border-b-2 cursor-pointer transition flex items-center gap-1.5 ${
              activeTab === 'paste'
                ? 'border-purple-700 text-purple-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Paste Teks / Format Kolom
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`py-2 px-3 border-b-2 cursor-pointer transition flex items-center gap-1.5 ${
              activeTab === 'file'
                ? 'border-purple-700 text-purple-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload File CSV
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-2 px-3 border-b-2 cursor-pointer transition flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-purple-700 text-purple-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            Ekspor & Download Template
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-semibold text-slate-700">
                  Tempel data siswa di sini (satu siswa per baris):
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="text-xs text-purple-700 hover:text-purple-900 font-medium flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-md border border-purple-200 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Contoh Data SMK Muhammadiyah (10 Siswa)
                  </button>
                </div>
              </div>

              <textarea
                rows={7}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={`Contoh format (bisa dipisah koma, tab, atau titik):
1, ABDULLAH KAFA BIHI, XI TKR 1
2, ADITYA PRATAMA, XI TKR 1
3, AHMAD FAUZI, XI TKR 1

Atau cukup nama saja per baris:
ABDULLAH KAFA BIHI
ADITYA PRATAMA`}
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
              />

              {/* Class & Mode Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Kelas Bawaan (jika tidak ada di baris teks)
                  </label>
                  <input
                    type="text"
                    value={importClass}
                    onChange={(e) => setImportClass(e.target.value)}
                    placeholder="XI TKR 1"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Metode Penyimpanan
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'append'}
                        onChange={() => setImportMode('append')}
                        className="text-purple-700 focus:ring-purple-600"
                      />
                      Tambahkan (Append)
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="importMode"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                        className="text-purple-700 focus:ring-purple-600"
                      />
                      Ganti Semua (Replace)
                    </label>
                  </div>
                </div>
              </div>

              {/* Live Parsing Feedback */}
              {rawText.trim() && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle className="w-4 h-4" />
                      Terdeteksi {parsedStudents.length} siswa valid
                    </span>
                    {errors.length > 0 && (
                      <span className="text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {errors.length} peringatan
                      </span>
                    )}
                  </div>

                  {parsedStudents.length > 0 && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden max-h-36 overflow-y-auto">
                      <table className="w-full text-left text-[11px] divide-y divide-slate-100">
                        <thead className="bg-slate-100 text-slate-600">
                          <tr>
                            <th className="py-1 px-2.5 w-16">Absen</th>
                            <th className="py-1 px-2.5">Nama Siswa</th>
                            <th className="py-1 px-2.5">Kelas</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {parsedStudents.slice(0, 8).map((s, idx) => (
                            <tr key={idx}>
                              <td className="py-1 px-2.5 font-bold">{s.absen}</td>
                              <td className="py-1 px-2.5">{s.nama}</td>
                              <td className="py-1 px-2.5 text-slate-500">{s.kelas}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {parsedStudents.length > 8 && (
                        <div className="p-1 text-center bg-slate-50 text-[10px] text-slate-500">
                          + {parsedStudents.length - 8} siswa lainnya
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'file' && (
            <div className="space-y-4 text-center py-4">
              <div className="border-2 border-dashed border-purple-300 bg-purple-50/50 rounded-2xl p-8 flex flex-col items-center justify-center">
                <Upload className="w-10 h-10 text-purple-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-800 mb-1">
                  Pilih File CSV atau TXT dari Komputer
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mb-4">
                  Format baris didukung: No Absen, Nama Siswa, Kelas (bisa hasil ekspor Excel ke CSV)
                </p>
                <label className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white text-xs font-semibold rounded-lg cursor-pointer transition shadow">
                  Pilih File (.csv / .txt)
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-left bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    Belum punya formatnya?
                  </span>
                  <button
                    onClick={handleDownloadTemplate}
                    className="text-xs text-purple-700 hover:underline font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh Template CSV
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4 py-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                  Ekspor Data Saat Ini
                </h4>
                <p className="text-xs text-slate-600">
                  Download seluruh {currentStudents.length} siswa yang ada saat ini ke format file CSV untuk cadangan atau diedit di Microsoft Excel.
                </p>
                <button
                  onClick={handleExportCurrent}
                  disabled={currentStudents.length === 0}
                  className="px-4 py-2 bg-purple-800 hover:bg-purple-900 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Daftar Siswa Aktif (.CSV)
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                  Template Kosong
                </h4>
                <p className="text-xs text-slate-600">
                  Gunakan template CSV siap pakai untuk diisi data kelas baru:
                </p>
                <button
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Template Excel / CSV Kosong
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            Tutup
          </button>

          {activeTab === 'paste' && (
            <button
              onClick={handleApplyImport}
              disabled={parsedStudents.length === 0}
              className="px-5 py-2 bg-purple-800 hover:bg-purple-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg flex items-center gap-2 transition shadow cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              Simpan & Masukkan {parsedStudents.length > 0 ? `(${parsedStudents.length} Siswa)` : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
