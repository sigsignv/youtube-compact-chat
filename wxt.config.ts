import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "YouTube CompactChat",
  },
  modules: ["@wxt-dev/auto-icons"],
  autoIcons: {
    baseIconPath: "assets/icon.svg",
  },
  imports: false,
  srcDir: "src",
});
