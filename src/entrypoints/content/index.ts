import { defineContentScript } from "#imports";

import "./layout.css";

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  main() {},
});
