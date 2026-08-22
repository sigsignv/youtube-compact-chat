import { defineContentScript } from "#imports";
import { onChatExpanded } from "./event";

import "./layout.css";

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  main(ctx) {
    const unsubscribe = onChatExpanded(() => {
      console.log("Chat expanded");

      return () => {
        console.log("Chat setup disposed");
      };
    });

    ctx.onInvalidated(unsubscribe);
  },
});
