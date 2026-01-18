import { type WritingNeighbors, WritingOrders } from "@/types";
import { getCollection } from "astro:content";
import type { WritingEntry } from "../types.ts";

// export async function getWritingCollection()

export function writingCollectionFilter<T extends { "to-publish": boolean }>({
  data,
}: {
  data: T;
}): boolean {
  return data["to-publish"] === true;
}

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

export function groupByYear<T extends { data: { date: Date } }>(
  posts: T[],
): Map<number, T[]> {
  const groupedWritings = new Map<number, T[]>();
  posts.forEach((writing) => {
    const year = writing.data.date.getFullYear();

    const yearPosts = groupedWritings.get(year) || [];

    yearPosts.push(writing);
    groupedWritings.set(year, yearPosts);
  });

  return groupedWritings;
}

// Returns the previous and next writings from the Astro collection associated with a
// particular writing referenced by slug.
export async function getWritingNeighbors(
  slug: string,
): Promise<WritingNeighbors> {
  const nearWritings: WritingNeighbors = {};

  const allPosts = await getCollection("writings", ({ data }) => {
    return data["to-publish"] === true;
  });

  const sortedPosts: WritingEntry[] = sortByDate({
    posts: allPosts,
  });

  let postIndex;
  for (const post of sortedPosts) {
    if (post.id === slug) {
      postIndex = sortedPosts.indexOf(post);

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
