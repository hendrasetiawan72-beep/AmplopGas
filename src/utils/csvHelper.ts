import { Student } from '../types';

export function parseStudentsText(text: string, defaultKelas: string): { students: Student[]; errors: string[] } {
  const lines = text.split(/\r?\n/);
  const students: Student[] = [];
  const errors: string[] = [];

  let autoAbsen = 1;

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Check if line looks like a header (e.g., "No, Nama", "Nomor, Nama Siswa")
    if (index === 0 && /^(no|nomor|absen|nrp|nis)/i.test(trimmed) && /nama/i.test(trimmed)) {
      return; // Skip header line
    }

    let absenVal: string | number = '';
    let namaVal = '';
    let kelasVal = defaultKelas;

    // Detect separator: Tab, Semicolon, Comma, or dot after number (e.g. "1. Budi")
    if (trimmed.includes('\t')) {
      const parts = trimmed.split('\t').map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        absenVal = parts[0];
        namaVal = parts[1];
        if (parts[2]) kelasVal = parts[2];
      } else {
        namaVal = parts[0];
      }
    } else if (trimmed.includes(';') || trimmed.includes(',')) {
      const sep = trimmed.includes(';') ? ';' : ',';
      const parts = trimmed.split(sep).map(p => p.trim());
      if (parts.length >= 2) {
        absenVal = parts[0];
        namaVal = parts[1];
        if (parts[2]) kelasVal = parts[2];
      } else {
        namaVal = parts[0];
      }
    } else {
      // Check pattern like "1. Abdullah" or "01 - Abdullah"
      const match = trimmed.match(/^(\d+)[\.\-\s]+(.+)$/);
      if (match) {
        absenVal = match[1];
        namaVal = match[2].trim();
      } else {
        // Plain name only
        namaVal = trimmed;
      }
    }

    // Clean up absen number
    let finalAbsen: number | string = autoAbsen;
    if (absenVal && !isNaN(Number(absenVal))) {
      finalAbsen = Number(absenVal);
      autoAbsen = finalAbsen + 1;
    } else {
      autoAbsen++;
    }

    if (!namaVal) {
      errors.push(`Baris ${index + 1}: Nama tidak boleh kosong.`);
      return;
    }

    students.push({
      id: `student-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      absen: finalAbsen,
      nama: namaVal.toUpperCase(),
      kelas: kelasVal || defaultKelas,
    });
  });

  // Sort by absen
  students.sort((a, b) => {
    const numA = Number(a.absen);
    const numB = Number(b.absen);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return String(a.absen).localeCompare(String(b.absen));
  });

  return { students, errors };
}

export function generateCsvTemplate(): string {
  return `No Absen,Nama Siswa,Kelas
1,ABDULLAH KAFA BIHI,XI TKR 1
2,ADITYA PRATAMA,XI TKR 1
3,AHMAD FAUZI,XI TKR 1
4,BAGAS SATRIA,XI TKR 1
5,DIMAS WAHYU RAMADHAN,XI TKR 1`;
}

export function exportStudentsToCsv(students: Student[]): string {
  const header = 'No Absen,Nama Siswa,Kelas\n';
  const rows = students
    .map(s => `"${s.absen}","${s.nama.replace(/"/g, '""')}","${(s.kelas || '').replace(/"/g, '""')}"`)
    .join('\n');
  return header + rows;
}
