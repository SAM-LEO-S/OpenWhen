export type EmotionCategory = 
  | "anxious" 
  | "happy" 
  | "sad" 
  | "grateful" 
  | "strength" 
  | "lonely" 
  | "guidance" 
  | "angry" 
  | "anything";

export interface Verse {
  id: number;
  emotion: EmotionCategory;
  text: string;
  reference: string;
  personalMessage: string;
  createdAt: string;
}

export interface UserPreferences {
  id: number;
  theme: "light" | "dark";
  lastUpdated: string;
} 