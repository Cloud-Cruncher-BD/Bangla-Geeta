# শ্রীমদ্ভগবদ্গীতা (Srimad Bhagavad Gita)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)

শ্রীমদ্ভগবদ্গীতার ১৮টি অধ্যায় ও ৭০০টি শ্লোক পাঠ, অনুধাবন এবং অনুশীলনের জন্য একটি মার্জিত, আধ্যাত্মিক এবং আধুনিক ওয়েব অ্যাপ্লিকেশন।

A serene, minimalist, and feature-rich digital edition of **Srimad Bhagavad Gita** designed with Bengali translation, Sanskrit Devanagari text, phonetic transliterations, word-by-word meanings, and detailed purports.

---

## ✨ Features (বৈশিষ্ট্যসমূহ)

- 📜 **সম্পূর্ণ ১৮টি অধ্যায় ও শ্লোক সম্ভার (All 18 Chapters & Verses):** অর্জুন বিষাদযোগ থেকে মোক্ষযোগ পর্যন্ত সম্পূর্ণ তালিকা ও শ্লোক সংখ্যা।
- 🕉️ **সংস্কৃত ও বাংলা লিপি (Dual Scripts):** মূল দেবনাগরী সংস্কৃত শ্লোক এবং বিশুদ্ধ বাংলা হরফে পাঠের বিকল্প।
- 🗣️ **শব্দার্থ ও অন্বয় (Word Meanings & Transliteration):** প্রতিটি শ্লোকের পদচ্ছেদ ও শব্দভিত্তিক বাংলা অর্থ।
- 📖 **বিশদ বঙ্গানুবাদ ও ভাবামৃত/মর্মার্থ (Translation & Purport):** শ্লোকসমূহের আধ্যাত্মিক তাৎপর্য ও বাস্তব জীবনের শিক্ষণীয় বিশ্লেষণ।
- 🔊 **মধুর অডিও আবৃত্তি ও মেডিটেশন মিউজিক (Audio & Ambient Chants):** শ্লোক পাঠ ও ব্যাকগ্রাউন্ড বাঁশির ধুন সহ প্রশান্তিদায়ক সুর।
- 🔍 **সার্চ ইঞ্জিন (Smart Search):** বাংলা ও সংস্কৃত শব্দ বা শ্লোক নম্বর দ্বারা দ্রুত অনুসন্ধান সুবিধা।
- 🔖 **বুকমার্ক ব্যবস্থাপনা (Personal Bookmarks):** প্রিয় ও গুরুত্বপূর্ণ শ্লোকসমূহ সংরক্ষণ এবং তাৎক্ষণিক অ্যাক্সেস।
- 🔤 **হরফ আকার নিয়ন্ত্রণ (Dynamic Font Scaling):** চোখের স্বাচ্ছন্দ্যের জন্য অক্ষরের আকার ছোট-বড় করার সুবিধা।
- 🎨 **আধ্যাত্মিক ও মার্জিত নকশা (Sacred & Responsive UI):** গোল্ডেন ও তপ্তকাঞ্চন আভা, সুসজ্জিত শ্রীমদ্ভগবদ্গীতা লোগো এবং মোবাইল ও ডেস্কটপ বান্ধব লেআউট।

---

## 🛠️ Tech Stack (প্রযুক্তি)

- **Frontend Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation:** [Motion](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)

---

## 🚀 Getting Started (প্রজেক্ট সেটআপ ও রান)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18+ recommended) installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/srimad-bhagavad-gita.git
cd srimad-bhagavad-gita
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build for production
```bash
npm run build
```
The optimized production files will be output to the `dist/` directory.

### 5. Preview production build
```bash
npm run preview
```

---

## 📁 Project Structure (প্রজেক্ট ডিরেক্টরি)

```plaintext
├── index.html               # Main HTML entry point
├── package.json             # Project dependencies and build scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── metadata.json            # App metadata
└── src/
    ├── main.tsx             # React DOM root entry
    ├── App.tsx              # Main application router and state
    ├── index.css            # Global Tailwind CSS styling
    ├── types.ts             # TypeScript interfaces and type definitions
    ├── components/
    │   ├── GitaLogo.tsx         # Sacred Vector Logo & Emblem
    │   ├── Navbar.tsx           # Top navigation bar
    │   ├── ChapterList.tsx      # Chapter overview and grid
    │   ├── ChapterVerseGrid.tsx # Verses list per chapter
    │   ├── VerseDetail.tsx      # Clean verse reading view
    │   ├── SearchModal.tsx      # Verse search interface
    │   └── BookmarksModal.tsx   # Saved bookmarks manager
    └── data/
        ├── chapters.ts          # Metadata of 18 chapters
        └── verses.ts            # Sanskrit verses, Bengali meanings & purports
```

---

## 🌐 Free Hosting & Deployment (ওয়েবসাইট পাবলিশ করার নিয়ম)

This application is built as a static client-side Single Page Application (SPA). You can deploy it completely **FREE** with **unlimited visitors** on any of these platforms:

- **[Vercel](https://vercel.com/):** Import the repository and deploy with 1-click.
- **[GitHub Pages](https://pages.github.com/):** Build with `npm run build` and deploy the `dist/` folder.
- **[Netlify](https://www.netlify.com/):** Drag & drop the `dist/` folder or link with GitHub.
- **[Cloud Run / Firebase Hosting](https://firebase.google.com/):** Connect and host globally with high speed.

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>ॐ শ্রীকৃষ্ণার্পণমস্তু ॐ</b><br>
  <i>"কর্মণ্যেবাধিকারস্তে মা ফলেষু কদাচন । মা কর্মফলহেতুর্ভূর্মা তে সঙ্গোঽস্ত্বকর্মণি ॥"</i>
</p>
