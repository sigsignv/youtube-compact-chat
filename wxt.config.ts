import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "YouTube CompactChat",
  },
  hooks: {
    "build:manifestGenerated": (_, manifest) => {
      manifest.content_scripts ??= [];
      manifest.content_scripts.push({
        css: ["content-scripts/content.css"],
        matches: ["https://www.youtube.com/*"],
        all_frames: false,
      });
    },
  },
  modules: ["@wxt-dev/auto-icons"],
  autoIcons: {
    baseIconPath: "assets/icon.svg",
  },
  srcDir: "src",
});
