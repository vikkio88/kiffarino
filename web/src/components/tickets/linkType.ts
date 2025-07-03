import type { LinkType } from "@kiffarino/shared";

export const typeEmojiMap: Record<LinkType, string> = {
  linked: "🔗",
  blocks: "⛔",
  blockedBy: "🚫",
};

export const typeLabelMap: Record<LinkType, string> = {
  linked: "Linked",
  blocks: "Blocks",
  blockedBy: "Blocked By",
};
