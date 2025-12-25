import type { CollectionEntry } from "astro:content";

export type NavigationLink = {
  name: string;
  path: string;
};

export type NavigationLinks = Array<NavigationLink>;

export type SocialLink = {
  platform: string;
  url: string;
  svg: string;
};

export type SocialLinks = Array<SocialLink>;

export type SiteConfig = {
  website: string;
  title: string;
  author: string;
  description: string;
  language: string;
};

export type WritingLink = {
  url: string;
  title: string;
};

export type NeighborWritings = {
  previous?: WritingLink;
  next?: WritingLink;
};

export type BlogEntry = CollectionEntry<"writings">;

export enum WritingOrders {
  Newest = 1,
  Oldest,
}
