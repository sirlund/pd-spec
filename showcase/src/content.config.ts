import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const slides = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/slides' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    subtitle: z.string().optional(),
    slideLayout: z.enum([
      'cover', 'section', 'content', 'grid',
      'compare', 'bench', 'case-study', 'viz',
      'transition', 'image-full', 'quote', 'custom'
    ]).default('content'),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(),
    refs: z.array(z.string()).optional(),
    hidden: z.boolean().default(false),
    cssClass: z.string().optional(),
  }),
});

export const collections = { slides };
