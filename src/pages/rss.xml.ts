import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { SITE_CONFIG } from "@/config";
import { sortByDate } from "@/scripts/writings";

export async function GET(context: APIContext) {
  const posts = await getCollection("writings", ({ data }) => {
    return data["to-publish"] === true;
  });

  const sortedPosts = sortByDate({ posts });

  return rss({
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    site: context.site ?? `https://${SITE_CONFIG.website}`,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/writings/${post.id}/`,
      author: post.data.author,
      categories: post.data.tags,
    })),
    customData: `<language>${SITE_CONFIG.language}</language>`,
  });
}
