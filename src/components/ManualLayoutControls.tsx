import React, { useState } from 'react';
import { EnvelopeSettings } from '../types';
import {
  Sliders,
  RotateCcw,
  AlignCenter,
  ArrowLeft,
  Target,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MoveHorizontal,
  MoveVertical,
  Maximize,
  ArrowLeftRight,
  Check,
} from 'lucide-react';

interface ManualLayoutControlsProps {
  settings: EnvelopeSettings;
  onUpdateSettings: (updates: Partial<EnvelopeSettings>) => void;
  isDl: boolean;
}

export const ManualLayoutControls: React.FC<ManualLayoutControlsProps> = ({
  settings,
  onUpdateSettings,
  isDl,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const defaultLogoSize = isDl ? 21 : 26;
  const standardMargin = isDl ? 6 : 10;

  const currentMarginLeft = settings.kopFullBleed
    ? 0
    : (settings.kopMarginLeft !== undefined ? settings.kopMarginLeft : standardMargin);

  const currentMarginRight = settings.kopFullBleed
    ? 0
    : (settings.kopMarginRight !== undefined ? settings.kopMarginRight : standardMargin);

  const isFullBleedActive = settings.kopFullBleed || (currentMarginLeft === 0 && currentMarginRight === 0);

  const handleReset = () => {
    onUpdateSettings({
      absenPosition: 'left',
      absenOffsetX: 0,
      absenOffsetY: 0,
      logoSizeMm: defaultLogoSize,
      logoOffsetX: 0,
      kopOffsetX: 0,
      kopOffsetY: 0,
      kopCenteredBalance: true,
      kopFullBleed: false,
      kopMarginLeft: standardMargin,
      kopMarginRight: standardMargin,
      kopPaddingTop: 0,
    });
  };

  const isCustomized =
    settings.absenPosition !== 'left' ||
    (settings.absenOffsetX || 0) !== 0 ||
    (settings.absenOffsetY || 0) !== 0 ||
    (settings.logoSizeMm || defaultLogoSize) !== defaultLogoSize ||
    (settings.logoOffsetX || 0) !== 0 ||
    (settings.kopOffsetX || 0) !== 0 ||
    (settings.kopOffsetY || 0) !== 0 ||
    settings.kopCenteredBalance === false ||
    settings.kopFullBleed === true ||
    (settings.kopMarginLeft !== undefined && settings.kopMarginLeft !== standardMargin) ||
    (settings.kopMarginRight !== undefined && settings.kopMarginRight !== standardMargin);

  return (
    <div className="bg-white border border-purple-200 rounded-xl shadow-xs overflow-hidden text-xs">
      {/* Header Bar */}
      <div
        className="bg-gradient-to-r from-purple-50 to-indigo-50/50 px-3.5 py-2.5 flex items-center justify-between border-b border-purple-200 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1 bg-purple-700 text-white rounded-md shadow-xs">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-[12px]">
                Atur Posisi Manual & Margin Mentok
              </span>
              {isFullBleedActive && (
                <span className="bg-emerald-600 text-white text-[9.5px] font-bold px-1.5 py-0.2 rounded-full">
                  Mentok Tepi 0mm
                </span>
              )}
              {isCustomized && !isFullBleedActive && (
                <span className="bg-purple-600 text-white text-[9.5px] font-bold px-1.5 py-0.2 rounded-full">
                  Kustom
                </span>
              )}
            </div>
            <p className="text-[10.5px] text-slate-500">
              Logo & kop bisa mentok tepi kiri-kanan, dan nomor absen bisa ketengah
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isCustomized && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="text-[10.5px] text-purple-700 hover:text-purple-900 bg-purple-100/70 hover:bg-purple-200/80 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 transition cursor-pointer"
              title="Reset semua posisi ke standar"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
          <button
            type="button"
            className="p-1 text-slate-500 hover:text-slate-800 rounded-md transition"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Controls Body */}
      {isOpen && (
        <div className="p-3.5 space-y-3.5 bg-slate-50/40">
          {/* FITUR UTAMA BARU: MARGIN KOP SURAT & LOGO (MENTOK KIRI & KANAN) */}
          <div className="space-y-2.5 bg-purple-50/60 p-3 rounded-xl border border-purple-300 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-purple-950 text-[11.5px]">
                <ArrowLeftRight className="w-3.5 h-3.5 text-purple-700" />
                <span>Margin Kop & Logo (Mentok Kiri & Kanan)</span>
              </div>
              <span className={`font-mono font-bold px-2 py-0.5 rounded border text-[10.5px] ${
                isFullBleedActive
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-white text-purple-800 border-purple-200'
              }`}>
                {isFullBleedActive ? 'Mentok Tepi (0 mm)' : `Kiri: ${currentMarginLeft}mm, Kanan: ${currentMarginRight}mm`}
              </span>
            </div>

            {/* Presets Cepat Margin Kop */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    kopFullBleed: true,
                    kopMarginLeft: 0,
                    kopMarginRight: 0,
                    logoOffsetX: 0,
                  })
                }
                className={`py-1.5 px-2 rounded-lg font-bold text-[10.5px] border transition flex items-center justify-center gap-1 cursor-pointer ${
                  isFullBleedActive
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : 'bg-white border-purple-300 text-purple-900 hover:bg-purple-100'
                }`}
                title="Logo dan garis kop langsung menempel mentok ke tepi kiri dan kanan kertas (0mm)"
              >
                <ArrowLeftRight className="w-3 h-3" /> Mentok Tepi (0mm)
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    kopFullBleed: false,
                    kopMarginLeft: 2,
                    kopMarginRight: 2,
                  })
                }
                className={`py-1.5 px-2 rounded-lg font-semibold text-[10.5px] border transition flex items-center justify-center gap-1 cursor-pointer ${
                  !settings.kopFullBleed && currentMarginLeft === 2 && currentMarginRight === 2
                    ? 'bg-purple-700 border-purple-700 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="Mepet tepi kertas dengan jarak tipis 2mm"
              >
                <span>Mepet (2mm)</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    kopFullBleed: false,
                    kopMarginLeft: standardMargin,
                    kopMarginRight: standardMargin,
                  })
                }
                className={`py-1.5 px-2 rounded-lg font-semibold text-[10.5px] border transition flex items-center justify-center gap-1 cursor-pointer ${
                  !settings.kopFullBleed && currentMarginLeft === standardMargin && currentMarginRight === standardMargin
                    ? 'bg-purple-700 border-purple-700 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="Sejajar dengan margin isi amplop"
              >
                <span>Standar ({standardMargin}mm)</span>
              </button>
            </div>

            {/* Slider Margin Kiri Kop & Logo */}
            <div className="space-y-1 pt-1 bg-white p-2.5 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between text-[11px] text-slate-700">
                <span className="font-medium flex items-center gap-1">
                  <span>Margin Kiri (Logo Sekolah):</span>
                  {currentMarginLeft === 0 && (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                      Mentok Tepi Kiri
                    </span>
                  )}
                </span>
                <span className="font-mono font-bold text-purple-900">
                  {currentMarginLeft} mm
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">0mm</span>
                <input
                  type="range"
                  min="0"
                  max="18"
                  step="1"
                  value={currentMarginLeft}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onUpdateSettings({
                      kopFullBleed: false,
                      kopMarginLeft: val,
                    });
                  }}
                  className="flex-1 accent-purple-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <span className="text-[10px] text-slate-400 font-mono">18mm</span>
              </div>
            </div>

            {/* Slider Margin Kanan Kop & Garis Pembatas */}
            <div className="space-y-1 bg-white p-2.5 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between text-[11px] text-slate-700">
                <span className="font-medium flex items-center gap-1">
                  <span>Margin Kanan (Garis & Teks Kop):</span>
                  {currentMarginRight === 0 && (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                      Mentok Tepi Kanan
                    </span>
                  )}
                </span>
                <span className="font-mono font-bold text-purple-900">
                  {currentMarginRight} mm
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">0mm</span>
                <input
                  type="range"
                  min="0"
                  max="18"
                  step="1"
                  value={currentMarginRight}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onUpdateSettings({
                      kopFullBleed: false,
                      kopMarginRight: val,
                    });
                  }}
                  className="flex-1 accent-purple-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <span className="text-[10px] text-slate-400 font-mono">18mm</span>
              </div>
            </div>
          </div>

          {/* 1. Pengaturan Nomor Absen (Geser Ketengah) */}
          <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11.5px]">
                <Target className="w-3.5 h-3.5 text-purple-700" />
                <span>Posisi Nomor Absen (Geser Ketengah)</span>
              </div>
              <span className="font-mono text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[10.5px]">
                {settings.absenPosition === 'center'
                  ? 'Tepat di Tengah'
                  : `X: ${settings.absenOffsetX || 0}mm, Y: ${settings.absenOffsetY || 0}mm`}
              </span>
            </div>

            {/* Presets Cepat */}
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({ absenPosition: 'left', absenOffsetX: 0 })
                }
                className={`py-1.5 px-2 rounded-lg font-semibold text-[10.5px] border transition flex items-center justify-center gap-1 cursor-pointer ${
                  settings.absenPosition === 'left' && (settings.absenOffsetX || 0) === 0
                    ? 'bg-purple-700 border-purple-700 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ArrowLeft className="w-3 h-3" /> Kiri Standar (0mm)
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    absenPosition: 'custom',
                    absenOffsetX: isDl ? 35 : 45,
                  })
                }
                className={`py-1.5 px-2 rounded-lg font-semibold text-[10.5px] border transition flex items-center justify-center gap-1 cursor-pointer ${
                  settings.absenPosition === 'custom' &&
                  (settings.absenOffsetX || 0) === (isDl ? 35 : 45)
                    ? 'bg-purple-700 border-purple-700 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3 h-3" /> Agak Tengah ({isDl ? '35mm' : '45mm'})
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    absenPosition: 'center',
                    absenOffsetX: 0,
                  })
                }
                className={`py-1.5 px-2 rounded-lg font-semibold text-[10.5px] border transition flex items-center justify-center gap-1 cursor-pointer ${
                  settings.absenPosition === 'center'
                    ? 'bg-purple-700 border-purple-700 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <AlignCenter className="w-3 h-3" /> Pas Tengah Amplop
              </button>
            </div>

            {/* Slider Geser Horizontal */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1">
                  <MoveHorizontal className="w-3 h-3 text-slate-400" />
                  Geser Horizontal Manual (Kiri ke Tengah/Kanan):
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {settings.absenPosition === 'center'
                    ? 'Otomatis Tengah'
                    : `${settings.absenOffsetX || 0} mm`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">0mm</span>
                <input
                  type="range"
                  min="0"
                  max={isDl ? '125' : '160'}
                  step="1"
                  value={settings.absenPosition === 'center' ? (isDl ? 60 : 80) : (settings.absenOffsetX || 0)}
                  onChange={(e) =>
                    onUpdateSettings({
                      absenOffsetX: Number(e.target.value),
                      absenPosition: 'custom',
                    })
                  }
                  className="flex-1 accent-purple-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <span className="text-[10px] text-slate-400 font-mono">
                  {isDl ? '125mm' : '160mm'}
                </span>
              </div>
            </div>

            {/* Slider Geser Vertikal (Atas/Bawah) */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span className="flex items-center gap-1">
                  <MoveVertical className="w-3 h-3 text-slate-400" />
                  Geser Vertikal Nomor Absen (Atas / Bawah):
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {settings.absenOffsetY ? `${settings.absenOffsetY > 0 ? '+' : ''}${settings.absenOffsetY} mm` : '0 mm'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">-4mm</span>
                <input
                  type="range"
                  min="-4"
                  max="16"
                  step="1"
                  value={settings.absenOffsetY || 0}
                  onChange={(e) =>
                    onUpdateSettings({
                      absenOffsetY: Number(e.target.value),
                    })
                  }
                  className="flex-1 accent-purple-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <span className="text-[10px] text-slate-400 font-mono">+16mm</span>
              </div>
            </div>
          </div>

          {/* 2. Pengaturan Ukuran & Geser Logo Sekolah */}
          <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11.5px]">
                <Maximize className="w-3.5 h-3.5 text-purple-700" />
                <span>Posisi & Ukuran Logo Sekolah</span>
              </div>
              <span className="font-mono text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[10.5px]">
                {settings.logoSizeMm || defaultLogoSize}mm / +{settings.logoOffsetX || 0}mm
              </span>
            </div>

            {/* Ukuran Logo */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Ukuran Logo:</span>
                <span className="font-mono font-bold text-slate-800">
                  {settings.logoSizeMm || defaultLogoSize} mm
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">16mm</span>
                <input
                  type="range"
                  min="16"
                  max="35"
                  step="1"
                  value={settings.logoSizeMm || defaultLogoSize}
                  onChange={(e) =>
                    onUpdateSettings({ logoSizeMm: Number(e.target.value) })
                  }
                  className="flex-1 accent-purple-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <span className="text-[10px] text-slate-400 font-mono">35mm</span>
              </div>
            </div>

            {/* Geser Logo ke Kanan/Tengah mendekat teks */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Geser Logo Masuk ke Arah Tengah / Teks:</span>
                <span className="font-mono font-bold text-slate-800">
                  +{settings.logoOffsetX || 0} mm
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">0mm</span>
                <input
                  type="range"
                  min="0"
                  max="28"
                  step="1"
                  value={settings.logoOffsetX || 0}
                  onChange={(e) =>
                    onUpdateSettings({ logoOffsetX: Number(e.target.value) })
                  }
                  className="flex-1 accent-purple-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <span className="text-[10px] text-slate-400 font-mono">28mm</span>
              </div>
            </div>
          </div>

          {/* 3. Posisi Horizontal & Vertikal Kop Surat */}
          <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11.5px]">
                <AlignCenter className="w-3.5 h-3.5 text-purple-700" />
                <span>Posisi Horizontal & Keseimbangan Kop Surat</span>
              </div>
              <span className="font-mono text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[10.5px]">
                {(settings.kopOffsetX || 0) > 0 ? `+${settings.kopOffsetX}` : settings.kopOffsetX || 0} mm
              </span>
            </div>

            {/* Geser Kop Horizontal */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Geser Seluruh Kop (Kiri / Kanan):</span>
                <span className="font-mono font-bold text-slate-800">
                  {(settings.kopOffsetX || 0) > 0 ? `+${settings.kopOffsetX}` : settings.kopOffsetX || 0} mm
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">-20mm</span>
                <input
                  type="range"
                  min="-20"
                  max="25"
                  step="1"
                  value={settings.kopOffsetX || 0}
                  onChange={(e) =>
                    onUpdateSettings({ kopOffsetX: Number(e.target.value) })
                  }
                  className="flex-1 accent-purple-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <span className="text-[10px] text-slate-400 font-mono">+25mm</span>
              </div>
            </div>

            {/* Geser Kop Vertikal */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Geser Vertikal Kop (Atas / Bawah):</span>
                <span className="font-mono font-bold text-slate-800">
                  {settings.kopOffsetY ? `${settings.kopOffsetY > 0 ? '+' : ''}${settings.kopOffsetY} mm` : '0 mm'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">-5mm</span>
                <input
                  type="range"
                  min="-5"
                  max="12"
                  step="1"
                  value={settings.kopOffsetY || 0}
                  onChange={(e) =>
                    onUpdateSettings({ kopOffsetY: Number(e.target.value) })
                  }
                  className="flex-1 accent-purple-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <span className="text-[10px] text-slate-400 font-mono">+12mm</span>
              </div>
            </div>

            {/* Auto-Centering Balanced Spacer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={settings.kopCenteredBalance ?? true}
                  onChange={(e) =>
                    onUpdateSettings({ kopCenteredBalance: e.target.checked })
                  }
                  className="rounded text-purple-700 focus:ring-purple-600 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold">
                  Seimbangkan teks kop agar persis di titik tengah amplop
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
