import React from 'react';
import { KopData, PaperSizeConfig, Student, EnvelopeSettings } from '../types';
import { EnvelopeKop } from './EnvelopeKop';

interface EnvelopeItemProps {
  student: Student;
  kop: KopData;
  settings: EnvelopeSettings;
  paper: PaperSizeConfig;
  id?: string;
  isPrintVersion?: boolean;
}

export const EnvelopeItem: React.FC<EnvelopeItemProps> = ({
  student,
  kop,
  settings,
  paper,
  id,
  isPrintVersion = false,
}) => {
  const isDl = paper.id === 'dl-landscape';

  // Format padding: DL is 110mm height, so 4mm top/bottom & 6mm left/right fits perfectly
  const paddingStyle = isDl ? '4mm 6mm' : '8mm 10mm';

  return (
    <div
      id={id}
      className={`envelope-page relative bg-white text-black flex flex-col justify-between overflow-hidden select-text ${
        settings.rotate180 ? 'print-rotate-180' : ''
      } ${isPrintVersion ? '' : 'shadow-lg border border-slate-200'}`}
      style={{
        width: `${paper.widthMm}mm`,
        height: `${paper.heightMm}mm`,
        minWidth: `${paper.widthMm}mm`,
        minHeight: `${paper.heightMm}mm`,
        maxWidth: `${paper.widthMm}mm`,
        maxHeight: `${paper.heightMm}mm`,
        padding: paddingStyle,
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
        transform: isPrintVersion && settings.rotate180 ? 'rotate(180deg)' : undefined,
        transformOrigin: isPrintVersion && settings.rotate180 ? 'center center' : undefined,
      }}
    >
      {/* 1. KOP SURAT ATAS */}
      <div className="w-full flex-shrink-0" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <EnvelopeKop kop={kop} isDl={isDl} />
      </div>

      {/* 2. BADAN AMPLOP */}
      <div
        className="w-full flex-1 flex flex-col justify-between pt-0.5 pb-1"
        style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
      >
        {/* Row 1: Nomor Absen Box (Left) */}
        <div className="flex items-start justify-between w-full">
          {settings.showBoxAbsen ? (
            <div
              className={`border-[1.8px] border-black rounded-lg flex items-center justify-center font-bold font-sans ${
                isDl ? 'w-10 h-8 text-[11.5pt]' : 'w-13 h-10 text-[16pt]'
              }`}
              title="Nomor Absen Siswa"
            >
              <span>{student.absen}</span>
            </div>
          ) : (
            <div className="font-semibold text-[10pt]">
              No. Absen: <span className="font-bold">{student.absen}</span>
            </div>
          )}

          {/* If layout is minimal-table, show table on the right */}
          {settings.layoutStyle === 'minimal-table' && (
            <div className="border border-black rounded-xl p-2.5 bg-white min-w-[220px]">
              <table className="text-left font-sans text-[10.5pt]">
                <tbody>
                  <tr>
                    <td className="pr-3 py-0.5 font-bold">NAMA</td>
                    <td className="pr-2">:</td>
                    <td className="font-extrabold underline uppercase">{student.nama}</td>
                  </tr>
                  <tr>
                    <td className="pr-3 py-0.5 font-bold">NO. ABSEN</td>
                    <td className="pr-2">:</td>
                    <td className="font-semibold">{student.absen}</td>
                  </tr>
                  {student.kelas && (
                    <tr>
                      <td className="pr-3 py-0.5 font-bold">KELAS</td>
                      <td className="pr-2">:</td>
                      <td className="font-medium">{student.kelas}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Row 2: Card Penerima / Kepada Orang Tua (Sesuai Referensi Gambar 2) */}
        {settings.layoutStyle !== 'minimal-table' && (
          <div className="w-full flex justify-end items-end mt-auto" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <div
              className={`border-[2px] border-black bg-white flex flex-col justify-between ${
                isDl
                  ? 'w-[105mm] max-w-[62%] rounded-xl p-2 min-h-[35mm]'
                  : 'w-[125mm] max-w-[58%] rounded-2xl p-4 min-h-[50mm]'
              }`}
            >
              {/* Header inside box */}
              <div className="font-sans text-left leading-tight">
                <div className={`${isDl ? 'text-[9pt]' : 'text-[11pt]'} font-semibold text-black`}>
                  Kepada :
                </div>
                <div className={`${isDl ? 'text-[9pt]' : 'text-[11pt]'} font-semibold text-black`}>
                  Orang Tua/Wali
                </div>
              </div>

              {/* Student Name & Class (Centered, Bold, Underline) */}
              <div className="text-center my-auto py-0.5">
                <div
                  className={`font-black underline tracking-wide uppercase font-sans text-black ${
                    isDl ? 'text-[11pt] leading-tight' : 'text-[14pt] leading-normal'
                  }`}
                  style={{ textUnderlineOffset: '3px' }}
                >
                  {student.nama}
                </div>
                {student.kelas && (
                  <div
                    className={`font-bold font-sans text-black mt-0.5 ${
                      isDl ? 'text-[9.5pt]' : 'text-[12pt]'
                    }`}
                  >
                    ( {student.kelas} )
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
