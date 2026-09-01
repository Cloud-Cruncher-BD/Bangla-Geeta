import React, { useState, useEffect } from 'react';
import { Verse, Chapter } from '../types';
import { toBengaliNumber } from '../data/verses';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  X,
  BookOpen,
  Share2,
  Layers,
  Languages
} from 'lucide-react';

interface VerseDetailProps {
  verse: Verse;
  chapter: Chapter;
  totalChapters: number;
  isBookmarked: boolean;
  onToggleBookmark: (verseId: string) => void;
  onPrevVerse: () => void;
  onNextVerse: () => void;
  onBackToGrid: () => void;
  onSelectSpecificVerse: (verseNum: number) => void;
  fontSizeLevel: number;
}

// Simple Devanagari to Bengali script transliterator for word matching
function devanagariToBengali(devText: string): string {
  const devToBnMap: Record<string, string> = {
    'अ': 'অ', 'आ': 'আ', 'इ': 'ই', 'ई': 'ঈ', 'उ': 'উ', 'ऊ': 'ঊ', 'ऋ': 'ঋ',
    'ए': 'এ', 'ऐ': 'ঐ', 'ओ': 'ও', 'औ': 'ঔ',
    'क': 'ক', 'ख': 'খ', 'ग': 'গ', 'घ': 'ঘ', 'ङ': 'ঙ',
    'च': 'চ', 'छ': 'ছ', 'ज': 'জ', 'झ': 'ঝ', 'ञ': 'ঞ',
    'ट': 'ট', 'ठ': 'ঠ', 'ড': 'ড', 'ढ': 'ঢ', 'ण': 'ণ',
    'त': 'ত', 'थ': 'থ', 'द': 'দ', 'ध': 'ধ', 'न': 'ন',
    'प': 'প', 'फ': 'ফ', 'ब': 'ব', 'भ': 'ভ', 'म': 'ম',
    'य': 'য', 'र': 'র', 'ल': 'ল', 'व': 'ব', 'श': 'শ', 'ष': 'ষ', 'स': 'স', 'ह': 'হ',
    'ा': 'া', 'ि': 'ি', 'ी': 'ী', 'ु': 'ু', 'ू': 'ূ', 'ृ': 'ৃ',
    'े': 'ে', 'ै': 'ৈ', 'ो': 'ো', 'ৌ': 'ৌ', '्': '্', 'ं': 'ং', 'ः': 'ঃ', 'ँ': 'ঁ', 'ऽ': 'ঽ'
  };
  return devText.split('').map(c => devToBnMap[c] || c).join('');
}

