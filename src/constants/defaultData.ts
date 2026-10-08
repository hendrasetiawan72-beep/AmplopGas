import { KopData, PaperSizeConfig, Student, EnvelopeSettings } from '../types';

export const OFFICIAL_LOGO_URL =
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSl3c440H1cWt89juZEb4LojehtllUa7RQvrYFzuxuCoerjRORl7eYBGRWuwOwN9gtEzUVkQJjOzRY0S1AazMnzmQBWvI0O0x9BLMA7srvriwOgb5IfHWOvGnhyphenhyphenq2Sbqc2nxAoKCDMrIcxs5rw8_uGvVljZxlX-XHdTQe2YkBUh8_jS3pOPCvMUWdHsx40/s506/50562.png';

export const PAPER_SIZES: PaperSizeConfig[] = [
  {
    id: 'dl-landscape',
    name: 'DL Envelope (220 × 110 mm) - Standar Amplop',
    widthMm: 220,
    heightMm: 110,
    description: 'Ukuran 220 × 110 mm (Ukuran amplop dinas raport resmi)',
  },
  {
    id: 'a4-landscape',
    name: 'A4 Landscape (297 × 210 mm)',
    widthMm: 297,
    heightMm: 210,
    description: 'Ukuran 297 × 210 mm (Kertas HVS/A4)',
  },
  {
    id: 'f4-landscape',
    name: 'Folio / F4 Landscape (330 × 215 mm)',
    widthMm: 330,
    heightMm: 215,
    description: 'Ukuran 330 × 215 mm (Kertas Folio / F4 standar Indonesia)',
  },
];

export const DEFAULT_KOP_DATA: KopData = {
  kopMode: 'standard', // 'standard' (logo + text) or 'image-banner' (full kop banner)
  kopImageUrl: OFFICIAL_LOGO_URL,
  majlis: 'MAJLIS PENDIDIKAN DASAR DAN MENENGAH',
  daerah: 'DAERAH MUHAMMADIYAH BATANG',
  namaSekolah: 'SMK MUHAMMADIYAH BAWANG',
  statusAkreditasi: 'TERAKREDITASI "A"',
  showAkreditasi: false,
  alamat: 'Jl. Bawang-Sukorejo Km 01 Ds. Jlamprang Kec. Bawang Kab. Batang',
  email: 'smkmutu1@yahoo.co.id',
  website: 'www.smkmuhbawang.sch.id',
  kodePos: '51274',
  telp: '(0285) 4486909',
  fax: '(0285) 4486899',
  logoUrl: OFFICIAL_LOGO_URL,
  lineStyle: 'double',
};

export const DEFAULT_SETTINGS: EnvelopeSettings = {
  paperSizeId: 'dl-landscape',
  defaultKelas: 'XI TKR 1',
  layoutStyle: 'official-box',
  showBoxAbsen: true,
  showBoxWali: true,
  fontSizeMultiplier: 1.0,
  rotate180: false,
  absenPosition: 'left',
  absenOffsetX: 0,
  absenOffsetY: 0,
  logoSizeMm: 21,
  logoOffsetX: 0,
  kopOffsetX: 0,
  kopOffsetY: 0,
  kopCenteredBalance: true,
};

export const SAMPLE_STUDENTS: Student[] = [
  { id: '1', absen: 1, nama: 'ABDULLAH KAFA BIHI', kelas: 'XI TKR 1' },
  { id: '2', absen: 2, nama: 'ADITYA PRATAMA', kelas: 'XI TKR 1' },
  { id: '3', absen: 3, nama: 'AHMAD FAUZI', kelas: 'XI TKR 1' },
  { id: '4', absen: 4, nama: 'BAGAS SATRIA', kelas: 'XI TKR 1' },
  { id: '5', absen: 5, nama: 'DIMAS WAHYU RAMADHAN', kelas: 'XI TKR 1' },
  { id: '6', absen: 6, nama: 'FAJAR SHODIQ', kelas: 'XI TKR 1' },
  { id: '7', absen: 7, nama: 'HILMAN MAULANA', kelas: 'XI TKR 1' },
  { id: '8', absen: 8, nama: 'ILHAM NUR KHAKIM', kelas: 'XI TKR 1' },
  { id: '9', absen: 9, nama: 'MUHAMMAD RIZKI FEBRIAN', kelas: 'XI TKR 1' },
  { id: '10', absen: 10, nama: 'ZIDAN AL GHIFARI', kelas: 'XI TKR 1' },
];
