import { defineCollection, z } from 'astro:content';

const clanky = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.enum(['investice', 'podnikani', 'finance', 'krypto']),
    date: z.date(),
    readTime: z.number(),
    image: z.string().optional(),
    keyPoints: z.array(z.string()).optional(),
  }),
});

export const collections = { clanky };
