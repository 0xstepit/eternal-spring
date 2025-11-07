// This is a special file used by astro for the definition of collections.
// Import the glob loader
import { glob } from "astro/loaders";
// Import utilities from `astro:content`
import { z, reference, defineCollection } from "astro:content";

// Define a `loader` and `schema` for each collection
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/blog" }),
  schema: z.object({
    title: z.string(),
    author: z.string().default("Anonymous"),
    pubDate: z.date(),
    description: z.string(),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    tags: z.array(z.string()),
    relatedPosts: z.array(reference("blog")).optional(),
  }),
});

// Export a single `collections` object to register your collection(s)
export const collections = { blog };
