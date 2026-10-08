import React, { useState } from 'react';
import { Student } from '../types';
import { Search, Edit2, Trash2, Printer, Eye, Users, ArrowUpDown } from 'lucide-react';

interface StudentTableProps {
  students: Student[];
  selectedStudentId: string | null;
  onSelectStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onClearAll: () => void;
  onPrintSingle: (student: Student) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  selectedStudentId,
  onSelectStudent,
  onEditStudent,
  onDeleteStudent,
  onClearAll,
  onPrintSingle,
}) => {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredStudents = students
    .filter((s) => {
      const q = search.toLowerCase();
      return (
        String(s.absen).toLowerCase().includes(q) ||
        s.nama.toLowerCase().includes(q) ||
        (s.kelas && s.kelas.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      const numA = Number(a.absen);
      const numB = Number(b.absen);
      const diff = !isNaN(numA) && !isNaN(numB)
        ? numA - numB
        : String(a.absen).localeCompare(String(b.absen));
      return sortOrder === 'asc' ? diff : -diff;
    });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Table Header & Search */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-700" />
          <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
            Daftar Siswa
          </h4>
          <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
            {students.length} Siswa
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari absen / nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-2 py-1 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
          </div>

          {/* Sort order toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title="Urutkan No. Absen"
            className="p-1.5 text-slate-600 hover:text-purple-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          {/* Clear all */}
          {students.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Yakin ingin menghapus seluruh daftar siswa? Data yang sudah dihapus tidak dapat dikembalikan.')) {
                  onClearAll();
                }
              }}
              title="Kosongkan semua daftar siswa"
              className="p-1.5 text-rose-600 hover:text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-md transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-y-auto max-h-[380px] min-h-[180px]">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center h-full">
            <Users className="w-8 h-8 stroke-[1.5] mb-2 opacity-50" />
            <p className="text-xs font-medium">
              {search ? 'Tidak ada siswa yang cocok dengan pencarian.' : 'Belum ada data siswa.'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Silakan tambahkan siswa di atas atau gunakan tombol Impor CSV.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-600 sticky top-0 z-10 text-[11px] font-semibold">
              <tr>
                <th className="py-2 px-3 w-14 text-center">Absen</th>
                <th className="py-2 px-3">Nama Siswa</th>
                <th className="py-2 px-3 hidden sm:table-cell">Kelas</th>
                <th className="py-2 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => {
                const isSelected = selectedStudentId === s.id;
                return (
                  <tr
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-purple-50/80 font-medium text-purple-950'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {/* Absen */}
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          isSelected
                            ? 'bg-purple-200 text-purple-900 ring-1 ring-purple-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {s.absen}
                      </span>
                    </td>

                    {/* Nama */}
                    <td className="py-2 px-3">
                      <div className="font-semibold uppercase tracking-tight line-clamp-1">
                        {s.nama}
                      </div>
                      <div className="text-[10px] text-slate-400 sm:hidden">
                        {s.kelas}
                      </div>
                    </td>

                    {/* Kelas */}
                    <td className="py-2 px-3 text-slate-500 hidden sm:table-cell">
                      {s.kelas || '-'}
                    </td>

                    {/* Action buttons */}
                    <td className="py-2 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectStudent(s)}
                          title="Lihat preview amplop"
                          className={`p-1 rounded hover:bg-slate-200 transition ${
                            isSelected ? 'text-purple-700 bg-purple-100' : 'text-slate-500'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onPrintSingle(s)}
                          title="Cetak amplop siswa ini saja"
                          className="p-1 rounded text-purple-700 hover:bg-purple-100 transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditStudent(s)}
                          title="Edit nama / nomor"
                          className="p-1 rounded text-amber-600 hover:bg-amber-100 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteStudent(s.id)}
                          title="Hapus siswa"
                          className="p-1 rounded text-rose-500 hover:bg-rose-100 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex justify-between items-center">
        <span>Klik baris siswa untuk melihat preview amplop.</span>
        <span className="font-semibold text-slate-700">Urut otomatis by No. Absen</span>
      </div>
    </div>
  );
};
