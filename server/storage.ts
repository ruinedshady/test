import { db } from "./db";
import {
  memories,
  loveNotes,
  timelineEvents,
  type Memory,
  type InsertMemory,
  type LoveNote,
  type InsertLoveNote,
  type TimelineEvent,
  type InsertTimelineEvent
} from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  // Memories
  getMemories(): Promise<Memory[]>;
  createMemory(memory: InsertMemory): Promise<Memory>;

  // Love Notes
  getLoveNotes(): Promise<LoveNote[]>;
  createLoveNote(note: InsertLoveNote): Promise<LoveNote>;

  // Timeline
  getTimeline(): Promise<TimelineEvent[]>;
  createTimelineEvent(event: InsertTimelineEvent): Promise<TimelineEvent>;
}

export class DatabaseStorage implements IStorage {
  // Memories
  async getMemories(): Promise<Memory[]> {
    return await db.select().from(memories).orderBy(desc(memories.date));
  }

  async createMemory(insertMemory: InsertMemory): Promise<Memory> {
    const [memory] = await db.insert(memories).values(insertMemory).returning();
    return memory;
  }

  // Love Notes
  async getLoveNotes(): Promise<LoveNote[]> {
    return await db.select().from(loveNotes).orderBy(desc(loveNotes.createdAt));
  }

  async createLoveNote(insertNote: InsertLoveNote): Promise<LoveNote> {
    const [note] = await db.insert(loveNotes).values(insertNote).returning();
    return note;
  }

  // Timeline
  async getTimeline(): Promise<TimelineEvent[]> {
    return await db.select().from(timelineEvents).orderBy(timelineEvents.date);
  }

  async createTimelineEvent(insertEvent: InsertTimelineEvent): Promise<TimelineEvent> {
    const [event] = await db.insert(timelineEvents).values(insertEvent).returning();
    return event;
  }
}

export const storage = new DatabaseStorage();
