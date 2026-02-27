import { defineConfig } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const prettyCodeOptions = {
  theme: "github-light",
  keepBackground: false,
  transformers: [
    transformerCopyButton({
      visibility: "hover",
      feedbackDuration: 2000,
      copyIcon:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b6e73' stroke-width='1.5'%3E%3Crect x='9' y='9' width='13' height='13' rx='2'/%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'/%3E%3C/svg%3E",
      successIcon:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230095ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E",
    }),
  ],
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
