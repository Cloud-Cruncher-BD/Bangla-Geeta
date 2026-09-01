export interface Chapter {
  id: number;
  nameBengali: string;
  nameSanskrit: string;
  nameTransliteration: string;
  meaningBengali: string;
  versesCount: number;
  summary: string;
  keyThemes: string[];
}

export interface WordMeaning {
  word: string;
  meaning: string;
}

export interface Verse {
  chapter: number;
  verse: number;
  id: string; // e.g. "1.1"
  speaker: string; // e.g. "ধৃতরাষ্ট্র উবাচ", "শ্রীভগবানুবাচ", "অর্জুন উবাচ", "সঞ্জয় উবাচ"
  sanskrit: string; // Sanskrit text (Devanagari)
  bengaliScript?: string; // Sanskrit in Bengali script
  bengaliUcharan: string; // বাংলা উচ্চারণ (Bengali Phonetic Reading)
  wordMeanings?: WordMeaning[];
  translation: string; // বাংলা অনুবাদ
  purport: string; // মর্মার্থ / তাৎপর্য
  audioQuery?: string;
  tags?: string[];
}

export type ViewMode = 'home' | 'chapter-verses' | 'verse-detail';

export interface ReadingProgress {
  lastChapter: number;
  lastVerse: number;
  completedVerses: string[]; // ["1.1", "1.2"]
  bookmarkedVerses: string[]; // ["2.47", "4.7"]
}
