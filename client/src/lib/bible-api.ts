import { apiRequest } from "./queryClient";
import type { Verse, EmotionCategory } from "@shared/schema";

export async function fetchVerseByEmotion(emotion: EmotionCategory): Promise<Verse> {
  const response = await apiRequest("GET", `/api/verses/${emotion}`);
  return response.json();
}

export async function addVerse(verse: { emotion: EmotionCategory; text: string; reference: string; personalMessage: string }) {
  const response = await apiRequest("POST", "/api/verses", verse);
  return response.json();
}

export async function shareVerse(verse: Verse) {
  const text = `"${verse.text}" - ${verse.reference}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Bible Verse",
        text,
      });
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback to clipboard
      await navigator.clipboard.writeText(text);
    }
  } else {
    // Fallback for browsers without Web Share API
    await navigator.clipboard.writeText(text);
  }
}