// Helper to normalize Bengali string for matching
function normalizeBengali(str: string): string {
  return str
    .replace(/[।॥,\.\?!;:\(\)\[\]"'\-–—\s\n\r০-৯0-9]/g, '')
    .replace(/ঃ/g, '')
    .replace(/্/g, '')
    .replace(/ঽ/g, '')
    .trim();
}

export const VerseDetail: React.FC<VerseDetailProps> = ({
  verse,
  chapter,
  isBookmarked,
  onToggleBookmark,
  onPrevVerse,
  onNextVerse,
  onBackToGrid,
  fontSizeLevel
}) => {
  const [copied, setCopied] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);
  const [useBengaliScriptForSanskrit, setUseBengaliScriptForSanskrit] = useState(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  
  // Selected word meaning modal / popover state
  const [activeWordData, setActiveWordData] = useState<{
    originalWord: string;
    matchedWord: string;
    meaning: string;
  } | null>(null);
  
  // Full word meanings drawer toggle
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Close active word popup on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveWordData(null);
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Font size grades hierarchy based on level
  const fontSizes = {
    sanskrit: ['text-2xl sm:text-3xl md:text-4xl', 'text-3xl sm:text-4xl md:text-5xl', 'text-4xl sm:text-5xl md:text-6xl', 'text-5xl sm:text-6xl md:text-7xl'][fontSizeLevel - 1] || 'text-3xl sm:text-4xl md:text-5xl',
    ucharan: ['text-lg sm:text-xl md:text-2xl', 'text-xl sm:text-2xl md:text-3xl', 'text-2xl sm:text-3xl md:text-4xl', 'text-3xl sm:text-4xl md:text-5xl'][fontSizeLevel - 1] || 'text-xl sm:text-2xl md:text-3xl',
    translation: ['text-xl sm:text-2xl md:text-3xl', 'text-2xl sm:text-3xl md:text-4xl', 'text-3xl sm:text-4xl md:text-5xl', 'text-4xl sm:text-5xl md:text-6xl'][fontSizeLevel - 1] || 'text-2xl sm:text-3xl md:text-4xl',
    purport: ['text-sm sm:text-base', 'text-base sm:text-lg', 'text-lg sm:text-xl', 'text-xl sm:text-2xl'][fontSizeLevel - 1] || 'text-base sm:text-lg',
  };

  // Find word meaning by clicked word
  const handleWordClick = (rawWord: string) => {
    const cleanWord = rawWord.replace(/[।॥,\.\?!;:\(\)\[\]"'\n\r]/g, '').trim();
    if (!cleanWord || cleanWord === '॥' || cleanWord === '।') return;

    const bnConverted = devanagariToBengali(cleanWord);
    const normClicked = normalizeBengali(bnConverted);

    if (verse.wordMeanings && verse.wordMeanings.length > 0) {
      // 1. Try exact or normalized match
      let match = verse.wordMeanings.find(item => {
        const normItem = normalizeBengali(item.word);
        return normItem === normClicked || normItem.includes(normClicked) || normClicked.includes(normItem);
      });

      // 2. Try prefix/stem match (minimum 3 chars)
      if (!match && normClicked.length >= 3) {
        match = verse.wordMeanings.find(item => {
          const normItem = normalizeBengali(item.word);
          return normItem.startsWith(normClicked.slice(0, 3)) || normClicked.startsWith(normItem.slice(0, 3));
        });
      }

      if (match) {
        setActiveWordData({
          originalWord: cleanWord,
          matchedWord: match.word,
          meaning: match.meaning
        });
        return;
      }

      // If not directly matched, pick the first word or show available list
      setActiveWordData({
        originalWord: cleanWord,
        matchedWord: cleanWord,
        meaning: "এই শ্লোকের প্রাসঙ্গিক অন্বয় নিচের শব্দার্থ তালিকায় দেখুন।"
      });
    } else {
      setActiveWordData({
        originalWord: cleanWord,
        matchedWord: cleanWord,
        meaning: verse.translation
      });
    }
  };

  // Render text with clickable interactive words without artificial gaps
  const renderInteractiveText = (text: string, isSanskrit: boolean = false) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-2 sm:space-y-3">
        {lines.map((line, lineIdx) => {
          const rawTokens = line.trim().split(/\s+/).filter(Boolean);
          return (
            <p key={lineIdx} className="text-center leading-relaxed">
              {rawTokens.map((token, tokenIdx) => {
                const isPurePunct = token === '।' || token === '॥' || token === ',' || token === '.';
                if (isPurePunct) {
                  return (
                    <React.Fragment key={tokenIdx}>
                      {' '}
                      <span className="text-[#C0924A] font-bold select-none px-1 inline-block">
                        {token}
                      </span>
                    </React.Fragment>
                  );
                }

                const match = token.match(/^([^।॥,;:?!]+)([।॥,;:?!]*)$/);
                const wordPart = match ? match[1] : token;
                const punctPart = match ? match[2] : '';

                return (
                  <React.Fragment key={tokenIdx}>
                    {tokenIdx > 0 && ' '}
                    <span
                      onClick={() => handleWordClick(wordPart)}
                      title="শব্দার্থ দেখতে ক্লিক করুন"
                      className="cursor-pointer transition-all duration-150 hover:text-[#B5853D] hover:underline decoration-[#B5853D]/40 underline-offset-4 rounded px-0.5"
                    >
                      {wordPart}
                    </span>
                    {punctPart && (
                      <span className="text-[#C0924A] font-bold select-none pl-1.5 inline-block">
                        {punctPart}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </p>
          );
        })}
      </div>
    );
  };

  // Copy full verse details to clipboard
  const handleCopy = async () => {
    const fullText = `শ্রীমদ্ভগবদ্গীতা — অধ্যায় ${toBengaliNumber(verse.chapter)}, শ্লোক ${toBengaliNumber(verse.verse)}\n\n[${verse.speaker}]\n\nমূল শ্লোক:\n${verse.sanskrit}\n\nউচ্চারণ:\n${verse.bengaliUcharan}\n\nঅনুবাদ:\n${verse.translation}\n\nমর্মার্থ:\n${verse.purport}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Share handler
  const handleShare = async () => {
    const shareData = {
      title: `শ্রীমদ্ভগবদ্গীতা - অধ্যায় ${toBengaliNumber(chapter.id)}, শ্লোক ${toBengaliNumber(verse.verse)}`,
      text: `${verse.speaker}\n${verse.sanskrit}\n${verse.translation}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopy();
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2500);
    }
  };

  // Text-to-speech recitation using browser SpeechSynthesis API
  const handleRecite = () => {
    if (!('speechSynthesis' in window)) return;
    
    if (isPlayingSpeech) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${verse.speaker}। ${verse.bengaliUcharan}। অনুবাদ: ${verse.translation}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.85;
    
    utterance.onend = () => setIsPlayingSpeech(false);
    utterance.onerror = () => setIsPlayingSpeech(false);

    setIsPlayingSpeech(true);
    window.speechSynthesis.speak(utterance);
  };

  const prevVerseNum = verse.verse > 1 ? verse.verse - 1 : null;
  const nextVerseNum = verse.verse < chapter.versesCount ? verse.verse + 1 : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10 min-h-[90vh] flex flex-col justify-between select-text">
      
      {/* Top Header: Minimal Back Icon, Centered Chapter/Verse, Share & Action Icons */}
      <header className="flex items-center justify-between pb-6">
        
        {/* Left: Back Button */}
        <button
          id="back-to-verse-grid-btn"
          onClick={onBackToGrid}
          title="সকল শ্লোকে ফিরে যান"
          className="p-2 -ml-2 rounded-full hover:bg-[#EFE7D8] text-[#523A25] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        {/* Center: Golden Chapter & Shloka Number */}
        <div className="text-center font-serif-bn">
          <div className="text-base sm:text-lg font-bold text-[#B5853D] tracking-wide">
            অধ্যায় {toBengaliNumber(chapter.id)}
          </div>
          <div className="text-xs sm:text-sm font-medium text-[#7D6E5D] mt-0.5">
            শ্লোক {toBengaliNumber(verse.verse)}
          </div>
        </div>

        {/* Right: Actions (Share, Bookmark, Audio, Script, Word Meanings) */}
        <div className="flex items-center gap-1 -mr-2">
          {/* Audio Listen */}
          <button
            id="recite-verse-btn"
            onClick={handleRecite}
            title={isPlayingSpeech ? "উচ্চারণ বন্ধ করুন" : "শ্লোক পাঠ শুনুন"}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isPlayingSpeech ? 'text-[#9B3B1B] bg-[#EFE7D8]' : 'text-[#7D6E5D] hover:text-[#B5853D] hover:bg-[#EFE7D8]'
            }`}
          >
            {isPlayingSpeech ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Script Switch Toggle */}
          <button
            id="toggle-sanskrit-script-btn"
            onClick={() => setUseBengaliScriptForSanskrit(!useBengaliScriptForSanskrit)}
            title={useBengaliScriptForSanskrit ? "দেবনাগরী লিপিতে দেখুন" : "বাংলা লিপিতে দেখুন"}
            className="p-2 rounded-full text-[#7D6E5D] hover:text-[#B5853D] hover:bg-[#EFE7D8] transition-colors cursor-pointer"
          >
            <Languages className="w-5 h-5" />
          </button>

          {/* Word Meanings Drawer Toggle */}
          {verse.wordMeanings && verse.wordMeanings.length > 0 && (
            <button
              id="toggle-word-meanings-drawer-btn"
              onClick={() => setIsDrawerOpen(true)}
              title="শব্দার্থ তালিকা"
              className="p-2 rounded-full text-[#7D6E5D] hover:text-[#B5853D] hover:bg-[#EFE7D8] transition-colors cursor-pointer"
            >
              <Layers className="w-5 h-5" />
            </button>
          )}

          {/* Bookmark Toggle */}
          <button
            id="bookmark-verse-detail-btn"
            onClick={() => onToggleBookmark(verse.id)}
            title={isBookmarked ? "বুকমার্ক থেকে সরান" : "বুকমার্ক করুন"}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isBookmarked ? 'text-[#B5853D]' : 'text-[#7D6E5D] hover:text-[#B5853D] hover:bg-[#EFE7D8]'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-[#B5853D]' : ''}`} />
          </button>

          {/* Share */}
          <button
            id="share-verse-btn"
            onClick={handleShare}
            title="শেয়ার ও কপি করুন"
            className="p-2 rounded-full text-[#7D6E5D] hover:text-[#B5853D] hover:bg-[#EFE7D8] transition-colors cursor-pointer"
          >
            <Share2 className="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </header>

      {/* Main Reading Canvas */}
      <main className="flex-1 flex flex-col justify-center py-4 sm:py-8 space-y-8 sm:space-y-12">
        
        {/* Speaker Name: --- শ্রীভগবানুবাচ --- */}
        <div className="text-center">
          <p className="font-serif-bn italic text-[#B5853D] text-base sm:text-lg md:text-xl font-medium tracking-wide">
            --- {verse.speaker} ---
          </p>
        </div>

        {/* 1. Sanskrit Shloka */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex flex-col items-center">
            <span className="text-xs sm:text-sm font-bold text-[#B5853D] tracking-wider font-serif-bn">
              সংস্কৃত শ্লোক
            </span>
            <div className="w-8 sm:w-10 h-[1.5px] bg-[#B5853D]/50 mt-1 rounded-full"></div>
          </div>
          
          <div className={`${useBengaliScriptForSanskrit ? 'font-serif-bn' : 'font-sanskrit'} font-bold text-[#542111] leading-relaxed tracking-wide ${fontSizes.sanskrit}`}>
            {renderInteractiveText(
              useBengaliScriptForSanskrit ? (verse.bengaliScript || verse.sanskrit) : verse.sanskrit,
              true
            )}
          </div>
        </div>

        {/* 2. Bengali Pronunciation */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex flex-col items-center">
            <span className="text-xs sm:text-sm font-bold text-[#B5853D] tracking-wider font-serif-bn">
              বাংলা উচ্চারণ
            </span>
            <div className="w-8 sm:w-10 h-[1.5px] bg-[#B5853D]/50 mt-1 rounded-full"></div>
          </div>

          <div className={`font-serif-bn font-medium text-[#7E461B] leading-relaxed italic ${fontSizes.ucharan}`}>
            {renderInteractiveText(verse.bengaliUcharan, false)}
          </div>
        </div>

        {/* 3. Bengali Translation */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex flex-col items-center">
            <span className="text-xs sm:text-sm font-bold text-[#B5853D] tracking-wider font-serif-bn">
              বাংলা অনুবাদ
            </span>
            <div className="w-8 sm:w-10 h-[1.5px] bg-[#B5853D]/50 mt-1 rounded-full"></div>
          </div>

          <p className={`font-serif-bn font-medium text-[#1E1711] leading-relaxed italic ${fontSizes.translation}`}>
            {verse.translation}
          </p>
        </div>

        {/* 4. Purport (মর্মার্থ) Card */}
        {verse.purport && (
          <div className="max-w-3xl mx-auto w-full pt-4">
            <div className="bg-[#FFFDF9]/90 rounded-2xl p-6 sm:p-8 border border-[#EBE1D0] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#9A621D] font-bold font-serif-bn text-sm sm:text-base">
                <BookOpen className="w-4 h-4 text-[#B5853D]" />
                <span>মর্মার্থ</span>
              </div>
              <p className={`font-serif-bn text-[#3A2614] leading-relaxed text-justify ${fontSizes.purport}`}>
                {verse.purport}
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Bottom Navigation: Previous and Next Shloka */}
      <footer className="pt-10 sm:pt-14 pb-4 border-t border-[#E8DEC9]/50 mt-8 space-y-8">
        <div className="flex items-center justify-between font-serif-bn">
          
          {/* Previous Shloka Button */}
          {prevVerseNum ? (
            <button
              id="prev-verse-btn"
              onClick={onPrevVerse}
              className="text-left group cursor-pointer transition-transform active:scale-95"
            >
              <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold text-[#B5853D] group-hover:text-[#9A6B29]">
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                <span>পূর্ববর্তী</span>
              </div>
              <div className="text-xs sm:text-sm text-[#7D6E5D] pl-5 mt-0.5">
                শ্লোক {toBengaliNumber(prevVerseNum)}
              </div>
            </button>
          ) : (
            <div />
          )}

          {/* Next Shloka Button */}
          {nextVerseNum ? (
            <button
              id="next-verse-btn"
              onClick={onNextVerse}
              className="text-right group cursor-pointer transition-transform active:scale-95"
            >
              <div className="flex items-center justify-end gap-1.5 text-sm sm:text-base font-bold text-[#B5853D] group-hover:text-[#9A6B29]">
                <span>পরবর্তী</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="text-xs sm:text-sm text-[#7D6E5D] pr-5 mt-0.5">
                শ্লোক {toBengaliNumber(nextVerseNum)}
              </div>
            </button>
          ) : (
            <div />
          )}

        </div>

        {/* Sacred Brand Tagline */}
        <div className="text-center">
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#A69886] uppercase font-sans">
            HARE KRISHNA • SRIMAD BHAGAVAD GITA
          </p>
        </div>
      </footer>

      {/* Interactive Word Meaning Modal / Popover */}
      {activeWordData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn"
          onClick={() => setActiveWordData(null)}
        >
          <div 
            className="w-full max-w-md bg-[#FAF7F2] rounded-2xl border border-[#DFCBB0] shadow-2xl p-5 sm:p-6 text-left relative overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              id="close-word-popup-btn"
              onClick={() => setActiveWordData(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#EBDDC8] text-[#704E2D] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold text-[#B5853D] bg-[#F2E5D0] px-2.5 py-0.5 rounded-md uppercase tracking-wider font-sans-bn">
                শব্দার্থ ও অন্বয়
              </span>
            </div>

            {/* Clicked Word Highlight */}
            <div className="mb-4 pb-3 border-b border-[#E8DCB8]">
              <h2 className="text-xl sm:text-2xl font-bold font-serif-bn text-[#2D1B0E]">
                {activeWordData.matchedWord}
              </h2>
              {activeWordData.originalWord !== activeWordData.matchedWord && (
                <p className="text-xs text-[#8C6B47] font-serif-bn mt-0.5">
                  (মূল শব্দ: {activeWordData.originalWord})
                </p>
              )}
            </div>

            {/* Meaning Display */}
            <div className="bg-[#FEFCF8] rounded-xl p-4 border border-[#E9DAC5] mb-5">
              <p className="text-xs font-bold text-[#8C4A18] uppercase tracking-wider mb-1.5 font-sans-bn">
                অর্থ / অন্বয়
              </p>
              <p className="text-base sm:text-lg font-serif-bn font-semibold text-[#2D1B0E] leading-relaxed">
                {activeWordData.meaning}
              </p>
            </div>

            {/* Related Words in This Shloka */}
            {verse.wordMeanings && verse.wordMeanings.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#7C5A37] mb-2 font-sans-bn flex items-center justify-between">
                  <span>এই শ্লোকের অন্যান্য শব্দার্থ:</span>
                  <button 
                    onClick={() => {
                      setActiveWordData(null);
                      setIsDrawerOpen(true);
                    }}
                    className="text-[#B5853D] hover:underline cursor-pointer"
                  >
                    সব দেখুন
                  </button>
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {verse.wordMeanings.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveWordData({
                        originalWord: item.word,
                        matchedWord: item.word,
                        meaning: item.meaning
                      })}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-serif-bn ${
                        item.word === activeWordData.matchedWord
                          ? 'bg-[#B5853D] text-white border-[#B5853D]'
                          : 'bg-[#FEFCF8] hover:bg-[#F2E5D0] text-[#3E2108] border-[#DFCBB0]'
                      }`}
                    >
                      {item.word}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Word Meanings Sidebar Drawer */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-2xs animate-fadeIn"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            className="w-full max-w-sm sm:max-w-md h-full bg-[#FAF7F2] border-l border-[#DFCBB0] shadow-2xl p-5 sm:p-6 flex flex-col overflow-hidden animate-slideLeft"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DCB8] mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#B5853D]" />
                <h3 className="text-lg font-bold font-serif-bn text-[#2D1B0E]">
                  সম্পূর্ণ শব্দার্থ ও অন্বয়
                </h3>
              </div>
              <button
                id="close-word-drawer-btn"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded-md hover:bg-[#F2E5D0] text-[#704E2D] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#7A5B3D] mb-4 font-serif-bn">
              অধ্যায় {toBengaliNumber(chapter.id)}, শ্লোক {toBengaliNumber(verse.verse)}
            </p>

            {/* Word Meanings List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {verse.wordMeanings && verse.wordMeanings.length > 0 ? (
                verse.wordMeanings.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-[#FEFCF8] border border-[#E9DAC5] hover:border-[#B5853D] transition-colors"
                  >
                    <div className="text-sm font-bold font-serif-bn text-[#B5853D] mb-0.5">
                      {item.word}
                    </div>
                    <div className="text-sm font-serif-bn text-[#2D1B0E]">
                      {item.meaning}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#7C5A37] font-serif-bn">
                  এই শ্লোকের বিস্তারিত শব্দার্থ অন্বয় উপলব্ধ নেই।
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Temporary Toast for Share/Copy */}
      {sharedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2D1B0E] text-[#F7EFE2] text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg font-serif-bn animate-fadeIn z-50">
          শ্লোকটি ক্লিপবোর্ডে কপি করা হয়েছে!
        </div>
      )}

    </div>
  );
};


