import React from 'react';
import { Bookmark, Search, Home } from 'lucide-react';
import { toBengaliNumber } from '../data/verses';
import { GitaLogo } from './GitaLogo';

interface NavbarProps {
  currentView: string;
  onGoHome: () => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  bookmarksCount: number;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  fontSizeLevel: number;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onGoHome,
  onOpenSearch,
  onOpenBookmarks,
  bookmarksCount,
  fontSizeLevel,
  onIncreaseFontSize,
  onDecreaseFontSize
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-xs border-b border-[#E8DCB8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <button
            id="nav-logo-btn"
            onClick={onGoHome}
            className="flex items-center gap-2.5 text-left focus:outline-hidden cursor-pointer group"
          >
            <GitaLogo size="md" showText={true} />
          </button>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* Quick Home button if not on home */}
            {currentView !== 'home' && (
              <button
                id="nav-home-btn"
                onClick={onGoHome}
                title="হোম"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FEFCF8] hover:bg-[#F2E5D0] text-[#5C3005] transition-colors border border-[#DECDB3] cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-[#8E3B16]" />
                <span className="hidden sm:inline">হোম</span>
              </button>
            )}

            {/* Font Size Adjuster */}
            <div className="flex items-center bg-[#FEFCF8] rounded-lg border border-[#DECDB3] p-0.5">
              <button
                id="nav-font-decrease-btn"
                onClick={onDecreaseFontSize}
                disabled={fontSizeLevel <= 1}
                title="অক্ষর ছোট করুন"
                className="px-2 py-1 text-xs font-semibold text-[#5C3005] hover:bg-[#F2E5D0] disabled:opacity-30 rounded-xs transition-colors cursor-pointer"
              >
                ক-
              </button>
              <div className="w-[1px] h-3.5 bg-[#DECDB3]"></div>
              <button
                id="nav-font-increase-btn"
                onClick={onIncreaseFontSize}
                disabled={fontSizeLevel >= 4}
                title="অক্ষর বড় করুন"
                className="px-2 py-1 text-xs font-semibold text-[#5C3005] hover:bg-[#F2E5D0] disabled:opacity-30 rounded-xs transition-colors cursor-pointer"
              >
                ক+
              </button>
            </div>

            {/* Search Button */}
            <button
              id="nav-search-btn"
              onClick={onOpenSearch}
              title="অনুসন্ধান"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FEFCF8] hover:bg-[#F2E5D0] text-[#5C3005] transition-colors border border-[#DECDB3] cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#8E3B16]" />
              <span className="hidden sm:inline">খুঁজুন</span>
            </button>

            {/* Bookmarks Button */}
            <button
              id="nav-bookmarks-btn"
              onClick={onOpenBookmarks}
              title="সংরক্ষিত শ্লোক"
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FEFCF8] hover:bg-[#F2E5D0] text-[#5C3005] transition-colors border border-[#DECDB3] cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#8E3B16]" />
              <span className="hidden sm:inline">বুকমার্ক</span>
              {bookmarksCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#8E3B16] text-white">
                  {toBengaliNumber(bookmarksCount)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

