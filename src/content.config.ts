import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    lang: z.enum(['ro', 'ru']).default('ro'),
  }),
});

const portofoliu = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portofoliu' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    client: z.string(),
    date: z.coerce.date(),
    image: z.string(),
    imageAlt: z.string(),
    tags: z.array(z.string()).default([]),
    url: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    lang: z.enum(['ro', 'ru']).default('ro'),
  }),
});

export const collections = { blog, portofoliu };
