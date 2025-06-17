import type { Verse, EmotionCategory } from "@shared/schema";

const STORAGE_KEYS = {
  CACHED_VERSES: "open_when_cached_verses",
  THEME: "open_when_theme",
  LAST_SYNC: "open_when_last_sync",
} as const;

export class LocalStorage {
  static getCachedVerses(): Record<EmotionCategory, Verse[]> {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.CACHED_VERSES);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }

  static setCachedVerses(verses: Record<EmotionCategory, Verse[]>) {
    try {
      localStorage.setItem(STORAGE_KEYS.CACHED_VERSES, JSON.stringify(verses));
    } catch (error) {
      console.error("Error caching verses:", error);
    }
  }

  static addCachedVerse(emotion: EmotionCategory, verse: Verse) {
    const cached = this.getCachedVerses();
    if (!cached[emotion]) {
      cached[emotion] = [];
    }
    
    // Avoid duplicates
    const exists = cached[emotion].some(v => v.id === verse.id);
    if (!exists) {
      cached[emotion].push(verse);
      this.setCachedVerses(cached);
    }
  }

  static getRandomCachedVerse(emotion: EmotionCategory): Verse | null {
    const cached = this.getCachedVerses();
    const verses = cached[emotion] || [];
    
    if (verses.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * verses.length);
    return verses[randomIndex];
  }

  static getTheme(): "light" | "dark" {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as "light" | "dark") || "light";
  }

  static setTheme(theme: "light" | "dark") {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  static setLastSync(timestamp: number) {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp.toString());
  }

  static getLastSync(): number {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return stored ? parseInt(stored, 10) : 0;
  }
}
