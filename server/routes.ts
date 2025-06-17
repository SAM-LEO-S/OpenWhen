import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVerseSchema, insertUserPreferencesSchema, type EmotionCategory, emotionCategories } from "@shared/schema";
import { z } from "zod";

const BIBLE_API_BASE = "https://bible-api.com";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get random verse by emotion
  app.get("/api/verses/:emotion", async (req, res) => {
    try {
      const emotion = req.params.emotion as EmotionCategory;
      
      if (!emotionCategories.includes(emotion)) {
        return res.status(400).json({ error: "Invalid emotion category" });
      }

      // First try to get from local storage
      let verse = await storage.getRandomVerseByEmotion(emotion);
      
      // If no local verse, try to fetch from Bible API
      if (!verse) {
        try {
          // Try to fetch a relevant verse from Bible API based on emotion
          const searchQueries: Record<EmotionCategory, string> = {
            anxious: "anxiety worry peace",
            happy: "joy rejoice glad",
            sad: "comfort sorrow weep",
            grateful: "thanks thanksgiving praise",
            strength: "strength power mighty",
            lonely: "alone presence with",
            guidance: "guide path way",
            angry: "anger patience slow",
            anything: "love care comfort"
          };
          
          const query = searchQueries[emotion];
          const response = await fetch(`${BIBLE_API_BASE}/${query}`);
          
          if (response.ok) {
            const data = await response.json();
            
            // Create a new verse entry
            const newVerse = {
              emotion,
              text: data.text || "The Lord your God is with you, the Mighty Warrior who saves.",
              reference: data.reference || "Zephaniah 3:17",
              personalMessage: getPersonalMessage(emotion)
            };
            
            verse = await storage.addVerse(newVerse);
          }
        } catch (apiError) {
          console.error("Bible API error:", apiError);
        }
      }
      
      if (!verse) {
        return res.status(404).json({ error: "No verse found for this emotion" });
      }
      
      res.json(verse);
    } catch (error) {
      console.error("Error fetching verse:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get user preferences
  app.get("/api/preferences", async (req, res) => {
    try {
      const preferences = await storage.getUserPreferences();
      res.json(preferences || { theme: "light" });
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update user preferences
  app.post("/api/preferences", async (req, res) => {
    try {
      const validatedData = insertUserPreferencesSchema.parse(req.body);
      const preferences = await storage.updateUserPreferences(validatedData);
      res.json(preferences);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid preferences data", details: error.errors });
      }
      console.error("Error updating preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Add new verse
  app.post("/api/verses", async (req, res) => {
    try {
      const validatedData = insertVerseSchema.parse(req.body);
      const verse = await storage.addVerse(validatedData);
      res.json(verse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid verse data", details: error.errors });
      }
      console.error("Error adding verse:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function getPersonalMessage(emotion: EmotionCategory): string {
  const messages: Record<EmotionCategory, string> = {
    anxious: "Your anxious thoughts don't define your future. God holds tomorrow in His hands, and He invites you to rest in His peace today.",
    happy: "Your joy is a gift from God. Let it shine brightly and be a blessing to others around you today.",
    sad: "Your tears are precious to God. He sees every sorrow and collects every tear. You are not alone in your pain.",
    grateful: "Gratitude transforms our perspective and opens our hearts to see God's goodness in every circumstance.",
    strength: "Your strength doesn't come from within alone - it flows from the infinite power of God who loves you.",
    lonely: "Even when you feel completely alone, you are held in the arms of a God who will never abandon you.",
    guidance: "When the path ahead seems unclear, remember that God sees the entire journey. Trust His guidance.",
    angry: "Your anger is valid, but it doesn't have to control you. God offers you peace and wisdom.",
    anything: "Every emotion you feel is valid. God sees your struggles and walks with you through every season of life."
  };
  
  return messages[emotion];
}
