import React, { useState } from 'react';
import { Chapter } from '../types';
import { CURATED_VERSES, toBengaliNumber } from '../data/verses';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  onSelectVerse: (chapterId: number, verseNumber: number) => void;
  onSelectChapter: (chapterId: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  chapters,
  onSelectVerse,
  onSelectChapter
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Direct chapter.verse parse e.g. "2.47" or "2 47" or "২.৪৭"
  const parseDirectReference = (query: string) => {
    // replace Bengali digits to english digits
    const bengaliMap: Record<string, string> = { '০':'0', '১':'1', '২':'2', '৩':'3', '৪':'4', '৫':'5', '৬':'6', '৭':'7', '৮':'8', '৯':'9' };
    const norm = query.replace(/[০-৯]/g, d => bengaliMap[d] || d).trim();
    const match = norm.match(/^(\d{1,2})[\s.:/-]+(\d{1,3})$/);
    if (match) {
      const ch = parseInt(match[1], 10);
      const vs = parseInt(match[2], 10);
      const chapterObj = chapters.find(c => c.id === ch);
      if (chapterObj && vs >= 1 && vs <= chapterObj.versesCount) {
        return { ch, vs, chapterObj };
      }
    }
    return null;
  };

  const directRef = parseDirectReference(searchTerm);

  // Search in chapters
  const matchingChapters = chapters.filter(c => 
    searchTerm.trim() && (
      c.nameBengali.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.meaningBengali.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nameTransliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.keyThemes.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  // Search in curated verses
  const matchingVerses: Array<{ id: string; chapter: number; verse: number; translation: string; bengaliUcharan: string }> = [];
  if (searchTerm.trim().length >= 2) {
    Object.entries(CURATED_VERSES).forEach(([key, v]) => {
      const [chStr, vsStr] = key.split('.');
      const ch = parseInt(chStr, 10);
      const vs = parseInt(vsStr, 10);
      if (
        (v.translation && v.translation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.bengaliUcharan && v.bengaliUcharan.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.purport && v.purport.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.speaker && v.speaker.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        matchingVerses.push({
          id: key,
          chapter: ch,
          verse: vs,
          translation: v.translation || '',
          bengaliUcharan: v.bengaliUcharan || ''
        });
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-20 bg-black/40 backdrop-blur-2xs animate-fadeIn">
      <div className="w-full max-w-xl bg-[#FAF7F2] rounded-2xl border border-[#DFCBB0] shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Header */}
        <div className="p-4 border-b border-[#E8DCB8] flex items-center gap-3">
          <Search className="w-4 h-4 text-[#8E3B16]" />
          <input
            id="global-gita-search-input"
            type="text"
            autoFocus
            placeholder="অধ্যায়, শ্লোক (যেমন: ২.৪৭), বা শব্দ খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm sm:text-base text-[#2D1B0E] placeholder-[#9C7D5D] focus:outline-hidden"
          />
          <button
            id="close-search-modal-btn"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-[#F2E5D0] text-[#704E2D] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Direct Verse Jump */}
          {directRef && (
            <div className="p-4 rounded-2xl bg-[#9B3B1B] text-white flex items-center justify-between gap-3 shadow-md">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#FCD7B6]">
                  সরাসরি শ্লোক প্রাপ্ত হয়েছে
                </span>
                <h4 className="text-lg font-bold font-serif-bn">
                  {directRef.chapterObj.nameBengali} — শ্লোক {toBengaliNumber(directRef.vs)}
                </h4>
              </div>
              <button
                id="direct-jump-verse-btn"
                onClick={() => {
                  onSelectVerse(directRef.ch, directRef.vs);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-white text-[#9B3B1B] text-xs font-bold hover:bg-[#FAF4EA] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                পাঠ করুন <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Chapters match */}
          {matchingChapters.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C4A18] mb-2">
                অধ্যায়সমূহ ({toBengaliNumber(matchingChapters.length)})
              </h3>
              <div className="space-y-2">
                {matchingChapters.map(ch => (
                  <div
                    key={ch.id}
                    onClick={() => {
                      onSelectChapter(ch.id);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-[#FDFBF7] hover:bg-[#FFFDF9] border border-[#E7D8C5] hover:border-[#9B3B1B] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-sm font-bold font-serif-bn text-[#3A1F04]">
                        {ch.nameBengali}
                      </div>
                      <div className="text-xs text-[#7A5B3D] line-clamp-1">
                        {ch.meaningBengali}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#8C4A18]">
                      {toBengaliNumber(ch.versesCount)} শ্লোক →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verses match */}
          {matchingVerses.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C4A18] mb-2">
                শ্লোকসমূহ ({toBengaliNumber(matchingVerses.length)})
              </h3>
              <div className="space-y-2">
                {matchingVerses.map(v => (
                  <div
                    key={v.id}
                    onClick={() => {
                      onSelectVerse(v.chapter, v.verse);
                      onClose();
                    }}
                    className="p-3.5 rounded-xl bg-[#FDFBF7] hover:bg-[#FFFDF9] border border-[#E7D8C5] hover:border-[#9B3B1B] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#F2E5D0] text-[#7A3F0B]">
                        অধ্যায় {toBengaliNumber(v.chapter)}, শ্লোক {toBengaliNumber(v.verse)}
                      </span>
                      <span className="text-xs text-[#8C4A18] font-semibold flex items-center gap-1">
                        দেখুন <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4E341B] font-medium line-clamp-2">
                      {v.translation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!searchTerm.trim() && (
            <div className="text-center py-8 text-[#7A5B3D]">
              <BookOpen className="w-8 h-8 mx-auto text-[#C19B72] mb-2" />
              <p className="text-sm font-medium">
                শ্লোক খুঁজতে যেমন লিখুন: <strong className="text-[#3A1F04]">২.৪৭</strong>, <strong className="text-[#3A1F04]">কর্ম</strong>, <strong className="text-[#3A1F04]">জ্ঞান</strong>, বা <strong className="text-[#3A1F04]">সাংখ্য</strong>
              </p>
            </div>
          )}

          {searchTerm.trim() && !directRef && matchingChapters.length === 0 && matchingVerses.length === 0 && (
            <div className="text-center py-8 text-[#7A5B3D]">
              <p className="text-sm">'{searchTerm}' দিয়ে কোনো ফলাফল পাওয়া যায়নি।</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
