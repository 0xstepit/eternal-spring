import { defineConfig } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const prettyCodeOptions = {
  theme: "github-light",
  keepBackground: false,
};

// https://astro.build/config
export default defineConfig({
  site: "https://eternalspring.xyz",
  markdown: {
    syntaxHighlight: false,
    extendDefaultPlugins: true,
    rehypePlugins: [rehypeKatex, [rehypePrettyCode, prettyCodeOptions]],
    remarkPlugins: [remarkMath],
  },
  devToolbar: {
    enabled: false,
  },
  integrations: [mdx(), sitemap()],
});
