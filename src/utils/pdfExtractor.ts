import * as pdfjsLib from 'pdfjs-dist';

// Ensure worker is configured for browser execution
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

export interface ExtractedPdfResult {
  title: string;
  text: string;
  pageCount: number;
  wordCount: number;
}

/**
 * Extracts plain text from an uploaded PDF File
 */
export async function extractTextFromPdf(file: File): Promise<ExtractedPdfResult> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDoc = await loadingTask.promise;
  const pageCount = pdfDoc.numPages;

  const fullTextParts: string[] = [];

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Concatenate text items with appropriate spacing
    const pageLines: string[] = [];
    let currentLine = '';
    let lastY: number | null = null;

    for (const item of textContent.items) {
      if ('str' in item) {
        const textItem = item as { str: string; transform: number[] };
        const y = textItem.transform[5]; // Y position
        
        if (lastY !== null && Math.abs(y - lastY) > 5) {
          if (currentLine.trim()) {
            pageLines.push(currentLine.trim());
          }
          currentLine = textItem.str;
        } else {
          currentLine += (currentLine ? ' ' : '') + textItem.str;
        }
        lastY = y;
      }
    }

    if (currentLine.trim()) {
      pageLines.push(currentLine.trim());
    }

    if (pageLines.length > 0) {
      fullTextParts.push(pageLines.join(' '));
    }
  }

  // Clean and normalize text
  const rawText = fullTextParts.join(' ');
  const normalizedText = rawText
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Clean filename for title
  const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
  const words = normalizedText.split(/\s+/).filter(Boolean);

  return {
    title: cleanTitle || 'PDF Practice Text',
    text: normalizedText,
    pageCount,
    wordCount: words.length
  };
}

/**
 * Extracts plain text from a text file (.txt, .md, etc.)
 */
export async function extractTextFromFile(file: File): Promise<ExtractedPdfResult> {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return extractTextFromPdf(file);
  }

  const raw = await file.text();
  const normalized = raw.replace(/\r\n/g, '\n').replace(/\t/g, '  ').trim();
  const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
  const words = normalized.split(/\s+/).filter(Boolean);

  return {
    title: cleanTitle || 'Custom Text',
    text: normalized,
    pageCount: 1,
    wordCount: words.length
  };
}
