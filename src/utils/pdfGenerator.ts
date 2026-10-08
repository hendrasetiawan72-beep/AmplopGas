import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PaperSizeConfig } from '../types';

/**
 * Attempts to convert an image URL to a Base64 data URL.
 * Falls back gracefully if CORS or network blocks it.
 */
export async function convertImageUrlToBase64(url: string): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith('data:')) return url;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 300;
        canvas.height = img.naturalHeight || 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
          return;
        }
      } catch (err) {
        console.warn('Canvas conversion failed (likely CORS tainted):', err);
      }
      resolve(null);
    };
    img.onerror = () => {
      console.warn('Image failed to load for base64 conversion:', url);
      resolve(null);
    };
    img.src = url;
  });
}

/**
 * Triggers standard high-resolution browser print dialog.
 * This guarantees 100% crisp vector output with OS print engine.
 */
export function triggerBrowserPrint(targetStudentId?: string) {
  // If specific student ID passed, we can mark a data attribute
  const body = document.body;
  if (targetStudentId) {
    body.setAttribute('data-print-single', targetStudentId);
  } else {
    body.removeAttribute('data-print-single');
  }

  // Small delay to allow any layout recalculations
  setTimeout(() => {
    window.print();
    body.removeAttribute('data-print-single');
  }, 100);
}

/**
 * Generates and downloads a PDF file using html2canvas (scale 3) and jsPDF.
 */
export async function generateDirectPdf(
  elementIds: string[],
  paperConfig: PaperSizeConfig,
  fileName: string,
  onProgress?: (current: number, total: number) => void,
  rotate180: boolean = false
): Promise<void> {
  const isLandscape = paperConfig.widthMm >= paperConfig.heightMm;
  const orientation = isLandscape ? 'landscape' : 'portrait';
  const format: [number, number] = [paperConfig.widthMm, paperConfig.heightMm];

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format,
    compress: true,
  });

  const total = elementIds.length;

  for (let i = 0; i < total; i++) {
    const id = elementIds[i];
    const el = document.getElementById(id);
    if (!el) continue;

    if (onProgress) {
      onProgress(i + 1, total);
    }

    // Capture using scale 3 for crisp 300 DPI equivalent
    const canvas = await html2canvas(el, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(id);
        if (clonedEl) {
          clonedEl.style.transform = rotate180 ? 'rotate(180deg)' : 'none';
          clonedEl.style.transformOrigin = 'center center';
          clonedEl.style.boxShadow = 'none';
          clonedEl.style.border = 'none';
          clonedEl.style.margin = '0';
        }
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    if (i > 0) {
      pdf.addPage(format, orientation);
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, paperConfig.widthMm, paperConfig.heightMm, undefined, 'FAST');
  }

  pdf.save(fileName);
}
