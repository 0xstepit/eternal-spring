import { glob } from "astro/loaders";
import { z, defineCollection } from "astro:content";

const blog = defineCollection({
  loader: glob({ base: "./src/blog", pattern: "**/*.{md,mdx}" }),
  schema: z
    .object({
      title: z.string(),
      summary: z.string().default("Unfortunately no summary to display"),
      author: z.string().default("Anonymous"),
      modified: z.date(),
      tags: z.array(z.string()),
      "to-publish": z.boolean().default(false),
    })
    .transform(({ modified, ...rest }) => ({
      ...rest,
      date: modified,
    })),
});

export const collections = { blog };
