import React, { useState } from 'react';

interface SchoolLogoProps {
  src?: string;
  base64?: string;
  className?: string;
  alt?: string;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  src,
  base64,
  className = 'w-[25mm] h-[25mm] object-contain',
  alt = 'Logo SMK Muhammadiyah Bawang',
}) => {
  const [loadError, setLoadError] = useState(false);

  // Preferred source order: base64 (for PDF/print reliability), then external URL
  const imageSource = base64 || src;

  if (loadError || !imageSource) {
    // Beautiful vector SVG fallback of Muhammadiyah emblem badge
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-purple-900 text-white ${className}`}
        style={{ aspectRatio: '1 / 1' }}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full p-0.5"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer purple scalloped circle */}
          <circle cx="60" cy="60" r="58" fill="#581c87" stroke="#3b0764" strokeWidth="2" />
          <circle cx="60" cy="60" r="51" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2" />
          
          {/* Inner dark circle */}
          <circle cx="60" cy="60" r="43" fill="#3b0764" />
          
          {/* Sun rays */}
          <g stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="60"
                y1="23"
                x2="60"
                y2="33"
                transform={`rotate(${deg} 60 60)`}
              />
            ))}
          </g>

          {/* Central sun badge */}
          <circle cx="60" cy="60" r="16" fill="#1e1b4b" stroke="#ffffff" strokeWidth="1" />
          <text
            x="60"
            y="64"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="10"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            SMK
          </text>

          {/* Text circle around */}
          <path
            id="textPathTop"
            d="M 22 60 A 38 38 0 0 1 98 60"
            fill="none"
          />
          <text fontSize="7.5" fill="#fef08a" fontWeight="bold" letterSpacing="0.8">
            <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
              MUHAMMADIYAH
            </textPath>
          </text>

          <path
            id="textPathBottom"
            d="M 22 60 A 38 38 0 0 0 98 60"
            fill="none"
          />
          <text fontSize="7" fill="#ffffff" fontWeight="bold" letterSpacing="0.8">
            <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
              BAWANG - BATANG
            </textPath>
          </text>
        </svg>
      </div>
    );
  }

  return (
    <img
      src={imageSource}
      alt={alt}
      crossOrigin="anonymous"
      onError={() => setLoadError(true)}
      className={`${className} object-contain select-none`}
      style={{
        imageRendering: 'auto',
      }}
    />
  );
};
