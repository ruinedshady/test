import { z } from 'zod';
import { insertMemorySchema, insertLoveNoteSchema, insertTimelineEventSchema, memories, loveNotes, timelineEvents } from './schema';

export { insertMemorySchema, insertLoveNoteSchema, insertTimelineEventSchema };

export const api = {
  memories: {
    list: {
      method: 'GET' as const,
      path: '/api/memories',
      responses: {
        200: z.array(z.custom<typeof memories.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/memories',
      input: insertMemorySchema,
      responses: {
        201: z.custom<typeof memories.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
  loveNotes: {
    list: {
      method: 'GET' as const,
      path: '/api/love-notes',
      responses: {
        200: z.array(z.custom<typeof loveNotes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/love-notes',
      input: insertLoveNoteSchema,
      responses: {
        201: z.custom<typeof loveNotes.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
  timeline: {
    list: {
      method: 'GET' as const,
      path: '/api/timeline',
      responses: {
        200: z.array(z.custom<typeof timelineEvents.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/timeline',
      input: insertTimelineEventSchema,
      responses: {
        201: z.custom<typeof timelineEvents.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
};
