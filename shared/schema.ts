import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  date: timestamp("date").notNull(),
});

export const loveNotes = pgTable("love_notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  author: text("author").default('Anonymous'), // "Me" or "You"
  createdAt: timestamp("created_at").defaultNow(),
});

export const timelineEvents = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  icon: text("icon").default('heart'), // heart, star, ring, etc.
});

// === BASE SCHEMAS ===
export const insertMemorySchema = createInsertSchema(memories).omit({ id: true });
export const insertLoveNoteSchema = createInsertSchema(loveNotes).omit({ id: true, createdAt: true });
export const insertTimelineEventSchema = createInsertSchema(timelineEvents).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Memory = typeof memories.$inferSelect;
export type InsertMemory = z.infer<typeof insertMemorySchema>;

export type LoveNote = typeof loveNotes.$inferSelect;
export type InsertLoveNote = z.infer<typeof insertLoveNoteSchema>;

export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;

// Responses
export type MemoriesResponse = Memory[];
export type LoveNotesResponse = LoveNote[];
export type TimelineResponse = TimelineEvent[];
