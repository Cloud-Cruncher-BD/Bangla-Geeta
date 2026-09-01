import React, { useState } from 'react';
import { Chapter } from '../types';
import { toBengaliNumber } from '../data/verses';
import { ArrowLeft, ChevronLeft, ChevronRight, Bookmark, Search } from 'lucide-react';

interface ChapterVerseGridProps {
  chapter: Chapter;
  totalChapters: number;
  bookmarkedVerses: string[];
  onSelectVerse: (chapterId: number, verseNumber: number) => void;
  onBackToChapters: () => void;
  onChangeChapter: (newChapterId: number) => void;
}

export const ChapterVerseGrid: React.FC<ChapterVerseGridProps> = ({
  chapter,
  totalChapters,
  bookmarkedVerses,
  onSelectVerse,
  onBackToChapters,
  onChangeChapter
}) => {
  const [verseFilter, setVerseFilter] = useState('');

  // Generate array of verse numbers [1, 2, ..., chapter.versesCount]
  const verseNumbers = Array.from({ length: chapter.versesCount }, (_, i) => i + 1);

  // Filter verses based on search
  const filteredVerses = verseNumbers.filter(vNum => {
    if (!verseFilter.trim()) return true;
    const bengaliNum = toBengaliNumber(vNum);
    return bengaliNum.includes(verseFilter) || String(vNum).includes(verseFilter);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      
      {/* Top Simple Navigation */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          id="back-to-chapters-btn"
          onClick={onBackToChapters}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#663F17] hover:text-[#8E3B16] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#8E3B16]" />
          <span>সকল অধ্যায়</span>
        </button>

        {/* Chapter Switcher */}
        <div className="flex items-center gap-1.5">
          <button
            id="prev-chapter-btn"
            onClick={() => onChangeChapter(chapter.id - 1)}
            disabled={chapter.id <= 1}
            title="পূর্ববর্তী অধ্যায়"
            className="p-1.5 rounded-md bg-[#FEFCF8] hover:bg-[#F5ECE0] text-[#5C3005] disabled:opacity-30 disabled:cursor-not-allowed border border-[#DECDB3] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-semibold px-2 py-1 text-[#663F17]">
            অধ্যায় {toBengaliNumber(chapter.id)} / {toBengaliNumber(totalChapters)}
          </span>

          <button
            id="next-chapter-btn"
            onClick={() => onChangeChapter(chapter.id + 1)}
            disabled={chapter.id >= totalChapters}
            title="পরবর্তী অধ্যায়"
            className="p-1.5 rounded-md bg-[#FEFCF8] hover:bg-[#F5ECE0] text-[#5C3005] disabled:opacity-30 disabled:cursor-not-allowed border border-[#DECDB3] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chapter Overview (Simple and Clean) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#FEFCF8] border border-[#E8DCB8] mb-8 text-center shadow-xs">
        <p className="text-xs font-medium text-[#7C5A37] mb-1">
          অধ্যায় {toBengaliNumber(chapter.id)} • {chapter.nameTransliteration}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold font-tiro text-[#2D1B0E] mb-3">
          {chapter.nameBengali}
        </h1>
        <p className="text-sm text-[#5C4229] font-tiro leading-relaxed max-w-2xl mx-auto mb-3">
          {chapter.summary}
        </p>
        <span className="inline-block text-xs font-medium text-[#8E3B16] bg-[#FAF3E8] px-3 py-1 rounded-full border border-[#DFCBB0]">
          মোট {toBengaliNumber(chapter.versesCount)}টি শ্লোক
        </span>
      </div>

      {/* Verses Selection & Filter */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="text-base font-bold font-tiro text-[#2D1B0E]">
          শ্লোক নির্বাচন করুন
        </h2>

        {/* Quick Filter */}
        <div className="relative w-40 sm:w-48">
          <Search className="w-3.5 h-3.5 text-[#8C643E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="verse-number-filter-input"
            type="text"
            placeholder="শ্লোক সংখ্যা..."
            value={verseFilter}
            onChange={(e) => setVerseFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#FEFCF8] border border-[#DFCBB0] text-xs text-[#2D1B0E] placeholder-[#9C7D5D] focus:outline-hidden focus:border-[#8E3B16]"
          />
        </div>
      </div>

      {/* The Verses Grid (Simple, Clear Boxes) */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
        {filteredVerses.map((vNum) => {
          const verseKey = `${chapter.id}.${vNum}`;
          const isBookmarked = bookmarkedVerses.includes(verseKey);

          return (
            <button
              key={vNum}
              id={`verse-grid-box-${chapter.id}-${vNum}`}
              onClick={() => onSelectVerse(chapter.id, vNum)}
              className="relative aspect-square flex flex-col items-center justify-center p-2 rounded-xl bg-[#FEFCF8] hover:bg-[#8E3B16] border border-[#E8DCB8] hover:border-[#8E3B16] text-[#2D1B0E] hover:text-white transition-all cursor-pointer group shadow-2xs"
            >
              {isBookmarked && (
                <Bookmark className="w-2.5 h-2.5 absolute top-1.5 right-1.5 fill-[#8E3B16] text-[#8E3B16] group-hover:fill-white group-hover:text-white" />
              )}
              <span className="text-base sm:text-lg font-bold font-tiro">
                {toBengaliNumber(vNum)}
              </span>
            </button>
          );
        })}
      </div>

      {filteredVerses.length === 0 && (
        <div className="text-center py-10 bg-[#FEFCF8] rounded-xl border border-[#E8DCB8] mt-4">
          <p className="text-xs text-[#704E2D] mb-2">
            '{verseFilter}' নম্বরের শ্লোক পাওয়া যায়নি।
          </p>
          <button
            id="reset-verse-filter-btn"
            onClick={() => setVerseFilter('')}
            className="text-xs text-[#8E3B16] font-semibold hover:underline cursor-pointer"
          >
            সকল শ্লোক দেখুন
          </button>
        </div>
      )}
    </div>
  );
};

