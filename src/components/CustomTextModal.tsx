import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Play,
  BookmarkPlus,
  Scissors
} from 'lucide-react';
import { extractTextFromFile, ExtractedPdfResult } from '../utils/pdfExtractor';
import { CustomText } from '../types';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTextForPractice: (text: string, title: string) => void;
  onSaveToLibrary?: (customText: CustomText) => void;
  savedTexts?: CustomText[];
}

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  isOpen,
  onClose,
  onLoadTextForPractice,
  onSaveToLibrary,
  savedTexts = []
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'saved'>('upload');
  
  // PDF / File state
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [extractedResult, setExtractedResult] = useState<ExtractedPdfResult | null>(null);
  const [sliceLength, setSliceLength] = useState<'100' | '250' | '500' | 'all'>('250');
  
  // Paste state
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedContent, setPastedContent] = useState('');
  const [pasteError, setPasteError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoadingPdf(true);
    setPdfError(null);
    setExtractedResult(null);

    try {
      const result = await extractTextFromFile(file);
      if (!result.text || result.text.length < 10) {
        throw new Error('No readable text could be extracted from this file.');
      }
      setExtractedResult(result);
    } catch (err: unknown) {
      console.error('File parsing error:', err);
      setPdfError(err instanceof Error ? err.message : 'Failed to extract text from file.');
    } finally {
      setIsLoadingPdf(false);
      // Reset input value so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getEffectiveText = (fullText: string): string => {
    if (sliceLength === 'all') return fullText;
    const limit = parseInt(sliceLength, 10);
    const words = fullText.split(/\s+/).filter(Boolean);
    if (words.length <= limit) return fullText;
    return words.slice(0, limit).join(' ');
  };

  const handleStartPdfPractice = () => {
    if (!extractedResult) return;
    const finalContent = getEffectiveText(extractedResult.text);
    const finalTitle = `${extractedResult.title} (${sliceLength === 'all' ? 'Full' : `${sliceLength} words`})`;

    if (onSaveToLibrary) {
      onSaveToLibrary({
        id: 'pdf_' + Date.now(),
        userId: 'local',
        title: finalTitle,
        content: finalContent,
        createdAt: new Date().toISOString()
      });
    }

    onLoadTextForPractice(finalContent, finalTitle);
    onClose();
  };

  const handleStartPastePractice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedTitle.trim()) {
      setPasteError('Please provide a title.');
      return;
    }
    if (!pastedContent.trim() || pastedContent.trim().length < 15) {
      setPasteError('Text content must be at least 15 characters long.');
      return;
    }

    const title = pastedTitle.trim();
    const content = pastedContent.trim();

    if (onSaveToLibrary) {
      onSaveToLibrary({
        id: 'custom_' + Date.now(),
        userId: 'local',
        title,
        content,
        createdAt: new Date().toISOString()
      });
    }

    onLoadTextForPractice(content, title);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Load Custom Text or PDF
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Practice typing with any PDF document, article, or custom notes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800/60 font-mono text-xs">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Upload PDF / Document
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'paste'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Paste Custom Text
          </button>

          {savedTexts.length > 0 && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookmarkPlus className="w-4 h-4" />
              Saved Library ({savedTexts.length})
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.text"
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload-input"
              />

              {!extractedResult && (
                <label
                  htmlFor="pdf-upload-input"
                  className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isLoadingPdf
                      ? 'border-amber-400/50 bg-amber-400/5 cursor-wait'
                      : 'border-slate-800 hover:border-amber-400/60 hover:bg-slate-800/40 bg-slate-950/40'
                  }`}
                >
                  {isLoadingPdf ? (
                    <div className="space-y-3 flex flex-col items-center">
                      <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
                      <p className="text-sm font-semibold text-slate-200">Extracting text from PDF...</p>
                      <p className="text-xs text-slate-500 font-mono">Parsing document pages and words</p>
                    </div>
                  ) : (
                    <div className="space-y-3 flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shadow-lg">
                        <Upload className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-100">
                          Click to upload PDF or Document
                        </p>
                        <p className="text-xs text-slate-400 font-mono mt-1">
                          Supports .pdf, .txt, and .md files (extracted directly in browser)
                        </p>
                      </div>
                      <span className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs font-mono shadow mt-2">
                        Browse Files
                      </span>
                    </div>
                  )}
                </label>
              )}

              {pdfError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {pdfError}
                </div>
              )}

              {extractedResult && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Summary Card */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-100 truncate max-w-xs">
                          {extractedResult.title}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono">
                          {extractedResult.pageCount} page{extractedResult.pageCount === 1 ? '' : 's'} · {extractedResult.wordCount} words
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setExtractedResult(null)}
                      className="text-xs text-slate-400 hover:text-amber-400 font-mono underline"
                    >
                      Choose different file
                    </button>
                  </div>

                  {/* Length Slice selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                      <Scissors className="w-3.5 h-3.5 text-amber-400" />
                      Practice Length:
                    </label>
                    <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                      {(['100', '250', '500', 'all'] as const).map(option => (
                        <button
                          key={option}
                          onClick={() => setSliceLength(option)}
                          className={`py-2 px-3 rounded-xl border transition-all ${
                            sliceLength === option
                              ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-sm'
                              : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          {option === 'all' ? 'Full Text' : `${option} words`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Preview */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-mono">
                      Preview ({getEffectiveText(extractedResult.text).split(/\s+/).length} words ready for test):
                    </label>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
                      {getEffectiveText(extractedResult.text)}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleStartPdfPractice}
                    className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm font-mono transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-400/20 active:scale-[0.99]"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    Start PDF Typing Test Now
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'paste' && (
            <form onSubmit={handleStartPastePractice} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 font-mono">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 1 Notes, Legal Brief, Essay..."
                  value={pastedTitle}
                  onChange={e => setPastedTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <label className="font-semibold text-slate-300">Custom Text Content</label>
                  <span>{pastedContent.split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  rows={6}
                  placeholder="Paste any article, book excerpt, homework, or speech to practice..."
                  value={pastedContent}
                  onChange={e => setPastedContent(e.target.value)}
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs font-mono leading-relaxed focus:outline-none focus:border-amber-400 transition-colors resize-none"
                />
              </div>

              {pasteError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {pasteError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm font-mono transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                Load & Practice This Text
              </button>
            </form>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-400 font-mono">
                Click any saved text below to practice:
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {savedTexts.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onLoadTextForPractice(item.content, item.title);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-800/40 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5 line-clamp-1">
                        {item.content}
                      </p>
                    </div>

                    <button className="px-3 py-1.5 rounded-xl bg-slate-800 group-hover:bg-amber-400 group-hover:text-slate-950 text-slate-300 font-mono text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ml-3">
                      <Play className="w-3 h-3" />
                      Practice
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
