import React from 'react';
import { getVerseDetails, toBengaliNumber } from '../data/verses';
import { Chapter } from '../types';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedVerseIds: string[];
  chapters: Chapter[];
  onSelectVerse: (chapterId: number, verseNumber: number) => void;
  onRemoveBookmark: (verseId: string) => void;
  onClearAll: () => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarkedVerseIds,
  chapters,
  onSelectVerse,
  onRemoveBookmark,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
      <div className="w-full max-w-lg bg-[#FAF7F2] rounded-2xl border border-[#DFCBB0] shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-[#E8DCB8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#8E3B16] fill-[#8E3B16]" />
            <h3 className="text-base font-bold font-tiro text-[#2D1B0E]">
              সংরক্ষিত শ্লোক ({toBengaliNumber(bookmarkedVerseIds.length)})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {bookmarkedVerseIds.length > 0 && (
              <button
                id="clear-all-bookmarks-btn"
                onClick={onClearAll}
                className="text-xs text-[#8E3B16] hover:text-[#5E2704] font-medium px-2 py-0.5 rounded-md hover:bg-[#F2E5D0] transition-colors cursor-pointer"
              >
                সব মুছুন
              </button>
            )}
            <button
              id="close-bookmarks-modal-btn"
              onClick={onClose}
              className="p-1 rounded-md hover:bg-[#F2E5D0] text-[#704E2D] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {bookmarkedVerseIds.length === 0 ? (
            <div className="text-center py-12 text-[#7A5B3D]">
              <Bookmark className="w-10 h-10 mx-auto text-[#C19B72] mb-2 opacity-50" />
              <p className="text-base font-bold font-serif-bn text-[#422B14] mb-1">
                কোনো শ্লোক সংরক্ষিত নেই
              </p>
              <p className="text-xs sm:text-sm text-[#7A5B3D]">
                যেকোনো শ্লোক পাঠ করার সময় উপরে 'বুকমার্ক' বাটনে ক্লিক করে প্রিয় শ্লোক সংরক্ষণ করতে পারেন।
              </p>
            </div>
          ) : (
            bookmarkedVerseIds.map(verseId => {
              const [chStr, vsStr] = verseId.split('.');
              const ch = parseInt(chStr, 10);
              const vs = parseInt(vsStr, 10);
              const chapterObj = chapters.find(c => c.id === ch);
              const verseData = getVerseDetails(ch, vs);

              return (
                <div
                  key={verseId}
                  className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E5D4BE] hover:border-[#9B3B1B] transition-all flex flex-col justify-between gap-2 shadow-2xs group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EFE3CF] text-[#7A3F0B]">
                      {chapterObj?.nameBengali || `অধ্যায় ${toBengaliNumber(ch)}`} • শ্লোক {toBengaliNumber(vs)}
                    </span>

                    <button
                      id={`remove-bookmark-${verseId}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(verseId);
                      }}
                      title="বুকমার্ক থেকে মুছুন"
                      className="p-1 text-[#A37B58] hover:text-[#9B3B1B] hover:bg-[#F2E5D0] rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-[#3D250C] line-clamp-2">
                    {verseData.translation}
                  </p>

                  <div className="pt-2 border-t border-[#EFE3CF] flex justify-end">
                    <button
                      id={`open-bookmarked-verse-${verseId}`}
                      onClick={() => {
                        onSelectVerse(ch, vs);
                        onClose();
                      }}
                      className="text-xs font-bold text-[#8C4A18] hover:text-[#5E2704] flex items-center gap-1 cursor-pointer"
                    >
                      পাঠ করুন <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
