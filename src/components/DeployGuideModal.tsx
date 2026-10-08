import React, { useState } from 'react';
import { X, Globe, Cloud, Check, Copy, FolderTree, FileCode } from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'vercel' | 'cloudflare' | 'structure' | 'package'>('vercel');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const packageJsonContent = `{
  "name": "amplop-raport-smkmuhiba",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "html2canvas": "^1.4.1",
    "jspdf": "^4.2.1",
    "lucide-react": "^0.546.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0",
    "vite": "^6.0.0"
  }
}`;

  const folderStructure = `amplop-raport-smkmuhiba/
├── index.html                   # Entry point web & meta tag
├── package.json                 # Dependensi & skrip build
├── tsconfig.json                # Konfigurasi TypeScript
├── vite.config.ts               # Konfigurasi Vite & Tailwind plugin
├── public/                      # Aset statis & logo
│   └── favicon.ico
└── src/
    ├── main.tsx                 # Mounting React root
    ├── App.tsx                  # Komponen aplikasi utama & state
    ├── index.css                # Tailwind CSS v4 & styling print
    ├── types/
    │   └── index.ts             # Definisi tipe TypeScript
    ├── constants/
    │   └── defaultData.ts       # Data kop resmi SMK Muhammadiyah Bawang
    ├── utils/
    │   ├── pdfGenerator.ts      # Handler cetak vektor & download PDF jsPDF
    │   └── csvHelper.ts         # Parser & generator CSV
    └── components/
        ├── SchoolLogo.tsx       # Logo resmi dengan fallback SVG
        ├── EnvelopeKop.tsx      # Kop surat resmi SMK Muhammadiyah Bawang
        ├── EnvelopeItem.tsx     # Amplop A4/DL dengan layout referensi resmi
        ├── StudentForm.tsx      # Form input & edit siswa satuan
        ├── StudentTable.tsx     # Tabel data siswa & filter absen
        ├── ImportExportModal.tsx # Modal impor CSV & ekspor data
        ├── KopConfigModal.tsx   # Modal kustomisasi kop & logo
        └── DeployGuideModal.tsx # Panduan lengkap deploy hosting`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Globe className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Panduan Deploy ke Vercel & Cloudflare Pages
              </h3>
              <p className="text-xs text-purple-200">
                100% Client-Side / Tanpa Backend & Database (Bisa langsung deploy gratis)
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
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('vercel')}
            className={`py-2 px-3 border-b-2 cursor-pointer transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'vercel'
                ? 'border-purple-700 text-purple-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            Deploy ke Vercel
          </button>
          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`py-2 px-3 border-b-2 cursor-pointer transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cloudflare'
                ? 'border-purple-700 text-purple-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-4 h-4" />
            Deploy ke Cloudflare Pages
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`py-2 px-3 border-b-2 cursor-pointer transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'structure'
                ? 'border-purple-700 text-purple-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            Struktur Folder
          </button>
          <button
            onClick={() => setActiveTab('package')}
            className={`py-2 px-3 border-b-2 cursor-pointer transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'package'
                ? 'border-purple-700 text-purple-900 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            package.json
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <h4 className="font-bold text-sm text-purple-900 mb-1">
                  Cara 1: Import GitHub di Vercel Dashboard (Paling Mudah)
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                  <li>Push proyek ini ke repositori GitHub Anda (publik atau privat).</li>
                  <li>Buka <span className="font-semibold text-purple-950">vercel.com</span> dan login/daftar.</li>
                  <li>Klik tombol <span className="font-semibold">"Add New..." &rarr; "Project"</span>.</li>
                  <li>Pilih repositori GitHub Anda lalu klik <span className="font-semibold">Import</span>.</li>
                  <li>
                    Framework Preset otomatis terdeteksi sebagai <strong>Vite</strong>.
                  </li>
                  <li>Build Command: <code className="bg-purple-100 px-1 py-0.5 rounded">npm run build</code></li>
                  <li>Output Directory: <code className="bg-purple-100 px-1 py-0.5 rounded">dist</code></li>
                  <li><strong>Tidak memerlukan Environment Variable apa pun.</strong></li>
                  <li>Klik <strong>Deploy</strong>. Selesai dalam ~30 detik!</li>
                </ol>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800">
                    Cara 2: Deploy Cepat via Terminal (Vercel CLI)
                  </h4>
                  <button
                    onClick={() => copyToClipboard('npm i -g vercel\nvercel --prod', 'cli-vercel')}
                    className="flex items-center gap-1 text-[11px] text-purple-700 hover:underline"
                  >
                    {copiedKey === 'cli-vercel' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Salin Perintah
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
{`# 1. Install Vercel CLI (jika belum ada)
npm i -g vercel

# 2. Jalankan perintah deploy produksi
vercel --prod`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'cloudflare' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="font-bold text-sm text-amber-950 mb-1">
                  Deploy ke Cloudflare Pages (Gratis & Cepat Tanpa Batas)
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                  <li>Login ke dashboard <span className="font-semibold text-amber-950">dash.cloudflare.com</span>.</li>
                  <li>Pilih menu <strong>Workers & Pages</strong> &rarr; <strong>Create application</strong> &rarr; Tab <strong>Pages</strong>.</li>
                  <li>Pilih <strong>Connect to Git</strong> dan pilih repositori Anda.</li>
                  <li>Konfigurasikan pengaturan build:
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-0.5 text-slate-600">
                      <li>Framework preset: <strong>Vite</strong></li>
                      <li>Build command: <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900">npm run build</code></li>
                      <li>Build output directory: <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900">dist</code></li>
                    </ul>
                  </li>
                  <li>Klik <strong>Save and Deploy</strong>.</li>
                </ol>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-800 mb-1">Keunggulan Arsitektur:</h5>
                <p className="text-slate-600 leading-relaxed">
                  Aplikasi ini dirancang 100% Client-Side dengan penyimpanan <code>localStorage</code> dan cetak CSS/PDF browser murni, sehingga tidak memerlukan Node.js server runtime, database berbayar, atau token rahasia. Sangat hemat dan bebas biaya selamanya.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Struktur File Proyek Lengkap:</span>
                <button
                  onClick={() => copyToClipboard(folderStructure, 'structure')}
                  className="flex items-center gap-1 text-[11px] text-purple-700 hover:underline"
                >
                  {copiedKey === 'structure' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Salin Struktur
                </button>
              </div>
              <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto">
                {folderStructure}
              </pre>
            </div>
          )}

          {activeTab === 'package' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Isi package.json Produksi:</span>
                <button
                  onClick={() => copyToClipboard(packageJsonContent, 'pkg')}
                  className="flex items-center gap-1 text-[11px] text-purple-700 hover:underline"
                >
                  {copiedKey === 'pkg' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Salin package.json
                </button>
              </div>
              <pre className="bg-slate-900 text-sky-300 p-3 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto">
                {packageJsonContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-purple-800 hover:bg-purple-900 text-white font-semibold rounded-lg text-xs transition"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
