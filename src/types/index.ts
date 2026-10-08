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
  kopMode?: 'standard' | 'image-banner';
  kopImageUrl?: string;
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
  rotate180: boolean; // Rotate 180 degrees for Epson/rear tray printers
  // Manual layout & positioning controls
  absenPosition: 'left' | 'center' | 'right' | 'custom';
  absenOffsetX: number; // in mm (0 to 140mm)
  absenOffsetY?: number; // in mm (-5 to +20mm)
  logoSizeMm: number; // in mm (16 to 36mm)
  logoOffsetX: number; // in mm (0 to 30mm, shift logo inwards/center)
  kopOffsetX: number; // in mm (-25 to +25mm)
  kopOffsetY?: number; // in mm (-10 to +15mm)
  kopCenteredBalance: boolean; // True center balancing spacer
}
