import { type NeighborWritings, WritingOrders } from "@/types";
import { getCollection } from "astro:content";
import type { BlogEntry } from "../types.ts";

export function sortByDate<T extends { data: { date: Date } }>({
  posts,
  order = WritingOrders.Newest,
}: {
  posts: T[];
  order?: WritingOrders;
}): T[] {
  const sortedPosts = [...posts].sort((a, b) => {
    const timeA = a.data.date.getTime();
    const timeB = b.data.date.getTime();

    return order === WritingOrders.Newest ? timeB - timeA : timeA - timeB;
  });

  return sortedPosts;
}

export async function getNeighbors(slug: string): Promise<NeighborWritings> {
  const nearWritings: NeighborWritings = {};

  const allPosts = await getCollection("writings", ({ data }) => {
    return data["to-publish"] === true;
  });

  const sortedPosts: BlogEntry[] = sortByDate({
    posts: allPosts,
  });

  let postIndex;
  for (const post of sortedPosts) {
    if (post.id === slug) {
      postIndex = sortedPosts.indexOf(post);

      console.log(postIndex);
      if (postIndex !== 0) {
        nearWritings.next = {
          url: sortedPosts[postIndex - 1].id,
          title: sortedPosts[postIndex - 1].data.title,
        };
      }

      if (postIndex !== sortedPosts.length - 1) {
        nearWritings.previous = {
          url: sortedPosts[postIndex + 1].id,
          title: sortedPosts[postIndex + 1].data.title,
        };
      }
    }
  }

  return nearWritings;
}
