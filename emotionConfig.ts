import { EmotionCategory } from './types';

export const emotionConfig = {
  anxious: {
    title: "When you're anxious",
    icon: "☁️",
    gradient: ["#60A5FA", "#3B82F6"]
  },
  happy: {
    title: "When you're happy",
    icon: "☀️",
    gradient: ["#FBBF24", "#F59E0B"]
  },
  sad: {
    title: "When you're sad",
    icon: "💔",
    gradient: ["#818CF8", "#6366F1"]
  },
  grateful: {
    title: "When you're grateful",
    icon: "🙏",
    gradient: ["#34D399", "#10B981"]
  },
  strength: {
    title: "When you need strength",
    icon: "✊",
    gradient: ["#F87171", "#EF4444"]
  },
  lonely: {
    title: "When you're lonely",
    icon: "👤",
    gradient: ["#A78BFA", "#8B5CF6"]
  },
  guidance: {
    title: "When you need guidance",
    icon: "🧭",
    gradient: ["#14B8A6", "#0D9488"]
  },
  angry: {
    title: "When you're angry",
    icon: "🔥",
    gradient: ["#FB923C", "#F97316"]
  },
  anything: {
    title: "Anything else",
    icon: "💝",
    gradient: ["#F472B6", "#EC4899"]
  }
} as const;

export const emotionCategories: EmotionCategory[] = [
  "anxious", "happy", "sad", "grateful", 
  "strength", "lonely", "guidance", "angry"
]; 