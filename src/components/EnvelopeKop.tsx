import React from 'react';
import { KopData } from '../types';
import { SchoolLogo } from './SchoolLogo';

interface EnvelopeKopProps {
  kop: KopData;
  scale?: number;
}

export const EnvelopeKop: React.FC<EnvelopeKopProps> = ({ kop }) => {
  if (kop.kopMode === 'image-banner' && (kop.kopImageUrl || kop.logoBase64 || kop.logoUrl)) {
    const bannerSrc = kop.logoBase64 || kop.kopImageUrl || kop.logoUrl;
    return (
      <header className="w-full text-black">
        <div className="w-full flex items-center justify-center mb-1">
          <img
            src={bannerSrc}
            alt="Kop Surat SMK Muhammadiyah Bawang"
            crossOrigin="anonymous"
            className="w-full max-h-[35mm] object-contain select-none"
          />
        </div>
        {/* Optional divider line if selected */}
        {kop.lineStyle === 'double' ? (
          <div className="w-full flex flex-col gap-[1.5px] mt-1 mb-2">
            <div className="w-full h-[2px] bg-black"></div>
            <div className="w-full h-[1px] bg-black"></div>
          </div>
        ) : kop.lineStyle === 'single' ? (
          <div className="w-full h-[1.5px] bg-black mt-1 mb-2"></div>
        ) : null}
      </header>
    );
  }

  return (
    <header className="w-full text-black">
      {/* Header Grid: Logo Left, Text Centered */}
      <div className="flex items-center justify-between gap-4 mb-2">
        {/* Logo Left */}
        <div className="flex-shrink-0 flex items-center justify-center pl-2">
          <SchoolLogo
            src={kop.logoUrl}
            base64={kop.logoBase64}
            className="w-[26mm] h-[26mm] max-h-[105px] max-w-[105px]"
          />
        </div>

        {/* Text Center */}
        <div className="flex-1 text-center font-sans tracking-tight pr-6">
          <h2 className="text-[12pt] leading-tight font-bold uppercase tracking-wide">
            {kop.majlis}
          </h2>
          <h3 className="text-[12pt] leading-tight font-bold uppercase tracking-wide">
            {kop.daerah}
          </h3>
          <h1 className="text-[16.5pt] leading-snug font-black uppercase tracking-wider my-0.5">
            {kop.namaSekolah}
          </h1>

          {kop.showAkreditasi && kop.statusAkreditasi && (
            <p className="text-[11pt] font-extrabold tracking-widest uppercase my-0.5">
              {kop.statusAkreditasi}
            </p>
          )}

          <p className="text-[9.5pt] leading-tight mt-0.5">
            {kop.alamat}
          </p>
          <p className="text-[9.5pt] leading-tight">
            Email : <span className="underline">{kop.email}</span> &nbsp; Website : <span className="underline">{kop.website}</span>
          </p>
          <p className="text-[9.5pt] leading-tight">
            Kode Pos {kop.kodePos} Telp. {kop.telp} Fax. {kop.fax}
          </p>
        </div>
      </div>

      {/* Horizontal Divider Line */}
      {kop.lineStyle === 'double' ? (
        <div className="w-full flex flex-col gap-[1.5px] mt-1 mb-3">
          <div className="w-full h-[2.5px] bg-black"></div>
          <div className="w-full h-[1px] bg-black"></div>
        </div>
      ) : kop.lineStyle === 'thick' ? (
        <div className="w-full h-[2.5px] bg-black mt-1 mb-3"></div>
      ) : (
        <div className="w-full h-[1.5px] bg-black mt-1 mb-3"></div>
      )}
    </header>
  );
};
