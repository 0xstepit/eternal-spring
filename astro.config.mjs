import { defineConfig } from "astro/config";
import { remarkReadingTime } from "./remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkReadingTime],
    shikiConfig: {
      theme: "github-light",
    },
  },
  vite: {},
  devToolbar: {
    enabled: false,
  },
});
