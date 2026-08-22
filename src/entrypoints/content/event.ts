import * as v from "valibot";

declare global {
  interface DocumentEventMap {
    "yt-chat-collapsed-changed": CustomEvent<unknown>;
    "yt-navigate-finish": CustomEvent<unknown>;
  }
}

const ChatAvailableSchema = v.object({
  pageType: v.literal("watch"),
  response: v.object({
    response: v.object({
      contents: v.object({
        twoColumnWatchNextResults: v.object({
          conversationBar: v.object({
            liveChatRenderer: v.object({}),
          }),
        }),
      }),
    }),
  }),
});

type Unsubscribe = () => void;

type Disposer = () => void;

type ChatExpandedSetup = () => Disposer | undefined;

export function onChatExpanded(setup: ChatExpandedSetup): Unsubscribe {
  let disposer: Disposer | undefined;

  const dispose = () => {
    const currentDisposer = disposer;
    disposer = undefined;

    try {
      currentDisposer?.();
    } catch (error) {
      console.error("Cleanup failed:", error);
    }
  };

  const update = (event: CustomEvent<unknown>) => {
    dispose();

    const { detail: isCollapsed } = event;
    if (typeof isCollapsed !== "boolean" || isCollapsed) {
      return;
    }

    try {
      disposer = setup();
    } catch (error) {
      console.error("Setup failed:", error);
    }
  };
  document.addEventListener("yt-chat-collapsed-changed", update);

  const cleanup = (event: CustomEvent<unknown>) => {
    const result = v.safeParse(ChatAvailableSchema, event.detail);
    if (!result.success) {
      dispose();
    }
  };
  document.addEventListener("yt-navigate-finish", cleanup);

  return () => {
    document.removeEventListener("yt-chat-collapsed-changed", update);
    document.removeEventListener("yt-navigate-finish", cleanup);
    dispose();
  };
}
