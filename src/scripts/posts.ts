export function sortByDate<T extends { data: { date: Date } }>({
  posts,
  order = "newest",
}: {
  posts: T[];
  order: "newest" | "oldest";
}): T[] {
  const sortedPosts = [...posts].sort((a, b) => {
    const timeA = a.data.date.getTime();
    const timeB = b.data.date.getTime();

    return order === "newest" ? timeB - timeA : timeA - timeB;
  });

  return sortedPosts;
}
