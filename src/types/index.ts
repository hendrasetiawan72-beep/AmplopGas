export interface Student {
  id: string;
  absen: string | number;
  nama: string;
  kelas?: string;
}

export type PaperSizeId = 'a4-landscape' | 'dl-landscape' | 'f4-landscape';

export interface PaperSizeConfig {
  id: PaperSizeId;
  name: string;
  widthMm: number;
  heightMm: number;
  description: string;
}

export type EnvelopeLayoutStyle = 'official-box' | 'compact-label' | 'minimal-table';

export interface KopData {
  majlis: string;
  daerah: string;
  namaSekolah: string;
  statusAkreditasi: string;
  showAkreditasi: boolean;
  alamat: string;
  email: string;
  website: string;
  kodePos: string;
  telp: string;
  fax: string;
  logoUrl: string;
  logoBase64?: string;
  lineStyle: 'double' | 'single' | 'thick';
}

export interface EnvelopeSettings {
  paperSizeId: PaperSizeId;
  defaultKelas: string;
  layoutStyle: EnvelopeLayoutStyle;
  showBoxAbsen: boolean;
  showBoxWali: boolean;
  fontSizeMultiplier: number; // 0.9 to 1.2
}
