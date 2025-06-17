import { verses, userPreferences, type Verse, type InsertVerse, type UserPreferences, type InsertUserPreferences, type EmotionCategory } from "@shared/schema";

export interface IStorage {
  // Verse operations
  getVersesByEmotion(emotion: EmotionCategory): Promise<Verse[]>;
  addVerse(verse: InsertVerse): Promise<Verse>;
  getRandomVerseByEmotion(emotion: EmotionCategory): Promise<Verse | undefined>;
  
  // User preferences
  getUserPreferences(): Promise<UserPreferences | undefined>;
  updateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
}

export class MemStorage implements IStorage {
  private verses: Map<number, Verse>;
  private preferences: UserPreferences | undefined;
  private currentVerseId: number;
  private currentPreferenceId: number;

  constructor() {
    this.verses = new Map();
    this.currentVerseId = 1;
    this.currentPreferenceId = 1;
    
    // Initialize with some default verses for each emotion
    this.initializeDefaultVerses();
  }

  private initializeDefaultVerses() {
    const defaultVerses: InsertVerse[] = [
      {
        emotion: "anxious",
        text: "Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.",
        reference: "Matthew 6:34",
        personalMessage: "Your anxious thoughts don't define your future. God holds tomorrow in His hands, and He invites you to rest in His peace today. Take a deep breath and trust in His perfect timing."
      },
      {
        emotion: "anxious",
        text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
        reference: "Philippians 4:6",
        personalMessage: "Anxiety is not a sign of weak faith. It's an invitation to bring your concerns to the One who cares for you completely. Pour out your heart to Him."
      },
      {
        emotion: "happy",
        text: "This is the day that the Lord has made; let us rejoice and be glad in it.",
        reference: "Psalm 118:24",
        personalMessage: "Your joy is a gift from God. Let it shine brightly and be a blessing to others around you today. Share this happiness with those who need it."
      },
      {
        emotion: "sad",
        text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
        reference: "Psalm 34:18",
        personalMessage: "Your tears are precious to God. He sees every sorrow and collects every tear. You are not alone in your pain, and healing will come in His perfect time."
      },
      {
        emotion: "grateful",
        text: "Give thanks to the Lord, for he is good; his love endures forever.",
        reference: "Psalm 107:1",
        personalMessage: "Gratitude transforms our perspective and opens our hearts to see God's goodness in every circumstance. Your thankful heart is a beautiful offering to Him."
      },
      {
        emotion: "strength",
        text: "I can do all this through him who gives me strength.",
        reference: "Philippians 4:13",
        personalMessage: "Your strength doesn't come from within alone - it flows from the infinite power of God who loves you. You are capable of more than you know because He is with you."
      },
      {
        emotion: "lonely",
        text: "Never will I leave you; never will I forsake you.",
        reference: "Hebrews 13:5",
        personalMessage: "Even when you feel completely alone, you are held in the arms of a God who will never abandon you. His presence is constant, His love unwavering."
      },
      {
        emotion: "guidance",
        text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
        reference: "Proverbs 3:5-6",
        personalMessage: "When the path ahead seems unclear, remember that God sees the entire journey. Trust His guidance even when you can't see the next step clearly."
      },
      {
        emotion: "angry",
        text: "In your anger do not sin: Do not let the sun go down while you are still angry.",
        reference: "Ephesians 4:26",
        personalMessage: "Your anger is valid, but it doesn't have to control you. God offers you peace and wisdom to handle difficult emotions in healthy ways."
      },
      {
        emotion: "anything",
        text: "Cast all your anxiety on him because he cares for you.",
        reference: "1 Peter 5:7",
        personalMessage: "Every emotion you feel is valid. God sees your struggles and walks with you through every season of life. You are loved, you are valued, and you are never forgotten."
      }
    ];

    defaultVerses.forEach(verse => {
      const newVerse: Verse = {
        ...verse,
        id: this.currentVerseId++,
        createdAt: new Date()
      };
      this.verses.set(newVerse.id, newVerse);
    });
  }

  async getVersesByEmotion(emotion: EmotionCategory): Promise<Verse[]> {
    return Array.from(this.verses.values()).filter(verse => verse.emotion === emotion);
  }

  async addVerse(insertVerse: InsertVerse): Promise<Verse> {
    const verse: Verse = {
      ...insertVerse,
      id: this.currentVerseId++,
      createdAt: new Date()
    };
    this.verses.set(verse.id, verse);
    return verse;
  }

  async getRandomVerseByEmotion(emotion: EmotionCategory): Promise<Verse | undefined> {
    const emotionVerses = await this.getVersesByEmotion(emotion);
    if (emotionVerses.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * emotionVerses.length);
    return emotionVerses[randomIndex];
  }

  async getUserPreferences(): Promise<UserPreferences | undefined> {
    return this.preferences;
  }

  async updateUserPreferences(insertPreferences: InsertUserPreferences): Promise<UserPreferences> {
    const preferences: UserPreferences = {
      id: this.preferences?.id || this.currentPreferenceId++,
      theme: insertPreferences.theme || "light",
      lastUpdated: new Date()
    };
    this.preferences = preferences;
    return preferences;
  }
}

export const storage = new MemStorage();
