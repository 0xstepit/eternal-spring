// This is a special file used by astro for the definition of collections.
// Import the glob loader
import { glob } from "astro/loaders";
// Import utilities from `astro:content`
import { z, reference, defineCollection } from "astro:content";

// Define a `loader` and `schema` for each collection
const blog_tutorial = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/blog-tutorial" }),
  schema: z.object({
    title: z.string(),
    author: z.string().default("Anonymous"),
    pubDate: z.date(),
    summary: z.string(),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    tags: z.array(z.string()),
    relatedPosts: z.array(reference("blog_tutorial")).optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/blog" }),
  schema: z
    .object({
      title: z.string(),
      summary: z.string().default("Unfortunately no summary to display"),
      author: z.string().default("Anonymous"),
      modified: z.date(),
      tags: z.array(z.string()),
    })
    .transform(({ modified, ...rest }) => ({
      ...rest,
      date: modified,
    })),
});

// Export a single `collections` object to register your collection(s)
export const collections = { blog_tutorial, blog };
