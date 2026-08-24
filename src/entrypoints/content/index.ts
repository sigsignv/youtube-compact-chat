import { createIntegratedUi, defineContentScript } from "#imports";
import { onChatExpanded } from "./event";

import "./layout.css";
import "./resize.css";

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  main(ctx) {
    let height: number | undefined;

    const resizeHandle = createIntegratedUi(ctx, {
      position: "inline",
      anchor: "ytd-watch-flexy ytd-live-chat-frame#chat",
      append: "last",
      onMount(handle) {
        const chat = handle.closest<HTMLElement>("#chat");
        if (!chat) {
          throw new Error("Failed to find the chat element");
        }

        handle.className = "ycc-resize-handle";

        const setHeight = (newHeight: number) => {
          height = Math.round(newHeight);
          chat.style.setProperty("--ycc-user-height", `${height}px`);
        };

        if (height !== undefined) {
          setHeight(height);
        }

        let startY = 0;
        let startHeight = 0;

        const onPointerDown = (event: PointerEvent) => {
          if (
            !event.isPrimary ||
            (event.pointerType === "mouse" && event.button !== 0)
          ) {
            return;
          }

          startY = event.clientY;
          startHeight = chat.getBoundingClientRect().height;
          handle.setPointerCapture(event.pointerId);
          event.preventDefault();
        };

        const onPointerMove = (event: PointerEvent) => {
          if (!handle.hasPointerCapture(event.pointerId)) {
            return;
          }

          setHeight(startHeight + event.clientY - startY);
        };

        const resetHeight = () => {
          height = undefined;
          chat.style.removeProperty("--ycc-user-height");
        };

        const controller = new AbortController();
        const { signal } = controller;

        handle.addEventListener("pointerdown", onPointerDown, { signal });
        handle.addEventListener("pointermove", onPointerMove, { signal });
        handle.addEventListener("dblclick", resetHeight, { signal });

        return { chat, controller };
      },
      onRemove(mounted) {
        if (!mounted) {
          return;
        }

        const { chat, controller } = mounted;
        controller.abort();
        chat.style.removeProperty("--ycc-user-height");
      },
    });

    const unsubscribe = onChatExpanded(() => {
      resizeHandle.mount();

      return () => resizeHandle.remove();
    });

    ctx.onInvalidated(unsubscribe);
  },
});
