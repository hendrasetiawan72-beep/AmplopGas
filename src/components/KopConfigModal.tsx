import React, { useState } from 'react';
import { KopData } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { DEFAULT_KOP_DATA, OFFICIAL_LOGO_URL } from '../constants/defaultData';
import { X, Settings, RotateCcw, Upload, Check } from 'lucide-react';

interface KopConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  kop: KopData;
  onSaveKop: (updatedKop: KopData) => void;
}

export const KopConfigModal: React.FC<KopConfigModalProps> = ({
  isOpen,
  onClose,
  kop,
  onSaveKop,
}) => {
  const [formData, setFormData] = useState<KopData>({ ...kop });

  if (!isOpen) return null;

  const handleChange = (field: keyof KopData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      if (b64) {
        setFormData((prev) => ({
          ...prev,
          logoBase64: b64,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetDefault = () => {
    if (window.confirm('Kembalikan kop surat ke standar resmi SMK Muhammadiyah Bawang?')) {
      setFormData({
        ...DEFAULT_KOP_DATA,
        logoBase64: undefined,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKop(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Settings className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Pengaturan Kop Surat Sekolah
              </h3>
              <p className="text-xs text-purple-200">
                Sesuaikan identitas sekolah, kontak, logo, dan garis pembatas kop
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

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Pilihan Mode Kop: Logo+Teks atau Gambar Kop Penuh */}
          <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-200 space-y-2">
            <label className="font-bold text-slate-800 text-xs block">
              Format Tampilan Kop Surat:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                className={`p-2.5 rounded-xl border cursor-pointer flex items-start gap-2.5 transition ${
                  (formData.kopMode || 'standard') === 'standard'
                    ? 'bg-white border-purple-600 ring-2 ring-purple-600/20 font-semibold'
                    : 'bg-white/60 border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="kopMode"
                  checked={(formData.kopMode || 'standard') === 'standard'}
                  onChange={() => handleChange('kopMode', 'standard')}
                  className="mt-0.5 text-purple-700 focus:ring-purple-600"
                />
                <div>
                  <div className="font-bold text-slate-800 text-xs">Logo di Kiri + Teks Resmi</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Logo SMK di sisi kiri dengan teks ketikan resmi di tengah (Standar sekolah).
                  </div>
                </div>
              </label>

              <label
                className={`p-2.5 rounded-xl border cursor-pointer flex items-start gap-2.5 transition ${
                  formData.kopMode === 'image-banner'
                    ? 'bg-white border-purple-600 ring-2 ring-purple-600/20 font-semibold'
                    : 'bg-white/60 border-slate-200 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="kopMode"
                  checked={formData.kopMode === 'image-banner'}
                  onChange={() => handleChange('kopMode', 'image-banner')}
                  className="mt-0.5 text-purple-700 focus:ring-purple-600"
                />
                <div>
                  <div className="font-bold text-slate-800 text-xs">Gambar Kop Penuh (Banner)</div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Menampilkan gambar kop utuh membentang di bagian atas amplop.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Logo / Image Section */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-shrink-0 p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-center max-w-[120px]">
              <SchoolLogo
                src={formData.logoUrl}
                base64={formData.logoBase64}
                className="w-16 h-16"
              />
            </div>
            <div className="flex-1 space-y-1.5 text-center sm:text-left">
              <div className="font-bold text-slate-800 text-xs">Gambar Logo / Kop Resmi</div>
              <p className="text-slate-500 text-[11px]">
                Menggunakan gambar resmi SMK Muhammadiyah Bawang (50562.png) atau unggah gambar sendiri.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
                <label className="px-3 py-1 bg-white border border-slate-300 hover:border-purple-600 hover:text-purple-700 rounded-md font-semibold cursor-pointer transition text-[11px] flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5" /> Ganti Gambar (PNG/JPG)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {formData.logoBase64 && (
                  <button
                    type="button"
                    onClick={() => handleChange('logoBase64', undefined)}
                    className="px-2.5 py-1 text-slate-600 hover:text-rose-600 text-[11px] font-medium"
                  >
                    Reset Gambar Kustom
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* School Name & Organisation */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Baris 1: Majlis
              </label>
              <input
                type="text"
                value={formData.majlis}
                onChange={(e) => handleChange('majlis', e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg uppercase font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Baris 2: Daerah
              </label>
              <input
                type="text"
                value={formData.daerah}
                onChange={(e) => handleChange('daerah', e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg uppercase font-semibold focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Baris 3: Nama Sekolah (Paling Besar)
              </label>
              <input
                type="text"
                value={formData.namaSekolah}
                onChange={(e) => handleChange('namaSekolah', e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg uppercase font-bold text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>

            {/* Akreditasi Toggle */}
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 flex items-center justify-between">
              <div>
                <label className="font-semibold text-purple-950 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showAkreditasi}
                    onChange={(e) => handleChange('showAkreditasi', e.target.checked)}
                    className="rounded text-purple-700 focus:ring-purple-600 w-4 h-4"
                  />
                  Tampilkan Status Akreditasi di Bawah Nama Sekolah
                </label>
                <p className="text-[11px] text-purple-800 ml-6">
                  Contoh: TERAKREDITASI "A"
                </p>
              </div>
              {formData.showAkreditasi && (
                <input
                  type="text"
                  value={formData.statusAkreditasi}
                  onChange={(e) => handleChange('statusAkreditasi', e.target.value)}
                  placeholder='TERAKREDITASI "A"'
                  className="px-2.5 py-1 text-xs font-bold border border-purple-300 bg-white rounded-md w-44"
                />
              )}
            </div>
          </div>

          {/* Address & Contacts */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Sekolah
              </label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => handleChange('alamat', e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kode Pos
                </label>
                <input
                  type="text"
                  value={formData.kodePos}
                  onChange={(e) => handleChange('kodePos', e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Telepon
                </label>
                <input
                  type="text"
                  value={formData.telp}
                  onChange={(e) => handleChange('telp', e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fax
                </label>
                <input
                  type="text"
                  value={formData.fax}
                  onChange={(e) => handleChange('fax', e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Line Style */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Gaya Garis Pembatas Kop
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`p-2.5 border rounded-xl cursor-pointer flex flex-col gap-1 transition ${
                  formData.lineStyle === 'double'
                    ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="lineStyle"
                  className="sr-only"
                  checked={formData.lineStyle === 'double'}
                  onChange={() => handleChange('lineStyle', 'double')}
                />
                <span className="text-xs">Garis Ganda Resmi</span>
                <div className="w-full flex flex-col gap-[1.5px] mt-1">
                  <div className="h-[2px] bg-black w-full"></div>
                  <div className="h-[1px] bg-black w-full"></div>
                </div>
              </label>

              <label
                className={`p-2.5 border rounded-xl cursor-pointer flex flex-col gap-1 transition ${
                  formData.lineStyle === 'thick'
                    ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="lineStyle"
                  className="sr-only"
                  checked={formData.lineStyle === 'thick'}
                  onChange={() => handleChange('lineStyle', 'thick')}
                />
                <span className="text-xs">Garis Tebal (2.5px)</span>
                <div className="h-[2.5px] bg-black w-full mt-2"></div>
              </label>

              <label
                className={`p-2.5 border rounded-xl cursor-pointer flex flex-col gap-1 transition ${
                  formData.lineStyle === 'single'
                    ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="lineStyle"
                  className="sr-only"
                  checked={formData.lineStyle === 'single'}
                  onChange={() => handleChange('lineStyle', 'single')}
                />
                <span className="text-xs">Garis Tipis (1.5px)</span>
                <div className="h-[1.5px] bg-black w-full mt-2"></div>
              </label>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefault}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-medium px-2 py-1 rounded hover:bg-slate-100 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Default
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-lg flex items-center gap-1.5 transition shadow"
              >
                <Check className="w-4 h-4" /> Simpan Pengaturan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
