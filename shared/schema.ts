import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const verses = pgTable("verses", {
  id: serial("id").primaryKey(),
  emotion: text("emotion").notNull(),
  text: text("text").notNull(),
  reference: text("reference").notNull(),
  personalMessage: text("personal_message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  theme: text("theme").notNull().default("light"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertVerseSchema = createInsertSchema(verses).omit({
  id: true,
  createdAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  lastUpdated: true,
});

export type Verse = typeof verses.$inferSelect;
export type InsertVerse = z.infer<typeof insertVerseSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

export const emotionCategories = [
  "anxious",
  "happy", 
  "sad",
  "grateful",
  "strength",
  "lonely",
  "guidance",
  "angry",
  "anything"
] as const;

export type EmotionCategory = typeof emotionCategories[number];
