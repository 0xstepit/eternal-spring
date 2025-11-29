import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const writings = defineCollection({
  loader: glob({ base: "./src/writings", pattern: "**/*.{md,mdx}" }),
  schema: z
    .object({
      title: z.string(),
      summary: z.string().default(""),
      author: z.string().default("Anon"),
      modified: z.date(),
      tags: z.array(z.string()),
      "to-publish": z.boolean().default(false),
    })
    .transform(({ modified, ...rest }) => ({
      ...rest,
      date: modified,
    })),
});

export const collections = { writings: writings };
