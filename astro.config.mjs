import { defineConfig } from "astro/config";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const prettyCodeOptions = {
  theme: "github-light",
  keepBackground: false,
  transformers: [
    transformerCopyButton({
      visibility: "hover",
      feedbackDuration: 2_500,
      // successIcon:
      //   "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 48 48'%3E%3C!-- Icon from IconPark Outline by ByteDance - https://github.com/bytedance/IconPark/blob/master/LICENSE --%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='4' d='M43 11L16.875 37L5 25.182'/%3E%3C/svg%3E",
    }),
  ],
};

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: false,
    extendDefaultPlugins: true,
    rehypePlugins: [rehypeKatex, [rehypePrettyCode, prettyCodeOptions]],
    remarkPlugins: [remarkMath],
    shikiConfig: {},
  },

  vite: {},

  devToolbar: {
    enabled: false,
  },

  integrations: [mdx()],
});
