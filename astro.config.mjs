import { defineConfig } from "astro/config";
import { remarkReadingTime } from "./remark-reading-time.mjs";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  vite: {},
  devToolbar: {
    enabled: false,
  },
});
