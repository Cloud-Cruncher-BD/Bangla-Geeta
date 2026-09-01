import React, { useState } from 'react';
import { Chapter } from '../types';
import { toBengaliNumber } from '../data/verses';
import { Search, ChevronRight } from 'lucide-react';
import { GitaLogo } from './GitaLogo';

interface ChapterListProps {
  chapters: Chapter[];
  onSelectChapter: (chapterId: number) => void;
  onOpenFeaturedVerse: (chapter: number, verse: number) => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  onSelectChapter
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  const filteredChapters = chapters.filter(ch => 
    ch.nameBengali.toLowerCase().includes(searchFilter.toLowerCase()) ||
    ch.meaningBengali.toLowerCase().includes(searchFilter.toLowerCase()) ||
    ch.nameTransliteration.toLowerCase().includes(searchFilter.toLowerCase()) ||
    toBengaliNumber(ch.id).includes(searchFilter) ||
    String(ch.id).includes(searchFilter)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      {/* Simple, Serene Header with Beautiful Gita Logo */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <GitaLogo size="xl" showText={false} />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-tiro text-[#2D1B0E] tracking-tight mb-2">
          শ্রীমদ্ভগবদ্গীতা
        </h1>
        <p className="text-sm sm:text-base text-[#704E2D] font-tiro">
          ১৮টি অধ্যায় • ৭০০টি শ্লোক • বাংলা অনুবাদ ও তাৎপর্য
        </p>
      </div>

      {/* Clean Search Bar */}
      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C643E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="chapter-search-input"
            type="text"
            placeholder="অধ্যায় অনুসন্ধান করুন..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FEFCF8] border border-[#DFCBB0] text-sm text-[#2D1B0E] placeholder-[#9C7D5D] focus:outline-hidden focus:border-[#8E3B16] shadow-2xs transition-colors"
          />
        </div>
      </div>

      {/* Chapters Grid Layout (Clean, Minimal Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChapters.map((chapter) => (
          <div
            key={chapter.id}
            id={`chapter-card-${chapter.id}`}
            onClick={() => onSelectChapter(chapter.id)}
            className="p-5 rounded-xl bg-[#FEFCF8] hover:bg-[#FAF4EB] border border-[#E8DCB8] hover:border-[#CBB28C] transition-all cursor-pointer flex items-center justify-between gap-4 shadow-2xs group"
          >
            <div className="flex items-start gap-3.5">
              {/* Chapter Number */}
              <div className="w-9 h-9 rounded-lg bg-[#FAF3E8] border border-[#DECDB3] text-[#8E3B16] font-bold text-sm flex items-center justify-center shrink-0 group-hover:bg-[#8E3B16] group-hover:text-white transition-colors">
                {toBengaliNumber(chapter.id)}
              </div>

              {/* Chapter Details */}
              <div>
                <div className="flex items-baseline gap-2 mb-0.5">
                  <h2 className="text-lg font-bold font-tiro text-[#2D1B0E] group-hover:text-[#8E3B16] transition-colors">
                    {chapter.nameBengali}
                  </h2>
                  <span className="text-xs text-[#8C6B47] font-cinzel">
                    ({chapter.nameTransliteration})
                  </span>
                </div>
                <p className="text-xs text-[#6B4E33] font-sans-bn line-clamp-1 mb-1">
                  {chapter.meaningBengali}
                </p>
                <span className="text-[11px] text-[#91673E] font-medium">
                  {toBengaliNumber(chapter.versesCount)}টি শ্লোক
                </span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-[#B89B77] group-hover:text-[#8E3B16] group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        ))}
      </div>

      {filteredChapters.length === 0 && (
        <div className="text-center py-12 bg-[#FEFCF8] rounded-xl border border-[#E8DCB8]">
          <p className="text-sm text-[#704E2D] mb-2">
            কোনো অধ্যায় খুঁজে পাওয়া যায়নি।
          </p>
          <button
            id="clear-chapter-search-btn"
            onClick={() => setSearchFilter('')}
            className="text-xs text-[#8E3B16] font-semibold hover:underline cursor-pointer"
          >
            অনুসন্ধান মুছুন
          </button>
        </div>
      )}

    </div>
  );
};

