import type { CollectionEntry } from "astro:content";

// Contains section navigation data.
export type NavigationLink = {
  name: string;
  path: string;
};

export type NavigationLinks = Array<NavigationLink>;

// Contains social networks in formations.
export type SocialLink = {
  platform: string;
  url: string;
  svg: string;
};

export type SocialLinks = Array<SocialLink>;

// Blog website configuration data.
export type SiteConfig = {
  website: string;
  repo: string;
  title: string;
  author: string;
  description: string;
  language: string;
  writingOrder: WritingOrders;
};

// Defines the data needed to refer to a writing.
export type WritingLink = {
  url: string;
  title: string;
};

// Defines optional neighbors for a writing document.
export type WritingNeighbors = {
  previous?: WritingLink;
  next?: WritingLink;
};

// Alias for a writing entry of Astro collection.
export type WritingEntry = CollectionEntry<"writings">;

// Specify how to order the writings.
export enum WritingOrders {
  Newest = 1,
  Oldest,
}

// Defines the background of the page body.
export type PageStyle = "clean" | "dotted";
