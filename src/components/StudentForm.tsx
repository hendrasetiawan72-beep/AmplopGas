import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { UserPlus, Check, X, Sparkles } from 'lucide-react';

interface StudentFormProps {
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  editingStudent: Student | null;
  onUpdateStudent: (student: Student) => void;
  onCancelEdit: () => void;
  defaultKelas: string;
  nextSuggestedAbsen: number;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  onAddStudent,
  editingStudent,
  onUpdateStudent,
  onCancelEdit,
  defaultKelas,
  nextSuggestedAbsen,
}) => {
  const [absen, setAbsen] = useState<string>('');
  const [nama, setNama] = useState<string>('');
  const [kelas, setKelas] = useState<string>(defaultKelas);

  useEffect(() => {
    if (editingStudent) {
      setAbsen(String(editingStudent.absen));
      setNama(editingStudent.nama);
      setKelas(editingStudent.kelas || defaultKelas);
    } else {
      setAbsen(String(nextSuggestedAbsen));
      setNama('');
      setKelas(defaultKelas);
    }
  }, [editingStudent, nextSuggestedAbsen, defaultKelas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        absen: isNaN(Number(absen)) ? absen.trim() : Number(absen),
        nama: nama.trim().toUpperCase(),
        kelas: kelas.trim() || defaultKelas,
      });
    } else {
      onAddStudent({
        absen: isNaN(Number(absen)) ? (absen.trim() || nextSuggestedAbsen) : Number(absen),
        nama: nama.trim().toUpperCase(),
        kelas: kelas.trim() || defaultKelas,
      });
      // Clear for next input
      setNama('');
      setAbsen(String(nextSuggestedAbsen + 1));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 rounded-xl border transition-all ${
        editingStudent
          ? 'bg-amber-50/70 border-amber-300 shadow-sm ring-1 ring-amber-300'
          : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
          {editingStudent ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Edit Data Siswa (#{editingStudent.absen})
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 text-purple-700" />
              Input Siswa Satuan
            </>
          )}
        </h3>
        {editingStudent && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-amber-100"
          >
            <X className="w-3.5 h-3.5" /> Batal Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-2.5">
        {/* Nomor Absen */}
        <div className="col-span-3 sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            No. Absen
          </label>
          <input
            type="text"
            required
            value={absen}
            onChange={(e) => setAbsen(e.target.value)}
            placeholder="1"
            className="w-full px-2.5 py-1.5 text-center font-bold text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
          />
        </div>

        {/* Nama Siswa */}
        <div className="col-span-9 sm:col-span-6">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Nama Lengkap Siswa
          </label>
          <input
            type="text"
            required
            autoFocus
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: ABDULLAH KAFA BIHI"
            className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white font-medium uppercase"
          />
        </div>

        {/* Kelas */}
        <div className="col-span-12 sm:col-span-3">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Kelas / Jurusan
          </label>
          <input
            type="text"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            placeholder="XI TKR 1"
            className="w-full px-2.5 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] text-slate-500 hidden sm:block">
          Preview amplop langsung menyesuaikan saat diketik
        </p>
        <button
          type="submit"
          disabled={!nama.trim()}
          className={`ml-auto px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
            editingStudent
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-purple-800 hover:bg-purple-900 text-white disabled:bg-slate-300 disabled:cursor-not-allowed'
          }`}
        >
          {editingStudent ? (
            <>
              <Check className="w-3.5 h-3.5" /> Simpan Perubahan
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" /> Tambah Siswa
            </>
          )}
        </button>
      </div>
    </form>
  );
};
