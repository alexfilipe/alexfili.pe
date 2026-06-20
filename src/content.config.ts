import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const writings = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writings" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

const recordings = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/recordings" }),
  schema: z.object({
    title: z.string(),
    instrument: z.enum(["Piano", "Violin", "Conducting"]),
    composer: z.string(),
    work: z.string(),
    year: z.number(),
    mediaType: z.enum(["audio", "video", "external"]),
    url: z.url().optional(),
    featured: z.boolean().default(false)
  })
});

export const collections = { writings, recordings };
