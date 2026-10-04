import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Play,
  Trash2,
  Edit3,
  FileText,
  Code2,
  Quote,
  Check,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { CustomText } from '../types';
import { FAMOUS_QUOTES, CODE_SNIPPETS } from '../data/textLibraries';

interface CustomLibraryManagerProps {
  customTexts: CustomText[];
  onAddCustomText: (text: CustomText) => void;
  onDeleteCustomText: (id: string) => void;
  onSelectForPractice: (content: string, title: string) => void;
}

export const CustomLibraryManager: React.FC<CustomLibraryManagerProps> = ({
  customTexts,
  onAddCustomText,
  onDeleteCustomText,
  onSelectForPractice
}) => {
  const [activeTab, setActiveTab] = useState<'custom' | 'quotes' | 'code'>('custom');
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Please provide a title for your custom practice text.');
      return;
    }
    if (!content.trim() || content.trim().length < 15) {
      setValidationError('Text content must be at least 15 characters long.');
      return;
    }

    const newText: CustomText = {
      id: 'custom_' + Date.now(),
      userId: 'local',
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    onAddCustomText(newText);
    setTitle('');
    setContent('');
    setValidationError('');
    setIsCreating(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            Practice Text Libraries
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose from curated literature, programming snippets, or create your own custom practice passages
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreating(!isCreating);
            setValidationError('');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs font-mono transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          {isCreating ? 'Cancel' : 'New Custom Text'}
        </button>
      </div>

      {/* Library Category Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors ${
            activeTab === 'custom'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          My Custom Texts ({customTexts.length})
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors ${
            activeTab === 'quotes'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Quote className="w-3.5 h-3.5" />
          Famous Quotes ({FAMOUS_QUOTES.length})
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors ${
            activeTab === 'code'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          Code Snippets ({CODE_SNIPPETS.length})
        </button>
      </div>

      {/* New Custom Text Form Drawer */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl space-y-4 animate-in slide-in-from-top-2 duration-150"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Add Custom Practice Text
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Paste articles, speeches, lyrics, or technical drills
            </span>
          </div>

          {validationError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
              {validationError}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Text Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Gettysburg Address / Rust Memory Model / Lyrics"
              maxLength={100}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono text-slate-300">Practice Content</label>
              <span className="text-[10px] font-mono text-slate-500">
                {content.split(/\s+/).filter(Boolean).length} words · {content.length} chars
              </span>
            </div>
            <textarea
              rows={5}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste or type the text passage you want to master..."
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs font-mono leading-relaxed focus:outline-none focus:border-amber-400 resize-y"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs font-mono transition-all shadow"
            >
              Save to Library
            </button>
          </div>
        </form>
      )}

      {/* Content for My Custom Texts */}
      {activeTab === 'custom' && (
        <div className="space-y-4">
          {customTexts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-amber-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-200">No Custom Texts Saved Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Save your favorite quotes, coding challenges, book excerpts, or custom interview prompts to practice them repeatedly.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="mt-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold font-mono hover:bg-amber-300 transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Create First Text
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customTexts.map(text => {
                const words = text.content.split(/\s+/).filter(Boolean).length;
                return (
                  <div
                    key={text.id}
                    className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-100 truncate">
                          {text.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                          {words} words
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                        {text.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-800/60 mt-4">
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(text.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onDeleteCustomText(text.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                          title="Delete text"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onSelectForPractice(text.content, text.title)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold font-mono transition-all shadow"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          Practice Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Content for Built-in Famous Quotes */}
      {activeTab === 'quotes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAMOUS_QUOTES.map(q => {
            const wordCount = q.quote.split(/\s+/).filter(Boolean).length;
            return (
              <div
                key={q.id}
                className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="font-semibold text-amber-400">{q.author}</span>
                    <span>{wordCount} words</span>
                  </div>
                  <p className="text-xs font-mono text-slate-200 mt-2.5 italic leading-relaxed">
                    &ldquo;{q.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/60 mt-4 flex justify-end">
                  <button
                    onClick={() => onSelectForPractice(q.quote, `Quote by ${q.author}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200 text-xs font-bold font-mono transition-all shadow"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Practice Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content for Built-in Code Snippets */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CODE_SNIPPETS.map(snippet => (
            <div
              key={snippet.id}
              className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-100">{snippet.title}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 text-[10px]">
                    {snippet.language}
                  </span>
                </div>
                <pre className="text-[11px] font-mono text-slate-300 bg-slate-950 p-3 rounded-xl mt-3 overflow-x-auto border border-slate-800/60 max-h-36">
                  {snippet.code}
                </pre>
              </div>

              <div className="pt-4 border-t border-slate-800/60 mt-4 flex justify-end">
                <button
                  onClick={() => onSelectForPractice(snippet.code.replace(/\t/g, '  '), snippet.title)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-400 hover:text-slate-950 text-slate-200 text-xs font-bold font-mono transition-all shadow"
                >
                  <Play className="w-3 h-3 fill-current" />
                  Practice Code
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
