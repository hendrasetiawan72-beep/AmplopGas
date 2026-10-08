# Panduan Deployment - Pembuat Amplop Raport SMK Muhammadiyah Bawang

Aplikasi ini dibangun menggunakan arsitektur **100% Client-Side** dengan React + TypeScript + Tailwind CSS dan Vite.
- **Tanpa Database / Backend Server**: Semua data disimpan di `localStorage` peramban pengguna.
- **Tanpa Environment Variable**: Tidak memerlukan API key atau konfigurasi rahasia.
- **Siap Deploy Gratis**: Dapat langsung di-hosting ke **Vercel** atau **Cloudflare Pages** dengan 1-klik.

---

## 1. Struktur Folder Proyek

```
amplop-raport-smkmuhiba/
├── index.html                   # Entry point web & meta tag SEO
├── package.json                 # Dependensi & script build
├── tsconfig.json                # Konfigurasi TypeScript
├── vite.config.ts               # Konfigurasi Vite & Tailwind CSS plugin
├── DEPLOYMENT.md                # Dokumen panduan ini
├── public/                      # Aset publik statis
└── src/
    ├── main.tsx                 # Mounting React root
    ├── App.tsx                  # Dashboard utama & state management
    ├── index.css                # Konfigurasi Tailwind v4 & CSS @media print
    ├── types/
    │   └── index.ts             # Interface TypeScript data siswa & kop
    ├── constants/
    │   └── defaultData.ts       # Kop surat resmi SMK Muhammadiyah Bawang & data awal
    ├── utils/
    │   ├── pdfGenerator.ts      # Engine cetak vektor & unduh file jsPDF
    │   └── csvHelper.ts         # Parser & generator CSV / teks
    └── components/
        ├── SchoolLogo.tsx       # Komponen logo SMK dengan fallback SVG
        ├── EnvelopeKop.tsx      # Kop surat resmi & garis pembatas
        ├── EnvelopeItem.tsx     # Komponen fisik amplop (A4 Landscape & DL)
        ├── EnvelopePrintContainer.tsx # Wadah cetak multi-halaman
        ├── StudentForm.tsx      # Form input & edit siswa satuan
        ├── StudentTable.tsx     # Tabel siswa dengan sortir absen & pencarian
        ├── ImportExportModal.tsx # Modal impor CSV & ekspor data
        ├── KopConfigModal.tsx   # Modal kustomisasi teks kop & logo
        └── DeployGuideModal.tsx # Modal panduan deployment interaktif
```

---

## 2. File `package.json`

```json
{
  "name": "amplop-raport-smkmuhiba",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "html2canvas": "^1.4.1",
    "jspdf": "^4.2.1",
    "lucide-react": "^0.546.0",
    "react": "^19.0.1",
    "react-dom": "^19.0.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.1.1",
    "tailwindcss": "^4.3.3",
    "typescript": "^7.0.2",
    "vite": "^8.3.0"
  }
}
```

---

## 3. Cara Deploy ke Vercel

### Metode A: Melalui Vercel Dashboard (Paling Direkomendasikan)
1. Buat repositori baru di akun [GitHub](https://github.com) Anda, lalu upload/push seluruh file proyek ini.
2. Buka [vercel.com](https://vercel.com) dan masuk dengan akun GitHub Anda.
3. Klik tombol **"Add New..."** lalu pilih **"Project"**.
4. Pilih repositori GitHub Anda dan klik **"Import"**.
5. Konfigurasi otomatis:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Klik tombol **"Deploy"**. Dalam ~30 detik aplikasi akan langsung aktif dengan URL HTTPS resmi gratis (contoh: `https://amplop-raport.vercel.app`).

### Metode B: Melalui Terminal (Vercel CLI)
```bash
# 1. Install CLI
npm install -g vercel

# 2. Login dan deploy langsung ke production
vercel --prod
```

### Solusi Jika Muncul Error Lockfile Bun di Vercel:
Jika Anda melihat error seperti:
`error: bun.lock was generated with a newer version of bun, please upgrade bun to at least 1.2.0`

Ada 2 opsi mudah untuk menyelesaikannya:

**Opsi 1 (Paling Cepat & Dijamin Sukses - Pakai NPM):**
Hapus `bun.lock` agar Vercel menggunakan `npm` standar:
```bash
rm -f bun.lock
npm install
git add -A
git commit -m "use npm lockfile"
git push
```

**Opsi 2 (Tetap Pakai Bun):**
1. Buka dashboard proyek di **Vercel** &rarr; **Settings** &rarr; **Environment Variables**.
2. Tambahkan variable:
   - Key: `BUN_VERSION`
   - Value: `1.2.4` (atau versi bun di komputer Anda, misal `1.2.0` / `1.4.2`).
3. Jalankan perintah di komputer lokal Anda:
```bash
rm bun.lock
bun install
git add bun.lock
git commit -m "regenerate bun.lock"
git push
```

---

## 4. Cara Deploy ke Cloudflare Pages

1. Masuk ke dashboard [Cloudflare](https://dash.cloudflare.com).
2. Di menu samping kiri, klik **Workers & Pages** &rarr; **Create application**.
3. Pilih tab **Pages**, lalu klik **Connect to Git**.
4. Pilih repositori GitHub Anda.
5. Pada bagian **Build settings**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - *(Environment variables: Kosongkan, tidak diperlukan)*
6. Klik **Save and Deploy**. Cloudflare akan mem-build dan menyediakan CDN super cepat di seluruh dunia.

---

## 5. Fitur Siap Pakai

1. **Kop Surat Resmi SMK Muhammadiyah Bawang**:
   - Dilengkapi logo bulat ungu resmi (tersimpan Base64 untuk keandalan cetak)
   - Font sans-serif tajam presisi
   - Garis ganda kop resmi sesuai format surat dinas sekolah
2. **Desain Amplop Sesuai Gambar Referensi 2**:
   - Kotak Nomor Absen di sisi kiri atas
   - Kotak Kepada Orang Tua / Wali Murid di kanan bawah dengan Nama Siswa (Bold + Underline) dan Kelas
3. **Pilihan Ukuran Kertas**:
   - **A4 Landscape (297 × 210 mm)** - Default, standar HVS/Kertas Raport
   - **DL Envelope (220 × 110 mm)** - Amplop panjang standar
   - **F4 / Folio Landscape (330 × 215 mm)**
4. **Metode Cetak Ganda**:
   - **Cetak Browser (300+ DPI Vektor)**: Menggunakan engine printer OS browser murni untuk ketajaman teks maksimal tanpa pecah atau blur saat di-zoom.
   - **Unduh File .PDF**: Menggunakan html2canvas + jsPDF untuk menyimpan file PDF langsung.
5. **Manajemen Siswa**:
   - Tambah, edit, dan hapus siswa
   - Urut otomatis nomor absen
   - Impor massal dari CSV / Excel / Paste baris teks
   - Contoh data bawaan kelas XI TKR 1
