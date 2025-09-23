import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "YouTube Live Chat auto adjust",
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
  srcDir: "src",
});
