/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode, Verse, Chapter } from './types';
import { CHAPTERS_DATA } from './data/chapters';
import { getVerseDetails, toBengaliNumber } from './data/verses';
import { Navbar } from './components/Navbar';
import { ChapterList } from './components/ChapterList';
import { ChapterVerseGrid } from './components/ChapterVerseGrid';
import { VerseDetail } from './components/VerseDetail';
import { SearchModal } from './components/SearchModal';
import { BookmarksModal } from './components/BookmarksModal';
import { toggleAmbientAudio, stopAmbientAudio } from './utils/audioSynth';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [selectedVerseNum, setSelectedVerseNum] = useState<number>(1);
  
  // Bookmarks persistence
  const [bookmarkedVerses, setBookmarkedVerses] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gita_bookmarked_verses');
      return saved ? JSON.parse(saved) : ["2.47", "4.7", "18.66"];
    } catch {
      return ["2.47", "4.7", "18.66"];
    }
  });

  // Modals & settings
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(2); // 1 to 4

  // Save bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('gita_bookmarked_verses', JSON.stringify(bookmarkedVerses));
    } catch {
      // ignore
    }
  }, [bookmarkedVerses]);

  // Current Chapter & Verse objects
  const currentChapter = CHAPTERS_DATA.find(c => c.id === selectedChapterId) || CHAPTERS_DATA[0];
  const currentVerse = getVerseDetails(selectedChapterId, selectedVerseNum);

  // Handlers
  const handleSelectChapter = (chapterId: number) => {
    setSelectedChapterId(chapterId);
    setViewMode('chapter-verses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVerse = (chapterId: number, verseNumber: number) => {
    setSelectedChapterId(chapterId);
    setSelectedVerseNum(verseNumber);
    setViewMode('verse-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setViewMode('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGrid = () => {
    setViewMode('chapter-verses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Previous verse navigation
  const handlePrevVerse = () => {
    if (selectedVerseNum > 1) {
      setSelectedVerseNum(prev => prev - 1);
    } else if (selectedChapterId > 1) {
      // Go to last verse of previous chapter
      const prevChId = selectedChapterId - 1;
      const prevCh = CHAPTERS_DATA.find(c => c.id === prevChId);
      if (prevCh) {
        setSelectedChapterId(prevChId);
        setSelectedVerseNum(prevCh.versesCount);
      }
    } else {
      // Wrap to last chapter last verse
      const lastCh = CHAPTERS_DATA[CHAPTERS_DATA.length - 1];
      setSelectedChapterId(lastCh.id);
      setSelectedVerseNum(lastCh.versesCount);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Next verse navigation
  const handleNextVerse = () => {
    if (selectedVerseNum < currentChapter.versesCount) {
      setSelectedVerseNum(prev => prev + 1);
    } else if (selectedChapterId < CHAPTERS_DATA.length) {
      // Go to first verse of next chapter
      setSelectedChapterId(prev => prev + 1);
      setSelectedVerseNum(1);
    } else {
      // Wrap to first chapter first verse
      setSelectedChapterId(1);
      setSelectedVerseNum(1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Bookmark toggler
  const handleToggleBookmark = (verseId: string) => {
    setBookmarkedVerses(prev => 
      prev.includes(verseId) ? prev.filter(id => id !== verseId) : [...prev, verseId]
    );
  };

  const handleRemoveBookmark = (verseId: string) => {
    setBookmarkedVerses(prev => prev.filter(id => id !== verseId));
  };

  const handleClearAllBookmarks = () => {
    setBookmarkedVerses([]);
  };

  // Ambient sound toggler
  const handleToggleAmbientAudio = () => {
    const active = toggleAmbientAudio();
    setIsAmbientPlaying(active);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2E1D0C]">
      
      {/* Navigation Bar (Shown on Home and Chapter list view) */}
      {viewMode !== 'verse-detail' && (
        <Navbar
          currentView={viewMode}
          onGoHome={handleGoHome}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenBookmarks={() => setIsBookmarksOpen(true)}
          bookmarksCount={bookmarkedVerses.length}
          isAudioPlaying={isAmbientPlaying}
          onToggleAudio={handleToggleAmbientAudio}
          fontSizeLevel={fontSizeLevel}
          onIncreaseFontSize={() => setFontSizeLevel(p => Math.min(p + 1, 4))}
          onDecreaseFontSize={() => setFontSizeLevel(p => Math.max(p - 1, 1))}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {viewMode === 'home' && (
          <ChapterList
            chapters={CHAPTERS_DATA}
            onSelectChapter={handleSelectChapter}
            onOpenFeaturedVerse={handleSelectVerse}
          />
        )}

        {viewMode === 'chapter-verses' && (
          <ChapterVerseGrid
            chapter={currentChapter}
            totalChapters={CHAPTERS_DATA.length}
            bookmarkedVerses={bookmarkedVerses}
            onSelectVerse={(chId, vNum) => handleSelectVerse(chId, vNum)}
            onBackToChapters={handleGoHome}
            onChangeChapter={(newChId) => {
              if (newChId >= 1 && newChId <= CHAPTERS_DATA.length) {
                setSelectedChapterId(newChId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />
        )}

        {viewMode === 'verse-detail' && (
          <VerseDetail
            verse={currentVerse}
            chapter={currentChapter}
            totalChapters={CHAPTERS_DATA.length}
            isBookmarked={bookmarkedVerses.includes(currentVerse.id)}
            onToggleBookmark={handleToggleBookmark}
            onPrevVerse={handlePrevVerse}
            onNextVerse={handleNextVerse}
            onBackToGrid={handleBackToGrid}
            onSelectSpecificVerse={(vNum) => {
              setSelectedVerseNum(vNum);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            fontSizeLevel={fontSizeLevel}
          />
        )}
      </main>

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        chapters={CHAPTERS_DATA}
        onSelectVerse={handleSelectVerse}
        onSelectChapter={handleSelectChapter}
      />

      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedVerseIds={bookmarkedVerses}
        chapters={CHAPTERS_DATA}
        onSelectVerse={handleSelectVerse}
        onRemoveBookmark={handleRemoveBookmark}
        onClearAll={handleClearAllBookmarks}
      />

      {/* Global Footer (Shown on Home and Chapter list view) */}
      {viewMode !== 'verse-detail' && (
        <footer className="mt-12 py-8 bg-[#F3E9DA] border-t border-[#DECBB0] text-center text-[#6E4B28] text-xs sm:text-sm">
          <div className="max-w-4xl mx-auto px-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-[#9B3B1B] font-bold text-base font-serif-bn">
              <span>ॐ</span>
              <span>শ্রীমদ্ভগবদ্গীতা মাহাত্ম্য</span>
              <span>ॐ</span>
            </div>
            <p className="font-serif-bn italic text-[#59391A]">
              "গীতা সুগীতা কর্তব্যা কিমনৈঃ শাস্ত্রবিস্তরৈঃ । যা স্বয়ং পদ্মনাভস্য মুখপদ্মাদ্ বিনিঃসৃতা ॥"
            </p>
            <p className="text-[#7A5B3D] text-[11px]">
              শ্রীমদ্ভগবদ্গীতার ১৮টি অধ্যায় ও ৭০০টি শ্লোকের ভাবামৃত সহ সম্পূর্ণ পাঠ।
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
