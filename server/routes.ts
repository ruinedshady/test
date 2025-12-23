import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === Memories ===
  app.get(api.memories.list.path, async (_req, res) => {
    const memories = await storage.getMemories();
    res.json(memories);
  });

  app.post(api.memories.create.path, async (req, res) => {
    try {
      const input = api.memories.create.input.parse(req.body);
      const memory = await storage.createMemory(input);
      res.status(201).json(memory);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Invalid input" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
  });

  // === Love Notes ===
  app.get(api.loveNotes.list.path, async (_req, res) => {
    const notes = await storage.getLoveNotes();
    res.json(notes);
  });

  app.post(api.loveNotes.create.path, async (req, res) => {
    try {
      const input = api.loveNotes.create.input.parse(req.body);
      const note = await storage.createLoveNote(input);
      res.status(201).json(note);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Invalid input" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
  });

  // === Timeline ===
  app.get(api.timeline.list.path, async (_req, res) => {
    const timeline = await storage.getTimeline();
    res.json(timeline);
  });

  app.post(api.timeline.create.path, async (req, res) => {
     try {
      const input = api.timeline.create.input.parse(req.body);
      const event = await storage.createTimelineEvent(input);
      res.status(201).json(event);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Invalid input" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
  });

  // === Seed Data ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const memories = await storage.getMemories();
  if (memories.length === 0) {
    console.log("Seeding database...");
    
    // Seed Memories
    await storage.createMemory({
      title: "So Beautiful",
      description: "One of my favorite photos of you. Those eyes! 😍",
      imageUrl: "/images/her1.jpg",
      date: new Date("2023-06-15"),
    });
    
    await storage.createMemory({
      title: "Your Smile",
      description: "The way you light up my world every single day.",
      imageUrl: "/images/her2.jpg",
      date: new Date("2023-08-20"),
    });

    await storage.createMemory({
      title: "Always Stunning",
      description: "No matter what you're doing, you always look amazing.",
      imageUrl: "/images/her3.jpg",
      date: new Date("2023-10-10"),
    });

    // Seed Timeline
    await storage.createTimelineEvent({
      title: "First Met",
      description: "The day our paths crossed.",
      date: new Date("2023-01-01"),
      icon: "star",
    });

    await storage.createTimelineEvent({
      title: "First Date",
      description: "Dinner and a movie, classic but perfect.",
      date: new Date("2023-01-15"),
      icon: "heart",
    });

     await storage.createTimelineEvent({
      title: "Made it Official",
      description: "Best day ever.",
      date: new Date("2023-02-14"),
      icon: "ring",
    });

    // Seed Love Notes
    await storage.createLoveNote({
      content: "You are my sunshine on a cloudy day ☀️",
      author: "Me",
    });
     await storage.createLoveNote({
      content: "Can't wait to see you later! ❤️",
      author: "Me",
    });
    
    console.log("Database seeded!");
  }
}
