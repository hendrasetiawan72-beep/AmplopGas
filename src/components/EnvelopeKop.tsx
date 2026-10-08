import React from 'react';
import { KopData } from '../types';
import { SchoolLogo } from './SchoolLogo';

interface EnvelopeKopProps {
  kop: KopData;
  scale?: number;
  isDl?: boolean;
}

export const EnvelopeKop: React.FC<EnvelopeKopProps> = ({ kop, isDl = false }) => {
  if (kop.kopMode === 'image-banner' && (kop.kopImageUrl || kop.logoBase64 || kop.logoUrl)) {
    const bannerSrc = kop.logoBase64 || kop.kopImageUrl || kop.logoUrl;
    return (
      <div className="envelope-kop-container w-full text-black">
        <div className="w-full flex items-center justify-center mb-0.5">
          <img
            src={bannerSrc}
            alt="Kop Surat SMK Muhammadiyah Bawang"
            crossOrigin="anonymous"
            className={`w-full object-contain select-none ${
              isDl ? 'max-h-[26mm]' : 'max-h-[35mm]'
            }`}
          />
        </div>
        {/* Optional divider line if selected */}
        {kop.lineStyle === 'double' ? (
          <div className="w-full flex flex-col gap-[1.5px] mt-0.5 mb-1.5">
            <div className="w-full h-[2px] bg-black"></div>
            <div className="w-full h-[1px] bg-black"></div>
          </div>
        ) : kop.lineStyle === 'single' ? (
          <div className="w-full h-[1.5px] bg-black mt-0.5 mb-1.5"></div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="envelope-kop-container w-full text-black">
      {/* Header Grid: Logo Left, Text Centered */}
      <div className={`flex items-center justify-between gap-2.5 ${isDl ? 'mb-0.5' : 'mb-2'}`}>
        {/* Logo Left */}
        <div className="flex-shrink-0 flex items-center justify-center pl-1">
          <SchoolLogo
            src={kop.logoUrl}
            base64={kop.logoBase64}
            className={
              isDl
                ? 'w-[20mm] h-[20mm] max-h-[78px] max-w-[78px]'
                : 'w-[26mm] h-[26mm] max-h-[105px] max-w-[105px]'
            }
          />
        </div>

        {/* Text Center */}
        <div className="flex-1 text-center font-sans tracking-tight pr-3">
          <h2
            className={`${
              isDl ? 'text-[9pt]' : 'text-[12pt]'
            } leading-tight font-bold uppercase tracking-wide`}
          >
            {kop.majlis}
          </h2>
          <h3
            className={`${
              isDl ? 'text-[9pt]' : 'text-[12pt]'
            } leading-tight font-bold uppercase tracking-wide`}
          >
            {kop.daerah}
          </h3>
          <h1
            className={`${
              isDl ? 'text-[12pt] my-0.5' : 'text-[16.5pt] my-0.5'
            } leading-tight font-black uppercase tracking-wider`}
          >
            {kop.namaSekolah}
          </h1>

          {kop.showAkreditasi && kop.statusAkreditasi && (
            <p
              className={`${
                isDl ? 'text-[8.5pt]' : 'text-[11pt]'
              } font-extrabold tracking-widest uppercase my-0.5`}
            >
              {kop.statusAkreditasi}
            </p>
          )}

          <p className={`${isDl ? 'text-[7.5pt]' : 'text-[9.5pt]'} leading-tight mt-0.5`}>
            {kop.alamat}
          </p>
          <p className={`${isDl ? 'text-[7.5pt]' : 'text-[9.5pt]'} leading-tight`}>
            Email : <span className="underline">{kop.email}</span> &nbsp; Website : <span className="underline">{kop.website}</span>
          </p>
          <p className={`${isDl ? 'text-[7.5pt]' : 'text-[9.5pt]'} leading-tight`}>
            Kode Pos {kop.kodePos} Telp. {kop.telp} Fax. {kop.fax}
          </p>
        </div>
      </div>

      {/* Horizontal Divider Line */}
      {kop.lineStyle === 'double' ? (
        <div className={`w-full flex flex-col gap-[1.5px] ${isDl ? 'mt-0.5 mb-1.5' : 'mt-1 mb-3'}`}>
          <div className={`${isDl ? 'h-[2px]' : 'h-[2.5px]'} w-full bg-black`}></div>
          <div className="w-full h-[1px] bg-black"></div>
        </div>
      ) : kop.lineStyle === 'thick' ? (
        <div className={`w-full ${isDl ? 'h-[2px] mt-0.5 mb-1.5' : 'h-[2.5px] mt-1 mb-3'} bg-black`}></div>
      ) : (
        <div className={`w-full ${isDl ? 'h-[1px] mt-0.5 mb-1.5' : 'h-[1.5px] mt-1 mb-3'} bg-black`}></div>
      )}
    </div>
  );
};
