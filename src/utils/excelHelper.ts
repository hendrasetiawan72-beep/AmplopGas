import * as XLSX from 'xlsx';
import { Student } from '../types';

export interface ExcelParseResult {
  students: Student[];
  errors: string[];
  sheetNames: string[];
  totalRows: number;
}

/**
 * Parses an Excel (.xlsx, .xls) or CSV file and extracts student data.
 * Smartly finds Nomor Absen and Nama Siswa columns.
 */
export async function parseExcelFile(
  file: File,
  defaultKelas: string
): Promise<ExcelParseResult> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });

  if (workbook.SheetNames.length === 0) {
    throw new Error('File Excel tidak memiliki sheet yang valid.');
  }

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (rows.length === 0) {
    return {
      students: [],
      errors: ['File Excel kosong.'],
      sheetNames: workbook.SheetNames,
      totalRows: 0,
    };
  }

  const students: Student[] = [];
  const errors: string[] = [];

  let headerRowIndex = -1;
  let absenColIndex = -1;
  let namaColIndex = -1;
  let kelasColIndex = -1;

  // 1. Search for header row
  for (let r = 0; r < Math.min(rows.length, 10); r++) {
    const row = rows[r];
    if (!Array.isArray(row)) continue;

    for (let c = 0; c < row.length; c++) {
      const cellVal = String(row[c] || '').toLowerCase().trim();
      if (/^(no|nomor|no\.|no_absen|absen|urut)$/i.test(cellVal)) {
        absenColIndex = c;
      }
      if (/(nama|nama_siswa|nama lengkap|siswa|peserta didik)/i.test(cellVal)) {
        namaColIndex = c;
      }
      if (/(kelas|jurusan|rombel|tingkat)/i.test(cellVal)) {
        kelasColIndex = c;
      }
    }

    if (namaColIndex !== -1) {
      headerRowIndex = r;
      break;
    }
  }

  // 2. If no header detected with keywords, fallback to heuristic:
  // Column 0 is absen (if numbers), Column 1 is nama (if strings)
  const startRow = headerRowIndex !== -1 ? headerRowIndex + 1 : 0;
  if (namaColIndex === -1) {
    absenColIndex = 0;
    namaColIndex = 1;
  }

  let autoAbsen = 1;

  for (let r = startRow; r < rows.length; r++) {
    const row = rows[r];
    if (!Array.isArray(row) || row.length === 0) continue;

    let rawAbsen = absenColIndex !== -1 ? row[absenColIndex] : undefined;
    let rawNama = row[namaColIndex];
    let rawKelas = kelasColIndex !== -1 ? row[kelasColIndex] : undefined;

    // Check if only 1 column exists
    if (!rawNama && rawAbsen && typeof rawAbsen === 'string' && isNaN(Number(rawAbsen))) {
      rawNama = rawAbsen;
      rawAbsen = undefined;
    }

    if (!rawNama) continue;

    const namaStr = String(rawNama).trim();
    if (!namaStr || namaStr.toLowerCase() === 'nama' || namaStr.toLowerCase() === 'nama siswa') {
      continue; // Skip header duplicates
    }

    let finalAbsen: number | string = autoAbsen;
    if (rawAbsen !== undefined && rawAbsen !== null && String(rawAbsen).trim() !== '') {
      const parsedNum = Number(rawAbsen);
      if (!isNaN(parsedNum)) {
        finalAbsen = parsedNum;
        autoAbsen = parsedNum + 1;
      } else {
        finalAbsen = String(rawAbsen).trim();
        autoAbsen++;
      }
    } else {
      autoAbsen++;
    }

    students.push({
      id: `student-excel-${Date.now()}-${r}-${Math.random().toString(36).substring(2, 6)}`,
      absen: finalAbsen,
      nama: namaStr.toUpperCase(),
      kelas: rawKelas ? String(rawKelas).trim() : defaultKelas,
    });
  }

  // Sort by absen
  students.sort((a, b) => {
    const numA = Number(a.absen);
    const numB = Number(b.absen);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return String(a.absen).localeCompare(String(b.absen));
  });

  return {
    students,
    errors,
    sheetNames: workbook.SheetNames,
    totalRows: rows.length,
  };
}

/**
 * Creates and downloads a sample Excel (.xlsx) file with template headers and sample data
 */
export function downloadExcelTemplate(): void {
  const data = [
    { 'No. Absen': 1, 'Nama Siswa': 'ABDULLAH KAFA BIHI', 'Kelas': 'XI TKR 1' },
    { 'No. Absen': 2, 'Nama Siswa': 'ADITYA PRATAMA', 'Kelas': 'XI TKR 1' },
    { 'No. Absen': 3, 'Nama Siswa': 'AHMAD FAUZI', 'Kelas': 'XI TKR 1' },
    { 'No. Absen': 4, 'Nama Siswa': 'BAGAS SATRIA', 'Kelas': 'XI TKR 1' },
    { 'No. Absen': 5, 'Nama Siswa': 'DIMAS WAHYU RAMADHAN', 'Kelas': 'XI TKR 1' },
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Siswa');

  // Auto-fit column widths
  worksheet['!cols'] = [
    { wch: 12 },
    { wch: 30 },
    { wch: 15 },
  ];

  XLSX.writeFile(workbook, 'Template_Siswa_Amplop_SMK_Muhammadiyah_Bawang.xlsx');
}
